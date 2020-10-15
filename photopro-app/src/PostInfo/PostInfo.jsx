import React, { Component } from "react";
import "./PostInfo.css";
import Toolbar from "../components/toolbar/toolbar";
import PostImage from "./PostImage/PostImage";

const PostInfo = (props) => {
  console.log(props.location.state);
  return (
    <React.Fragment>
      <Toolbar />
      <div className="postWrapper"></div>
      <PostImage image={props.location.state} />
    </React.Fragment>
  );
};

export default PostInfo;
