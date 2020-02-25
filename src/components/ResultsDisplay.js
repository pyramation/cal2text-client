import React from "react";

const ResultsDisplay = ({ results, resultsFetching, timezone }) => {
  return results ? (
    <>
      <div>I'm free the following times ({timezone}): </div>
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
