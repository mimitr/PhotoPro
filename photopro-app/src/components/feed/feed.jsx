import React, { useState } from "react";
import "./feed.css";
import ImageCard from "./ImageCard/ImageCard";
import BookmarkModal from "../modal/BookmarkModal";

const Feed = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const imgs = props.foundImages.map((img) => {
    return (
      <ImageCard
        key={img.id}
        image={img}
        openBookmarkModal={modalIsOpen}
        setOpenBookmarkModal={setModalIsOpen}
      />
    );
  });

  return (
    <React.Fragment>
      <h2>Found Images: {props.foundImages.length}</h2>
      <div className="image-list">{imgs}</div>
      <BookmarkModal
        openModal={modalIsOpen}
        onCloseModal={() => setModalIsOpen(false)}
      ></BookmarkModal>
    </React.Fragment>
  );
};

export default Feed;
