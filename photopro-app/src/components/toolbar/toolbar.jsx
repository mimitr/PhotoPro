import React from 'react';
import './toolbar.css';
import { useHistory } from 'react-router-dom';

function Toolbar() {
  const history = useHistory();
  const loggedIn = localStorage.getItem('userLoggedIn');
  console.log('buttons think ' + loggedIn);

  const handleSignInClicked = () => {
    history.push('/login');
  };

  const handleSignUpClicked = () => {
    history.push('/signup');
  };

  const handleProfileClicked = function () {
    history.push('/profile/1');
  };

  const handleLogoutClicked = () => {
    localStorage.clear();
    history.push('/');
    history.go(0); // forces the page to re-render if you are already on it which causes it to display the right information
  };

  const handleDiscoveryClicked = () => {
    history.push('/');
  };

  const handleUploadClicked = () => {
    history.push('/uploadphoto');
  };

  const handleChangePassClicked = () => {
    history.push('/changepassword');
  };

  let buttons;
  if (loggedIn === 'true') {
    buttons = (
      <React.Fragment>
        <div className="flex-container-buttons-2">
          <button onClick={handleDiscoveryClicked}>Discovery</button>
          <button>Collections</button>
          <button onClick={handleProfileClicked}>Profile</button>
          <button onClick={handleChangePassClicked}>Change Password</button>
          <button onClick={handleLogoutClicked}>Log Out</button>
        </div>
        <div className="toolbar-left">
          <button onClick={handleUploadClicked}>Upload Photo</button>
        </div>
      </React.Fragment>
    );
  } else {
    buttons = (
      <React.Fragment>
        <div className="toolbar-left-placeholder"></div>
        <div className="flex-container-buttons-1">
          <button onClick={handleSignInClicked}>Sign in</button>
          <button onClick={handleSignUpClicked}>Getting Started</button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="flex-container-toolbar">
        <h1 className="toolbar-text">PhotoPro</h1>
        {buttons}
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
