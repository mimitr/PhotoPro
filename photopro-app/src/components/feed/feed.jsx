import React, { useState, useEffect, useRef, useCallback } from 'react';
import './feed.css';
import axios from 'axios';
import ImageCard from './ImageCard/ImageCard';
import BookmarkModal from '../modal/BookmarkModal';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ImageSearch } from '@material-ui/icons';

const Feed = (props) => {
  const [imgs, setImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchImages(props.query);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setImgs([]);
    setHasMore(false);
    fetchImages(props.query);
  }, [props.query]);

  const fetchImages = (term) => {
    setLoading(true);

    axios({
      method: 'GET',
      url: 'http://localhost:5000/discovery',
      params: { query: term, batch_size: 5 }, //user_id: 1
    }).then((res) => {
      console.log(res);
      if (res.data.result != false) {
        setHasMore(true);
        setTimeout(() => {
          setLoading(false);
          setImgs((prevImgs) => {
            return [...prevImgs, ...res.data.result];
          });
        }, 500);
      } else {
        console.log('no more images to return');
        setLoading(false);
        setHasMore(false);
        // setImgs((prevImgs) => {
        //   return [...prevImgs];
        // });
      }
    });
  };

  // console.log(`LENGTH = ${imgs.length}`);
  // console.log(`HASMORE = ${hasMore}`);

  return (
    <React.Fragment>
      <h2>Found Images: {imgs.length}</h2>

      <div className="image-grid">
        {imgs.map((image, index) => {
          if (image === null) {
            return null;
          }

          if (imgs.length === index + 1) {
            return (
              <div key={index} ref={lastImageRef} className="bug-fix">
                <ImageCard
                  key={image.id}
                  image={image}
                  openBookmarkModal={modalIsOpen}
                  setOpenBookmarkModal={setModalIsOpen}
                  setPhotoId={setPhotoIdBookmarked}
                />
              </div>
            );
          } else {
            return (
              <ImageCard
                key={image.id}
                image={image}
                openBookmarkModal={modalIsOpen}
                setOpenBookmarkModal={setModalIsOpen}
                setPhotoId={setPhotoIdBookmarked}
              />
            );
          }
        })}
      </div>
      <h2 style={{ textAlign: 'center' }}>{loading && 'Loading...'}</h2>

      <BookmarkModal
        openModal={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
        photoId={photoIdBookmarked}
      ></BookmarkModal>
    </React.Fragment>
  );
};

export default Feed;
