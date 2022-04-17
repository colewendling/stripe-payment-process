import React, { useState, useEffect, useContext } from "react";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import StatusMessages, { useMessages } from "./StatusMessages";
import { PaymentRequestButtonElement } from "@stripe/react-stripe-js";

import { useTheme, useThemeUpdate } from "./themeContext";
import { ThemeContext } from "./themeContext";

const Form = () => {
  const stripe = useStripe();
  const elements = useElements();
  const themeCtx = useContext(ThemeContext)
  const paymentMethod = themeCtx.paymentMethod;
  const togglePaymentMethod = themeCtx.togglePaymentMethod;


  const [messages, addMessage] = useMessages();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (!stripe || !elements) {
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
        amount: 1000,
      },
    });
    console.log(`paymentRequest`, pr);

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (e) => {
      console.log(`e`, e.paymentMethod);
      togglePaymentMethod(e.paymentMethod);

      const { error: backendError, clientSecret } = await fetch(
        "/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodType: "card",
            currency: "usd",
            amount: amount,
            customerEmail: e.paymentMethod.billing_details.email,
            customerName: e.paymentMethod.billing_details.name,
            customerPhone: e.paymentMethod.billing_details.phone,
            paymentMethodId: e.id,
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
            payment_method: e.paymentMethod.id,
            setup_future_usage: "off_session"
          },
          { handleActions: false }
        );

      if (stripeError) {
        // Show error to customer (e.g., insufficient funds)
        e.complete("fail");
        addMessage(stripeError.message);
        return;
      }

      // Show a success message to customer
      e.complete("success");
      // handlePaymentIntent(paymentIntent);
      // addMessage(`Payment INTENT: ${ JSON.stringify(paymentIntent)}`);

      // console.log(`paymentIntent`, paymentIntent)
      // addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    });
  }, [stripe, elements]);

  return (
    <div>
      {paymentRequest && (
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      )}
      <StatusMessages messages={messages} />
      <pre>{JSON.stringify(paymentMethod, null, 2)}</pre>
    </div>
  );
};

export default Form;
