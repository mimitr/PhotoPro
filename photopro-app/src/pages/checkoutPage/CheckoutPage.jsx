import React from "react";
import "./CheckoutPage.css";
import ToolBar from "../../components/toolbar/toolbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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
  const classes = useStyles();

  const handlePlaceOrderButton = () => {};

  return (
    <React.Fragment>
      <ToolBar />
      <div className="checkout-wrapper">
        <h1>Checkout</h1>
        <div className="checkout-grid">
          <div className="payment-info">
            <h2>Fill payment info:</h2>
            <form className={classes.root} noValidate autoComplete="off">
              <div className="card-details-grid">
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
                <h3>CVV</h3>
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
            <h2>5 Items:</h2>
            <div className="purchased-items">
              <div>{"photos and price here"}</div>
              <div>{"photos and price here"}</div>
              <div>{"photos and price here"}</div>
              <div>{"photos and price here"}</div>
              <div>{"photos and price here"}</div>
            </div>
            <h2>TOTAL TO PAY: $10009</h2>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
