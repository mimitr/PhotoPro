import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toolbar from './toolbar/toolbar';
import SearchBar from './SearchBar/SearchBar';
import ImageList from './ImageList/ImageList';

function MainWrapper() {
  // initialise the array to an empty array []
  const [images, setImages] = useState([]);

  async function onSearchSubmit(term) {
    const response = await axios.get('http://localhost:5000/discovery', {
      params: { query: term, batch_size: 30 }, //user_id: 1
    });
    console.log(response);

    // setImages(response.data.results.map((x) => images.push(x)));
    var results = response.data.result;
    if (results != false) {
      setImages(results);
+
    }
  }

  //console.log(images);

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
