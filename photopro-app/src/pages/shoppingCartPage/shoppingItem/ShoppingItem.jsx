import React from "react";
import "./ShoppingItem.css";

export default function ShoppingItem(props) {
  return (
    <React.Fragment>
      <div className="shopping-item">
        <div className="shopping-item-grid">
          <div className="image">
            <img
              src={`data:image/jpg;base64,${props.img}`}
              alt={props.caption}
            />
          </div>
          <div className="image-info">
            <h2>Title: {props.title}</h2>
            <h2>Caption:</h2>
            <p>{props.caption}</p>
            <h3>Price: {props.price}</h3>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
