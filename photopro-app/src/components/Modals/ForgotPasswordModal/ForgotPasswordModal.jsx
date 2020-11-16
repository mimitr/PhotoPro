import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "./ForgotPasswordModal";
import axios from "axios";
import { useHistory } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "ch",
    },
  },
}));

export default function ForgotPassword(props) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");
  const [hashValue, setHashValue] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [newPasswordFormOpen, setNewPasswordFormOpen] = useState(false);

  const [codeVerified, setCodeVerified] = useState(false);

  const [enteredCode, setEnteredCode] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredNewPassword, setEnteredNewPassword] = useState("");

  const history = useHistory();

  const handleEmailInput = (text) => {
    if (
      text.length > 10 &&
      text.length < 50 &&
      text.includes("@") &&
      text.includes(".com")
    ) {
      setErrorValue(false);
      setErrorText("");
      return true;
    } else {
      setErrorText("Email must be entered and include an @ and .com");
      setErrorValue(true);
      return false;
    }
  };

  const forgotPasswordGetLink = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/forgot_password_get_change_password_link",
      params: {
        email: email,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setHashValue(response.data.result);
        setVerifyOpen(true);
      }
    });
  };

  const handleSendEmailClicked = () => {
    forgotPasswordGetLink();
  };

  const forgotPasswordCodeSubmit = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/change_password",
      params: {
        email: enteredEmail,
        new_password: enteredNewPassword,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setNewPasswordFormOpen(true);
      }
    });
  };

  const handleCodeSubmitEntered = (e) => {
    e.stopPropagation();
    // compare the user's code with our code
    if (enteredCode === hashValue) {
      console.log("code is the same!");
    } else {
      setCodeVerified(true);
    }
  };

  if (!props.openForgotPasswordModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="loginModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {!verifyOpen ? (
            <React.Fragment>
              <h1>Forgot Password</h1>
              <h3>If you forgot your password, you can reset it here.</h3>
              <h3>
                Please enter your email and you will receive an email with
                further instructions.
              </h3>

              <h2>Email</h2>
              <div>
                <TextField
                  required
                  error={errorValue}
                  helperText={errorText}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleEmailInput(e.target.value);
                  }}
                  id="outlined-required"
                  label="Required"
                  defaultValue={props.oldTitle}
                  variant="outlined"
                />
              </div>

              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSendEmailClicked}
                >
                  SEND EMAIL
                </Button>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="default"
                  size="large"
                  onClick={() => {
                    props.setOpenForgotPasswordModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </React.Fragment>
          ) : null}

          {verifyOpen ? (
            <React.Fragment>
              <h1>Verify that it's you</h1>
              <h3>
                An email with a verification code was just sent to {email}
              </h3>
              <h2>Enter code</h2>
              <div>
                <TextField
                  required
                  // error={errorValue}
                  // helperText={errorText}
                  onChange={(e) => {
                    setEnteredCode(e.target.value);
                    // handleCodeInput(e.target.value);
                  }}
                  id="outlined-required"
                  label="Required"
                  defaultValue={props.oldTitle}
                  variant="outlined"
                />
              </div>

              <div>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCodeSubmitEntered}
                >
                  Submit
                </Button>
              </div>
            </React.Fragment>
          ) : null}

          {codeVerified ? (
            <React.Fragment>
              <h1>Code is verified!</h1>
            </React.Fragment>
          ) : null}
        </div>
      </React.Fragment>,
      document.getElementById("toolbarPortal")
    );
  }
}
