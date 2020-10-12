import React, { Component } from "react";
import "./ImageCard.css";
import like_icon from "../../../icons/outline_favorite_border_white_18dp.png";
import buy_icon from "../../../icons/outline_bookmark_border_white_18dp.png";
import bookmark_icon from "../../../icons/outline_add_shopping_cart_white_18dp.png";

class ImageCard extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard

    this.imageRef = React.createRef();
    this.state = { spans: 0 };
  }

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    const spansRows = Math.ceil(height / 10);
    this.setState({ spans: spansRows });
  };

  render() {
    return (
      <div
        class="photo-container"
        style={{ gridRowEnd: `span ${this.state.spans}` }}
      >
        <img
          ref={this.imageRef}
          src={`data:image/jpg;base64,${this.props.image.img}`}
          alt={this.props.image.caption}
        />
        <button class="btn like-btn">Like</button>
        <button class="btn bookmark-btn">Bookmark</button>
        <button class="btn buy-btn">Buy</button>
      </div>
    );
  }
}

export default ImageCard;
