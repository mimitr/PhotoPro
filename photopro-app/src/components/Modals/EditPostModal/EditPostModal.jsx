import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./EditPostModal.css";

import TitleField from "./textfields/TitleField";
import CaptionField from "./textfields/CaptionField";
import TagsField from "./textfields/TagsField";
import PriceField from "./textfields/PriceField";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "ch",
    },
  },
}));

export default function EditPostPage(props) {
  // const [caption, set_caption] = useState("");
  // const [title, set_title] = useState("");
  // const [price, set_price] = useState("");
  // const [tags, set_tags] = useState("");

  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [titleValidated, setTitleValidated] = useState(false);
  const [captionValidated, setCaptionValidated] = useState(false);
  const [priceValidated, setPriceValidated] = useState(false);
  const [tagsValidated, setTagsValidated] = useState(false);

  // const { match } = props;
  const history = useHistory();

  const classes = useStyles();

  // function validate_title() {
  //   return title.length > 0 && title.length < 50;
  // }
  // function validate_caption() {
  //   return caption.length > 0 && caption.length < 50;
  // }
  // function validate_price() {
  //   return parseInt(price) > 0 && price.length > 0;
  // }
  // function validate_tags() {
  //   return tags.length > 0 && tags.length < 100;
  // }

  // async function edit_post(event) {
  //   event.preventDefault();

  //   var response = await axios.get("http://localhost:5000/edit_post", {
  //     params: {
  //       image_id: parseInt(match.params.id),
  //       title: title,
  //       price: price,
  //       caption: caption,
  //       tags: tags,
  //     },
  //   });
  //   console.log(response);

  //   if (response.data.result) {
  //     history.goBack();
  //   }
  // }

  const handleSaveButton = () => {};

  const handleCancelButton = () => {};

  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="overlayStyles" />
        <div
          className="editPostModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="grid-container-editpost">
            <div className="grid-item-image">
              <img
                src={`data:image/jpg;base64,${props.url}`}
                alt={props.caption}
              />
            </div>
            <form className={classes.root} noValidate autoComplete="off">
              <div className="edit-post-details">
                <TitleField
                  saveButtonClicked={saveButtonClicked}
                  setTitleValidated={setTitleValidated}
                />
                <CaptionField
                  saveButtonClicked={saveButtonClicked}
                  setCaptionValidated={setCaptionValidated}
                />
                <TagsField
                  saveButtonClicked={saveButtonClicked}
                  setTagsValidated={setTagsValidated}
                />
                <PriceField
                  saveButtonClicked={saveButtonClicked}
                  setPriceValidated={setPriceValidated}
                />

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSaveButton}
                >
                  SAVE
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleCancelButton}
                >
                  Cancel
                </Button>
              </div>
            </form>
            {/* <form className="grid-item-form" onSubmit={edit_post}>
              <FormGroup controlId="title" bsSize="large">
                <div>
                  <FormLabel>Title</FormLabel>
                </div>

                <FormControl
                  Type="title"
                  value={title}
                  onChange={(e) => set_title(e.target.value)}
                  defaultValue={"HELLLLOOOOO"}
                />
              </FormGroup>

              <FormGroup controlId="price" bsSize="large">
                <div>
                  <FormLabel>Price</FormLabel>
                </div>

                <FormControl
                  Type="price"
                  value={price}
                  onChange={(e) => set_price(e.target.value)}
                />
              </FormGroup>

              <FormGroup controlId="caption" bsSize="large">
                <div>
                  <FormLabel>Caption</FormLabel>
                </div>

                <FormControl
                  Type="caption"
                  value={caption}
                  onChange={(e) => set_caption(e.target.value)}
                />
              </FormGroup>

              <FormGroup controlId="tags" bsSize="large">
                <div>
                  <FormLabel>tags</FormLabel>
                </div>

                <FormControl
                  Type="tags"
                  value={tags}
                  onChange={(e) => set_tags(e.target.value)}
                />
              </FormGroup>

              <div>
                <Button
                  variant="primary"
                  disabled={
                    !validate_caption() ||
                    !validate_title() ||
                    !validate_price() ||
                    !validate_tags()
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </div>

              <Button
                onClick={() => {
                  history.push("/profile");
                }}
              >
                Cancel
              </Button>
            </form> */}
            {/* <div className="grid-item-old-values">
              <h1>Current title: {props.title}</h1>
              <h1>Current Caption: {props.caption}</h1>
              <h1>Current Price: ${props.price}</h1>
              <h1>Current Tags: ${props.tags}</h1>
            </div> */}
          </div>
        </div>
      </React.Fragment>,
      document.getElementById("editPostPortal")
    );
  }
}
