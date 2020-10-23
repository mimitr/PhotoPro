import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Toolbar from '../components/toolbar/toolbar';
import Feed from '../components/feed/feed';
import UserPhotos from '../components/userPhotos/UserPhotos';

function ProfilePage() {
  const [profileImgs, setImgs] = useState([]);

  const requestProfileImages = async function () {
    const response = await axios.get('http://localhost:5000/profile_photos', {
      params: { batch_size: 30 },
    });

    return response;
  };

  useEffect(() => {
    const imgs = requestProfileImages();
    imgs.then((response) => {
      if (response.data.result !== false) {
        setImgs(response.data.result);
      }
    });
  }, []);

  console.log(profileImgs);

  return (
    <React.Fragment>
      <Toolbar />
      <UserPhotos postedImages={profileImgs} />
    </React.Fragment>
  );
}

export default ProfilePage;
