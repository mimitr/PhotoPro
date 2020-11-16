import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function PriceField(props) {
  const [text, setText] = useState(props.oldPrice);
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  //   const [firstRender, setFirstRender] = useState(true);

  const { saveButtonClicked } = props;

  //   useEffect(() => {
  //     setFirstRender(false);
  //   }, []);

  useEffect(() => {
    const result = handlePriceInput(text);
    props.setPriceValidated([result, text]);
  }, []);

  useEffect(() => {
    // if (firstRender === false) {
    const result = handlePriceInput(text);
    console.log(text);
    props.setPriceValidated([result, text]);

    // }
  }, [saveButtonClicked]);

  const handlePriceInput = (text) => {
    console.log(Number.isInteger(parseInt(text)));
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
          defaultValue={parseInt(props.oldPrice)}
          variant="outlined"
        />
      </div>
    </React.Fragment>
  );
}
