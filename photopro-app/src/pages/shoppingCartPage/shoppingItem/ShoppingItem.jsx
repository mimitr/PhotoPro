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
            <h2>Photo title: {props.title}</h2>
            <p>Price: {props.price}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
