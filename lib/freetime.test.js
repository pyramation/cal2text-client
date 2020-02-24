import { flattenSegments, getFreetime, mergeCalendars } from "./freetime";

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

/*
  0. cursor c1, c2
  1. get first start   curS -> c1
  2. get first end     curE -> c2
  3. get next start    nxtS
    3a. nxtS < curE -> nxtE -> c2
    3b. nxtS >= curE -> (insert cursor and make new one)
  recurse
*/

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

const flattenTestInput = [
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
    start: "2020-02-24T21:00:00Z",
    end: "2020-02-24T21:37:00Z"
  }
];

test("flattenSegments", () => {
  expect(flattenSegments(flattenTestInput)).toEqual([
    {
      start: "2020-02-24T16:57:01Z",
      end: "2020-02-24T17:30:00Z"
    },
    {
      start: "2020-02-24T21:00:00Z",
      end: "2020-02-24T21:37:00Z"
    }
  ]);
});

// test("freetime", () => {
//   expect(
//     getFreetime({
//       calendarEvents: calendarMerge,
//       start: "2020-02-24T16:57:01.000Z",
//       endTime: "2020-02-24T21:30:00Z"
//     })
//   ).toEqual([
//     {
//       start: "2020-02-24T17:30:00Z",
//       end: "2020-02-24T21:00:00Z"
//     }
//   ]);
// });
