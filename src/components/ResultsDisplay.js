import React from "react";
import { Button } from "@blueprintjs/core";

import * as moment from "moment-timezone";

const ABBR_REGEX = /^[^-+]/;

export function getTimezoneMetadata(timezone, date = new Date()) {
  const timestamp = date.getTime();
  const zone = moment.tz.zone(timezone);
  const zonedDate = moment.tz(timestamp, timezone);
  const offset = zonedDate.utcOffset();
  const offsetAsString = zonedDate.format("Z");

  // Only include abbreviations that are not just a repeat of the offset:
  // moment-timezone's `abbr` falls back to the time offset if a zone doesn't have an abbr.
  const abbr = zone.abbr(timestamp);
  const abbreviation = ABBR_REGEX.test(abbr) ? abbr : undefined;

  return {
    abbreviation,
    offset,
    offsetAsString,
    population: zone.population,
    timezone
  };
}

const handleFocus = event => {
  event.target.select();
};

const getText = (results, timezone) => {
  return (
    `I'm free the following times (${
      getTimezoneMetadata(timezone).abbreviation
    })\n` + results.map((daySummary, i) => `* ${daySummary}`).join("\n")
  );
};

class AutofocusTextarea extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("trying to focus");
    this._input.focus();
  }

  render() {
    const { results, timezone } = this.props;
    return (
      <textarea
        ref={c => (this._input = c)}
        className="results-text"
        autoFocus
        onFocus={handleFocus}
      >
        {getText(results, timezone)}
      </textarea>
    );
  }
}

const ResultsDisplay = ({
  results,
  resultsFetching,
  timezone,
  notFinishedChoosingCalendars
}) => {
  return !resultsFetching && results ? (
    <>
      <AutofocusTextarea results={results} timezone={timezone} />
      <div className="calendar-chooser">
        <Button onClick={notFinishedChoosingCalendars}>
          Re-choose Calendars
        </Button>
      </div>
    </>
  ) : (
    <>{resultsFetching ? <h1>Fetching events...</h1> : null}</>
  );
};

export default ResultsDisplay;
