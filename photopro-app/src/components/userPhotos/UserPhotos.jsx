import React, { useState, useEffect } from 'react';
import './UserPhotos.css';
import axios from 'axios';
import ImageCard from '../feed/ImageCard/ImageCard';
import BookmarkModal from '../modal/BookmarkModal';

const UserPhotos = () => {
  const [profileImgs, setProfileImgs] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfileImgs([]);
    fetchProfilePhotos();
  }, []);

  const fetchProfilePhotos = () => {
    setLoading(true);

    axios({
      method: 'GET',
      url: 'http://localhost:5000/profile_photos',
      params: { batch_size: 30 }, //user_id: 1
    }).then((res) => {
      console.log(res);
      if (res.data.result != false) {
        setLoading(false);
        setProfileImgs(res.data.result);
      }
    });
  };

  return (
    <React.Fragment>
      <h2>Uploaded Images: {profileImgs.length}</h2>

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

      <BookmarkModal
        openModal={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
        photoId={photoIdBookmarked}
      ></BookmarkModal>
    </React.Fragment>
  );
};

export default UserPhotos;
