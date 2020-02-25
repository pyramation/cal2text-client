import React from "react";
import { Header } from "./Header";

const Layout = ({ children, signUserOut, signIn, signedIn }) => {
  return (
    <>
      <Header signOut={signUserOut} signIn={signIn} signedIn={signedIn} />
      <div className="App-header">{children}</div>
    </>
  );
};

export default Layout;
