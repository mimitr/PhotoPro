import React, { useState, useEffect, useRef, useCallback } from 'react';
import './feed.css';
import axios from 'axios';
import ImageCard from './ImageCard/ImageCard';
import BookmarkModal from '../modal/BookmarkModal';

const Feed = (props) => {
  const [imgs, setImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const userLoggedIn = localStorage.getItem('userLoggedIn');
  const fetchIsCancelled = useRef(false);
  const cancelAxiosRequest = useRef();
  const observer = useRef();
  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          fetchImages(props.query);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, props.query]
  );

  useEffect(() => {
    fetchIsCancelled.current = false;
    setLoading(true);

    setTimeout(() => {
      fetchImages(props.query);
    }, 150);

    return () => {
      console.log('CLEAN UP - Feed');

      if (cancelAxiosRequest.current != null) cancelAxiosRequest.current();

      fetchIsCancelled.current = true;
      setImgs([]);
      setHasMore(true);
    };
  }, [props.query]);

  const fetchImages = (term) => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/discovery',
      params: { query: term, batch_size: 10 }, //user_id: 1
      cancelToken: new axios.CancelToken(
        (c) => (cancelAxiosRequest.current = c)
      ),
    })
      .then((res) => {
        console.log(res);
        if (res.data.result !== false && !fetchIsCancelled.current) {
          setHasMore(true);
          setLoading(false);
          setImgs((prevImgs) => {
            return [...prevImgs, ...res.data.result];
          });
        } else if (!fetchIsCancelled.current) {
          console.log('no more images to return');
          setLoading(false);
          setHasMore(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          console.log(`previous search request cancelled for - ${term}`);
          return;
        }
      });
  };

  // console.log(`LENGTH = ${imgs.length}`);
  // console.log(`HASMORE = ${hasMore}`);
  // console.log(`LOADING = ${loading}`);

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
              <React.Fragment key={index}>
                <ImageCard
                  key={image.id}
                  image={image}
                  setOpenBookmarkModal={setModalIsOpen}
                  setPhotoId={setPhotoIdBookmarked}
                />
                <div
                  key={index}
                  ref={lastImageRef}
                  style={{
                    position: 'relative',
                    bottom: '200px',
                    // border: '3px solid red',
                    height: '0%',
                  }}
                ></div>
              </React.Fragment>
            );
          } else {
            return (
              <ImageCard
                key={image.id}
                image={image}
                setOpenBookmarkModal={setModalIsOpen}
                setPhotoId={setPhotoIdBookmarked}
                userLoggedIn={userLoggedIn}
              />
            );
          }
        })}
      </div>
      <h2 style={{ textAlign: 'center' }}>{loading && 'Loading...'}</h2>
      <h2 style={{ textAlign: 'center' }}>
        {!hasMore && 'No more images to display'}
      </h2>

      {modalIsOpen ? (
        <BookmarkModal
          openModal={true}
          setOpenModal={setModalIsOpen}
          photoId={photoIdBookmarked}
        ></BookmarkModal>
      ) : null}
    </React.Fragment>
  );
};

export default Feed;
