import React from "react";
import Toolbar from "../components/toolbar/toolbar";
import UserPhotos from "../components/userPhotos/UserPhotos";
import Collections from "../components/collections/collections";
import Button from "@material-ui/core/Button";
import "./ProfilePage.css";

function ProfilePage(props) {
  if (props.location.state === undefined) {
    return (
      <React.Fragment>
        <Toolbar />
        <h1>Nothing found</h1>
      </React.Fragment>
    );
  } else {
    // This variable helps certain components decide what information they should display.
    const displayMyProfile =
      localStorage.getItem("userID") === props.location.state.uploaderID
        ? true
        : false;

    // Tries to move the page to the top when the profile page is rendered
    document.body.style.overflow = "unset";
    return (
      <React.Fragment>
        <Toolbar />
        <div className="profile-wrapper" style={{ marginTop: "20%" }}>
          <div className="users-profile-pic">
            <div className="dp-photo-wrapper">
              <div className="dp-photo"></div>
            </div>

            <div className="upload-dp-button" style={{ textAlign: "center" }}>
              <Button variant="outlined">Update Profile Photo</Button>
            </div>
          </div>

          {displayMyProfile ? null : (
            <Collections
              userID={props.location.state.uploaderID}
              displayMyProfile={displayMyProfile}
            />
          )}
          <UserPhotos
            userID={props.location.state.uploaderID}
            userLoggedIn={localStorage.getItem("userLoggedIn")}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default ProfilePage;
