import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import './SignupModal.css';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Email from './Textfields/Email';
import FirstName from './Textfields/FirstName';
import LastName from './Textfields/LastName';
import Password from './Textfields/Password';
import Username from './Textfields/Username';

export default function RegistrationPage(props) {
  const [submitFormClicked, setSubmitFormClicked] = useState(false);

  const [firstNameValidated, setFirstNameValidated] = useState([false, '']);
  const [lastNameValidated, setLastNamedValidated] = useState([false, '']);
  const [emailValidated, setEmailValidated] = useState([false, '']);
  const [passwordValidated, setPasswordValidated] = useState([false, '']);
  const [usernameValidated, setUsernameValidated] = useState([false, '']);
  const history = useHistory();

  useEffect(() => {

    const registerUser = () => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/create_user',
        params: {
          email: emailValidated[1],
          password: passwordValidated[1],
          first: firstNameValidated[1],
          last: lastNameValidated[1],
          username: usernameValidated[1],
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          history.push('/');
          history.go(0);
        }
      });
    };

    const verifyUser = () => {
      axios({
        method: 'POST',
        url: 'http://localhost:5000/verify_email',
        params: {
          email: emailValidated[1]
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          registerUser();
        }
      });
    };

    if (
      firstNameValidated[0] &&
      lastNameValidated[0] &&
      emailValidated[0] &&
      passwordValidated[0] &&
      usernameValidated[0]
    ) {
      verifyUser();
    }
  }, [
    firstNameValidated,
    lastNameValidated,
    emailValidated,
    passwordValidated,
    usernameValidated,
  ]);

  if (!props.openSignupModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="signupModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1>Join PhotoPro</h1>

          <FirstName
            submitFormClicked={submitFormClicked}
            setFirstNameValidated={setFirstNameValidated}
          />
          <LastName
            submitFormClicked={submitFormClicked}
            setLastNameValidated={setLastNamedValidated}
          />
          <Email
            submitFormClicked={submitFormClicked}
            setEmailValidated={setEmailValidated}
          />
          <Username
            submitFormClicked={submitFormClicked}
            setUsernameValidated={setUsernameValidated}
          />
          <Password
            submitFormClicked={submitFormClicked}
            setPasswordValidated={setPasswordValidated}
          />

          <div className="register-button">
            <Button
              block
              bsSize="large"
              onClick={() => {
                setSubmitFormClicked(!submitFormClicked);
              }}
            >
              Register
            </Button>
          </div>
        </div>
      </React.Fragment>,
      document.getElementById('toolbarPortal')
    );
  }
}
