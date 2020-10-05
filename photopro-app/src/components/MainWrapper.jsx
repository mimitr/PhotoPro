import React, { useState, useEffect } from "react";
import axios from "axios";
import Toolbar from "./toolbar/toolbar";
import SearchBar from "./SearchBar/SearchBar";
import ImageList from "./ImageList/ImageList";

function MainWrapper() {
  const [images, setImages] = useState([]);

  onSearchSubmit = async (term) => {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term },
      headers: {
        Authorization: "Client-ID YOUR_ACCESS_KEYS",
      },
    });

    setImages(response.data.results.map((x) => images.push(x)));
  };

  onSearchSubmit().then(() => {
    console.log(images);
  });

  return (
    <React.Fragment>
      <Toolbar />
      <SearchBar userSubmit={onSearchSubmit} />
      <span>Found: {images.length} images</span>
      <ImageList foundImages={images} />
    </React.Fragment>
  );
}

export default MainWrapper;
