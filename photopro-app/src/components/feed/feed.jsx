import React from 'react';
import test_image from '../../test_images/001.jpg';

function Feed() {
  return (
    <div>
      <h1>Feed</h1>
      <img src={test_image} alt="Bull"></img>
    </div>
  );
}

export default Feed;
