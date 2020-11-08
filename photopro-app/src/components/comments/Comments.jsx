import React, { useState, useEffect } from 'react';
import Comment from './comment/Comment';
import './Comments.css';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
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
      }
    });
  };

  return (
    <React.Fragment>
      <div className="comment-input">
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
      </div>
      <div className="comments-container">{comments}</div>
    </React.Fragment>
  );
}
