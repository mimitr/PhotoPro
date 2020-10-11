import React, { useState } from 'react';
import './buttons.css';
import { useHistory } from 'react-router-dom';
import LoginPage from '../../../LoginPage';

function SignIn() {
  const history = useHistory();

  const handleSignInClicked = () => {
    history.push('/login');
  };

  return (
    <React.Fragment>
      <ul style={{ listStyleType: 'none' }}>
        <li className="sign-in">
          <button onClick={handleSignInClicked}>Sign in</button>
        </li>
        <li className="getting-started">
          <button>Getting Started</button>
        </li>
      </ul>
    </React.Fragment>
  );
}

export default SignIn;
