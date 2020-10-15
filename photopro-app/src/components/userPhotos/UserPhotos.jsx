import React from 'react';

const UserPhotos = (props) => {
  const imgs = props.postedImages.map((img) => {
    return <ImageCard key={img.id} image={img} />;
  });

  return (
    <React.Fragment>
      <h2>My Uploads: {props.postedImages.length}</h2>
      <div className="image-list">{imgs}</div>
    </React.Fragment>
  );
};

export default Feed;
