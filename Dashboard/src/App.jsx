import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "./Components/Login.jsx";
import Home from "./Components/Home.jsx";
import Nav from "./Components/Nav.jsx";

const App = () => {
  return (
    <div>
      <Router>
        <div>
          <Nav />
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Home} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
