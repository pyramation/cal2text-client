import React, { useState } from "react";
import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput, Position } from "@blueprintjs/core";
import { TimezonePicker, TimezoneDisplayFormat } from "@blueprintjs/timezone";

import { DateTime } from "luxon";

import ResultsDisplay from "./ResultsDisplay";

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

const MainForm = ({
  results,
  resultsFetching,
  getFreeSummary,
  notFinishedChoosingCalendars
}) => {
  const [days, setDays] = useState(3);
  const [dayStartTime, setDayStartTime] = useState(new Date(2020, 5, 5, 9));
  const [dayEndTime, setDayEndTime] = useState(new Date(2020, 5, 5, 17));
  const [timezone, setTimezone] = useState(DateTime.local().zoneName);

  return (
    <div className="calendar-mainform">
      <div className="word">Find my free time between</div>
      <div className="timespan-chooser">
        <TimePicker
          {...jsTimeFormatterStart}
          value={dayStartTime}
          onChange={setDayStartTime}
        />
        <div className="word">and</div>
        <TimePicker
          {...jsTimeFormatterEnd}
          value={dayEndTime}
          onChange={setDayEndTime}
        />
      </div>
      <div className="days-chooser">
        <div className="word"> for the next </div>
        <input
          name="days"
          className="get-days-input"
          type="number"
          value={days}
          onChange={e => {
            setDays(e.target.value);
          }}
        ></input>
        <div className="word">{days > 1 ? "days" : "day"}</div>
      </div>
      <div className="timezone-chooser">
        <div className="word">displayed in </div>
        <TimezonePicker
          value={timezone}
          onChange={setTimezone}
          showLocalTimezone
          valueDisplayFormat={TimezoneDisplayFormat.ABBREVIATION}
          popoverProps={{ position: Position.BOTTOM }}
        ></TimezonePicker>
        <div className="word">timezone</div>
      </div>
      <div className="gettimes-buttons">
        <Button
          onClick={() =>
            getFreeSummary(days, dayStartTime, dayEndTime, timezone)
          }
          icon="timeline-events"
          text="Get Times"
          large
          intent="primary"
        />
      </div>
      <ResultsDisplay
        results={results}
        resultsFetching={resultsFetching}
        timezone={timezone}
        notFinishedChoosingCalendars={notFinishedChoosingCalendars}
      />
    </div>
  );
};

export default MainForm;
