import React, { Component } from "react";
import axios from "axios";
import "./ImageCard.css";
import { Redirect, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

const deletePostRequest = async function (imageID) {
  const response = await axios.get("http://localhost:5000/delete_image_post", {
    params: { image_id: String(imageID) }, //user_id: 1
  });

  return response;
};

// matrial-ui component style override
const styles = {
  root: {
    bottom: "0%",
    left: "50%",
    color: "rgba(255, 255, 255,1)",
    height: "20%",
    width: "20%",
  },
  iconSize: {
    width: "60%",
    height: "60%",
  },
  like: {
    left: "5%",
  },
  bookmark: {
    left: "60%",
  },
  buy: {
    left: "80%",
  },
  delete: {
    left: "4%",
    top: "10%",
    width: "16%",
    height: "20%",
    "&:hover": {
      backgroundColor: "rgba(180, 65, 65, 0.82)",
    },
  },
  edit: {
    left: "82%",
    top: "10%",
    width: "16%",
    height: "20%",
    "&:hover": {
      backgroundColor: "rgba(219, 193, 20, 0.71)",
    },
  },
};

class ImageCard extends Component {
  constructor(props) {
    super(props);

    // CreateRef is used to access the DOM
    // after accessing the DOM, we can get the height of each ImageCard
    this.imageRef = React.createRef();
    this.state = { redirect: null, spans: 0 };

    // for Bookmarks
    //this.state = { modalIsOpen: false };
  }

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    const spansRows = Math.ceil(height / 10);
    this.setState({ spans: spansRows });
  };

  handleImageClicked = (e) => {
    console.log(this.props.image);
    this.setState({ redirect: `/post-${this.props.image.id}` });
  };

  handleLikeClicked = (e) => {
    console.log("like button clicked");
    e.stopPropagation();
  };

  handleBookmarkClicked = (e) => {
    console.log("bookmark button clicked");
    e.stopPropagation();
    //this.setState({ modalIsOpen: true });
    this.props.setOpenBookmarkModal(true);
    this.props.setPhotoId(parseInt(this.props.image.id));
  };

  handleBuyClicked = (e) => {
    console.log("buy button clicked");
    e.stopPropagation();
  };

  handleDeleteClicked = (e) => {
    console.log("delete button clicked");
    let response = deletePostRequest(this.props.image.id);
    console.log(response);
    e.stopPropagation();
    window.location.reload();
  };

  handleEditClicked = (e) => {
    console.log("edit button clicked");
    this.setState({ redirect: `/editpost/${this.props.image.id}` });
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
      let uploaderID = String(this.props.image.uploader);
      let userID = localStorage.getItem("userID");
      let deleteButton =
        uploaderID === userID ? (
          <IconButton
            variant="contained"
            classes={{
              root: `${this.props.classes.root} ${this.props.classes.delete}`,
            }}
            onClick={this.handleDeleteClicked}
          >
            <DeleteIcon />
          </IconButton>
        ) : (
          <Button></Button>
        );

      let editButton =
        uploaderID === userID ? (
          <IconButton
            variant="contained"
            classes={{
              root: `${this.props.classes.root} ${this.props.classes.edit}`,
            }}
            onClick={this.handleEditClicked}
          >
            <EditIcon />
          </IconButton>
        ) : (
          <Button></Button>
        );

      component = (
        <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
          <div onClick={this.handleImageClicked} className="photo-container">
            <div className="icon-bar"></div>
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
              <FavoriteIcon classes={{ root: this.props.classes.iconSize }} />
              <div className="num-likes">{this.props.image.num_likes}</div>
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

            {deleteButton}
            {editButton}
          </div>
        </div>
      );
    }
    return <React.Fragment>{component}</React.Fragment>;
  }
}

export default withStyles(styles)(ImageCard);
