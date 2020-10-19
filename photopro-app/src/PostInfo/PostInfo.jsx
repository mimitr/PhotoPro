import React, { Component } from "react";
import "./PostInfo.css";
import Toolbar from "../components/toolbar/toolbar";
import PostImage from "./PostImage/PostImage";

const PostInfo = (props) => {
  console.log(props.location.state);
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
            <button className="btn like-btn" type="button">
              <svg width="25" height="25">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
            </button>
          </div>
          <div className="bookmaerk">
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
        </div>
        <div className="postFeed-nested">
          <div className="postTags">
            <h2>{props.location.state.caption}</h2>
            <h3>Tags:</h3>
          </div>
          <div className="postPrice">
            <h2>Price: {props.location.state.price}</h2>
            <button>Add to Cart</button>
          </div>
          <div className="postComments">
            <h2>Comments:</h2>
          </div>
        </div>
        <div className="recImages-nested">
          <h1> Related Photos:</h1>
          <div className="recImage"></div>
          <div className="recImage"></div>
          <div className="recImage"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PostInfo;
