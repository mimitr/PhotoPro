import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

export default function Email(props) {
  const [text, setText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { submitFormClicked } = props;

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handleEmailInput(text);
      props.setEmailValidated([result, text]);
    }
  }, [submitFormClicked]);

  const handleEmailInput = (text) => {
    if (text.length > 16 && text.length < 50) {
      setErrorValue(false);
      setErrorText('');
      return true;
    } else {
      setErrorText('Email must be entered');
      setErrorValue(true);
      return false;
    }
  };

  return (
    <React.Fragment>
      <h1></h1>
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={(e) => {
          setText(e.target.value);
          handleEmailInput(e.target.value);
        }}
        label="Email"
        InputLabelProps={{
          shrink: true,
        }}
      />
    </React.Fragment>
  );
}
