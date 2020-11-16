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
  const [errorValue, setErrorValue] = useState(false);

  const history = useHistory();

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  async function attempt_password_change(event) {
    event.preventDefault();

    var response = await axios.get(
      "http://localhost:5000/forgot_password_get_change_password_link",
      {
        params: { email: email },
      }
    );
    console.log(response);
  }

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
      console.log(response);
      if (response.data.result !== false) {
        console.log(response);
      }
    });
  };

  const handleSendEmailClicked = () => {
    forgotPasswordGetLink();
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
          <h1>Forgot Password</h1>
          <h3>If you forgot your password, you can reset it here.</h3>
          <h3>
            Please enter your email and you will receive an email with further
            instructions.
          </h3>
          {/* <form className={classes.root} noValidate autoComplete="off">
            <div className="cart-details-grid"></div> */}
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
          {/* </form> */}
        </div>
      </React.Fragment>,
      document.getElementById("toolbarPortal")
    );
  }
}
