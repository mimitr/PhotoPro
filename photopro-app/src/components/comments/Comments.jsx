import React, { useState, useEffect } from 'react';
import Comment from './comment/Comment';
import './Comments.css';
import axios from 'axios';

export default function Comments(props) {
  const [comment_input, set_comment_input] = useState('');

  const comments = props.comments_list.map((comment) => {
    return (
      <Comment
        key={comment.comment_id}
        updateComments={props.updateComments}
        updateReplies={props.updateReplies}
        comment_info={comment}
      />
    );
  });

  const handlePostClick = (e) => {
    e.preventDefault();
    postComments(comment_input);
  };

  const postComments = (comment_input) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/post_comment_to_image',
      params: { comment: comment_input, image_id: props.image_id },
    }).then((response) => {
      if (response.data.result) {
        console.log(`comment posted successfully with ${response.data.result}`);
        props.updateComments(props.comments_list.concat(comment_input));
      }
    });
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
      <div className="comments-container">{comments}</div>
    </React.Fragment>
  );
}
