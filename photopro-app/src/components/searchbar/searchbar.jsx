import React, { useState } from 'react';
import './searchbar.css';
import axios from 'axios';
import Feed from '../feed/feed';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    width: '100ch',
  },
}));

function SearchBar(props) {
  const [imgs, setImgs] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const classes = useStyles();

  const onSearchSubmit = async function (term) {
    const response = await axios.get('http://localhost:5000/discovery', {
      params: { query: term, batch_size: 30 }, //user_id: 1
    });
    console.log(response);

    return response;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const images = onSearchSubmit(searchVal);
    images.then((imageResults) => {
      console.log(imageResults);
      // this means no images were found
      if (imageResults.data.result !== false) {
        setImgs(imageResults.data.result);
      }
    });
  };

  return (
    <React.Fragment>
      {/* <form onSubmit={handleSubmit} className="flexContainer">
        <input
          className="inputStyle"
          type="text"
          value={searchVal}
          onChange={(event) => setSearchVal(event.target.value)}
        />
      </form> */}

      <div className="searchBar">
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <TextField
            className={classes.text}
            id="outlined-basic"
            label="Search for stock photos"
            variant="outlined"
            size="small"
            fullWidth
            value={searchVal}
            onChange={(event) => setSearchVal(event.target.value)}
          />
        </form>
      </div>

      <Feed foundImages={imgs} />
    </React.Fragment>
  );
}

export default SearchBar;
