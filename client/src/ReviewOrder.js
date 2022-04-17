import React, { useState, useEffect, useContext } from "react";
import { OrderContext } from "./OrderContext";
import StatusMessages, { useMessages } from "./StatusMessages";
import { useElements, useStripe } from "@stripe/react-stripe-js";

const ReviewOrder = () => {
   const stripe = useStripe();
   const elements = useElements();
  const orderCtx = useContext(OrderContext);
  const StudentInfo = orderCtx.studentInfo;
  const paymentMethod = orderCtx.paymentMethod;
  const orderDetails = orderCtx.orderDetails;
  const [messages, addMessage] = useMessages();

  const brand = paymentMethod.card.brand;
  const exp_month = paymentMethod.card.exp_month;
  const exp_year = paymentMethod.card.exp_year;
  const last4 = paymentMethod.card.last4;
  const wallet = paymentMethod.card.wallet.type;

  
  const [terms, setTerms] = useState(false);

  const handleTerms = () => {
    const opposite = !terms
    setTerms(opposite)
  }

  const handleCheckout = async () => {
    const { error: backendError, clientSecret } = await fetch(
      "/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodType: "card",
          currency: orderDetails.currency,
          amount: orderDetails.initialPayment,
          customerEmail: StudentInfo.email,
          customerName: paymentMethod.billing_details.name,
          customerPhone: StudentInfo.phone,
          paymentMethodId: paymentMethod.id,
          card: paymentMethod.card
        }),
      }
    ).then((r) => r.json());
          if (backendError) {
            addMessage(backendError.message);
            return;
          }

          addMessage("Client secret returned");

          const { error: stripeError, paymentIntent } =
            await stripe.confirmCardPayment(
              clientSecret,
              {
                payment_method: paymentMethod.id,
                setup_future_usage: "off_session"
              },
              { handleActions: false }
            );

          if (stripeError) {
            addMessage(stripeError.message);
            return;
          }

          console.log(`paymentIntent`, paymentIntent)
      }

  return (
    <React.Fragment>
      <div className="review-order">
        <h1>3. Review Order</h1>
        <pre className="review-item">
          {JSON.stringify(StudentInfo, null, 2)}
        </pre>
        <div className="review-item">{`Wallet Used: ${wallet}`}</div>
        <div className="review-item">{`${brand} ending in ${last4}`}</div>
        <div className="review-item">{`Expiration Date: ${exp_month}/${exp_year}`}</div>
        <button onClick={handleTerms}>Terms and Services ?</button>
        {terms && (
          <button className="place-order" onClick={handleCheckout}>Place Order</button>
        )}
      </div>
    </React.Fragment>
  );
};

export default ReviewOrder;
