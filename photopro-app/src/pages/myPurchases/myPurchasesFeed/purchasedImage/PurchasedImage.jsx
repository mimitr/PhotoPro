import React, { Component } from "react";
import axios from "axios";
import "./PurchasedImage.css";
import { Redirect } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import GetAppIcon from "@material-ui/icons/GetApp";

// matrial-ui component style override
const styles = {
  root: {
    position: "absolute",
    color: "rgba(255, 255, 255,1)",
  },
  likeIcon: {
    width: "50%",
    height: "10%",
  },
  removeIcon: {
    width: "95%",
    height: "10%",
  },
  likeButton: {
    bottom: "0%",
    left: "5%",
    width: "20%",
    height: "15%",
  },
  buy: {
    bottom: "0%",
    left: "80%",
    width: "20%",
    height: "15%",
  },
  remove: {
    right: "0%",
    top: "0%",
    width: "15%",
    height: "25%",
    "&:hover": {
      backgroundColor: "rgba(234, 241, 223, 0.26)",
    },
  },
};

class PurchasedImage extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard
    this.imageRef = React.createRef();
    this.state = {
      redirect: null,
      spans: 0,
      animateImages: "",
    };

    this.collection_id = props.image.collection_id;
    this.image_id = props.image.id;
  }

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
    setTimeout(() => {
      this.setState({
        animateImages: "image-container-animate",
      });
    }, 100);
  }

  setSpans = () => {
    if (this.imageRef.current != null) {
      const height = this.imageRef.current.clientHeight;
      const spansRows = Math.ceil(height / 10);
      this.setState({ spans: spansRows });
    }
  };

  handleImageClicked = (e) => {
    this.setState({ redirect: `/post-${this.props.image.id}` });
  };

  handleDeleteClicked = (e) => {
    const deletePhotoFromCollection = () => {
      axios({
        method: "GET",
        url: "http://localhost:5000/delete_photo_from_collection",
        params: { collection_id: this.collection_id, image_id: this.image_id }, //user_id: 1
      }).then((res) => {
        console.log(res);
      });
    };

    deletePhotoFromCollection();
    e.stopPropagation();
    window.location.reload();
  };

  handleDownloadClicked = (e) => {
    const downloadPhoto = () => {
      axios({
        method: "GET",
        url: "http://localhost:5000/download",
        params: { image_id: this.props.image.image_id },
      }).then((res) => {
        console.log(res);
      });
    };

    console.log("download clicked");
    downloadPhoto();
    e.stopPropagation();
  };

  render() {
    let component;

    if (this.state.redirect) {
      component = (
        <Redirect
          push
          to={{
            pathname: `${this.state.redirect}`,
            state: {
              id: `${this.props.image.image_id}`,
              url: `${this.props.image.img}`,
              caption: `${this.props.image.caption}`,
              price: `${this.props.image.price}`,
              title: `${this.props.image.title}`,
              //   uploader: `${this.props.image.uploader}`,
              //   num_likes: `${this.props.image.num_likes}`,
            },
          }}
        />
      );
    } else {
      component = (
        // <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <div
          className={`image-container ${this.state.animateImages}`}
          onClick={this.handleImageClicked}
        >
          <div className="icon-bar"></div>

          <img
            className="image-size"
            ref={this.imageRef}
            src={`data:image/jpg;base64,${this.props.image.img}`}
            alt={this.props.caption}
          />
          <IconButton
            classes={{
              root: `${this.props.classes.root} ${this.props.classes.buy}`,
            }}
            variant="contained"
            onClick={this.handleDownloadClicked}
          >
            <GetAppIcon />
          </IconButton>
        </div>
        // </div>
      );
    }
    return <React.Fragment>{component}</React.Fragment>;
  }
}

export default withStyles(styles)(PurchasedImage);
