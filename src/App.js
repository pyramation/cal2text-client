import React from 'react';
import logo from './logo.svg';
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import './App.css';

import {
  ButtonGroupExample
} from './components/example';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ButtonGroupExample />
      </header>
    </div>
  );
}

export default App;
