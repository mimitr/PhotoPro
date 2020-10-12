import React, { useState, useEffect } from 'react';

import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import ProfilePage from './ProfilePage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  console.log('RENDERED => ' + loggedIn);

  const updateLoginStatus = () => {
    setLoggedIn(true);
  };

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <React.Fragment>
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/login">
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <LoginPage loggedIn={updateLoginStatus} />
            )}
          </Route>
          <Route path="/signup">
            {loggedIn ? <Redirect to="/" /> : <RegistrationPage />}
          </Route>
        </Switch>
        <Route path="/profile" component={ProfilePage} />
      </React.Fragment>
    </Router>
  );
}

export default App;
