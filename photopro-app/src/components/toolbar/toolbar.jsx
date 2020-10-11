import React, { useState, useEffect } from 'react';
import './toolbar.css';
import SignIn from './buttons/signin';

function Toolbar(props) {
  return (
    <React.Fragment>
      <div className="flex-container">
        <div className="toolbar-left"></div>
        <h1 className="logo">Logo</h1>
        <div className="toolbar-right">
          <SignIn />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
