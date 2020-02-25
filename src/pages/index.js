
import React, { useState } from "react";
import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput } from "@blueprintjs/core";

import {
  signIn,
  signOut,
  listEvents,
  listCalendars,
  loadApi
} from '../lib/google';

import { SelectCalendars } from '../components/SelectCalendars';
import { Header } from '../components/Header';

const handleWeekValueChange = (_valueAsNumber, valueAsString) => {
  var week = document.querySelector("#week");
  if (_valueAsNumber > 1) {
    if (week.innerHTML !== " weeks.") {
      week.classList.add("fade");
      setTimeout(function () {
        week.innerHTML = " weeks.";
        week.classList.add("reveal");
        week.classList.remove("reveal", "fade");
      }, 500);
    }
  } else {
    if (week.innerHTML !== " week.") {
      week.classList.add("fade");
      setTimeout(function () {
        week.innerHTML = " week.";
        week.classList.add("reveal");
        week.classList.remove("reveal", "fade");
      }, 500);
    }
  }
};

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
  value: 1,
  onValueChange: handleWeekValueChange
};

const Index = () => {
  const [apiReady, setApiReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [getTimes, setGetTimes] = useState(false);

  const [calendars, setCalendars] = useState([]);
  const [calendarsToQuery, setCalendarsToQuery] = useState([]);
  const [calendarsFetched, setCalendarsFetched] = useState(false);
  const [calendarsChosen, setCalendarsChosen] = useState(false);

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

    setEventsFetched(false)
    setEvents([])
  }

  const Layout = ({ children }) => {
    return (
      <>
      <Header signOut={signUserOut} />
      <div className="App-header">
        {children}
      </div>
      </>
    );
  }

  const doneChoosingCalendars = () => {
    setCalendarsChosen(true);
  }
  const notFinishedChoosingCalendars = () => {
    setCalendarsChosen(false);
  }

  if (!apiReady) {
    loadApi({ setSignedIn, setApiReady })
    return (
      <Layout>
        <div>Loading API...</div>
      </Layout>
    )
  }

  if (!signedIn) {
    return (
      <Layout>
        <h1>Not signed in...go for it!</h1>
        <Button onClick={signIn}>Authorize</Button>
      </Layout>
    )
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
      </Layout>);
  }


  if (!calendarsChosen) {
    return (
      <Layout>
        <div className="no-break">
          <SelectCalendars calendars={calendars} selected={calendarsToQuery} setSelected={setCalendarsToQuery} />
          <Button onClick={doneChoosingCalendars}>Done</Button>
        </div>
      </Layout>
    )
  }

  if (!getTimes) {
    return (
      <Layout>
        <div>Find my free time between</div>
        <div className="no-break">
          <TimePicker {...jsTimeFormatterStart} />
          <div className="vertical-center">and</div>
          <TimePicker {...jsTimeFormatterEnd} />
        </div>
        <div className="no-break">
          <div> for the next </div>
          <NumericInput {...jsNumericInputFormatter} />
          <div id="week"> week.</div>
        </div>
        <div className="no-break">
          <Button onClick={() => setGetTimes(true)} icon="timeline-events" text="Get Times" />
        </div>
        <div className="no-break">
          <Button onClick={notFinishedChoosingCalendars} >Choose Calendars</Button>
        </div>
      </Layout>
    );
  }


  if (!eventsFetched) {
    // TODO pass list of calendars and batch
    listEvents({calendarId: calendarsToQuery[0].id}).then(res => {
      setEvents(res);
      setEventsFetched(true);
    });
    return (
      <Layout>
        <h1>fetching events...</h1>
      </Layout>);
  }

  return (
    <Layout>
      <div>Final Result: </div>
      <pre>
        {JSON.stringify(events, null, 2)}
      </pre>
    </Layout>
  )


};

export default Index;
