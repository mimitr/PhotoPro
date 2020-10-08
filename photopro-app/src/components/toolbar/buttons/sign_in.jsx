import React from 'react';

import './buttons.css';

function SignIn() {
  return (
    <React.Fragment>
      <ul style={{ listStyleType: 'none' }}>
        <li className="sign-in">
          <button>Sign in</button>
        </li>
        <li className="getting-started">
          <button>Getting Started</button>
        </li>
      </ul>
    </React.Fragment>
  );
}

export default SignIn;
