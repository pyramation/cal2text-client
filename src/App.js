import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";

import Index from "./pages/index";
import Calendars from "./pages/calendars";



const App = () => {
  return (
    <div className="App">
      <a href="/">home</a>
      <a href="/calendars">calendars</a>
      <Router>
        <Switch>
          <Route path="/calendars" render={() => <Calendars />} />
          <Route render={() => <Index />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
