import React from 'react';

import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import ProfilePage from './ProfilePage';
import CapturePhotoPage from './components/CapturePhotoPage';

import { Switch, Route } from 'react-router-dom';

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
        <Route path="/uploadphoto" component={CapturePhotoPage} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
