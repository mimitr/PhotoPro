import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function () {
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);

  const handleYearInput = (event) => {
    event.stopPropagation();
    if (parseInt(event.target.value) >= 2020) {
      setErrorValue(false);
      setErrorText("");
    } else {
      setErrorText("Input the correct year [2020+]");
      setErrorValue(true);
    }
  };
  return (
    <React.Fragment>
      {" "}
      <TextField
        required
        error={errorValue}
        helperText={errorText}
        onChange={handleYearInput}
        id="outlined-number"
        label="Year"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
      />
    </React.Fragment>
  );
}
