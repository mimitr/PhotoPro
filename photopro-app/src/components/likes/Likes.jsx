import React, { useState, useEffect } from 'react';
import './Likes.css';
import axios from 'axios';

function Likes(props) {
  const [num_likes, set_num_likes] = useState(props.num_likes);
  const [updated, set_updated] = useState(false);
  const [postLiked, setPostLiked] = useState(false);

  useEffect(() => {
    console.log('check if liked called');
    checkIfLiked();
  }, []);

  let userID = localStorage.getItem('userID');

  const handleLikeClicked = () => {
    if (userID != null) {
      if (!postLiked) {
        post_likes(props.image_id);
      } else {
        delete_likes(props.image_id);
      }
    } else {
      console.log('user is not logged in yet');
    }
  };

  const checkIfLiked = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/get_likers_of_image',
      params: { image_id: props.image_id, batch_size: 50 },
    }).then((response) => {
      console.log(response);
      if (response.data.result) {
        for (let i = 0; i < response.data.result.length; i++) {
          if (userID === response.data.result.user_id) {
            setPostLiked(true);
            console.log('This image has been liked before :o');
          }
        }
      } else {
        console.log('no likers found');
      }
    });
  };

  const post_likes = (img_id) => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/post_like_to_image',
      params: { image_id: img_id },
    }).then((response) => {
      console.log(`post_like api response is ${response.data.result}`);
      console.log(response);

      if (updated === false) {
        set_num_likes((prevState) => parseInt(prevState) + 1);
        set_updated(true);
      }

      return response.data.result;
    });
  };

  const delete_likes = (img_id) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/delete_like_from_image',
      params: { image_id: img_id },
    }).then((response) => {
      console.log(`delete_likes api response is ${response.data.result}`);

      if (updated === true) {
        set_num_likes((prevState) => parseInt(prevState) - 1);
        set_updated(false);
      }
      return response.data.result;
    });
  };

  return (
    <React.Fragment>
      <div className="like">
        <button
          className="btn like-btn"
          onClick={handleLikeClicked}
          type="button"
        >
          <svg width="25" height="25">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        </button>
        <p>{num_likes}</p>
      </div>
    </React.Fragment>
  );
}

export default Likes;
