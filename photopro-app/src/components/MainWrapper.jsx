import React, { useState, useEffect } from "react";
import axios from "axios";
import Toolbar from "./toolbar/toolbar";
import SearchBar from "./SearchBar/SearchBar";
import ImageList from "./ImageList/ImageList";

import { Route, Switch, Link } from "react-router-dom";
import LoginPage from "./Login/LoginPage";
import RegistrationPage from "./Registration/RegistrationPage";
import ChangePasswordPage from "./ChangePassword/ChangePasswordPage";
import ForgotPasswordPage from "./ForgotPassword/ForgotPasswordPage";

function MainWrapper() {
  // initialise the array to an empty array []
  const [images, setImages] = useState([]);

  async function onSearchSubmit(term) {
    const response = await axios.get("http://localhost:5000/discovery", {
      params: { query: term, batch_size: 10 }, //user_id: 1
    });
    console.log(response);

    // setImages(response.data.results.map((x) => images.push(x)));
    var results = response.data.result;
    if (results != false) {
      // var newImages = [];
      // for (var i = 0; i < results.length; i++) {
      // var obj = results[i];
      // console.log(obj['id']);
      // console.log(obj['caption']);
      // console.log(obj['img']);
      // console.log(obj['uploader']);
      // newImages.push(obj['img']);
      // }
      // const newImages = response.data.results;
      setImages(results);
      // console.log(response)
      // console.log(images);
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
