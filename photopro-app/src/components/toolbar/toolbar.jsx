import React, { useState } from "react";
import axios from "axios";
import "./toolbar.css";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Notifications from "./notifications/notifications";
import logo from "../../logo/photoPro-logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    border: "3px solid red",
  },
  button: {
    color: "rgb(110, 110, 110)",
  },
}));

function Toolbar() {
  const history = useHistory();
  const classes = useStyles();
  const loggedIn = localStorage.getItem("userLoggedIn");

  const [anchorEl, setAnchorEl] = useState(null);

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleSignInClicked = () => {
    history.push("/login");
  };

  const handleSignUpClicked = () => {
    history.push("/signup");
  };

  const handleProfileClicked = function () {
    const userID = localStorage.getItem("userID");
    console.log(`In toolbar the userID = ${userID}`);
    history.push({
      pathname: `/profile/${userID}`,
      state: { uploaderID: userID },
    });
  };

  const handleLogoutClicked = () => {
    localStorage.clear();
    history.push("/");
    history.go(0); // forces the page to re-render if you are already on it which causes it to display the right information
  };

  const handleDiscoveryClicked = () => {
    history.push("/");
  };

  const handleUploadClicked = () => {
    history.push("/uploadphoto");
  };

  const handleChangePassClicked = () => {
    history.push("/changepassword");
  };

  const handleCollectionsClicked = () => {
    const userID = localStorage.getItem("userID");
    console.log(`In toolbar the userID = ${userID}`);
    history.push({
      pathname: `/collections/${userID}`,
      state: { uploaderID: userID },
    });
  };

  const handleCartClicked = () => {
    history.push("/shopping-cart");
  };

  const handleMyPurchasesClicked = () => {
    history.push("/my-purchases");
  };

  let buttons;
  if (loggedIn === "true") {
    buttons = (
      <React.Fragment>
        <div className={"flex-container-buttons-2"}>
          <Button
            className={classes.button}
            size="small"
            onClick={handleDiscoveryClicked}
          >
            Discovery
          </Button>
          <Button
            className={classes.button}
            size="small"
            onClick={handleCollectionsClicked}
          >
            Collections
          </Button>

          <Button
            className={classes.button}
            size="small"
            onClick={handleCartClicked}
          >
            My Cart
          </Button>

          <Button
            className={classes.button}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleAccountClick}
          >
            Account
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleAccountClose}
          >
            <MenuItem onClick={handleProfileClicked}>Profile</MenuItem>
            <MenuItem onClick={handleMyPurchasesClicked}>My Purchases</MenuItem>
            <MenuItem onClick={handleChangePassClicked}>
              Change Password
            </MenuItem>
            <MenuItem onClick={handleLogoutClicked}>Logout</MenuItem>
          </Menu>
          <Notifications />
        </div>
        <div className="toolbar-left">
          <Button
            onClick={handleUploadClicked}
            // variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
          >
            Upload Photo
          </Button>
        </div>
      </React.Fragment>
    );
  } else {
    buttons = (
      <React.Fragment>
        <div className="toolbar-left-placeholder"></div>
        <div className="flex-container-buttons-1">
          <Button className={classes.button} onClick={handleSignInClicked}>
            Sign in
          </Button>
          <Button className={classes.button} onClick={handleSignUpClicked}>
            Getting Started
          </Button>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="flex-container-toolbar">
        <img className="logo" src={logo} alt="Logo" />
        {buttons}
      </div>
    </React.Fragment>
  );
}

export default Toolbar;
