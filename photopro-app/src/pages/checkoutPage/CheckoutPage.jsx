import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import ToolBar from "../../components/toolbar/toolbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";
import CheckoutItem from "./checkoutItem/CheckoutItem";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "ch",
    },
  },
}));

export default function CheckoutPage(props) {
  const [shoppingCartItems, setShoppingCartItems] = useState([]);
  const [detailsValidated, setDetailsValidated] = useState(true);

  const classes = useStyles();

  const history = useHistory();

  const getUserNotPurchasedItems = () => {
    axios({
      method: "GET",
      url: "http://localhost:5000/get_user_purchases",
      params: {
        save_for_later: 0,
        purchased: 0,
      },
    }).then((response) => {
      if (response.data.result !== false) {
        console.log(response);
        setShoppingCartItems(response.data.result);
      }
    });
  };

  useEffect(() => {
    getUserNotPurchasedItems();
  }, []);

  const updatePurchase = (img_id) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/update_user_purchases_details",
      params: {
        save_for_later: 0,
        purchased: 1,
        image_id: img_id,
      },
    }).then((response) => {
      console.log(response);
      // if (response.data.result !== false) {
      // }
    });
  };

  const handlePlaceOrderButton = () => {
    if (detailsValidated) {
      shoppingCartItems.map((item) => {
        console.log(item.image_id);

        updatePurchase(item.image_id);
      });
    }
  };

  const handleEditButton = () => {
    history.push("/shopping-cart");
  };

  const checkoutItemsComponents = shoppingCartItems.map((item) => {
    //console.log(item);
    return (
      <CheckoutItem
        key={item.image_id}
        image_id={item.image_id}
        img={item.img}
        price={item.price}
        title={item.title}
      />
    );
  });

  return (
    <React.Fragment>
      <ToolBar />
      <div className="checkout-wrapper" style={{ marginTop: "15%" }}>
        <h1>Checkout</h1>
        <div className="checkout-grid">
          <div className="payment-info">
            <h2>Fill payment info:</h2>
            <form className={classes.root} noValidate autoComplete="off">
              <div className="cart-details-grid">
                <h3>CARD NUMBER</h3>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  defaultValue="1234567890"
                  variant="outlined"
                />
                <h3>NAME ON CARD</h3>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  defaultValue="Mushi Iroh"
                  variant="outlined"
                />
                <h3>EXPIRY DATE</h3>
                <TextField
                  required
                  id="outlined-number"
                  label="Month"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  required
                  id="outlined-number"
                  label="Year"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <h3>CVC</h3>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  defaultValue="123"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handlePlaceOrderButton}
                >
                  PLACE ORDER
                </Button>
              </div>
            </form>
          </div>
          <div className="purchase-info">
            <h2>
              {shoppingCartItems.length}{" "}
              {shoppingCartItems.length > 1 ? "Items" : "Item"}:
            </h2>
            <Button color="primary" onClick={handleEditButton}>
              Edit
            </Button>
            <div className="purchased-items">{checkoutItemsComponents}</div>
            <h2>TOTAL TO PAY: ${props.location.state.totalPrice}</h2>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
