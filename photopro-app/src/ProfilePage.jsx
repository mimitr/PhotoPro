import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Toolbar from './components/toolbar/toolbar';
import Feed from './components/feed/feed';

function ProfilePage() {
  const [profileImgs, setImgs] = useState([]);

  const requestProfileImages = async function (user_id = 1) {
    const response = await axios.get('http://localhost:5000/profile_photos', {
      params: { user_id: user_id, batch_size: 30 }, //user_id: 1
    });

    return response;
  };

  useEffect(() => {
    const imgs = requestProfileImages();
    imgs.then((response) => {
      setImgs(response.data.result);
    });
  }, []);

  console.log(profileImgs);

  return (
    <React.Fragment>
      <Toolbar />
      <Feed foundImages={profileImgs} />
    </React.Fragment>
  );
}

export default ProfilePage;
