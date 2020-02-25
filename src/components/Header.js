
import React from "react";

import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarGroup,
} from "@blueprintjs/core";

export const Header = ({ signOut, signIn, signedIn }) => {
    return (<Navbar>
        <NavbarGroup align={Alignment.LEFT}>
            <Button className={Classes.MINIMAL} icon="calendar" text="Calendar Management" />
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
            {signedIn ? (<Button className={Classes.MINIMAL} text="Sign Out" onClick={signOut} />) : (<Button className={Classes.MINIMAL} text="Sign In" onClick={signIn} />)}
        </NavbarGroup>
    </Navbar>);
}