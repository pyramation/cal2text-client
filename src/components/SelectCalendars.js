import React from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";

export const SelectCalendars = ({calendars, selected, setSelected}) => {

    const isSelected = (item) =>
        selected.includes(item);

    const renderItem = (item, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={isSelected(item) ? "tick" : "blank"}
                key={item.id}
                label={''}
                onClick={handleClick}
                text={item.summary}
                shouldDismissPopover={false}
            />
        );
    };

    const renderTag = (item) => {
        return item.summary;
    }

    const handleCalendarSelect = (item) => {
        if (selected.map(s => s.summary).includes(item.summary)) return;
        setSelected([...selected, item]);
    };

    const handleClear = () => {
        setSelected([]);
    };

    const handleTagRemove = (summary) => {
        setSelected(selected.filter(i => i.summary !== summary));
    };

    const clearButton =
        calendars.length > 0 ? <Button icon="cross" minimal={true} onClick={handleClear} /> : undefined;

    // TODO wtf does this even do
    const getTagProps = (_value, index) => {
        return { _value, index }
    };

    const tagInputProps = { tagProps: getTagProps, onRemove: handleTagRemove, rightElement: clearButton };

    return (
        <MultiSelect
            itemRenderer={renderItem}
            items={calendars}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={handleCalendarSelect}
            tagRenderer={renderTag}
            selectedItems={selected}
            tagInputProps={tagInputProps}
        />
    );
};