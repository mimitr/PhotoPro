import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollectionDataPage.css";
import CollectionImage from "./collectionImage/CollectionImage";

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

  console.log(collectionImages);

  const collectionImagesComponents = collectionImages.map((img) => {
    return <CollectionImage key={img.id} image_info={img} />;
  });

  return (
    <div className="collectionDataWrapper">
      <div className="title"> className="title"</div>
      {collectionImagesComponents}
    </div>
  );
}
