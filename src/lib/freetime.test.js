import {
  flattenSegments,
  getFreetime,
  mergeCalendars,
  timeToShortEnglish,
  freeToEnglish
} from "./freetime";

const apiResponse = {
  kind: "calendar#freeBusy",
  timeMin: "2020-02-24T16:57:01.000Z",
  timeMax: "2020-02-25T16:57:38.000Z",
  calendars: {
    "xxxxxxxx@gmail.com": {
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
    "yyyyyyyyyyy@gmail.com": {
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

const flattenedSegments = [
  {
    start: "2020-02-24T16:57:01Z",
    end: "2020-02-24T17:30:00Z"
  },
  {
    start: "2020-02-24T21:00:00Z",
    end: "2020-02-24T21:37:00Z"
  }
];

test("flattenSegments", () => {
  expect(flattenSegments(flattenTestInput)).toEqual(flattenedSegments);
});

const busySegments = [
  {
    start: "2020-02-24T17:00:00Z",
    end: "2020-02-24T17:30:00Z"
  },
  {
    start: "2020-02-24T21:00:00Z",
    end: "2020-02-24T21:30:00Z"
  }
];

test("freetime", () => {
  expect(
    getFreetime({
      segments: busySegments,
      start: "2020-02-24T17:00:00Z",
      end: "2020-02-24T21:30:00Z"
    })
  ).toEqual([
    {
      start: "2020-02-24T17:30:00Z",
      end: "2020-02-24T21:00:00Z"
    }
  ]);
  expect(
    getFreetime({
      segments: busySegments,
      start: "2020-02-24T17:15:00Z",
      end: "2020-02-24T21:15:00Z"
    })
  ).toEqual([
    {
      start: "2020-02-24T17:30:00Z",
      end: "2020-02-24T21:00:00Z"
    }
  ]);
  expect(
    getFreetime({
      segments: busySegments,
      start: "2020-02-24T16:30:00Z",
      end: "2020-02-24T22:00:00Z"
    })
  ).toEqual([
    {
      start: "2020-02-24T16:30:00Z",
      end: "2020-02-24T17:00:00Z"
    },
    {
      start: "2020-02-24T17:30:00Z",
      end: "2020-02-24T21:00:00Z"
    },
    {
      start: "2020-02-24T21:30:00Z",
      end: "2020-02-24T22:00:00Z"
    }
  ]);
});

test("timeToShortEnglish", () => {
  expect(
    timeToShortEnglish("2020-02-24T17:30:00Z", "America/New_York")
  ).toEqual("12:30pm");
  expect(
    timeToShortEnglish("2020-02-24T21:00:00Z", "America/New_York")
  ).toEqual("4pm");
  expect(
    timeToShortEnglish("2020-02-24T17:30:00Z", "America/Los_Angeles")
  ).toEqual("9:30am");
  expect(
    timeToShortEnglish("2020-02-24T21:00:00Z", "America/Los_Angeles")
  ).toEqual("1pm");
});

test("freeToEnglish", () => {
  expect(
    freeToEnglish(
      [
        {
          start: "2020-02-24T17:30:00Z",
          end: "2020-02-24T21:00:00Z"
        },
        {
          start: "2020-02-24T21:30:00Z",
          end: "2020-02-24T22:00:00Z"
        }
      ],
      "America/Los_Angeles"
    )
  ).toEqual("9:30am to 1pm, 1:30pm to 2pm");
});
