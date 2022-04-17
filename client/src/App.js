import React from "react";
import { OrderProvider } from "./OrderContext";

import Cart from "./Cart";
import StudentDetails from "./StudentDetails";
import Payment from "./Payment";
import ReviewOrder from "./ReviewOrder";
import Confirmation from "./Confirmation";
import "./App.css"

export default function App() {
  return (
    <OrderProvider>
      <div className="main">
        <div className="row split">
          <div className="fourth">
            <Cart />
          </div>
          <StudentDetails />
        </div>
        <div className="row">
          <Payment />
        </div>
        <div className="row">
          <ReviewOrder />
        </div>
        <div className="row">
          <Confirmation />
        </div>
      </div>
    </OrderProvider>
  );
}
