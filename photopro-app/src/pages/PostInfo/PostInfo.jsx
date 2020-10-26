import React, { useState, useEffect } from "react";
import "./PostInfo.css";
import Toolbar from "../../components/toolbar/toolbar";
import Likes from "../../components/likes/Likes";
import Comments from "../../components/comments/Comments";
import axios from "axios";

const PostInfo = (props) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // fetch the comments given the photo id
    fetchComments(props.location.state.id);
    //console.log(props.location.state);
  });

  const fetchComments = (id) => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_comments_to_image",
      params: { image_id: id, batch_size: 20 },
    }).then((res) => {
      if (res.data.result != false) {
        setComments(comments.concat(res.data.result));
      }

      console.log(res);
    });
  };

  return (
    <React.Fragment>
      <Toolbar />
      <div className="postWrapper">
        <div className="postInfo">
          <div className="username">
            <p>@{props.location.state.uploader}</p>
          </div>
          <div className="follow">
            <button className="btn">Follow</button>
          </div>
          <div className="like">
            <Likes
              num_likes={props.location.state.num_likes}
              image_id={props.location.state.id}
            />
          </div>
          <div className="bookmark">
            <button className="btn bookmark-btn">
              <svg width="25" height="25">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="postImage">
          <img
            src={`data:image/jpg;base64,${props.location.state.url}`}
            alt={props.location.state.caption}
          />
          <div className="recImages-nested">
            <h1> Related Photos:</h1>
            <div className="recImage"></div>
            <div className="recImage"></div>
            <div className="recImage"></div>
          </div>
        </div>
        <div className="postFeed-nested">
          <div className="postTags">
            <h2>{props.location.state.caption}</h2>
            <h3>Tags:</h3>
          </div>
          <div className="postPrice">
            <h2>Price: ${props.location.state.price}</h2>
            <button>Add to Cart</button>
          </div>
          <div className="postComments">
            <h2>Comments:</h2>
            {/* <Comments className="comments" /> */}
            <Comments
              image_id={props.location.state.id}
              comments_list={comments}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PostInfo;
