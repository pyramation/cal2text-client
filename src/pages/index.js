import React from "react";

import { TimePicker } from "@blueprintjs/datetime";
import { Button, NumericInput } from "@blueprintjs/core";

import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";


const handleWeekValueChange = (_valueAsNumber, valueAsString) => {
    console.log(_valueAsNumber);
    var week = document.querySelector('#week');
    if (_valueAsNumber > 1){
        if (week.innerHTML !== " weeks."){
            week.classList.add('fade');
            setTimeout(function(){
                week.innerHTML = " weeks.";
                week.classList.add('reveal');
                week.classList.remove('reveal','fade');
            },500);
        }
    } else {
        if (week.innerHTML !== " week."){
            week.classList.add('fade');
            setTimeout(function(){
                week.innerHTML = " week.";
                week.classList.add('reveal');
                week.classList.remove('reveal','fade');
            },500);
        }
    }
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
    onValueChange: handleWeekValueChange
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
            <div id="week"> week.</div>
        </div>
        <div class="no-break">
            <Button icon="user" text="Get Times" />
        </div>
    </header>

  );
};

export default Index;


