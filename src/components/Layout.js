import React from "react";
import { Header } from "./Header";

const Layout = ({ children, signOut, signIn, signedIn }) => {
  return (
    <div className="layout-container">
      <Header signOut={signOut} signIn={signIn} signedIn={signedIn} />
      <div className="app-body">{children}</div>
    </div>
  );
};

export default Layout;
