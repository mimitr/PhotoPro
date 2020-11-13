import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function CardMonth() {
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);

  const handleMonthInput = (event) => {
    event.stopPropagation();
    if (
      parseInt(event.target.value) > 0 &&
      parseInt(event.target.value) <= 12
    ) {
      setErrorValue(false);
      setErrorText("");
    } else {
      setErrorText("Input the correct month [1-12]");
      setErrorValue(true);
    }
  };
  return (
    <React.Fragment>
      <h3>EXPIRY DATE</h3>
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={handleMonthInput}
        id="outlined-number"
        label="Month"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
    </React.Fragment>
  );
}
