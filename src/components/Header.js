import React from "react";

import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarGroup
} from "@blueprintjs/core";

export const Header = ({
  signOut,
  signIn,
  signedIn,
  setCalendarsChosen,
  calendarsChosen
}) => {
  const notFinishedChoosingCalendars = () => {
    setCalendarsChosen(false);
  };

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <a href="/">
          <Button className={Classes.MINIMAL} text="Calendar Management" />
        </a>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {signedIn ? (
          <>
            <Button
              className={Classes.MINIMAL}
              icon="calendar"
              text="Select Calendars"
              onClick={notFinishedChoosingCalendars}
            />
            <Button
              className={Classes.MINIMAL}
              text="Sign Out"
              icon="log-out"
              onClick={signOut}
            />
          </>
        ) : (
          <Button
            className={Classes.MINIMAL}
            text="Sign In"
            icon="log-in"
            onClick={signIn}
          />
        )}
      </NavbarGroup>
    </Navbar>
  );
};
