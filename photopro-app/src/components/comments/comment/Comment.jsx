import React from 'react';
import './Comment.css';

export default function Comment(props) {
  return (
    <div class="card v-card v-sheet theme--light elevation-2">
      <div class="header">
        <div class="comment-container">
          <div class="v-avatar avatar">
            <img src="https://images.unsplash.com/photo-1490894641324-cfac2f5cd077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=70"></img>
          </div>
          <span class="displayName title">{props.comment_info.commenter}</span>{' '}
          <span class="displayName caption">
            {props.comment_info.created_at}
          </span>
        </div>
        <div class="wrapper comment">
          <p>{props.comment_info.comment}</p>
        </div>
      </div>
    </div>
  );
}
