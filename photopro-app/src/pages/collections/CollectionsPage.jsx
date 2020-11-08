import React, { useState, useEffect } from "react";
import axios from "axios";
import Toolbar from "../../components/toolbar/toolbar";
import "./CollectionsPage.css";
import Collection from "./collection/Collection";

export default function CollectionsPage() {
  const [allCollections, setAllCollections] = useState([]);

  useEffect(() => {
    console.log("getting users collections");
    getUsersCollections();
  }, []);

  const getUsersCollections = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_users_collection",
      params: {
        batch_size: 10,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setAllCollections(response.data.result);
      }
    });
  };
  const collectionsComponents = allCollections.map((collection) => {
    return (
      <Collection
        key={collection.collection_id}
        collection_name={collection.collection_name}
        creator_id={collection.creator_id}
        num_photos={collection.num_photos}
        private={collection.private}
      />
    );
  });

  return (
    <React.Fragment>
      <Toolbar />
      <div className="collectionsWrapper">{collectionsComponents}</div>
    </React.Fragment>
  );
}
