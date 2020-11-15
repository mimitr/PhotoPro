import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import './SignupModal.css';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function RegistrationPage(props) {
  const history = useHistory();

  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [first_name, set_first_name] = useState('');
  const [last_name, set_last_name] = useState('');
  const [username, set_username] = useState('');

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  function validate_password() {
    return password.length >= 8 && password.length < 16;
  }

  function validate_first_name() {
    return email.length > 0 && email.length < 50;
  }

  function validate_last_name() {
    return password.length > 0 && password.length < 50;
  }

  function validate_username() {
    return password.length > 0 && password.length < 32;
  }

  async function attempt_registration(event) {
    event.preventDefault();

    const response = await axios.get('http://localhost:5000/create_user', {
      params: {
        email: email,
        password: password,
        first: first_name,
        last: last_name,
        username: username,
      },
    });
    console.log(response);

    if (response.data.result !== false) {
      history.push('/');
      history.go(0);
    }
  }

  console.log(props.openSignupModal);

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

          <form onSubmit={attempt_registration}>
            <FormGroup controlId="first_name" bsSize="large">
              <div>
                <FormLabel>First Name</FormLabel>
              </div>

              <FormControl
                autoFocus
                value={first_name}
                onChange={(e) => set_first_name(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="last_name" bsSize="large">
              <div>
                <FormLabel>Last Name</FormLabel>
              </div>

              <FormControl
                value={last_name}
                onChange={(e) => set_last_name(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="username" bsSize="large">
              <div>
                <FormLabel>Username</FormLabel>
              </div>

              <FormControl
                value={username}
                onChange={(e) => set_username(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="email" bsSize="large">
              <div>
                <FormLabel>Email</FormLabel>
              </div>

              <FormControl
                autoFocus
                type="email"
                value={email}
                onChange={(e) => set_email(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="password" bsSize="large">
              <div>
                <FormLabel>Password</FormLabel>
              </div>

              <FormControl
                value={password}
                onChange={(e) => set_password(e.target.value)}
                type="password"
              />
            </FormGroup>
            <div className="register-button">
              <Button
                block
                bsSize="large"
                disabled={
                  !validate_first_name() ||
                  !validate_last_name() ||
                  !validate_email() ||
                  !validate_password() ||
                  !validate_username()
                }
                type="submit"
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </React.Fragment>,
      document.getElementById('toolbarPortal')
    );
  }
}
