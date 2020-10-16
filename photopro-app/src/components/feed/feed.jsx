import React from 'react';
import './feed.css';
import ImageCard from './ImageCard/ImageCard';

const Feed = (props) => {
  const imgs = props.foundImages.map((img) => {
    return <ImageCard key={img.id} image={img} />;
  });

  return (
    <React.Fragment>
      <h2>Found Images: {props.foundImages.length}</h2>
      <div className="image-list">{imgs}</div>
    </React.Fragment>
  );
};

export default Feed;
