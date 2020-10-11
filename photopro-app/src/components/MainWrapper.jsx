import React from 'react';

import Toolbar from './toolbar/toolbar';
import SearchBar from './searchbar/searchbar';

function MainWrapper() {
  return (
    <React.Fragment>
      <Toolbar />
      <SearchBar />
    </React.Fragment>
  );
}

export default MainWrapper;
