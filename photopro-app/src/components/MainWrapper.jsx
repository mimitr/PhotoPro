import React from 'react';

import Toolbar from './toolbar/toolbar';
import SearchBar from './SearchBar/SearchBar';

function MainWrapper() {
  return (
    <React.Fragment>
      <Toolbar />
      <SearchBar />
    </React.Fragment>
  );
}

export default MainWrapper;
