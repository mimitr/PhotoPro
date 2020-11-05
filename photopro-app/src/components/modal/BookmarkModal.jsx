import React, { useState } from "react";
import ReactDom from "react-dom";
import "./BookmarkModal.css";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import IconButton from "@material-ui/core/IconButton";

export default function BookmarkModal({ openModal, children, onCloseModal }) {
  const [enteredCollection, setEnteredCollection] = useState("");

  if (!openModal) {
    return null;
  }

  const handleEnteredCollection = (e) => {
    e.preventDefault();
  };

  return ReactDom.createPortal(
    <React.Fragment>
      <div className="overlayStyles" />
      <div className="bookmarkModal">
        <div className="closeButton">
          <IconButton variant="contained" onClick={onCloseModal}>
            <HighlightOffIcon />
          </IconButton>
        </div>
        <h2>Add to Collection</h2>
        <div className="enteredCollection">
          <form onSubmit={handleEnteredCollection}>
            <div>
              <input
                type="reply"
                value={enteredCollection}
                onChange={(e) => setEnteredCollection(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>,
    document.getElementById("portal")
  );
}
