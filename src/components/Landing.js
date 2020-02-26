import React from "react";
import { Button } from "@blueprintjs/core";
import landingImage from "../assets/landing.svg";

const Landing = ({ signIn }) => {
  return (
    <div className="calendar-landing">
      <h1>Summarize your availability in seconds</h1>
      <h2>
        Get available times in human readable text without sending impersonal
        calendar links
      </h2>
      <pre className="bp3-code-block">
        {"I'm free the following times (EST)\n" +
          "* Wed 26th: 9am to 11:30am, 12:30pm\n" +
          "to 3:30pm, 4pm to 5pm\n" +
          "* Thu 27th: 9am to 11:30am, 12pm to 5pm\n" +
          "* Fri 28th: 9am to 10am, 1:30pm to 5pm\n"}
      </pre>
      <Button onClick={signIn} intent={"primary"} large>
        Start Scheduling Now
      </Button>
      <img
        src={landingImage}
        alt="Calendar Management"
        className="landing-image"
      />
    </div>
  );
};
export default Landing;
