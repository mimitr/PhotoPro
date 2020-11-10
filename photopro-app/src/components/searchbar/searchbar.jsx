import React, { useState } from 'react';
import './searchbar.css';
import Feed from '../feed/feed';
import SearchBarInput from './searchBarInput';

function SearchBar() {
  const [query, setQuery] = useState(null);

  console.log(`The query is - ${query}`);

  return (
    <React.Fragment>
      <SearchBarInput setQuery={setQuery} />
      <Feed query={query} />
    </React.Fragment>
  );
}

export default SearchBar;
