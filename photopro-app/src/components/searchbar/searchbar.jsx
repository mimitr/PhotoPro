import React, { useState } from 'react';
import './searchbar.css';
import axios from 'axios';
import Feed from '../feed/feed';

async function onSearchSubmit(term) {
  const response = await axios.get('http://localhost:5000/discovery', {
    params: { query: term, batch_size: 30 }, //user_id: 1
  });

  return response;
}

function SearchBar(props) {
  const [imgs, setImgs] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const images = onSearchSubmit(imgs);
    images.then((imageResults) => {
      setImgs(imageResults.data.result);
    });
    console.log(imgs);
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="flexContainer">
        <input
          className="inputStyle"
          type="text"
          value={searchVal}
          onChange={(event) => setSearchVal(event.target.value)}
        />
      </form>
      <Feed foundImages={imgs} />
    </React.Fragment>
  );
}

export default SearchBar;
