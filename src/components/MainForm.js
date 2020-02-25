import React from "react";
import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput, Position } from "@blueprintjs/core";
import { TimezonePicker, TimezoneDisplayFormat } from "@blueprintjs/timezone";

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
    dayStartTime,
    setDayStartTime,
    dayEndTime,
    setDayEndTime,
    daysToGet,
    setDaysToGet,
    timezone,
    setTimezone,
    results,
    resultsFetching,
    getFreeSummary,
    notFinishedChoosingCalendars
}) => {

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
                <NumericInput
                    {...jsNumericInputFormatter}
                    value={daysToGet}
                    onValueChange={setDaysToGet}
                />
                <div className="word">
                    {daysToGet > 1 ? "days" : "day"}
                </div>
            </div>
            <div className="timezone-chooser">
                <div className="word">display in the following timezone </div>
                <br />
                <TimezonePicker
                    value={timezone}
                    onChange={setTimezone}
                    showLocalTimezone
                    valueDisplayFormat={TimezoneDisplayFormat.ABBREVIATION}
                    popoverProps={{ position: Position.BOTTOM }}
                ></TimezonePicker>
            </div>
            <div className="gettimes-buttons">
                <Button
                    onClick={getFreeSummary}
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
