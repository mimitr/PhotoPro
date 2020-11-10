import React from 'react';
import './CollectionImage.css';

export default function CollectionImage(props) {
  console.log(props);

  return (
    <div>
      <img
        src={`data:image/jpg;base64,${props.image_info.img}`}
        alt={props.image_info.collection_name}
        key={props.image_info.collection_id}
      />
    </div>
  );
}
