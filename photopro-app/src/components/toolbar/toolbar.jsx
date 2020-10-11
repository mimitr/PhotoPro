import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./toolbar.css";

function Toolbar(props) {
  return (
    <React.Fragment>
      <div className="flex-container">
        <div className="toolbar-left"></div>
        <h1 className="logo">Logo</h1>
        <div className="toolbar-right"></div>
        <Link to="/signup">
          <button class="button button1">Sign up</button>
        </Link>
        <Link to="login">
          <button class="button button2">Log in</button>
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
