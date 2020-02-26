import ordinal from "ordinal";

import { sortBy, flatten, map, chunk } from "lodash";
import { DateTime } from "luxon";

import { getBusyTimes } from "./google";

// min, max
// start, end
// if start < min && end < min (throw it out)
// if start >= max (throw it out)
// if start < min && end <= max -> add {min, end}
// if start >= min && end <= max -> add {start, end}
// if start >= min && end < max -> add {start, max}

const reduceSegments = ({ segments, min, max }) => {
  if (segments.length === 1) {
    return [
      {
        start: strMax(min, segments[0].start),
        end: strMin(max, segments[0].end)
      }
    ];
  }
  return segments.reduce((m, { start, end }) => {
    if (start < min && end < min) return m;
    if (start >= max) return m;
    return [
      ...m,
      {
        start: strMax(min, start),
        end: strMin(max, end)
      }
    ];
  }, []);
};

export const strMax = (a, b) => {
  return a > b ? a : b;
};
export const strMin = (a, b) => {
  return a < b ? a : b;
};

// this function assumes reduceSegments has been called
const invertSegments = ({ segments, min, max }) => {
  if (!segments.length) {
    return [
      {
        start: min,
        end: max
      }
    ];
  }
  const firstStart = segments[0].start;
  const lastEnd = segments[segments.length - 1].end;

  const points = [];
  if (min < firstStart) {
    points.push(min);
  } else {
    points.push(false);
  }
  segments.forEach(({ start, end }) => {
    points.push(start);
    points.push(end);
  });
  if (lastEnd < max) {
    points.push(max);
  }

  const result = chunk(points, 2)
    .map(([start, end]) => ({
      start,
      end
    }))
    .filter(({ start, end }) => !!end && !!start);

  return result;
};

export const getFreetime = ({ segments, start, end }) => {
  const reduced = reduceSegments({ segments, min: start, max: end });
  return invertSegments({ segments: reduced, min: start, max: end });
};

export const mergeCalendars = calendars => {
  return sortBy(flatten(map(calendars, cal => cal.busy)), [
    c => new Date(c.start)
  ]);
};

export const flattenSegments = segments => {
  if (!segments.length) return segments;

  let currentStart = segments[0].start;
  let currentEnd = segments[0].end;

  const flattened = [];

  segments.forEach(({ start, end }, index) => {
    if (start <= currentEnd && end >= currentEnd) {
      /*
          |------|
              |------|
      */

      currentEnd = end;
    } else if (start <= currentEnd && end < currentEnd) {
      /*
          |-------------------|
                     |------|
      */
      // noop
    } else if (start > currentEnd) {
      /*
          |------|
                     |------|
      */
      flattened.push({
        start: currentStart,
        end: currentEnd
      });
      currentStart = start;
      currentEnd = end;
      return;
    }
    if (index === segments.length - 1) {
      flattened.push({
        start: currentStart,
        end: currentEnd
      });
    }
  });

  return flattened;
};

export const getDaysStartEnd = ({ startHour, endHour, days }) => {
  let now;
  if (new Date().getHours() < endHour) {
    now = DateTime.local().set({ minute: 0, second: 0, millisecond: 0 });
  } else {
    now = DateTime.local()
      .plus({ days: 1 })
      .set({ hour: startHour, minute: 0, second: 0, millisecond: 0 });
  }
  const dayStartEnds = [
    {
      start: now.toUTC().toISO(),
      end: now
        .set({ hour: endHour })
        .toUTC()
        .toISO()
    }
  ];
  for (let i = 1; i < days; i++) {
    dayStartEnds.push({
      start: now
        .plus({ days: i })
        .set({ hour: startHour })
        .toUTC()
        .toISO(),
      end: now
        .plus({ days: i })
        .set({ hour: endHour })
        .toUTC()
        .toISO()
    });
  }
  return dayStartEnds;
};

export const timeToShortEnglish = (timeString, timezoneString) => {
  const date = DateTime.fromISO(timeString).setZone(timezoneString);
  // const date = new Date(timestring);
  const hour = date.hour % 12;
  const hourDisplay = hour === 0 ? "12" : `${hour}`;
  const isPm = date.hour >= 12;
  const amPmDisplay = isPm ? "pm" : "am";
  const minutes = `${date.minute}`;
  const minutesDisplay =
    minutes === "0" ? "" : `:${minutes.length === 1 ? `0${minutes}` : minutes}`;

  return `${hourDisplay}${minutesDisplay}${amPmDisplay}`;
};

export const freeToEnglish = (segments, timezoneString) => {
  return segments
    .map(segment => {
      const startStr = timeToShortEnglish(segment.start, timezoneString);
      const endStr = timeToShortEnglish(segment.end, timezoneString);
      return `${startStr} to ${endStr}`;
    })
    .join(", ");
};

export const apiResponseToFree = (apiResponse, start, end, timezoneString) => {
  const freeTime = getFreetime({
    segments: flattenSegments(mergeCalendars(apiResponse.calendars)),
    start,
    end
  }).filter(
    ({ start, end }) =>
      DateTime.fromISO(start).toSeconds() !== DateTime.fromISO(end).toSeconds()
  );
  console.log(freeTime, "freetime");
  return freeToEnglish(freeTime, timezoneString);
};

export const getEachDayBusyTimes = ({
  startHour,
  endHour,
  calendarIds,
  days
}) => {
  const daysStartEnd = getDaysStartEnd({ startHour, endHour, days });

  return Promise.all(
    daysStartEnd.map(({ start, end }) => {
      return getBusyTimes({
        timeMin: start,
        timeMax: end,
        calendarIds
      }).then(({ result }) => ({ result, start, end }));
    })
  );
};

export const getDaysFreeSummaryText = ({
  startHour,
  endHour,
  days,
  calendarIds,
  timezone
}) => {
  return getEachDayBusyTimes({
    startHour: Math.min(startHour, endHour),
    endHour: Math.max(startHour, endHour),
    days,
    calendarIds
  }).then(dayResults => {
    const result = dayResults
      .map(({ result: dayResult, start, end }) => {
        const dayFreeTime = apiResponseToFree(dayResult, start, end, timezone);

        const day = DateTime.fromISO(start);
        const dayName = day.weekdayShort;
        const monthDay = day.day;
        return dayFreeTime
          ? `${dayName} ${ordinal(monthDay)}: ${dayFreeTime}`
          : null;
      })
      .filter(i => i);
    return result;
  });
};
