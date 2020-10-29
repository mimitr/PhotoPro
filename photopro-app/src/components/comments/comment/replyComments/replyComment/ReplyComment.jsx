import React from "react";
import "./ReplyComment.css";

export default function ReplyComment(props) {
  //   console.log("each com");
  return (
    <React.Fragment>
      <div className="reply_comment">
        <div className="reply-avatar ava">
          <img src="https://images.unsplash.com/photo-1490894641324-cfac2f5cd077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=70"></img>
        </div>
        <div className="username">@{props.replies_info.commenter}</div>
        <div className="date">
          <p>{props.replies_info.created_at}</p>
        </div>
        <div className="reply_content">
          <p>{props.replies_info.comment}</p>
        </div>
      </div>
    </React.Fragment>
  );
}
