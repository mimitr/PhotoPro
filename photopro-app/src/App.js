import React, { useState, useEffect } from "react";

import MainPage from "./MainPage/MainPage";
import LoginPage from "./LoginPage/LoginPage";
import RegistrationPage from "./RegistrationPage/RegistrationPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import PostInfo from "./PostInfo/PostInfo";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  console.log("RENDERED => " + loggedIn);

  const updateLoginStatus = () => {
    setLoggedIn(true);
  };

  useEffect(() => {
    const userLoggedIn = localStorage.getItem("userLoggedIn");
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
          <Route path="/profile" component={ProfilePage} />
          {loggedIn ? <h1>logged in</h1> : <h1>not logged in</h1>}
          <Route path="/post-info" component={PostInfo} />
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
