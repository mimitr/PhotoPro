import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import "./BookmarkModal.css";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";

import axios from "axios";

export default function BookmarkModal({
  openModal,
  children,
  onCloseModal,
  photoId,
}) {
  const [enteredCollection, setEnteredCollection] = useState("");
  const [newCollectionEntered, setNewCollectionEntered] = useState("");
  const [privateCollection, setPrivateCollection] = useState(false);

  const getUsersCollections = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_users_collection",
      params: {
        batch_size: 10,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  useEffect(() => {
    console.log("getting users collections");
    getUsersCollections();
  }, [newCollectionEntered]);

  if (!openModal) {
    return null;
  }

  const handleEnteredCollection = (e) => {
    e.preventDefault();
    //createCollections();
    //setNewCollectionEntered(enteredCollection);
    //addPhotoToCollections();
  };

  const createCollections = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/create_collection",
      params: {
        collection_name: enteredCollection,
        private: privateCollection,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  const addPhotoToCollections = (col_id, img_id) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/add_photo_to_collection",
      params: {
        collection_id: 15,
        image_id: photoId,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  return ReactDom.createPortal(
    <React.Fragment>
      <div className="overlayStyles" />
      <div className="bookmarkModal">
        <div className="closeButton">
          <IconButton variant="contained" onClick={onCloseModal}>
            <HighlightOffIcon />
          </IconButton>
        </div>
        <h2>Add to Collection</h2>
        <div className="enteredCollection">
          <form onSubmit={handleEnteredCollection}>
            <div>
              <input
                type="reply"
                value={enteredCollection}
                onChange={(e) => setEnteredCollection(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>,
    document.getElementById("portal")
  );
}
