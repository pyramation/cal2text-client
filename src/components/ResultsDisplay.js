import React from "react";

const ResultsDisplay = ({ results, resultsFetching }) => {
  return results ? (
    <>
      <div>I'm free the following times: </div>
      <p>
        {results.map((daySummary, i) => (
          <li key={i}>{daySummary}</li>
        ))}
      </p>
    </>
  ) : (
    <>{resultsFetching ? <h1>fetching events...</h1> : null}</>
  );
};

export default ResultsDisplay;
