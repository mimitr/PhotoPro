import React, { useState, useEffect } from 'react';

import Toolbar from './toolbar/toolbar';
import Feed from './feed/feed';
import Searchbar from './searchbar/searchbar';

function MainWrapper() {
  return (
    <React.Fragment>
      <Toolbar />
      <Feed />
      <Searchbar />
    </React.Fragment>
  );
}

export default MainWrapper;
