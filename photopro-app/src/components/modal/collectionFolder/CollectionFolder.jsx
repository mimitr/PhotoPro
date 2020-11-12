import React from "react";
import "./CollectionFolder.css";
import Button from "@material-ui/core/Button";
import axios from "axios";

export default function CollectionFolder(props) {
  console.log(props.collectionInfo);

  const addPhotoToCollections = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/add_photo_to_collection",
      params: {
        collection_id: props.collectionInfo.collection_id,
        image_id: props.photoId,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  const handleCollectionPicked = () => {
    addPhotoToCollections();
  };

  return (
    <React.Fragment>
      <div className="collection_folder">
        <Button variant="contained" onClick={handleCollectionPicked}>
          {props.collectionInfo.collection_name}
        </Button>
      </div>
    </React.Fragment>
  );
}
