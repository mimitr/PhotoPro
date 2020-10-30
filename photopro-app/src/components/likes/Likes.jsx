import React, { useState } from "react";
import "./Likes.css";
import axios from "axios";

function Likes(props) {
  const [num_likes, set_num_likes] = useState(props.num_likes);
  const [updated, set_updated] = useState(false);

  const handleLikeClicked = () => {
    if (updated == false) {
      if (post_likes(props.image_id)) {
        set_num_likes((prevState) => parseInt(prevState) + 1);
        set_updated(true);
      }
    } else {
      if (delete_likes(props.image_id)) {
        set_num_likes((prevState) => parseInt(prevState) - 1);
        set_updated(false);
      }
    }
  };

  const post_likes = (img_id) => {
    axios({
      method: "GET",
      url: "http://localhost:5000/post_like_to_image",
      params: { image_id: img_id },
    }).then((response) => {
      console.log(response.data.result);
      return response.data.result;
    });
  };

  const delete_likes = (img_id) => {
    axios({
      method: "GET",
      url: "http://localhost:5000/delete_like_from_image",
      params: { image_id: img_id },
    }).then((response) => {
      console.log(response.data.result);
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
