import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import './BookmarkModal.css';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import axios from 'axios';

import CollectionFolder from './collectionFolder/CollectionFolder';

export default function BookmarkModal({ openModal, setOpenModal, photoId }) {
  const [enteredCollection, setEnteredCollection] = useState('');
  const [usersCollections, setUsersCollections] = useState(null);
  const [showCreateCollectionButton, setShowCreateCollectionButton] = useState(
    true
  );

  const [privateCollection, setPrivateCollection] = useState(0);

  console.log('TESTT');

  const getUsersCollections = () => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/get_users_collection',
      params: {
        batch_size: 20,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result !== false) {
        console.log('not false');
        setUsersCollections(response.data.result);
      }
    });
  };

  useEffect(() => {
    console.log('GETTING USERS COLLECTION');
    getUsersCollections();
  }, []);

  useEffect(() => {
    console.log(
      `collection button state changed to ${showCreateCollectionButton}`
    );
  }, [showCreateCollectionButton]);

  if (!openModal) {
    return null;
  }

  let collectionFolders = null;
  if (usersCollections != null) {
    collectionFolders = usersCollections.map((collection) => {
      return (
        <CollectionFolder
          key={collection.collection_id}
          collectionInfo={collection}
          photoId={photoId}
        />
      );
    });
  }

  //console.log(collectionFolders);

  const handleEnteredCollection = (e) => {
    e.preventDefault();
    //getUsersCollections();
    console.log(enteredCollection);

    createCollections();

    //setNewCollectionEntered(enteredCollection);
    //addPhotoToCollections();
  };

  const createCollections = () => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/create_collection',
      params: {
        collection_name: enteredCollection,
        private: privateCollection,
      },
    }).then((response) => {
      console.log(response);
      console.log(`colection created should return collection_id ${response}`);
      if (response.data.result) {
        addPhotoToCollections(response.data.result);
      }
    });
  };

  const addPhotoToCollections = (col_id) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/add_photo_to_collection',
      params: {
        collection_id: col_id,
        image_id: photoId,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  console.log(`collectionButton = ${showCreateCollectionButton}`);

  return ReactDom.createPortal(
    <React.Fragment>
      <div className="overlayStyles" />
      <div className="bookmarkModal">
        <div className="closeButton">
          <IconButton
            variant="contained"
            onClick={() => {
              setShowCreateCollectionButton(true);
              setOpenModal(false);
            }}
          >
            <HighlightOffIcon />
          </IconButton>
        </div>
        <h2>Add to Collection</h2>

        {showCreateCollectionButton ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setShowCreateCollectionButton(false);
              console.log('create collection button clicked');
            }}
          >
            Create a new collection
          </Button>
        ) : null}

        {showCreateCollectionButton ? (
          <div className="collectionFolders">{collectionFolders}</div>
        ) : null}

        {!showCreateCollectionButton ? (
          <div className="enteredCollection">
            <form onSubmit={handleEnteredCollection}>
              <div>
                <input
                  type="reply"
                  onChange={(e) => setEnteredCollection(e.target.value)}
                />
              </div>
              <Button variant="contained" color="primary" type="submit">
                Create collection
              </Button>
            </form>
            <FormControlLabel
              control={
                <Checkbox
                  checked={privateCollection}
                  onChange={() => {
                    if (privateCollection === true) {
                      setPrivateCollection(0);
                    } else {
                      setPrivateCollection(1);
                    }
                  }}
                  name="privateCheckbox"
                  color="primary"
                />
              }
              label="Private"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowCreateCollectionButton(true);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : null}
      </div>
    </React.Fragment>,
    document.getElementById('portal')
  );
}
