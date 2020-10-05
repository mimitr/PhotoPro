import React, { useState, useEffect } from "react";
import axios from "axios";
import Toolbar from "./toolbar/toolbar";
import SearchBar from "./SearchBar/SearchBar";
import ImageList from "./ImageList/ImageList";

function MainWrapper() {
  const [images, setImages] = useState([]);

  async function onSearchSubmit(term) {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: term },
      headers: {
        Authorization: "Client-ID d59bDVT3fM5DB90WT41RUwaYFzikaPGfpviDpMqMTls",
      },
    });

    //setImages(response.data.results.map((x) => images.push(x)));
    const newImages = response.data.results;
    setImages(newImages);
    console.log(images);
  }

  console.log(images);

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
