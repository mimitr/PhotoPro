import React, { useState, useEffect } from 'react';
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
    if (res.data.result != false) {
      setHasMore(true);
      setTimeout(() => {
        setImgs((prevImgs) => {
          return [...prevImgs, ...res.data.result];
        });
      }, 500);

      // setImgs(imgs.concat(res.data.result));
    } else {
      console.log('no more images to return');
      setHasMore(false);
      // setImgs((prevImgs) => {
      //   return [...prevImgs];
      // });
    }
  });
};

const Feed = (props) => {
  const [imgs, setImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setImgs([]);
    setHasMore(false);
  }, [props.query]);

  console.log(`LENGTH = ${imgs.length}`);
  console.log(`HASMORE = ${hasMore}`);

  let images = null;
  if (imgs != null) {
    images = imgs.map((img) => {
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
  }

  return (
    <React.Fragment>
      <h2>Found Images: {imgs.length}</h2>
      <InfiniteScroll
        dataLength={imgs.length}
        next={fetchImages(props.query, setImgs, setHasMore)}
        hasMore={hasMore}
        loader={'Loading...'}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
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
