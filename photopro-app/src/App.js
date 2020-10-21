import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import PostInfo from './pages/PostInfo/PostInfo';
import CapturePhotoPage from './components/CapturePhotoPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

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
        <Route path="/changepassword" component={ChangePasswordPage} />
        <Route path="/forgotpassword" component={ForgotPasswordPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/uploadphoto" component={CapturePhotoPage} />
        <Route path="/post-:id" component={PostInfo} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
