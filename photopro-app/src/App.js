import React from 'react';

import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={RegistrationPage} />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
