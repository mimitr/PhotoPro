import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollectionDataPage.css";
import CollectionImage from "./collectionImage/CollectionImage";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import Toolbar from "../../../../components/toolbar/toolbar";

export default function CollectionDataPage(props) {
  const [collectionImages, setCollectionImages] = useState([]);

  const [privateCollection, setPrivateCollection] = useState(
    props.location.state.private
  );

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    console.log("getting collections data");
    getCollectionsById();

    // if (props.location.state.private == "true") {
    //   setPrivateCollection(1);
    // } else {
    //   setPrivateCollection(0);
    // }
  }, [privateCollection]);

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

  const updateCollectionsPrivate = (privValue) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/update_collections_private",
      params: {
        collection_id: props.location.state.collection_id,
        private: privValue,
      },
    }).then((response) => {
      console.log(response);
      if (privValue == 0) {
        setPrivateCollection("false");
      } else {
        setPrivateCollection("true");
      }
    });
  };

  console.log(collectionImages);

  const collectionImagesComponents = collectionImages.map((img) => {
    return <CollectionImage key={img.id} image_info={img} />;
  });

  console.log(`PRIVATE? ${props.location.state.private}`);

  const handleEditCollectionClose = () => {
    setAnchorEl(null);
  };

  const handleChangePrivateClicked = () => {
    if (privateCollection == "true") {
      updateCollectionsPrivate(0);
      console.log("changing to public");
    } else {
      updateCollectionsPrivate(1);
      console.log("changing to private");
    }
  };

  const handleEditCollectionClicked = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      <Toolbar />
      <div className="collectionDataWrapper">
        <div className="collection-info">
          {privateCollection == "true" ? <LockIcon /> : null}
          <h1>{props.location.state.collection_name}</h1>
          <p>by @{props.location.state.creator_id}</p>
          <p>Total photos: {props.location.state.num_photos}</p>

          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            variant="outlined"
            color="primary"
            onClick={handleEditCollectionClicked}
          >
            Edit collection
          </Button>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleEditCollectionClose}
          >
            {privateCollection == "true" ? (
              <MenuItem onClick={handleChangePrivateClicked}>
                Make Public
              </MenuItem>
            ) : (
              <MenuItem onClick={handleChangePrivateClicked}>
                Make Private
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                deleteCollection();
              }}
            >
              Delete collection
            </MenuItem>
          </Menu>
        </div>
        {collectionImagesComponents}
      </div>
    </React.Fragment>
  );
}
