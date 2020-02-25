import React from "react";
import { Header } from "./Header";

const Layout = ({
  children,
  signOut,
  signIn,
  signedIn,
  setCalendarsChosen,
  calendarsChosen
}) => {
  return (
    <div className="layout-container">
      <Header
        signOut={signOut}
        signIn={signIn}
        signedIn={signedIn}
        setCalendarsChosen={setCalendarsChosen}
        calendarsChosen={calendarsChosen}
      />
      <div className="app-body">{children}</div>
      <div className="footer">
        <a className="footer-links" href="/privacy">
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default Layout;
