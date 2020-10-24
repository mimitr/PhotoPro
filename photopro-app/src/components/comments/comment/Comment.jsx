import React from "react";
import "./Comment.css";

export default function Comment() {
  return (
    <div class="card v-card v-sheet theme--light elevation-2">
      <div class="header">
        <div class="comment-container">
          <div class="v-avatar avatar">
            <img src="https://images.unsplash.com/photo-1490894641324-cfac2f5cd077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=70"></img>
          </div>
          <span class="displayName title">Robert</span>{" "}
          <span class="displayName caption">2 months ago</span>
        </div>
        <div class="wrapper comment">
          <p>
            Fusce sodales magna id porta egestas. Nulla massa est, hendrerit nec
            auctor vitae, porta ut est.
          </p>
        </div>
      </div>
    </div>
  );
}

/* <div class="comment-container theme--light">
<div class="comments">
  <div class="card v-card v-sheet theme--light elevation-2">
    <div class="head er">
      <div class="v-avatar avatar">
        <img src="https://images.unsplash.com/photo-1490894641324-cfac2f5cd077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=70"></img>
      </div>
      <div>
        <span class="displayName title">Robert</span>{" "}
        <span class="displayName caption">2 months ago</span>
      </div>

      <div class="wrapper comment">
        <p>
          Fusce sodales magna id porta egestas. Nulla massa est, hendrerit
          nec auctor vitae, porta ut est.{" "}
        </p>
        <p>
          Fusce sodales magna id porta egestas. Nulla massa est, hendrerit
          nec auctor vitae, porta ut est.
        </p>
      </div>
      <div class="actions"></div>
      <div class="v-dialog__container"></div>
    </div>

    <div class="answers"></div>
  </div>
</div>
</div> */
