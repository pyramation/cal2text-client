import { sortBy, flatten, map } from "lodash";

export const getFreetime = () => {
  return true;
};

export const mergeCalendars = calendars => {
  return sortBy(flatten(map(calendars, cal => cal.busy)), [
    c => new Date(c.start)
  ]);
};
