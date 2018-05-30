import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Chat from "./Chat";

const FourOhFour = () => <h1>404</h1>;

const App = () => (
  <BrowserRouter>
    <div className="app">
      <fieldset>
        <Switch>
          <Route exact path="/" component={Chat} />
          <Route component={FourOhFour} />
        </Switch>
      </fieldset>
    </div>
  </BrowserRouter>
);

export default App;
