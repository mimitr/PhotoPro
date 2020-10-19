import React, { Component } from 'react';
import './ImageCard.css';
import { Redirect } from 'react-router-dom';

class ImageCard extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard
    this.imageRef = React.createRef();
    this.state = { image_clicked: false, spans: 0 };
  }

  componentDidMount() {
    this.imageRef.current.addEventListener('load', this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    const spansRows = Math.ceil(height / 10);
    this.setState({ spans: spansRows });
  };

  handleImageClicked = (e) => {
    console.log('image clicked');
    this.setState({ image_clicked: true });
    console.log(this.state.image_clicked);
  };

  render() {
    console.log('rendered with state ' + this.state.image_clicked);
    let component;
    if (this.state.image_clicked) {
      console.log('if clicked');
      console.log(this.props.image);
      component = (
        <Redirect
          to={{
            pathname: `/post-${this.props.image.id}`,
            state: {
              id: `${this.props.image.id}`,
              url: `${this.props.image.img}`,
              caption: `${this.props.image.caption}`,
              price: `${this.props.image.price}`,
              title: `${this.props.image.title}`,
              uploader: `${this.props.image.uploader}`,
            },
          }}
        />
      );
    } else {
      console.log('else clicked');
      component = (
        <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
          <div onClick={this.handleImageClicked} className="photo-container">
            <img
              ref={this.imageRef}
              src={`data:image/jpg;base64,${this.props.image.img}`}
              alt={this.props.caption}
            />
            <button className="btn like-btn" type="button">
              <svg width="25" height="25">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
              </svg>
            </button>

            <button className="btn bookmark-btn">
              <svg width="25" height="25">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
              </svg>
            </button>

            <button className="btn buy-btn">
              <svg width="25" height="25">
                <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"></path>
              </svg>
            </button>
          </div>
        </div>
      );
    }
    return <React.Fragment>{component}</React.Fragment>;
  }
}

export default ImageCard;
