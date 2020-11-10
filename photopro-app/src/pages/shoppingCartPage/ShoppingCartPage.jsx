import React, { useState, useEffect } from "react";
import ToolBar from "../../components/toolbar/toolbar";
import ShoppingItem from "./shoppingItem/ShoppingItem";
import Button from "@material-ui/core/Button";

import { Redirect } from "react-router-dom";

import "./ShoppingCartPage.css";

export default function ShoppingCart() {
  const [checkoutButtonClicked, setCheckoutButtonClicked] = useState(false);

  const handleCheckoutButton = () => {
    setCheckoutButtonClicked(true);
  };

  const checkoutComponent = (
    <Redirect
      push
      to={{
        pathname: `/checkout`,
      }}
    />
  );

  let componentsRender;
  if (checkoutButtonClicked) {
    componentsRender = checkoutComponent;
  } else {
    componentsRender = (
      <div className="shopping-cart">
        <h1>My Shopping Cart</h1>
        <div className="shopping-cart-grid">
          <div className="shopping-cart-items">
            <ShoppingItem />
            <ShoppingItem />
            <ShoppingItem />
          </div>
          <div className="shopping-cart-subtotal">
            <h2>Subtotal (3 items): $999</h2>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCheckoutButton}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ToolBar />
      {componentsRender}
    </React.Fragment>
  );
}
