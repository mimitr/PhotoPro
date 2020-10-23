import React, { useState } from "react";
import "./Comments.css";
import { CommentsHeader } from "./CommentsHeader/CommentsHeader";
import { AddComments } from "./AddComments/AddComments";
import { Comment } from "./Comment/Comment";

import axios from "axios";

function Comments(props) {
  return (
    <React.Fragment>
      <div>
        <CommentsHeader amountComments={0} />
        <AddComments />
        <Comment />
        <Comment />
        <Comment />
      </div>
    </React.Fragment>
  );
}

export default Comments;
