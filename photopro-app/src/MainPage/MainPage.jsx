<<<<<<< HEAD:photopro-app/src/MainPage/MainPage.jsx
import React from "react";
=======
import React, { useState, useEffect } from 'react';
>>>>>>> front-end:photopro-app/src/MainPage.jsx

import Toolbar from "../components/toolbar/toolbar";
import SearchBar from "../components/searchbar/searchbar";

function MainPage() {
  return (
    <React.Fragment>
      <Toolbar />
      <SearchBar />
    </React.Fragment>
  );
}

export default MainPage;
