import React, { useState, useEffect } from "react";
import LockIcon from "@material-ui/icons/Lock";

import "./Collection.css";

export default function Collection(props) {
  console.log(props);

  const handleCollectionClicked = () => {
    console.log("collection clicked!");
    props.setCollectionClicked(true);
    props.setCollectionIdClicked(props.collection_id);
    props.setCollectionNameClicked(props.collection_name);
    props.setCollectionPrivateClicked(props.private);
    props.setCollectionNumPhotosClicked(props.num_photos);
    props.setCollectionCreatorClicked(props.creator_id);
  };

  console.log(props.private);

  return (
    <React.Fragment>
      <div className="collection-box" onClick={handleCollectionClicked}>
        {props.private == true ? <LockIcon /> : null}
        {props.collection_name}
      </div>
    </React.Fragment>
  );
}
