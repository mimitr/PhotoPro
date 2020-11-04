import React, { useState, useEffect } from 'react';
import './ReplyComments.css';
import axios from 'axios';
import ReplyComment from './replyComment/ReplyComment';

export default function ReplyComments(props) {
  const [replies, set_replies] = useState([]);
  const [replyUpdated, updateReplies] = useState('');

  // useEffect(() => {
  //   getReplies();
  // }, []);

  useEffect(() => {
    getReplies();
  }, [replyUpdated]);

  const getReplies = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/get_comments_to_comment',
      params: {
        comment_id: props.comment_id,
        batch_size: 10,
      },
    }).then((response) => {
      console.log(`im here in getReplies ${response.data.result}`);
      if (response.data.result) {
        set_replies(response.data.result);
      } else {
        set_replies([]);
        props.setShowViewReplies(false);
        props.updateComments(props.comment_id);
      }
    });
  };

  const replies_components = replies.map((reply) => {
    return (
      <ReplyComment
        key={reply.comment_id}
        replies_info={reply}
        updateReplies={updateReplies}
      />
    );
  });

  return (
    <React.Fragment>
      <div className="reply_comments">{replies_components}</div>
    </React.Fragment>
  );
}
