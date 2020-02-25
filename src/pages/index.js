import React, { useState } from "react";
import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput, Icon, Position } from "@blueprintjs/core";
import { TimezonePicker, TimezoneDisplayFormat } from "@blueprintjs/timezone";

import { DateTime } from "luxon";

import {
  signIn,
  signOut,
  listCalendars,
  loadApi,
  getDaysFreeSummaryText
} from "../lib/google";

import { SelectCalendars } from "../components/SelectCalendars";
import { Header } from "../components/Header";
import ResultsDisplay from "../components/ResultsDisplay";

const jsTimeFormatterStart = {
  useAmPm: "True",
  showArrowButtons: "True",
  defaultValue: new Date(2020, 5, 5, 9)
};

const jsTimeFormatterEnd = {
  useAmPm: "True",
  showArrowButtons: "True",
  defaultValue: new Date(2020, 5, 5, 17, 0)
};

const jsNumericInputFormatter = {
  allowNumericCharactersOnly: "True",
  min: 1,
  value: 1
};

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
    getDaysFreeSummaryText({
      startHour: dayStartTime.getHours(),
      endHour: dayEndTime.getHours(),
      days: daysToGet,
      calendarIds: calendarsToQuery.map(c => c.id),
      timezone
    }).then(result => {
      setResults(result);
    });
  };

  const doneChoosingCalendars = () => {
    setCalendarsChosen(true);
  };
  const notFinishedChoosingCalendars = () => {
    setCalendarsChosen(false);
  };

  const Layout = ({ children }) => {
    return (
      <>
        <Header signOut={signUserOut} signIn={signIn} signedIn={signedIn} />
        <div className="App-header">{children}</div>
      </>
    );
  };

  if (!apiReady) {
    loadApi({ setSignedIn, setApiReady });
    return (
      <Layout>
        <div>Loading API...</div>
      </Layout>
    );
  }

  if (!signedIn) {
    return (
      <Layout>
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
      <Layout>
        <h1>fetching calendars...</h1>
      </Layout>
    );
  }

  if (!calendarsChosen) {
    return (
      <Layout>
        <div className="no-break">
          <SelectCalendars
            calendars={calendars}
            selected={calendarsToQuery}
            setSelected={setCalendarsToQuery}
          />
          <Button onClick={doneChoosingCalendars}>Done</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="no-break">
        <Button onClick={notFinishedChoosingCalendars}>
          Re-choose Calendars
        </Button>
      </div>
      <div>Find my free time between</div>
      <div className="no-break">
        <TimePicker
          {...jsTimeFormatterStart}
          value={dayStartTime}
          onChange={setDayStartTime}
        />
        <div className="vertical-center">and</div>
        <TimePicker
          {...jsTimeFormatterEnd}
          value={dayEndTime}
          onChange={setDayEndTime}
        />
      </div>
      <div className="no-break">
        <div> for the next </div>
        <NumericInput
          {...jsNumericInputFormatter}
          value={daysToGet}
          onValueChange={setDaysToGet}
        />
        <div id="week">{daysToGet > 1 ? "days" : "day"}</div>
      </div>
      <div className="no-break">
        <div>display in the following timezone </div>
        <br />
        <TimezonePicker
          value={timezone}
          onChange={setTimezone}
          showLocalTimezone
          valueDisplayFormat={TimezoneDisplayFormat.COMPOSITE}
          popoverProps={{ position: Position.BOTTOM }}
        ></TimezonePicker>
      </div>
      <div className="no-break">
        <Button
          onClick={getFreeSummary}
          icon="timeline-events"
          text="Get Times"
        />
      </div>
      <ResultsDisplay
        results={results}
        resultsFetching={resultsFetching}
        timezone={timezone}
      />
    </Layout>
  );
};

export default Index;
