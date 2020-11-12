import React, { useState } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ITEM_HEIGHT = 48;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log(notifications);

  const handleClick = (event) => {
    const fetchNotifications = () => {
      axios({
        url: 'http://localhost:5000/fetch_notification',
        params: {},
      }).then((res) => {
        console.log(res);
        if (res.data.result) {
          console.log('setting notifications');
          setNotifications(res.data.result);
        }
      });
    };

    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearNotifications = () => {
    console.log('clear notifications');
    const clearNotifications = () => {
      axios({
        url: 'http://localhost:5000/clear_notifications',
        params: {},
      }).then((res) => {
        console.log(res);
      });
    };

    clearNotifications();
    setNotifications([]);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <NotificationsIcon style={{ color: 'rgba(224, 224, 224, 0.74)' }} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '50ch',
          },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            if (index === 0) {
              return (
                <div key={index}>
                  <MenuItem key={index} onClick={handleClearNotifications}>
                    Clear Notifications
                  </MenuItem>
                  <MenuItem key={index + 1} onClick={handleClose}>
                    <div>
                      User {notification.sender}{' '}
                      {notification.type === 'like'
                        ? 'liked your'
                        : 'commented on your'}{' '}
                      post - {`'${notification.image_id}'`}
                    </div>
                  </MenuItem>
                </div>
              );
            }
            return (
              <MenuItem key={index + 1} onClick={handleClose}>
                <div>
                  User {notification.sender}{' '}
                  {notification.type === 'like'
                    ? 'liked your'
                    : 'commented on your'}{' '}
                  post - {`'${notification.image_id}'`}
                </div>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={handleClose}>
            No Notifications at this time
          </MenuItem>
        )}
      </Menu>
    </div>
  );
}
