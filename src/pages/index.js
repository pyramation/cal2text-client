import React from "react";

import { DateInput, TimePicker } from "@blueprintjs/datetime";
import { Button, Icon, NumericInput } from "@blueprintjs/core";

import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const jsDateFormatterStart = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: date => date.toLocaleDateString(),
  parseDate: str => new Date(str),
  placeholder: "Start Date"
};

const jsDateFormatterEnd = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: date => date.toLocaleDateString(),
  parseDate: str => new Date(str),
  placeholder: "End Date"
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

const jsNumericInputFormatter={
    allowNumericCharactersOnly: "True",
    min: 1,
    value: 1,
}

const Index = () => {
  return (
    <header className="App-header">
        <div>Find my free time between</div>
        <div class="no-break">
            <TimePicker {...jsTimeFormatterStart} />
            <div class="vertical-center">and</div>
            <TimePicker {...jsTimeFormatterEnd}/>
        </div>
        <div class="no-break">
            <div> for the next </div>
            <NumericInput {...jsNumericInputFormatter} />
            <div> weeks.</div>
        </div>
        <div class="no-break">
            <Button icon="user" text="Get Times" />
        </div>
    </header>

  );
};

export default Index;


