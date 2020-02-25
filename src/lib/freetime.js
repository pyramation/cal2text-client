import { sortBy, flatten, map, chunk } from "lodash";
import { DateTime } from "luxon";

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

const strMax = (a, b) => {
  return a > b ? a : b;
};
const strMin = (a, b) => {
  return a < b ? a : b;
};

// this function assumes reduceSegments has been called
const invertSegments = ({ segments, min, max }) => {
  if (!segments[0]) {
    return [];
  }
  console.log(segments, "inside invertSegments");
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

  return chunk(points, 2)
    .map(([start, end]) => ({
      start,
      end
    }))
    .filter(({ start, end }) => !!end && !!start);
};

export const getFreetime = ({ segments, start, end }) => {
  console.log(segments, "before reducing segments");
  const reduced = reduceSegments({ segments, min: start, max: end });
  console.log(reduced, "after reducing segments");
  return invertSegments({ segments: reduced, min: start, max: end });
};

export const mergeCalendars = calendars => {
  return sortBy(flatten(map(calendars, cal => cal.busy)), [
    c => new Date(c.start)
  ]);
};

export const flattenSegments = segments => {
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

export const timeToShortEnglish = (timeString, timezoneString) => {
  const date = DateTime.fromISO(timeString).setZone(timezoneString);
  // const date = new Date(timestring);
  const hour = date.hour % 12;
  const hourDisplay = hour === 0 ? "12" : `${hour}`;
  const isPm = date.hour >= 12;
  const amPmDisplay = isPm ? "pm" : "am";
  const minutes = date.minute;
  const minutesDisplay = minutes === 0 ? "" : `:${minutes}`;

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
  return freeToEnglish(
    getFreetime({
      segments: flattenSegments(mergeCalendars(apiResponse.calendars)),
      start,
      end
    }),
    timezoneString
  );
};
