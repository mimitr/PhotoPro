import React, { useState, useEffect } from 'react';

import Toolbar from './components/toolbar/toolbar';
import SearchBar from './components/searchbar/searchbar';

function MainPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    console.log('USE EFFECT');
    let userLoggedIn = localStorage.getItem('userLoggedIn');

    if (userLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  console.log(loggedIn);

  return (
    <React.Fragment>
      <Toolbar />
      <SearchBar />
      {loggedIn ? <h1>logged in</h1> : <h1>not logged in</h1>}
    </React.Fragment>
  );
}

export default MainPage;
