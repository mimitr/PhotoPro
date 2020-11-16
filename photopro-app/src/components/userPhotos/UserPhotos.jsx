import React, { useState, useEffect, useCallback, useRef } from 'react';
import './UserPhotos.css';
import axios from 'axios';
import ImageCard from '../feed/ImageCard/ImageCard';
import BookmarkModal from '../Modals/BookmarkModal/BookmarkModal';

const UserPhotos = (props) => {
  const [username, setUsername] = useState(props.userID);
  const [profileImgs, setProfileImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const { userID } = props;
  const displayMyProfile =
    localStorage.getItem('userID') == userID ? true : false;

  const userLoggedIn = localStorage.getItem('userLoggedIn');
  const [lastID, setLastID] = useState(null);
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
          console.log(`called with last_id of ${lastID}`);
          setTimeout(() => {
            fetchProfilePhotos(lastID);
          }, 2000);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    axios({
      url: 'http://localhost:5000/get_user_username',
      params: { user_id: userID },
    }).then((response) => {
      if (response.data.result) {
        setUsername(response.data.result);
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // temp fix to api call the clashes with another and which both modify file = "image.jpg"
      fetchProfilePhotos();
    }, 700);

    return () => {
      if (cancelAxiosRequest.current != null) cancelAxiosRequest.current();

      fetchIsCancelled.current = true;
      setProfileImgs([]);
      setHasMore(true);
    };
  }, [userID]);

  const fetchProfilePhotos = (last_id) => {
    setLoading(true);

    axios({
      method: 'GET',
      url: 'http://localhost:5000/profile_photos',
      params: { user_id: userID, batch_size: 10, last_id: last_id },
      cancelToken: new axios.CancelToken(
        (c) => (cancelAxiosRequest.current = c)
      ),
    })
      .then((res) => {
        console.log(res);
        if (res.data.result !== false && !fetchIsCancelled.current) {
          setLastID(res.data.last_id);
          setHasMore(true);
          setLoading(false);
          setProfileImgs((prevImgs) => {
            return [...prevImgs, ...res.data.result];
          });
        } else if (!fetchIsCancelled.current) {
          setLoading(false);
          setHasPhotos(false);
          setHasMore(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) {
          return;
        }
      });
  };

  return (
    <React.Fragment>
      {displayMyProfile ? (
        <h2 style={{ marginTop: '10%', marginLeft: '9%' }}>
          Uploaded Images: {profileImgs.length}
        </h2>
      ) : (
        <h2 style={{ marginTop: '10%', marginLeft: '9%' }}>
          Uploads: {profileImgs.length}
        </h2>
      )}

      <div className="image-grid">
        {profileImgs.map((image, index) => {
          if (image === null) {
            return null;
          }

          if (profileImgs.length === index + 1) {
            return (
              <React.Fragment key={index}>
                <ImageCard
                  key={image.id}
                  image={image}
                  setOpenBookmarkModal={setModalIsOpen}
                  setPhotoId={setPhotoIdBookmarked}
                  userLoggedIn={userLoggedIn}
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
      {!hasPhotos ? (
        <h2 style={{ textAlign: 'center' }}>
          You haven't uploaded any photos!
        </h2>
      ) : (
        <React.Fragment>
          <h2>{!hasMore && 'No more images to display'}</h2>
        </React.Fragment>
      )}

      {modalIsOpen ? (
        <BookmarkModal
          openModal={modalIsOpen}
          setOpenModal={setModalIsOpen}
          photoId={photoIdBookmarked}
        ></BookmarkModal>
      ) : null}
    </React.Fragment>
  );
};

export default UserPhotos;
