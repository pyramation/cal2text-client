import { getFreetime, mergeCalendars } from "./freetime";

const apiResponse = {
  kind: "calendar#freeBusy",
  timeMin: "2020-02-24T16:57:01.000Z",
  timeMax: "2020-02-25T16:57:38.000Z",
  calendars: {
    "mkbunday@gmail.com": {
      busy: [
        {
          start: "2020-02-24T16:57:01Z",
          end: "2020-02-24T17:30:00Z"
        },
        {
          start: "2020-02-24T23:30:00Z",
          end: "2020-02-25T01:30:00Z"
        }
      ]
    },
    "stedmanhood@gmail.com": {
      busy: [
        {
          start: "2020-02-24T17:00:00Z",
          end: "2020-02-24T17:30:00Z"
        },
        {
          start: "2020-02-24T21:00:00Z",
          end: "2020-02-24T21:30:00Z"
        },
        {
          start: "2020-02-25T02:00:00Z",
          end: "2020-02-25T02:45:00Z"
        },
        {
          start: "2020-02-25T05:30:00Z",
          end: "2020-02-25T06:30:00Z"
        }
      ]
    }
  }
};

const calendarMerge = [
  {
    start: "2020-02-24T16:57:01Z",
    end: "2020-02-24T17:30:00Z"
  },
  {
    start: "2020-02-24T17:00:00Z",
    end: "2020-02-24T17:30:00Z"
  },
  {
    start: "2020-02-24T21:00:00Z",
    end: "2020-02-24T21:30:00Z"
  },
  {
    start: "2020-02-24T23:30:00Z",
    end: "2020-02-25T01:30:00Z"
  },
  {
    start: "2020-02-25T02:00:00Z",
    end: "2020-02-25T02:45:00Z"
  },
  {
    start: "2020-02-25T05:30:00Z",
    end: "2020-02-25T06:30:00Z"
  }
];

test("merge calendars", () => {
  expect(mergeCalendars(apiResponse.calendars)).toEqual(calendarMerge);
});

test("freetime", () => {
  expect(
    getFreetime({
      calendarEvents: calendarMerge,
      startTime: "2020-02-24T16:57:01.000Z",
      endTime: "2020-02-24T21:30:00Z"
    })
  ).toEqual([
    {
      start: "2020-02-24T17:30:00Z",
      end: "2020-02-24T21:00:00Z"
    }
  ]);
});
