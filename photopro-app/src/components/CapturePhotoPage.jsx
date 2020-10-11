import React, { useState, useEffect } from "react";
import ImageUploader from "react-images-upload";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import axios from "axios";

var caption = "";
var img = null;

function isValid() {
  if (img==null) {
    return true;
  }
  return false;
}

async function attempt_login(event) {
  event.preventDefault();
  // console.log(caption);
  // console.log(img);
  const form_data = new FormData();
  form_data.append("image", img)
  form_data.append("user_id", 1)
  form_data.append("caption", caption)

  const response = await axios.post("http://localhost:5000/post", form_data);
  console.log(response);

}

class CapturePhotoPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pictures: [], caption:"" };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles)
    });
    // console.log(pictureFiles[0]);
    // console.log(pictureDataURLs[0]);
    img = pictureDataURLs[0];
  }

  render() {
    return (
      <div>
        <ImageUploader
          withIcon={true}
          buttonText="Choose image"
          onChange={this.onDrop}
          imgExtension={[".jpg", ".png"]}
          maxFileSize={5242880}
          withPreview={true}
          singleImage={true}
          withLabel={true}
        />
        <form onSubmit={attempt_login}>

          <FormGroup bsSize="large">
            <FormLabel>
                Caption
            </FormLabel>
            <FormControl
              autoFocus

              onChange={e => caption = e.target.value}
          />
          <Button
              block
              bsSize="large"
              disabled={isValid()}
              type="submit">
              Post
          </Button>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export {CapturePhotoPage};