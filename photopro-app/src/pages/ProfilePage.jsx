import React from 'react';
import Toolbar from '../components/toolbar/toolbar';
import UserPhotos from '../components/userPhotos/UserPhotos';

function ProfilePage() {
  return (
    <React.Fragment>
      <Toolbar />
      <UserPhotos />
    </React.Fragment>
  );
}

export default ProfilePage;
