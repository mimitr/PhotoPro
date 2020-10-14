import React from "react";
import "./feed.css";
import ImageCard from "./ImageCard/ImageCard";
import { Link } from "react-router-dom";

const Feed = (props) => {
  const imgs = props.foundImages.map((img) => {
    return {
      id: img.id,
      component: (
        <ImageCard
          key={img.id}
          image={img}
          img_caption={img.caption}
          img_uploader={img.uploader}
          img_title={img.title}
          img_price={img.price}
        />
      ),
    };
  });

  console.log(imgs[0]);
  return (
    <React.Fragment>
      <h2>Found Images: {props.foundImages.length}</h2>
      <div className="image-list">
        <Link to={`/post/${imgs.id}`}>{imgs[0].component}</Link>
      </div>
    </React.Fragment>
  );
};

export default Feed;
