import React, { useState, useEffect } from 'react';
import './toolbar.css';
import Buttons from './buttons/buttons';

function Toolbar(props) {

  return (
    <React.Fragment>
      <div className="flex-container-toolbar">
        <div className="toolbar-left">
        <button>Upload Photo</button>
        </div>
        <h1 className="toolbar-text">PhotoPro</h1>
        <Buttons />
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
