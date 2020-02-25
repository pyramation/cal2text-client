import React, { useState } from "react";
import { Button } from "@blueprintjs/core";

import { DateTime } from "luxon";

import {
  signIn,
  signOut,
  listCalendars,
  loadApi,
  getDaysFreeSummaryText
} from "../lib/google";

import { SelectCalendars } from "../components/SelectCalendars";

import Layout from "../components/Layout";
import Landing from "../components/Landing";
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

  const PageLayout = ({ children }) => {
    return (
      <Layout
          signOut={signUserOut}
          signIn={signIn}
          signedIn={signedIn}
          setCalendarsChosen={setCalendarsChosen}
          calendarsChosen={calendarsChosen}
          >
        {children}
      </Layout>);
  }

  if (!apiReady) {
    loadApi({ setSignedIn, setApiReady });
    return (
      <PageLayout>
        <div>Loading API...</div>
      </PageLayout>
    );
  }

  if (!signedIn) {
    return (
      <PageLayout>
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
      <PageLayout>
        <h1>fetching calendars...</h1>
      </PageLayout>
    );
  }

  if (!calendarsChosen) {
    return (
      <PageLayout>
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
    <PageLayout>
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
    </PageLayout>
  );
};

export default Index;
