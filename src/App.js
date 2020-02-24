import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";

import Index from "./pages/index";
import Cal2Text from "./pages/cal2text";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/cal2text" component={Cal2Text} />
          <Route render={() => <Index />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
