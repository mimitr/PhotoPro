import React from "react";
import "./CheckoutItem.css";

export default function CheckoutItem(props) {
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
            <h3>Price: ${props.price}</h3>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
