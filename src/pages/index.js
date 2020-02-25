
import React, { useState } from "react";
import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput } from "@blueprintjs/core";

import {
  signIn,
  listEvents,
  listCalendars,
  loadApi
} from '../lib/google';

import { SelectCalendars } from './calendars';


const handleWeekValueChange = (_valueAsNumber, valueAsString) => {
  console.log(_valueAsNumber);
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

  const doneChoosingCalendars = () => {
    setCalendarsChosen(true);
  }
  const notFinishedChoosingCalendars = () => {
    setCalendarsChosen(false);
  }

  if (!apiReady) {
    loadApi({ setSignedIn, setApiReady })
    return (
      <header className="App-header">
        <div>Loading API...</div>
      </header>
    )
  }

  if (!signedIn) {
    return (
      <header className="App-header">
        <h1>Not signed in...go for it!</h1>
        <Button onClick={signIn}>Authorize</Button>
      </header>
    )
  }

  if (!calendarsFetched) {
    listCalendars().then(res => {
      setCalendars(res);
      setCalendarsToQuery(res.filter(item => item.primary));
      setCalendarsFetched(true);
    });
    return (
      <header className="App-header">
        <h1>fetching calendars...</h1>
      </header>);
  }


  if (!calendarsChosen) {
    return (
      <>
        <SelectCalendars calendars={calendars} selected={calendarsToQuery} setSelected={setCalendarsToQuery} />
        <Button onClick={doneChoosingCalendars}>Done</Button>
      </>
    )
  }

  if (!getTimes) {
    return (
      <header className="App-header">
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
          <Button icon="timeline-events" text="Get Times" />
        </div>
        <div className="no-break">
          <Button onClick={notFinishedChoosingCalendars} >Choose Calendars</Button>
        </div>
      </header>
    );
  }


  if (!eventsFetched) {
    listEvents().then(res => {
      setEvents(res);
      setEventsFetched(true);
    });
    return (
      <header className="App-header">
        <h1>fetching events...</h1>
        <pre>
          {JSON.stringify(events, null, 2)}
        </pre>
      </header>);
  }


};

export default Index;
