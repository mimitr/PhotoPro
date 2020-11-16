import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";

export default function TagsField(props) {
  const [text, setText] = useState(props.oldTags);
  const [errorText, setErrorText] = useState("");
  const [errorValue, setErrorValue] = useState(false);
  //   const [firstRender, setFirstRender] = useState(true);

  const { saveButtonClicked } = props;

  //   useEffect(() => {
  //     setFirstRender(false);
  //   }, []);

  console.log("old tags");
  console.log(props.oldTags.toString());

  useEffect(() => {
    const result = handleTagsInput(props.oldTags);
    props.setTagsValidated([result, text]);
  }, []);

  useEffect(() => {
    // if (firstRender === false) {
    const result = handleTagsInput(text);
    props.setTagsValidated([result, text]);
    // }
  }, [saveButtonClicked]);

  const handleTagsInput = (text) => {
    console.log(text);
    return text.length > 0 && text.length < 100;
  };

  return (
    <React.Fragment>
      <h3>Tags</h3>
      <div>
        {props.oldTags.length > 0 ? (
          <TextField
            required
            error={errorValue}
            helperText={errorText}
            onChange={(e) => {
              setText(e.target.value);
              handleTagsInput(e.target.value);
            }}
            id="outlined-required"
            label="Required"
            defaultValue={props.oldTags.toString()}
            variant="outlined"
          />
        ) : null}
      </div>
    </React.Fragment>
  );
}
