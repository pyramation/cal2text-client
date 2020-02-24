import React from "react";

import { DateInput, TimePicker } from "@blueprintjs/datetime";
import { Button, Icon } from "@blueprintjs/core";

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

const jsTimeFormatter = {
  useAmPm: "True",
  showArrowButtons: "True"
};

const Index = () => {
  return (
    <header className="App-header">
        <div>Pick a date between</div>
        <div class="no-break">
            <DateInput {...jsDateFormatterStart} />
            <div> to </div>
            <DateInput {...jsDateFormatterEnd} />
        </div>
        <div>between</div>
        <div class="no-break">
            <TimePicker {...jsTimeFormatter} />
            <div class="vertical-center">and</div>
            <TimePicker {...jsTimeFormatter}/>
        </div>
      <Button icon="user" text="Get Times" />
    </header>

  );
};

export default Index;


