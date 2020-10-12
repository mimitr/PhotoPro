import React, { useState } from 'react';
import './buttons.css';
import { useHistory } from 'react-router-dom';

function Buttons() {
  const history = useHistory();
  const loggedIn = localStorage.getItem('userLoggedIn');
  console.log('buttons ' + loggedIn);

  const handleSignInClicked = () => {
    history.push('/login');
  };

  const handleSignUpClicked = () => {
    history.push('/signup');
  };

  const handleProfileClicked = function () {
    history.push('/profile/1');
  };

  if (loggedIn) {
    return (
      <React.Fragment>
        <div className="flex-container-buttons">
          <button>Collections</button>
          <button onClick={handleProfileClicked}>Profile</button>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="flex-container-buttons">
          <button onClick={handleSignInClicked}>Sign in</button>
          <button onClick={handleSignUpClicked}>Getting Started</button>
        </div>
      </React.Fragment>
    );
  }
}

export default Buttons;
