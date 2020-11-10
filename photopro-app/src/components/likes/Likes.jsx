import React, { useState, useEffect } from 'react';
import './Likes.css';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    width: '2rem',
    height: '2rem',
  },
  liked: {
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(213, 48, 48, 1)',
  },

  unliked: {},
});

function Likes(props) {
  const [num_likes, set_num_likes] = useState(props.num_likes);
  const [postLiked, setPostLiked] = useState(false);
  const classes = useStyles();

  const { image_id: imageID } = props;
  let userID = localStorage.getItem('userID');

  useEffect(() => {
    console.log('check if liked called');
    const checkIfLiked = () => {
      axios({
        method: 'GET',
        url: 'http://localhost:5000/get_likers_of_image',
        params: { image_id: imageID, batch_size: 50 },
      }).then((response) => {
        console.log(response);
        if (response.data.result.length > 0) {
          for (let i = 0; i < response.data.result.length; i++) {
            if (parseInt(userID) === response.data.result[i].user_id) {
              setPostLiked(true);
              console.log('This image has been liked before :o');
            }
          }
        } else {
          console.log('no likers found');
        }
      });
    };
    setTimeout(() => {
      checkIfLiked();
    }, 150);
  }, [userID, imageID]);

  const handleLikeClicked = () => {
    if (userID != null) {
      if (!postLiked) {
        post_likes(props.image_id);
      } else {
        delete_likes(props.image_id);
      }
    } else {
      console.log('user is not logged in yet');
    }
  };

  const post_likes = (img_id) => {
    axios({
      method: 'GET',
      url: 'http://localhost:5000/post_like_to_image',
      params: { image_id: img_id },
    }).then((response) => {
      console.log(`post_like api response is ${response.data.result}`);
      console.log(response);

      if (response.data.result) {
        set_num_likes((prevState) => parseInt(prevState) + 1);
        setPostLiked(true);
      }

      return response.data.result;
    });
  };

  const delete_likes = (img_id) => {
    axios({
      method: 'POST',
      url: 'http://localhost:5000/delete_like_from_image',
      params: { image_id: img_id },
    }).then((response) => {
      console.log(`delete_likes api response is ${response.data.result}`);

      if (response.data.result) {
        set_num_likes((prevState) => parseInt(prevState) - 1);
        setPostLiked(false);
      }
      return response.data.result;
    });
  };

  let buttonClass;
  if (postLiked) {
    buttonClass = classes.liked;
  } else {
    buttonClass = classes.unliked;
  }

  return (
    <React.Fragment>
      <div className="like">
        <div style={{ textAlign: 'center' }}>
          <IconButton
            classes={{ root: `${classes.root} ${buttonClass}` }}
            onClick={handleLikeClicked}
            disabled={localStorage.getItem('userLoggedIn') ? false : true}
          >
            <FavoriteIcon />
          </IconButton>
        </div>

        <p>{num_likes}</p>
      </div>
    </React.Fragment>
  );
}

export default Likes;
