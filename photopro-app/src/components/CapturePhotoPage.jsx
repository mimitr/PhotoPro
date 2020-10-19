import React from 'react';
import ImageUploader from 'react-images-upload';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';

var caption = '';
var title = '';
var price = '0';
var img = null;

function isValid() {
  if (img == null) {
    return true;
  }
  return false;
}

async function attempt_login() {
  const form_data = new FormData();
  form_data.append('image', img);
  form_data.append('caption', caption);
  form_data.append('title', title);
  form_data.append('price', price);

  const response = await axios.post('http://localhost:5000/post', form_data);
  return response;
}

class CapturePhotoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pictures: [], caption: '' };
    this.onDrop = this.onDrop.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  onDrop(pictureFiles, pictureDataURLs) {
    this.setState({
      pictures: this.state.pictures.concat(pictureFiles),
    });
    // console.log(pictureFiles[0]);
    // console.log(pictureDataURLs[0]);
    img = pictureDataURLs[0];
  }

  formSubmit(event) {
    event.preventDefault();
    const post = attempt_login();
    post.then((response) => {
      console.log(response);
      if (response.data.result !== false) {
        this.props.history.push('/');
      }
    });
  }

  render() {
    return (
      <div>
        <ImageUploader
          withIcon={true}
          buttonText="Choose image"
          onChange={this.onDrop}
          imgExtension={['.jpg', '.png']}
          maxFileSize={5242880}
          withPreview={true}
          singleImage={true}
          withLabel={true}
        />
        <form onSubmit={this.formSubmit}>
          <FormGroup bsSize="large">
            <FormLabel>Title:</FormLabel>
            <FormControl autoFocus onChange={(e) => (title = e.target.value)} />
          </FormGroup>
          <FormGroup bsSize="large">
            <FormLabel>Caption:</FormLabel>
            <FormControl
              autoFocus
              onChange={(e) => (caption = e.target.value)}
            />
          </FormGroup>
          <FormGroup bsSize="large">
            <FormLabel>Price: $</FormLabel>
            <FormControl
              autoFocus
              type="number"
              step="0.01"
              onChange={(e) => (price = e.target.value)}
            />
          </FormGroup>
          <Button block bsSize="large" disabled={isValid()} type="submit">
            Post
          </Button>
        </form>
        <Button
          block
          bsSize="large"
          type="submit"
          onClick={() => {
            this.props.history.goBack();
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }
}

export default CapturePhotoPage;
