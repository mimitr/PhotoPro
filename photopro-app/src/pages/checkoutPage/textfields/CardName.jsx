import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function CardName() {
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);

  const handleNameCardInput = (event) => {
    event.stopPropagation();
    let patt = /\w+\s\w+/;
    if (event.target.value.length > 0 && patt.test(event.target.value)) {
      setErrorValue(false);
      setErrorText("");
    } else {
      setErrorText("Enter your card name [first name + last name]");
      setErrorValue(true);
    }
  };
  return (
    <React.Fragment>
      <h3>NAME ON CARD</h3>
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={handleNameCardInput}
        id="outlined-required"
        label="Required"
        variant="outlined"
      />
    </React.Fragment>
  );
}
