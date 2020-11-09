import React from "react";
import "./CollectionFolder.css";

export default function CollectionFolder(props) {
  console.log(props.collectionInfo);
  return (
    <React.Fragment>
      <div className="collection_folder">
        {props.collectionInfo.collection_name}
      </div>
    </React.Fragment>
  );
}
