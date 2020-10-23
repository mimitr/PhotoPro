import React, { Component } from 'react';
import './ImageCard.css';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

// matrial-ui component style override
const styles = {
  root: {
    top: '60%',
    left: '50%',
    // minWidth: '50px',
    width: '52px',
    backgroundColor: 'rgba(226, 227, 233, 0.82)',
    '&:hover': {
      backgroundColor: 'rgba(140, 140, 140, 0.82)',
    },
  },
  like: {
    left: '50%',
  },
  bookmark: {
    left: '20%',
  },
  buy: {
    left: '80%',
  },
};

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
    console.log('Image clicked');
    this.setState({ image_clicked: true });
    console.log(this.state.image_clicked);
  };

  handleLikeClicked = (e) => {
    console.log('like button clicked');
    e.stopPropagation();
  };

  handleBookmarkClicked = (e) => {
    console.log('bookmark button clicked');
    e.stopPropagation();
  };

  handleBuyClicked = (e) => {
    console.log('buy button clicked');
    e.stopPropagation();
  };

  render() {
    let component;
    if (this.state.image_clicked) {
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
              num_likes: `${this.props.image.num_likes}`,
            },
          }}
        />
      );
    } else {
      component = (
        <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
          <div onClick={this.handleImageClicked} className="photo-container">
            <img
              ref={this.imageRef}
              src={`data:image/jpg;base64,${this.props.image.img}`}
              alt={this.props.caption}
            />
            <IconButton
              variant="contained"
              classes={{
                root: `${this.props.classes.root} ${this.props.classes.like}`,
              }}
              onClick={this.handleLikeClicked}
            >
              <FavoriteIcon />
            </IconButton>

            <IconButton
              variant="contained"
              classes={{
                root: `${this.props.classes.root} ${this.props.classes.bookmark}`,
              }}
              onClick={this.handleBookmarkClicked}
            >
              <BookmarkIcon />
            </IconButton>

            <IconButton
              variant="contained"
              classes={{
                root: `${this.props.classes.root} ${this.props.classes.buy}`,
              }}
              onClick={this.handleBuyClicked}
            >
              <ShoppingCartIcon />
            </IconButton>
          </div>
        </div>
      );
    }
    return <React.Fragment>{component}</React.Fragment>;
  }
}

export default withStyles(styles)(ImageCard);
