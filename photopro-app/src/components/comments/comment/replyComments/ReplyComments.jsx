import React, { useState, useEffect } from "react";
import "./ReplyComments.css";
import axios from "axios";
import ReplyComment from "./replyComment/ReplyComment";

export default function ReplyComments(props) {
  const [replies, set_replies] = useState([]);

  //const [replyUpdated, setReplyUpdated] = useState("");

  useEffect(() => {
    getReplies();
  }, []);

  const getReplies = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_comments_to_comment",
      params: {
        comment_id: props.comment_id,
        batch_size: 10,
      },
    }).then((response) => {
      if (response.data.result) {
        console.log(response.data.result);
        set_replies(response.data.result);
      }
    });
  };

  const replies_components = replies.map((reply) => {
    console.log("heree");
    return <ReplyComment replies_info={reply} />;
  });

  return (
    <React.Fragment>
      <div className="reply_comments">{replies_components}</div>
    </React.Fragment>
  );
}
