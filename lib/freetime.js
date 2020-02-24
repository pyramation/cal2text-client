import { sortBy, flatten, map } from "lodash";

export const getFreetime = () => {
  return true;
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
