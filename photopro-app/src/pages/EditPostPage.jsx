import React, { useState } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function EditPostPage(props) {
  const [caption, set_caption] = useState('');
  const [title, set_title] = useState('');
  const [price, set_price] = useState('');
  const [tags, set_tags] = useState('');
  const { match } = props;
  const history = useHistory();
  console.log(match.params.id);

  function validate_title() {
    return title.length > 0 && title.length < 50;
  }
  function validate_caption() {
    return caption.length > 0 && caption.length < 50;
  }
  function validate_price() {
    return parseInt(price) > 0 && price.length > 0;
  }
  function validate_tags() {
    return tags.length > 0 && tags.length < 100;
  }

  async function edit_post(event) {
    event.preventDefault();

    var response = await axios.get('http://localhost:5000/edit_post', {
      params: {
        image_id: match,
        title: title,
        price: price,
        caption: caption,
        tags: tags,
      },
    });
    console.log(response);
  }
  //TODO: Find a way to extract image_id from an image
  //To test, replace 'image_id' with any valid image_id from the database

  return (
    <div>
      <form onSubmit={edit_post}>
        <FormGroup controlId="title" bsSize="large">
          <FormLabel>Title</FormLabel>
          <FormControl
            Type="title"
            value={title}
            onChange={(e) => set_title(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="price" bsSize="large">
          <FormLabel>Price</FormLabel>
          <FormControl
            Type="price"
            value={price}
            onChange={(e) => set_price(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="caption" bsSize="large">
          <FormLabel>Caption</FormLabel>
          <FormControl
            Type="caption"
            value={caption}
            onChange={(e) => set_caption(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="tags" bsSize="large">
          <FormLabel>Caption</FormLabel>
          <FormControl
            Type="tags"
            value={tags}
            onChange={(e) => set_tags(e.target.value)}
          />
        </FormGroup>

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
        <Button
          onClick={() => {
            history.push('/profile');
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
