import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"

import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Routes from "./components/routing/Routes"

import { Provider } from "react-redux"
import store from "./store"


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route component={Routes} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
