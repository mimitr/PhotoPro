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

  const fetchImages = (term) => {
    let cancel;
    axios({
      method: 'GET',
      url: 'http://localhost:5000/discovery',
      params: { query: term, batch_size: 20 }, //user_id: 1
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.result != null) {
          setImgs(imgs.concat(res.data.result));
        }

        console.log(res);
        console.log(imgs);
        console.log(term);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
    return () => cancel();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchImages(searchVal);
  };

  return (
    <React.Fragment>
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

      <Feed foundImages={imgs} fetchImages={fetchImages} query={searchVal} />
    </React.Fragment>
  );
}

export default SearchBar;
