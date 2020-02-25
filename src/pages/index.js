import React, { useState } from "react";
import { Button } from "@blueprintjs/core";

import { DateTime } from "luxon";

import { signIn, signOut, listCalendars, loadApi } from "../lib/google";
import { getDaysFreeSummaryText } from "../lib/freetime";
import { SelectCalendars } from "../components/SelectCalendars";

import Layout from "../components/Layout";
import MainForm from "../components/MainForm";

const Index = () => {
  const [apiReady, setApiReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [getTimes, setGetTimes] = useState(false);

  const [calendars, setCalendars] = useState([]);
  const [calendarsToQuery, setCalendarsToQuery] = useState([]);
  const [calendarsFetched, setCalendarsFetched] = useState(false);
  const [calendarsChosen, setCalendarsChosen] = useState(false);

  const [daysToGet, setDaysToGet] = useState(3);
  const [dayStartTime, setDayStartTime] = useState(new Date(2020, 5, 5, 9));
  const [dayEndTime, setDayEndTime] = useState(new Date(2020, 5, 5, 17));
  const [timezone, setTimezone] = useState(DateTime.local().zoneName);

  const [results, setResults] = useState(null);
  const [resultsFetching, setResultsFetching] = useState(false);

  const signUserOut = () => {
    console.log("signOut");
    signOut();

    setSignedIn(false);
    setGetTimes(false);

    setCalendars([]);
    setCalendarsToQuery([]);
    setCalendarsFetched(false);
    setCalendarsChosen(false);

    setResultsFetching(false);
    setResults(null);
  };

  const getFreeSummary = () => {
    setResultsFetching(true);
    getDaysFreeSummaryText({
      startHour: dayStartTime.getHours(),
      endHour: dayEndTime.getHours(),
      days: daysToGet,
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
      <Layout signOut={signUserOut} signIn={signIn} signedIn={signedIn}>
        <div>Loading API...</div>
      </Layout>
    );
  }

  if (!signedIn) {
    return (
      <Layout signOut={signUserOut} signIn={signIn} signedIn={signedIn}>
        <h1>Not signed in... go for it!</h1>
        <Button onClick={signIn}>Authorize</Button>
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
      <Layout signOut={signUserOut} signIn={signIn} signedIn={signedIn}>
        <h1>fetching calendars...</h1>
      </Layout>
    );
  }

  if (!calendarsChosen) {
    return (
      <Layout signOut={signUserOut} signIn={signIn} signedIn={signedIn}>
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
    <Layout signOut={signUserOut} signIn={signIn} signedIn={signedIn}>
      <MainForm
        dayStartTime={dayStartTime}
        setDayStartTime={setDayStartTime}
        dayEndTime={dayEndTime}
        setDayEndTime={setDayEndTime}
        daysToGet={daysToGet}
        setDaysToGet={setDaysToGet}
        timezone={timezone}
        setTimezone={setTimezone}
        results={results}
        resultsFetching={resultsFetching}
        getFreeSummary={getFreeSummary}
        notFinishedChoosingCalendars={notFinishedChoosingCalendars}
      />
    </Layout>
  );
};

export default Index;
