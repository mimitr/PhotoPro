import React, { useState, useEffect } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';

import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import MainPage from './MainPage';

export default function LoginPage() {
  const [email, set_email] = useState('');
  const [password, set_password] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

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
    console.log(response);

    if (response.data.result) {
      setLoggedIn(true);
    }
  }

  if (loggedIn) {
    return (
      <Router>
        <Route path="/" exact component={MainPage} />
        <Redirect to="/" />
      </Router>
    );
  } else {
    return (
      <div>
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
      </div>
    );
  }
}
