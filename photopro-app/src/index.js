import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";

import MainWrapper from "./components/MainWrapper";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import ChangePasswordPage from "./components/ChangePasswordPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import {CapturePhotoPage} from "./components/CapturePhotoPage";
import EditPostPage from "./components/EditPostPage";



ReactDOM.render(
  <React.StrictMode>
    <MainWrapper/>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
