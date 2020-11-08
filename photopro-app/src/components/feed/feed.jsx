import React, { useState } from 'react';
import './feed.css';
import ImageCard from './ImageCard/ImageCard';
import BookmarkModal from '../modal/BookmarkModal';
import InfiniteScroll from 'react-infinite-scroll-component';

const Feed = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);

  const imgs = props.foundImages.map((img) => {
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
      <h2>Found Images: {props.foundImages.length}</h2>
      {/* update the start position of the next batch */}
      <InfiniteScroll
        dataLength={props.foundImages.length}
        next={props.fetchImages(props.query)}
        hasMore={true}
        loader={'Loading!'}
      >
        <div className="image-list">{imgs}</div>
      </InfiniteScroll>
      <div className="image-list">{imgs}</div>
      <BookmarkModal
        openModal={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
        photoId={photoIdBookmarked}
      ></BookmarkModal>
    </React.Fragment>
  );
};

export default Feed;
