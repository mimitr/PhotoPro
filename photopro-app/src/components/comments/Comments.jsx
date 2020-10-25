import React, { useState } from "react";
import Comment from "./comment/Comment";
import "./Comments.css";
import axios from "axios";

//  APIS FOR COMMENTS:
//  /get_comments_to_image: image_id, batch_size => comment_id, image_id, commenter, comment, reply_id, created_at
//  /post_comment_to_image
//  /post_comment_to_comment
//  /post_delete_comment
//  /get_comments_to_comment: comment_id, batch_size => comment_id, image_id, commenter, comment, reply_id, created_at

export default function Comments(props) {
  const [comment_input, set_comment_input] = useState("");

  const comments = props.comments_list.map((comment) => {
    return <Comment comment_info={comment} />;
  });

  const handlePostClick = (e) => {
    e.preventDefault();
    console.log(comment_input);
    postComments(comment_input);
  };

  const postComments = (comment_input) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/post_comment_to_image",
      params: { comment: comment_input, image_id: props.image_id },
    }).then((res) => {
      // if (res.data.result != false) {
      //   setComments(comments.concat(res.data.result));
      // }
      console.log(res);
    });
    //     axios
    //       .post("http://localhost:5000/post_comment_to_image", {
    //         comment: comment_input,
    //         image_id: props.image_id,
    //       })
    //       .then((res) => {
    //         console.log(res);
    //       });
  };

  return (
    <React.Fragment>
      <div className="comment-input">
        <form onSubmit={handlePostClick}>
          <div>
            <input
              type="comment"
              id="comment_input"
              value={comment_input}
              onChange={(e) => set_comment_input(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="comments-container">
        <Comment />
        {comments}
      </div>
    </React.Fragment>
  );
}
