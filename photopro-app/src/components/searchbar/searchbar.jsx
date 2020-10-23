import React, { useState } from "react";
import "./searchbar.css";
import axios from "axios";
import Feed from "../feed/feed";

function SearchBar(props) {
  const [imgs, setImgs] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  const fetchImages = (term) => {
    let cancel;
    axios({
      method: "GET",
      url: "http://localhost:5000/discovery",
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
      <form onSubmit={handleSubmit} className="flexContainer">
        <input
          className="inputStyle"
          type="text"
          value={searchVal}
          onChange={(event) => setSearchVal(event.target.value)}
        />
      </form>
      <Feed foundImages={imgs} fetchImgs={fetchImages} query={searchVal} />
    </React.Fragment>
  );
}

export default SearchBar;
