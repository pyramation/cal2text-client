import React, { useState } from "react";

import { signIn, signOut, listCalendars, loadApi } from "../lib/google";
import { getDaysFreeSummaryText } from "../lib/freetime";
import { SelectCalendars } from "../components/SelectCalendars";

import Layout from "../components/Layout";
import Landing from "../components/Landing";
import MainForm from "../components/MainForm";

const Index = () => {
  const [apiReady, setApiReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const [calendars, setCalendars] = useState([]);
  const [calendarsToQuery, setCalendarsToQuery] = useState([]);
  const [calendarsFetched, setCalendarsFetched] = useState(false);
  const [calendarsChosen, setCalendarsChosen] = useState(false);

  const [results, setResults] = useState(null);
  const [resultsFetching, setResultsFetching] = useState(false);

  const signUserOut = () => {
    signOut();

    setSignedIn(false);

    setCalendars([]);
    setCalendarsToQuery([]);
    setCalendarsFetched(false);
    setCalendarsChosen(false);

    setResultsFetching(false);
    setResults(null);
  };

  const getFreeSummary = (days, dayStartTime, dayEndTime, timezone) => {
    window._gaq &&
      window._gaq.push([
        "_trackEvent",
        "userAction",
        "Clicked through summary text"
      ]);
    setResultsFetching(true);
    getDaysFreeSummaryText({
      startHour: dayStartTime.getHours(),
      endHour: dayEndTime.getHours(),
      days,
      calendarIds: calendarsToQuery.map(c => c.id),
      timezone
    }).then(result => {
      setResults(result);
      setResultsFetching(false);
    });
  };

  const doneChoosingCalendars = () => {
    setCalendarsChosen(true);
  };
  const notFinishedChoosingCalendars = () => {
    setCalendarsChosen(false);
  };

  const doSignIn = () => {
    loadApi({ setSignedIn, setApiReady: signIn });
  };

  if (!signedIn) {
    return (
      <Layout
        signOut={signUserOut}
        signIn={doSignIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      >
        <Landing signIn={doSignIn} />
      </Layout>
    );
  }

  if (!calendarsFetched) {
    listCalendars().then(res => {
      setCalendars(res);
      setCalendarsToQuery(res.filter(item => item.primary));
      setCalendarsFetched(true);
    });
    return (
      <Layout
        signOut={signUserOut}
        signIn={signIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      >
        <div className="loader">Feching calendars...</div>
      </Layout>
    );
  }

  if (!calendarsChosen) {
    return (
      <Layout
        signOut={signUserOut}
        signIn={signIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      >
        <SelectCalendars
          calendars={calendars}
          selected={calendarsToQuery}
          setSelected={setCalendarsToQuery}
          doneChoosingCalendars={doneChoosingCalendars}
        />
      </Layout>
    );
  }

  return (
    <Layout
      signOut={signUserOut}
      signIn={signIn}
      signedIn={signedIn}
      setCalendarsChosen={setCalendarsChosen}
      calendarsChosen={calendarsChosen}
    >
      <MainForm
        results={results}
        resultsFetching={resultsFetching}
        getFreeSummary={getFreeSummary}
        notFinishedChoosingCalendars={notFinishedChoosingCalendars}
      />
    </Layout>
  );
};

export default Index;
