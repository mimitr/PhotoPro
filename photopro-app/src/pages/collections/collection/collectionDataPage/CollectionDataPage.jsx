import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollectionDataPage.css";
import CollectionImage from "./collectionImage/CollectionImage";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";

import Toolbar from "../../../../components/toolbar/toolbar";

export default function CollectionDataPage(props) {
  const [collectionImages, setCollectionImages] = useState([]);

  useEffect(() => {
    console.log("getting collections data");
    getCollectionsById();
  }, []);

  const getCollectionsById = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_collection_data",
      params: {
        collection_id: props.location.state.collection_id,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.result) {
        setCollectionImages(response.data.result);
      }
    });
  };

  const deleteCollection = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/delete_collection",
      params: {
        collection_id: props.location.state.collection_id,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  console.log(collectionImages);

  const collectionImagesComponents = collectionImages.map((img) => {
    return <CollectionImage key={img.id} image_info={img} />;
  });

  console.log(`PRIVATE? ${props.location.state.private}`);

  return (
    <React.Fragment>
      <Toolbar />
      <div className="collectionDataWrapper">
        <div className="collection-info">
          {props.location.state.private == "true" ? <LockIcon /> : null}
          <h1>{props.location.state.collection_name}</h1>
          <p>by @{props.location.state.creator_id}</p>
          <p>Total photos: {props.location.state.num_photos}</p>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              deleteCollection();
              console.log("delete collection button clicked");
            }}
          >
            Delete collection
          </Button>
        </div>
        {collectionImagesComponents}
      </div>
    </React.Fragment>
  );
}
