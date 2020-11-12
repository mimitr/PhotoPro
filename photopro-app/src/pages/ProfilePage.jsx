import React, { useEffect } from 'react';
import Toolbar from '../components/toolbar/toolbar';
import UserPhotos from '../components/userPhotos/UserPhotos';

function ProfilePage(props) {
  return (
    <React.Fragment>
      <Toolbar />
      <UserPhotos userID={props.match.params.userID} />
    </React.Fragment>
  );
}

export default ProfilePage;
