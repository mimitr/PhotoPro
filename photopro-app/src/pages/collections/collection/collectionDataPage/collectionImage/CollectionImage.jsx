import React from 'react';
import './CollectionImage.css';
import axios from 'axios';

export default function CollectionImage(props) {
  const deletePhotoFromCollection = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/delete_photo_from_collection',
      params: {
        collection_id: props.image_info.collection_id,
        image_id: props.image_info.image_id,
      },
    }).then((response) => {
      console.log(response);
    });
  };

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
