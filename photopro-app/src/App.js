import React, { useState, useEffect } from "react";

import MainPage from "./MainPage/MainPage";
import LoginPage from "./LoginPage/LoginPage";
import RegistrationPage from "./RegistrationPage/RegistrationPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import PostInfo from "./PostInfo/PostInfo";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
        <Route path="/post-info" component={PostInfo} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
