import React from "react";
import { Button, MenuItem, Icon } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import calendarIcon from '../assets/cal.png';

export const SelectCalendars = ({ calendars, selected, setSelected, doneChoosingCalendars }) => {
  const isSelected = item => selected.includes(item);

  const renderItem = (item, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        icon={isSelected(item) ? "tick" : "blank"}
        key={item.id}
        label={""}
        onClick={handleClick}
        text={item.summary}
        shouldDismissPopover={false}
      />
    );
  };

  const renderTag = item => {
    return item.summary;
  };

  const handleCalendarSelect = item => {
    if (selected.map(s => s.summary).includes(item.summary)) {
      setSelected(selected.filter(i => item.summary !== i.summary));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleClear = () => {
    setSelected([]);
  };

  const handleTagRemove = summary => {
    setSelected(selected.filter(i => i.summary !== summary));
  };

  const clearButton =
    calendars.length > 0 ? (
      <Button icon="cross" minimal={true} onClick={handleClear} />
    ) : (
        undefined
      );

  // TODO wtf does this even do
  const getTagProps = (_value, index) => {
    return { _value, index };
  };

  const tagInputProps = {
    tagProps: getTagProps,
    onRemove: handleTagRemove,
    rightElement: clearButton
  };

  return (
    <>
      <div className="calendar-select">
        <h1>Choose all calendars you need to coordinate with</h1>
        <br />
        <img src={calendarIcon} alt="calendar" />
        <br />
        <MultiSelect

          itemRenderer={renderItem}
          items={calendars}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={handleCalendarSelect}
          tagRenderer={renderTag}
          selectedItems={selected}
          tagInputProps={tagInputProps}
        />
        <Button onClick={doneChoosingCalendars} intent={'primary'} large>Done</Button>
      </div>

    </>
  );
};
