import ReactDom from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './PostModal.css';
import '../../../pages/PostInfo/PostInfo.css';
import FollowButton from '../../follow/followButton';
import Likes from '../../likes/Likes';
import Comments from '../../comments/Comments';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkModal from '../BookmarkModal/BookmarkModal';

export default function PostModal(props) {
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [commentUpdated, updateComments] = useState('');
  const [bookmarkModalIsOpen, setBookmarkModalIsOpen] = useState(false);
  const cancelAxiosRequest = useRef();
  const { imageID } = props;
  const history = useHistory();

  useEffect(() => {
    let mounted = true;

    const fetchTags = (id) => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_tags',
        params: { image_id: id },
        cancelToken: new axios.CancelToken(
          (c) => (cancelAxiosRequest.current = c)
        ),
      }).then((res) => {
        console.log(res);
        if (res.data.result !== false && mounted) {
          console.log(res.data.result);
          setTags(res.data.result);
        } else if (mounted) {
          setTags([]);
        }
      });
    };

    const fetchComments = (id) => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_comments_to_image',
        params: { image_id: id, batch_size: 20 },
        cancelToken: new axios.CancelToken(
          (c) => (cancelAxiosRequest.current = c)
        ),
      }).then((res) => {
        console.log(res);
        if (res.data.result !== false && mounted) {
          setComments(res.data.result);
        } else if (mounted) {
          setComments([]);
        }
        fetchTags(id);
      });
    };
    fetchComments(imageID);

    return () => {
      cancelAxiosRequest.current();
      mounted = false;
    };
  }, [commentUpdated, imageID]);

  const apiAddPurchase = (imageID) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/add_purchase',
      params: {
        save_for_later: 0,
        purchased: 0,
        image_id: String(imageID),
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
      }
    });
  };

  const handleBuyButton = () => {
    apiAddPurchase(props.imageID);
  };

  const handleBookmarkClicked = () => {
    setBookmarkModalIsOpen(true);
  };

  if (!props.openModal) {
    return null;
  } else {
    return ReactDom.createPortal(
      <React.Fragment>
        <div className="photo-overlay-styles" />
        <div
          className="photo-styles"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="postWrapper">
            <div className="postInfo">
              <div className="username">
                <Button
                  varient="outlined"
                  onClick={() => {
                    history.push({
                      pathname: `/profile/${props.uploader}`,
                      state: { uploaderID: props.uploader },
                    });
                  }}
                >
                  @{props.uploader}
                </Button>
                {localStorage.getItem('userLoggedIn') ? (
                  <React.Fragment>
                    {localStorage.getItem('userID') !== props.uploader ? (
                      <FollowButton uploader={props.uploader} />
                    ) : null}
                    <IconButton
                      variant="contained"
                      onClick={handleBookmarkClicked}
                    >
                      <BookmarkIcon />
                    </IconButton>
                  </React.Fragment>
                ) : null}
                <Likes
                  setNumLikes={props.setNumLikes}
                  image_id={props.imageID}
                  uploader_id={props.uploader}
                />
              </div>
            </div>
            <div className="postImage">
              <div className="main-img">
                <img
                  src={`data:image/jpg;base64,${props.url}`}
                  alt={props.caption}
                />
              </div>

              <div className="recImages-nested">
                <h1 className="roboto"> Related Photos:</h1>
                <div className="recImage"></div>
                <div className="recImage"></div>
                <div className="recImage"></div>
              </div>
            </div>
            <div className="postFeed-nested">
              <h1>{props.title}</h1>
              <h2 className="roboto">{props.caption}</h2>
              <div className="postTags">
                <h3>
                  Tags:{' '}
                  {tags.length < 1 ? 'this post has no tags to display' : null}
                </h3>
                <div className="flexbox-tags">
                  {tags.length > 0
                    ? tags.map((tag, index) => {
                        return (
                          <Button key={index} variant="contained">
                            #{tag}
                          </Button>
                        );
                      })
                    : null}
                </div>
              </div>
              <div className="postPrice">
                <h2 className="roboto">Price: ${props.price}</h2>
                <Button variant="contained" onClick={handleBuyButton}>
                  Add to Cart
                </Button>
              </div>
              <div className="postComments">
                <h2 className="roboto">Comments:</h2>
                <Comments
                  image_id={props.imageID}
                  comments_list={comments}
                  updateComments={updateComments}
                  uploader_id={props.uploader}
                />
              </div>
            </div>
          </div>

          {bookmarkModalIsOpen ? (
            <BookmarkModal
              openModal={true}
              setOpenModal={setBookmarkModalIsOpen}
              photoId={props.imageID}
            ></BookmarkModal>
          ) : null}
        </div>
      </React.Fragment>,

      document.getElementById('postPortal')
    );
  }
}
