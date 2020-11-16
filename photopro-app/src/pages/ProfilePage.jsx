import React, { useEffect } from 'react';
import Toolbar from '../components/toolbar/toolbar';
import UserPhotos from '../components/userPhotos/UserPhotos';
import Collections from '../components/collections/collections';

function ProfilePage(props) {
  if (props.location.state === undefined) {
    return (
      <React.Fragment>
        <Toolbar />
        <h1>Nothing found</h1>
      </React.Fragment>
    );
  } else {
    const displayMyProfile =
      localStorage.getItem('userID') === props.location.state.uploaderID
        ? true
        : false;

    console.log(
      `ProfilePage - props.location.state is ${props.location.state.uploaderID}`
    );

    console.log(`ProfilePage - displayMyProfile is ${displayMyProfile}`);
    document.body.style.overflow = 'unset';
    return (
      <React.Fragment>
        <Toolbar />
        <div className="profile-wrapper" style={{ marginTop: '20%' }}>
          {displayMyProfile ? null : (
            <Collections
              userID={props.location.state.uploaderID}
              displayMyProfile={displayMyProfile}
            />
          )}
          <UserPhotos
            userID={props.location.state.uploaderID}
            userLoggedIn={localStorage.getItem('userLoggedIn')}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default ProfilePage;
