import React from "react";
import { Button, MenuItem, Icon, Switch } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import calendarIcon from "../assets/cal.png";

export const SelectCalendars = ({
  calendars,
  selected,
  setSelected,
  doneChoosingCalendars
}) => {
  const isSelected = item => selected.includes(item);


  const handleCalendarSelect = item => {
    if (selected.map(s => s.summary).includes(item.summary)) {
      setSelected(selected.filter(i => item.summary !== i.summary));
      window._gaq &&
        window._gaq.push(["_trackEvent", "userAction", "remove calendar"]);
    } else {
      window._gaq &&
        window._gaq.push(["_trackEvent", "userAction", "add calendar"]);
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="calendar-select">
      <img src={calendarIcon} alt="calendar" />
      <br />
      <h1>Which calendars set your schedule?</h1>
      <br />
      <div >
      {calendars.map(calendar=>{
        return (
          <Switch labelElement={calendar.summary} checked={isSelected(calendar)}  onClick={()=>handleCalendarSelect(calendar)}/>
        );
      })}
      </div>
      <br />
      <Button onClick={doneChoosingCalendars} large intent={"primary"}>
        Done
      </Button>
    </div>
  );
};
