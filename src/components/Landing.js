import React from 'react';
import { Button } from "@blueprintjs/core";
import landingImage from '../assets/landing.svg';

const Landing = ({ signIn }) => {

    return (
        <div className="calendar-landing">

            <h1>Add a human touch to your automated scheduling</h1>
            <h2>Get available times in human readable text without sending impersonal calendar links</h2>
            <Button onClick={signIn} intent={'primary'} large>Start Scheduling Now</Button>
            <img src={landingImage} alt="Calendar Management" />
        </div>
    );

}
export default Landing;
