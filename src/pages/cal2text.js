import React from "react";

import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const jsDateFormatter = {
  // note that the native implementation of Date functions differs between browsers
  formatDate: date => date.toLocaleDateString(),
  parseDate: str => new Date(str),
  placeholder: "M/D/YYYY"
};

const Cal2Text = () => {
  return (
    <header className="App-header">
      <DateInput {...jsDateFormatter} />
      <a href="/">Go Home</a>
    </header>
  );
};

export default Cal2Text;
