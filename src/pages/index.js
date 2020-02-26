import React, { useState } from "react";

import { signIn, signOut, listCalendars, loadApi } from "../lib/google";
import { getDaysFreeSummaryText } from "../lib/freetime";
import { SelectCalendars } from "../components/SelectCalendars";

import Layout from "../components/Layout";
import Landing from "../components/Landing";
import MainForm from "../components/MainForm";

const PageLayout = ({
  children,
  signUserOut,
  signIn,
  signedIn,
  setCalendarsChosen,
  calendarsChosen
}) => {
  return (
    <Layout
      signOut={signUserOut}
      signIn={signIn}
      signedIn={signedIn}
      setCalendarsChosen={setCalendarsChosen}
      calendarsChosen={calendarsChosen}
    >
      {children}
    </Layout>
  );
};

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

  if (!apiReady) {
    loadApi({ setSignedIn, setApiReady });
    return (
      <PageLayout
        signUserOut={signUserOut}
        signIn={signIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      >
        <div className="loader">Loading API...</div>
      </PageLayout>
    );
  }

  if (!signedIn) {
    return (
      <PageLayout
        signUserOut={signUserOut}
        signIn={signIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      >
        <Landing signIn={signIn} />
      </PageLayout>
    );
  }

  if (!calendarsFetched) {
    listCalendars().then(res => {
      setCalendars(res);
      setCalendarsToQuery(res.filter(item => item.primary));
      setCalendarsFetched(true);
    });
    return (
      <PageLayout
        signUserOut={signUserOut}
        signIn={signIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      >
        <div className="loader">Feching calendars...</div>
      </PageLayout>
    );
  }

  if (!calendarsChosen) {
    return (
      <PageLayout
        signUserOut={signUserOut}
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
      </PageLayout>
    );
  }

  return (
    <PageLayout
      signUserOut={signUserOut}
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
    </PageLayout>
  );
};

export default Index;
