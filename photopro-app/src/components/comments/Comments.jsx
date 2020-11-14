import React, { useState } from 'react';
import Comment from './comment/Comment';
import './Comments.css';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  margin: {
    width: '70%',
    marginBottom: '10px',
  },
  textField: {
    width: '30ch',
    backgroundColor: 'white',
  },
}));

export default function Comments(props) {
  const [comment_input, set_comment_input] = useState('');
  const classes = useStyles();

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

  const sendCommentNotification = () => {
    axios({
      url: 'http://localhost:5000/send_notification',
      params: {
        uploader_id: props.uploader_id,
        notification: 'comment',
        image_id: props.image_id,
      },
    }).then((response) => {
      console.log(response);
    });
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
        set_comment_input('');
        sendCommentNotification();
      }
    });
    axios({
        method: 'GET',
        url: 'http://localhost:5000/update_comment_recommendation',
        params: { image_id: props.image_id}, //user_id: 1
        
      }).then((res) => {
        console.log(res);
      });
  };

  return (
    <React.Fragment>
      {localStorage.getItem('userLoggedIn') ? (
        <form onSubmit={handlePostClick}>
          <div className={classes.margin}>
            <TextField
              classes={{ root: classes.textField }}
              id="outlined-multiline-flexible"
              label="Type a comment"
              multiline
              rowsMax={4}
              value={comment_input}
              onChange={(e) => set_comment_input(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handlePostClick(e);
                }
              }}
              variant="outlined"
              size="small"
              fullWidth
            />
          </div>
        </form>
      ) : null}
      <div className="comments-container">{comments}</div>
    </React.Fragment>
  );
}
