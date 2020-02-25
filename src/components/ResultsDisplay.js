import React from "react";

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

const ResultsDisplay = ({ results, resultsFetching, timezone }) => {
  return results ? (
    <>
      <div>
        I'm free the following times (
        {getTimezoneMetadata(timezone).abbreviation}):{" "}
      </div>
      <p>
        {results.map((daySummary, i) => (
          <li key={i}>{daySummary}</li>
        ))}
      </p>
    </>
  ) : (
    <>{resultsFetching ? <h1>Fetching events...</h1> : null}</>
  );
};

export default ResultsDisplay;
