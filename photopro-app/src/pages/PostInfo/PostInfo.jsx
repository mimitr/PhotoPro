import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import './PostInfo.css';
import Toolbar from '../../components/toolbar/toolbar';
import Likes from '../../components/likes/Likes';
import Comments from '../../components/comments/Comments';
import axios from 'axios';
import Button from '@material-ui/core/Button';

const PostInfo = (props) => {
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [commentUpdated, updateComments] = useState('');
  const cancelAxiosRequest = useRef();
  const {
    location: {
      state: { id: imageID },
    },
  } = props;
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
      console.log('CLEAN UP - PostInfo');
      cancelAxiosRequest.current();
      mounted = false;
    };
  }, [commentUpdated, imageID]);

  return (
    <React.Fragment>
      <Toolbar />
      <div className="postWrapper">
        <div className="postInfo">
          <div className="username">
            <Button
              onClick={() => {
                history.push({
                  pathname: `/profile/${props.location.state.uploader}`,
                  state: { uploaderID: props.location.state.uploader },
                });
              }}
            >
              @{props.location.state.uploader}
            </Button>
            <button className="btn">Follow</button>
            <Likes
              num_likes={props.location.state.num_likes}
              image_id={props.location.state.id}
            />
            <button className="btn bookmark-btn">
              <svg width="25" height="25">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="postImage">
          <img
            src={`data:image/jpg;base64,${props.location.state.url}`}
            alt={props.location.state.caption}
          />
          <div className="recImages-nested">
            <h1 className="roboto"> Related Photos:</h1>
            <div className="recImage"></div>
            <div className="recImage"></div>
            <div className="recImage"></div>
          </div>
        </div>
        <div className="postFeed-nested">
          <div className="postTags">
            <h2 className="roboto">{props.location.state.caption}</h2>
            <h3>Tags:</h3>
            <div className="flexbox-tags">
              {tags.length > 0 ? (
                tags.map((tag, index) => {
                  return (
                    <Button key={index} variant="contained">
                      #{tag}
                    </Button>
                  );
                })
              ) : (
                <h2>This post has no tags to display</h2>
              )}
            </div>
          </div>
          <div className="postPrice">
            <h2 className="roboto">Price: ${props.location.state.price}</h2>
            <button>Add to Cart</button>
          </div>
          <div className="postComments">
            <h2 className="roboto">Comments:</h2>
            {/* <Comments className="comments" /> */}
            <Comments
              image_id={props.location.state.id}
              comments_list={comments}
              updateComments={updateComments}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PostInfo;
