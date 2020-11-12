import React, { useState, useEffect } from 'react';
import './UserPhotos.css';
import axios from 'axios';
import ImageCard from '../feed/ImageCard/ImageCard';
import BookmarkModal from '../modal/BookmarkModal';

const UserPhotos = (props) => {
  const [profileImgs, setProfileImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasPhotos, setHasPhotos] = useState(true);

  const { userID } = props;
  const displayMyProfile =
    localStorage.getItem('userID') == userID ? true : false;

  useEffect(() => {
    setTimeout(() => {
      // temp fix to api call the clashes with another and which both modify file = "image.jpg"
      fetchProfilePhotos();
    }, 1000);

    return () => {
      setProfileImgs([]);
    };
  }, [userID]);

  const fetchProfilePhotos = () => {
    setLoading(true);

    axios({
      method: 'GET',
      url: 'http://localhost:5000/profile_photos',
      params: { user_id: userID, batch_size: 30 }, //user_id: 1
    }).then((res) => {
      console.log(res);
      if (res.data.result !== false) {
        setLoading(false);
        setProfileImgs(res.data.result);
      } else {
        setLoading(false);
        setHasPhotos(false);
      }
    });
  };

  return (
    <React.Fragment>
      {displayMyProfile ? (
        <h2>Uploaded Images: {profileImgs.length}</h2>
      ) : (
        <h2>
          Uploads by @{userID}: {profileImgs.length}
        </h2>
      )}
      {hasPhotos ? null : (
        <h2 style={{ textAlign: 'center' }}>
          You haven't uploaded any photos!
        </h2>
      )}

      <div className="image-grid">
        {profileImgs.map((image, index) => {
          if (image === null) {
            return null;
          }

          return (
            <ImageCard
              key={image.id}
              image={image}
              openBookmarkModal={modalIsOpen}
              setOpenBookmarkModal={setModalIsOpen}
              setPhotoId={setPhotoIdBookmarked}
            />
          );
        })}
      </div>
      <h2 style={{ textAlign: 'center' }}>{loading && 'Loading...'}</h2>

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
