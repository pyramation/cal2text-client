import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/timezone/lib/css/blueprint-timezone.css";
import "./App.css";

import Index from "./pages/index";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route render={() => <Index />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
