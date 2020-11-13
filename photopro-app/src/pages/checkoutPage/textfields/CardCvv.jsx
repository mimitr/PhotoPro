import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function () {
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);

  const handleCvvInput = (event) => {
    event.stopPropagation();
    let patt = /\d+/;
    if (
      (parseInt(event.target.value.length) === 3) &
      patt.test(event.target.value)
    ) {
      setErrorValue(false);
      setErrorText("");
    } else {
      setErrorText("Input the correct CVV [3 digits]");
      setErrorValue(true);
    }
  };
  return (
    <React.Fragment>
      {" "}
      <h3>CVV</h3>
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={handleCvvInput}
        id="outlined-required"
        label="Required"
        defaultValue="123"
        variant="outlined"
      />
    </React.Fragment>
  );
}
