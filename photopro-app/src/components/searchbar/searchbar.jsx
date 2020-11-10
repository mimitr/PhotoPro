import React, { useState } from 'react';
import './searchbar.css';
import Feed from '../feed/feed';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    width: '100ch',
  },
}));

function SearchBar() {
  const [query, setQuery] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      if ((searchVal.match(/[/[\s]/g) || []).length === searchVal.length) {
        console.log('fucketh');
        setQuery(null);
      } else {
        setQuery(searchVal);
      }
    }, 100);
  };

  console.log(`current query is ${query}`);

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

      <Feed query={query} />
    </React.Fragment>
  );
}

export default SearchBar;
