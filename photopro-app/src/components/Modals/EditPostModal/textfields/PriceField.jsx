import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function PriceField(props) {
  const [text, setText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const { saveButtonClicked } = props;

  useEffect(() => {
    setFirstRender(false);
  }, []);

  useEffect(() => {
    if (firstRender === false) {
      const result = handlePriceInput(text);
      props.setPriceValidated(result);
    }
  }, [saveButtonClicked]);

  const handlePriceInput = (text) => {
    if (Number.isInteger(parseInt(text))) return true;

    return false;
  };

  return (
    <React.Fragment>
      <h3>Price</h3>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handlePriceInput(e.target.value);
          }}
          id="outlined-required"
          label="Required"
          defaultValue="123"
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
