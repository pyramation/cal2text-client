import React, { useState } from "react";
import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput } from "@blueprintjs/core";

import { DateTime } from "luxon";

import {
  signIn,
  signOut,
  listEvents,
  listCalendars,
  loadApi,
  getEachDayBusyTimes
} from "../lib/google";

import { apiResponseToFree } from "../lib/freetime";

import { SelectCalendars } from "../components/SelectCalendars";
import { Header } from "../components/Header";

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

  const [events, setEvents] = useState([]);
  const [eventsFetched, setEventsFetched] = useState(false);

  const signUserOut = () => {
    signOut();

    setSignedIn(false);
    setGetTimes(false);

    setCalendars([]);
    setCalendarsToQuery([]);
    setCalendarsFetched(false);
    setCalendarsChosen(false);

    setEventsFetched(false);
    setEvents([]);
  };

  const Layout = ({ children }) => {
    return (
      <>
        <Header signOut={signUserOut} signIn={signIn} signedIn={signedIn} />
        <div className="App-header">{children}</div>
      </>
    );
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
      <Layout>
        <div>Loading API...</div>
      </Layout>
    );
  }

  if (!signedIn) {
    return (
      <Layout>
        <h1>Not signed in...go for it!</h1>
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

  if (!getTimes) {
    return (
      <Layout>
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
          <Button
            onClick={() => setGetTimes(true)}
            icon="timeline-events"
            text="Get Times"
          />
        </div>
        <div className="no-break">
          <Button onClick={notFinishedChoosingCalendars}>
            Choose Calendars
          </Button>
        </div>
      </Layout>
    );
  }

  if (!eventsFetched) {
    getEachDayBusyTimes({
      startHour: dayStartTime.getHours(),
      endHour: dayEndTime.getHours(),
      days: daysToGet,
      calendarIds: calendarsToQuery.map(c => c.id)
    }).then(dayResults => {
      console.log(dayResults, "dayResults");
      const result = dayResults.map(({ result: dayResult, start, end }) => {
        const dayFreeTime = apiResponseToFree(
          dayResult,
          start,
          end,
          DateTime.local().zoneName
        );

        const dayName = DateTime.fromISO(start).weekdayLong;
        return `${dayName}: ${dayFreeTime}`;
      });
      setEvents(result);
      setEventsFetched(true);
      // console.log(result);
    });
    return (
      <Layout>
        <h1>fetching events...</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>Final Result: </div>
      <p>
        {events.map((daySummary, i) => (
          <li key={i}>{daySummary}</li>
        ))}
      </p>
    </Layout>
  );
};

export default Index;
