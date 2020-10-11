import React, { useState, useEffect } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";

export default function RegistrationPage() {

  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");

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

    async function attempt_registration(event) {
      event.preventDefault();

      const response = await axios.get("http://localhost:5000/create_user",
      {
        params: { email: email, password: password }
      });
      console.log(response);

    }


  return (
        <div>
            <form onSubmit={attempt_registration}>
              <FormGroup controlId="first_name" bsSize="large">
                <FormLabel>
                    First Name
                </FormLabel>
                <FormControl
                  autoFocus
                  value={first_name}
                  onChange={e => set_first_name(e.target.value)}
              /></FormGroup>

              <FormGroup
                  controlId="last_name"
                  bsSize="large">
                <FormLabel>
                  Last Name
                </FormLabel>
                <FormControl
                  value={last_name}
                  onChange={e => set_last_name(e.target.value)}
              /></FormGroup>

              <FormGroup controlId="email" bsSize="large">
                <FormLabel>
                    Email
                </FormLabel>
                <FormControl
                  autoFocus
                  type="email"
                  value={email}
                  onChange={e => set_email(e.target.value)}
              /></FormGroup>

              <FormGroup
                  controlId="password"
                  bsSize="large">
                <FormLabel>
                  Password
                </FormLabel>

                <FormControl
                  value={password}
                  onChange={e => set_password(e.target.value)}
                  type="password"
                />
              </FormGroup>

              <Button
                  block
                  bsSize="large"
                  disabled={
                      !validate_first_name()
                      || !validate_last_name()
                      || !validate_email()
                      || !validate_password()
                    }
                  type="submit">

                  Register

              </Button>
            </form>
        </div>
  );



}
