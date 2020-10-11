import React, { useState, useEffect } from "react";
import "./toolbar.css";

function Toolbar(props) {
  return (
    <React.Fragment>
      <div className="flex-container">
        <div className="toolbar-left"></div>
        <h1 className="logo">Logo</h1>
        <div className="toolbar-right"></div>
        <button class="button button1">Sign up</button>
        <button class="button button2">Log in</button>
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
