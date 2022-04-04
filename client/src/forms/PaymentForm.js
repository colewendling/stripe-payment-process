import { React, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import StatusMessages, { useMessages } from "../StatusMessages";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const PaymentForm = () => {
  const elements = useElements();
  const stripe = useStripe();

  const [name, setName] = useState("Susan Example");
  const [email, setEmail] = useState("susan@example.com");
  const [customer, setCustomer] = useState(null);

  const [messages, addMessage] = useMessages();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    addMessage("Creating Customer.....");

    const { customer } = await fetch("/create-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
      }),
    }).then((res) => res.json());
    console.log(customer)

    addMessage("Customer Created.");

    await sleep(300);

    addMessage("Creating Payment Intent.....");
    // Create payment intent on the server.
    const { clientSecret } = await fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customer.id,
        paymentMethodType: "card",
        currency: "usd",
      }),
    }).then((res) => res.json());

    addMessage("Payment Intent Created");

    // Confrim the payment on the client
    stripe.confirmCardPayment(clientSecret, {
      payment_method: "",
    });
  };

  return (
    <div className="payment-form">
      <h3>3. submit card payment</h3>
      <form id="payment-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label htmlFor="card-element">Card</label>
        <CardElement id="card-element" />
        <button>Pay</button>
      </form>
      <StatusMessages messages={messages} />
    </div>
  );
};

export default withRouter(PaymentForm);
