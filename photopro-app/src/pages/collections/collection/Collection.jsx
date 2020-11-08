import React from "react";
import "./Collection.css";

export default function Collection(props) {
  return (
    <React.Fragment>
      <div className="collection-box">{props.collection_name}</div>
    </React.Fragment>
  );
}
