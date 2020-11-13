import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function CardNum() {
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);

  const handleCardNumberInput = (event) => {
    event.stopPropagation();
    let patt = /\d+/;
    if (event.target.value.length === 16 && patt.test(event.target.value)) {
      setErrorValue(false);
      setErrorText("");
    } else {
      setErrorText("Bank Account should be 16 digits only");
      setErrorValue(true);
    }
  };
  return (
    <React.Fragment>
      <h3>CARD NUMBER</h3>
      <TextField
        required
        error={errorValue}
        id="outlined-required"
        label="Required"
        variant="outlined"
        helperText={errorText}
        onChange={handleCardNumberInput}
      />
    </React.Fragment>
  );
}
