import React from "react";

import { DateInput, TimePicker } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const jsDateFormatter = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: date => date.toLocaleDateString(),
  parseDate: str => new Date(str),
  placeholder: "M/D/YYYY"
};

const jsTimeFormatter = {
  useAmPm: "True"
};

const Index = () => {
  return (
    <header className="App-header">
      <div>Pick a date between</div>
      <DateInput {...jsDateFormatter} />
      <div>to</div>
      <DateInput {...jsDateFormatter} />
      <div>between</div>
      <TimePicker {...jsTimeFormatter} />
      <div>and</div>
      <TimePicker {...jsTimeFormatter}/>
    </header>
  );
};

export default Index;


