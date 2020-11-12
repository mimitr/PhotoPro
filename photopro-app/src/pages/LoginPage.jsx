import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function LoginPage() {
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  let history = useHistory(); // router hook which provides access to dom history (allows for page transitions)

  function validate_email() {
    return email.length > 0 && email.length < 50;
  }

  function validate_password() {
    return password.length >= 8 && password.length < 16;
  }

  async function attempt_login(event) {
    event.preventDefault();

    const response = await axios.get('http://localhost:5000/login', {
      params: { email: email, password: password },
    });

    const a = await axios.get('http://localhost:5000/get_user_username', {
      params: { user_id: 26},
    });

    if (response.data.result) {
      localStorage.setItem('userLoggedIn', true);
      localStorage.setItem('userID', response.data.user_id);
      history.push('/');
    } else {
      setLoginFailed(true);
    }
  }

  function handleForgotPasswordClicked() {
    history.push('/forgotpassword');
  }

  return (
    <React.Fragment>
      <form onSubmit={attempt_login}>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={(e) => set_email(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>

          <FormControl
            value={password}
            onChange={(e) => set_password(e.target.value)}
            type="password"
          />
        </FormGroup>

        <Button
          block
          bsSize="large"
          disabled={!validate_email() || !validate_password()}
          type="submit"
        >
          Login
        </Button>
      </form>
      <Button block bsSize="large" onClick={handleForgotPasswordClicked}>
        Forgot Password
      </Button>
      <Button
        block
        bsSize="large"
        type="submit"
        onClick={() => {
          history.goBack();
        }}
      >
        Cancel
      </Button>
      {loginFailed ? (
        <p style={{ color: 'red' }}>Incorrect username or password</p>
      ) : (
        <p></p>
      )}
    </React.Fragment>
  );
}
