import React, { useState, useEffect } from 'react';

import Toolbar from './toolbar/toolbar';
import Feed from './feed/feed';

function MainWrapper() {
  return (
    <React.Fragment>
      <Toolbar />
      <Feed />
    </React.Fragment>
  );
}

export default MainWrapper;
