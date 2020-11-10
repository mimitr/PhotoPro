import React, { useState, useEffect } from 'react';
import './PostInfo.css';
import Toolbar from '../../components/toolbar/toolbar';
import Likes from '../../components/likes/Likes';
import Comments from '../../components/comments/Comments';
import axios from 'axios';

const PostInfo = (props) => {
  const [comments, setComments] = useState([]);
  const [commentUpdated, updateComments] = useState('');
  const {
    location: {
      state: { id: imageID },
    },
  } = props;

  console.log(`NUMBER OF LIKES IS ${props.location.state.num_likes}`);

  console.log(props);

  useEffect(() => {
    const fetchComments = (id) => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_comments_to_image',
        params: { image_id: id, batch_size: 20 },
      }).then((res) => {
        // console.log(res);
        // console.log(`in fetch comments with result = ${res.data.result}`);
        if (res.data.result !== false) {
          // console.log('result was not false');
          setComments(res.data.result);
        } else {
          setComments([]);
        }
      });
    };
    fetchComments(imageID);
    console.log('update comment called');
  }, [commentUpdated, imageID]);

  return (
    <React.Fragment>
      <Toolbar />
      <div className="postWrapper">
        <div className="postInfo">
          <div className="username">
            <p>@{props.location.state.uploader}</p>
            <button className="btn">Follow</button>
            <Likes
              num_likes={props.location.state.num_likes}
              image_id={props.location.state.id}
            />
            <button className="btn bookmark-btn">
              <svg width="25" height="25">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
              </svg>
            </button>
          </div>
          {/* <div className="follow"></div>
          <div className="like"></div>
          <div className="bookmark"></div> */}
        </div>
        <div className="postImage">
          <img
            src={`data:image/jpg;base64,${props.location.state.url}`}
            alt={props.location.state.caption}
          />
          <div className="recImages-nested">
            <h1 className="roboto"> Related Photos:</h1>
            <div className="recImage"></div>
            <div className="recImage"></div>
            <div className="recImage"></div>
          </div>
        </div>
        <div className="postFeed-nested">
          <div className="postTags">
            <h2 className="roboto">{props.location.state.caption}</h2>
            <h3>Tags:</h3>
          </div>
          <div className="postPrice">
            <h2 className="roboto">Price: ${props.location.state.price}</h2>
            <button>Add to Cart</button>
          </div>
          <div className="postComments">
            <h2 className="roboto">Comments:</h2>
            {/* <Comments className="comments" /> */}
            <Comments
              image_id={props.location.state.id}
              comments_list={comments}
              updateComments={updateComments}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PostInfo;
