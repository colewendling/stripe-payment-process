import React, { useState, useEffect, useContext } from "react";
import { OrderContext } from "./OrderContext";

const Cart = () => {
  const orderCtx = useContext(OrderContext);
  const orderDetails = orderCtx.orderDetails;
  const setOrderDetails = orderCtx.setOrderDetails;

  const handleOrderDetails = () => {
    setOrderDetails({
      total: 10000,
      payments: 10,
      initialPayment: 1000,
      currency: "usd"
    });
  };

  return (
    <React.Fragment>
      <div className="cart">
        <h1>0. Cart</h1>
        <button className="order-item" onClick={handleOrderDetails}>Set Order Details</button>
        <pre className="order-item">
          {JSON.stringify(orderDetails, null, 2)}
        </pre>
      </div>
    </React.Fragment>
  );
};

export default Cart;
