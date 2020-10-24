import React from "react";
import "./feed.css";
import ImageCard from "./ImageCard/ImageCard";
import InfiniteScroll from "react-infinite-scroll-component";

const Feed = (props) => {
  const imgs = props.foundImages.map((img) => {
    return <ImageCard key={img.id} image={img} />;
  });

  return (
    <React.Fragment>
      <h2>Found Images: {props.foundImages.length}</h2>
      {/* update the start position of the next batch */}
      <div>
        <InfiniteScroll
          dataLength={props.foundImages.length}
          next={props.fetchImgs(props.query)}
          hasMore={true}
          loader={"Loading!"}
        >
          <div className="image-list">{imgs}</div>
        </InfiniteScroll>
      </div>
    </React.Fragment>
  );
};

export default Feed;
