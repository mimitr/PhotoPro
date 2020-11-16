import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function CaptionField(props) {
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
      const result = handleCaptionInput(text);
      props.setCaptionValidated(result);
    }
  }, [saveButtonClicked]);

  const handleCaptionInput = (text) => {
    return text.length > 0 && text.length < 50;
  };

  return (
    <React.Fragment>
      <h3>Caption</h3>
      <div>
        <TextField
          required
          error={errorValue}
          helperText={errorText}
          onChange={(e) => {
            setText(e.target.value);
            handleCaptionInput(e.target.value);
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
