import React, { useState, useEffect, useContext } from "react";
import {
  useElements,
  useStripe,
  paymentIntents,
} from "@stripe/react-stripe-js";
import { PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { OrderContext } from "./OrderContext";
import StudentDetails from "./StudentDetails";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const orderCtx = useContext(OrderContext);

  const [paymentRequest, setPaymentRequest] = useState(null);

  const paymentMethod = orderCtx.paymentMethod;
  const setPaymentMethod = orderCtx.setPaymentMethod;

  const paymentIntent = orderCtx.paymentIntent;
  const setPaymentIntent = orderCtx.setPaymentIntent;

  const studentInfo = orderCtx.studentInfo;
  const studentAddress = orderCtx.studentAddress;
  const studentBillingAddress = orderCtx.studentBillingAddress;

  const setStudentBillingAddress = orderCtx.setStudentBillingAddress;

  const amount = orderCtx.orderDetails.initialPayment;
  const currency = orderCtx.orderDetails.currency;

  let shouldSet = false;

  const handleStudentBillingAddress = (e) => {
    shouldSet = !shouldSet;

    if (shouldSet) {
      setStudentBillingAddress(studentAddress);
    } else {
      setStudentBillingAddress({
        line1: "",
        line2: "",
        country: "",
        postal: "",
        city: "",
        state: "",
        phoneCountry: "",
        phoneNumber: "",
      });
    }
  };

  useEffect(() => {
    if (!stripe || !elements || amount < 10) {
      return;
    }

    const pr = stripe.paymentRequest({
      currency: "usd",
      country: "US",
      requestPayerEmail: true,
      requestPayerName: true,
      requestPayerPhone: true,

      total: {
        label: "Demo payment",
        amount: amount,
      },
    });
    console.log(`paymentRequest`, pr);

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (e) => {
      if (!stripe || !elements) {
        return;
      }
      console.log(`e`, e.paymentMethod);
      setPaymentMethod(e.paymentMethod);

      // const { error: backendError, clientSecret } = await fetch(
      //   "/create-payment-intent",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       paymentMethodType: e.paymentMethod.type,
      //       currency: currency,
      //       amount: amount,
      //       customerEmail: e.paymentMethod.billing_details.email,
      //       customerName: e.paymentMethod.billing_details.name,
      //       customerPhone: e.paymentMethod.billing_details.phone,
      //       paymentMethodId: e.id,
      //     }),
      //   }
      // ).then((r) => r.json());
      // if (backendError) {
      //   addMessage(backendError.message);
      //   return;
      // }

      // const pi = await stripe.paymentIntents.create({
      //   amount: amount,
      //   currency: currency,
      //   payment_method: e.paymentMethod.id,
      //   setup_future_usage: "off_session",
      // });

      // console.log(`paymentIntent`, pi);

      // const { error: stripeError, paymentIntent } =
      //   await stripe.confirmCardPayment(
      //     clientSecret,
      //     {
      //       payment_method: e.paymentMethod.id,
      //       setup_future_usage: "off_session"
      //     },
      //     { handleActions: false }
      //   );

      // if (stripeError) {
      //   // Show error to customer (e.g., insufficient funds)
      //   e.complete("fail");
      //   addMessage(stripeError.message);
      //   return;
      // }

      // Show a success message to customer
      e.complete("success");
      // handlePaymentIntent(paymentIntent);
      // addMessage(`Payment INTENT: ${ JSON.stringify(paymentIntent)}`);

      // console.log(`paymentIntent`, paymentIntent)
      // addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    });
  }, [stripe, elements, amount]);

  return (
    <React.Fragment>
      <div className="payment">
        <h1>2. Payment</h1>
        <button onClick={handleStudentBillingAddress}>
          billing same as shipping
        </button>
        <div className="payment-item">
          {paymentRequest ? (
            <PaymentRequestButtonElement options={{ paymentRequest }} />
          ) : (
            <div className="spacer"></div>
          )}
        </div>
        <pre className="payment-item">
          {JSON.stringify(paymentMethod.id, null, 2)}
        </pre>
        <div className="row">
          <pre className="payment-item">
            {JSON.stringify(studentInfo, null, 2)}
          </pre>
          <pre className="payment-item">
            {JSON.stringify(studentAddress, null, 2)}
          </pre>
          <pre className="payment-item">
            {JSON.stringify(studentBillingAddress, null, 2)}
          </pre>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Payment;
