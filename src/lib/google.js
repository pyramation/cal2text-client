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
  const updateSigninStatus = (isSignedIn) => {
    setSignedIn(isSignedIn);
  }

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
      function (error) {
        console.log(error);
      }
    );
}

export const signIn = (event) => {
  window.gapi.auth2.getAuthInstance().signIn();
}

export const listEvents = ({ calendarId = "primary", timeMin = new Date().toISOString(), maxResults = 10 } = {}) => {
  return window.gapi.client.calendar.events
    .list({
      calendarId,
      timeMin,
      showDeleted: false,
      singleEvents: true,
      maxResults,
      orderBy: "startTime"
    })
    .then(res => res.result.items);
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
