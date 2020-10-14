import React, { useState, useEffect } from 'react';

import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import ProfilePage from './ProfilePage';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/signup">
          <RegistrationPage />
        </Route>
        <Route path="/profile" component={ProfilePage} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
