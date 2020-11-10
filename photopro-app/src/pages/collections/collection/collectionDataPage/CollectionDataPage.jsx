import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CollectionDataPage.css';
import CollectionImage from './collectionImage/CollectionImage';
import LockIcon from '@material-ui/icons/Lock';

export default function CollectionDataPage(props) {
  const [collectionImages, setCollectionImages] = useState([]);

  // the below line is to get rid of warning messages in useEffect
  const {
    location: {
      state: { collection_id: collectionID },
    },
  } = props;

  useEffect(() => {
    console.log('getting collections data');
    const getCollectionsById = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_collection_data',
        params: {
          collection_id: collectionID,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result) {
          setCollectionImages(response.data.result);
        }
      });
    };
    getCollectionsById();
  }, [collectionID]);

  console.log(collectionImages);

  const collectionImagesComponents = collectionImages.map((img) => {
    return <CollectionImage key={img.id} image_info={img} />;
  });

  return (
    <div className="collectionDataWrapper">
      <div className="collection-info">
        {props.location.state ? (
          <LockIcon>Create a new collection</LockIcon>
        ) : null}
        <h1>{props.location.state.collection_name}</h1>{' '}
        <p>by @{props.location.state.creator_id}</p>
        <p>Total photos: {props.location.state.num_photos}</p>
        <p></p>
      </div>
      {collectionImagesComponents}
    </div>
  );
}
