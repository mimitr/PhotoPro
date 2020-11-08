import React, { useState } from 'react';
import './feed.css';
import axios from 'axios';
import ImageCard from './ImageCard/ImageCard';
import BookmarkModal from '../modal/BookmarkModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ImageSearch } from '@material-ui/icons';

const fetchImages = (term, setImgs, setHasMore) => {
  axios({
    method: 'GET',
    url: 'http://localhost:5000/discovery',
    params: { query: term, batch_size: 20 }, //user_id: 1
  }).then((res) => {
    if (res.data.result != null) {
      setHasMore(true);
      setImgs((prevImgs) => {
        return [...prevImgs, ...res.data.result];
      });

      // setImgs(imgs.concat(res.data.result));
    } else {
      setHasMore(false);
      setImgs((prevImgs) => {
        return [...prevImgs];
      });
    }
  });
};

const Feed = (props) => {
  const [imgs, setImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  console.log(`LENGTH = ${imgs.length}`);

  const images = imgs.map((img) => {
    return (
      <ImageCard
        key={img.id}
        image={img}
        openBookmarkModal={modalIsOpen}
        setOpenBookmarkModal={setModalIsOpen}
        setPhotoId={setPhotoIdBookmarked}
      />
    );
  });

  return (
    <React.Fragment>
      <h2>Found Images: {imgs.length}</h2>
      <InfiniteScroll
        dataLength={imgs.length}
        next={fetchImages(props.query, setImgs, setHasMore)}
        hasMore={hasMore}
        loader={'Loading...'}
        scrollThreshold="1000px"
      >
        <div className="image-list">{images}</div>
      </InfiniteScroll>
      <BookmarkModal
        openModal={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
        photoId={photoIdBookmarked}
      ></BookmarkModal>
    </React.Fragment>
  );
};

export default Feed;
