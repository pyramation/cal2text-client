import { DateTime } from "luxon";

import ordinal from "ordinal";

import { apiResponseToFree } from "./freetime";

// Client ID and API key from the Developer Console
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export function initClient({ setSignedIn, setApiReady }) {
  const updateSigninStatus = isSignedIn => {
    setSignedIn(isSignedIn);
  };

  window.gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      () => {
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        );

        setApiReady(true);
      },
      function(error) {
        console.log(error);
      }
    );
}

export const signIn = event => {
  window.gapi.auth2.getAuthInstance().signIn();
};

export const signOut = event => {
  window.gapi.auth2.getAuthInstance().signOut();
};

export const getDaysStartEnd = ({ startHour, endHour, days }) => {
  const now = DateTime.local().set({ minute: 0, second: 0, millisecond: 0 });
  const dayStartEnds = [
    {
      start: DateTime.utc().toISO(),
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

export const getBusyTimes = ({ timeMin, timeMax, calendarIds }) => {
  return window.gapi.client.calendar.freebusy.query({
    timeMin: timeMin,
    timeMax: timeMax,
    items: calendarIds.map(id => ({
      id
    }))
  });
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
    startHour,
    endHour,
    days,
    calendarIds
  }).then(dayResults => {
    const result = dayResults.map(({ result: dayResult, start, end }) => {
      const dayFreeTime = apiResponseToFree(dayResult, start, end, timezone);

      const day = DateTime.fromISO(start);
      const dayName = day.weekdayShort;
      const monthDay = day.day;
      return `${dayName} ${ordinal(monthDay)}: ${dayFreeTime}`;
    });
    return result;
  });
};

export const listCalendars = () => {
  return window.gapi.client.calendar.calendarList
    .list()
    .then(res => res.result.items);
};

export const loadApi = ({ setSignedIn, setApiReady }) => {
  const script = document.createElement("script");
  script.src = "https://apis.google.com/js/api.js";
  script.onload = () => {
    window.gapi.load("client", () => {
      window.gapi.client.setApiKey(API_KEY);
      initClient({ setSignedIn, setApiReady });
    });
  };
  document.body.appendChild(script);
};
