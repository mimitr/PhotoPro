import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './collections.css';
import { Redirect } from 'react-router-dom';
import Collection from './collection/Collection';
import { CropPortrait } from '@material-ui/icons';

export default function Collections(props) {
  const [allCollections, setAllCollections] = useState([]);

  const [collectionClicked, setCollectionClicked] = useState(false);
  const [collectionIdClicked, setCollectionIdClicked] = useState(null);
  const [collectionNameClicked, setCollectionNameClicked] = useState(null);
  const [collectionPrivateClicked, setCollectionPrivateClicked] = useState(
    null
  );
  const [collectionNumPhotosClicked, setCollectionNumPhotosClicked] = useState(
    null
  );
  const [collectionCreatorClicked, setCollectionCreatorClicked] = useState(
    null
  );

  const { userID, displayMyProfile } = props;

  useEffect(() => {
    const getUsersCollections = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_users_collection',
        params: {
          user_id: userID,
          batch_size: 20,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.result !== false) {
          console.log(response);
          setAllCollections(response.data.result);
        }
      });
    };
    getUsersCollections();
  }, [userID]);

  const collectionsComponents = allCollections.map((collection) => {
    if (displayMyProfile === true || collection.private === false) {
      return (
        <Collection
          key={collection.collection_id}
          collection={collection}
          setCollectionClicked={setCollectionClicked}
          setCollectionIdClicked={setCollectionIdClicked}
          setCollectionNameClicked={setCollectionNameClicked}
          setCollectionPrivateClicked={setCollectionPrivateClicked}
          setCollectionNumPhotosClicked={setCollectionNumPhotosClicked}
          setCollectionCreatorClicked={setCollectionCreatorClicked}
        />
      );
    }
  });

  const collectionData = (
    <Redirect
      push
      to={{
        pathname: `/collection-${collectionIdClicked}`,
        state: {
          collection_id: `${collectionIdClicked}`,
          collection_name: `${collectionNameClicked}`,
          private: `${collectionPrivateClicked}`,
          num_photos: `${collectionNumPhotosClicked}`,
          creator_id: `${collectionCreatorClicked}`,
        },
      }}
    />
  );

  let componentsRender;
  if (collectionClicked) {
    componentsRender = collectionData;
  } else {
    componentsRender = (
      <div className="collectionsPageWrapper">
        <div className="title">
          {props.displayMyProfile ? (
            <h1>My collections</h1>
          ) : (
            <h1>Public Collections of @{userID}</h1>
          )}
        </div>
        <div className="collectionsWrapper">{collectionsComponents}</div>
      </div>
    );
  }

  return <React.Fragment>{componentsRender}</React.Fragment>;
}
