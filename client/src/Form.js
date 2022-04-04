import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import StatusMessages, { useMessages } from "./StatusMessages";
import { CardElement, PaymentRequestButtonElement } from "@stripe/react-stripe-js";

import "./Form.css";
import { Card } from "material-ui";

const Form = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [messages, addMessage] = useMessages();
  const [name, setName] = useState("Fig Moi");
  const [email, setEmail] = useState("fig@test.com");
  const [description, setDescription] = useState("April 3");
  const [amount, setAmount] = useState(300);
  const [number, setNumber] = useState(4242424242424242);
  const [exp_month, setExpMonth] = useState(12);
  const [exp_year, setExpYear] = useState(2024);
  const [cvc, setCvc] = useState(444);

  const [customer, setCustomer] = useState({});
  const [paymentRequest, setPaymentRequest] = useState(null);


  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleAmount = (e) => {
    e.preventDefault();
    setAmount(e.target.value);

    const activeId = e.target.id;
    const unactiveId = activeId === "p-one" ? "p-two" : "p-one";
    const unactiveElement = document.getElementById(unactiveId);
    const activeElement = document.getElementById(activeId);

    activeElement.style.backgroundColor = "var(--accent-color)";
    unactiveElement.style.backgroundColor = "var(--accent-color)";
    activeElement.style.backgroundColor = "green";
  };
  const handleNumber = (e) => {
    const value = Math.floor(e.target.value);
    setNumber(value);
  };
  const handleExpMonth = (e) => {
    const value = Math.floor(e.target.value);
    setExpMonth(value);
  };
  const handleExpYear = (e) => {
    const value = Math.floor(e.target.value);
    setExpYear(value);
  };
  const handleCvc = (e) => {
    const value = Math.floor(e.target.value);
    setCvc(value);
  };

  const [inputField, setInputField] = useState({
    name: name,
    email: email,
    description: description,
    amount: amount,
    number: number,
    exp_month: exp_month,
    exp_year: exp_year,
    cvc: cvc,
    customer: customer,
  });

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }
    const pr = stripe.paymentRequest({
      currency: "usd",
      country: "US",
      requestPayerEmail: true,
      requestPayerName: true,
      total: {
        label: "Demo payment",
        amount: amount,
      },
    });
    pr.canMakePayment().then((result) => {
      if (result) {
        //show some button on the page
        setPaymentRequest(pr);
      }
    });

    pr.on("paymentmethod", async (e) => {
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
          },
          { handleActions: false }
        );

      if (stripeError) {
        // Show error to customer (e.g., insufficient funds)
        addMessage(stripeError.message);
        return;
      }

      // Show a success message to customer
      addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    });
  }, [stripe, elements, addMessage]);

  //  0. Init Git
  //  1. Create a customer
  //  2. Collect the payment information securely using Stripe.js
  //  3. Attach the PaymentMethod to the Customer
  //  4. (Optionally) save that as the invoice settings default payment method (because you can pass the PaymentMethod to the Subscription creation as a default payment method, but it's good practice so that you can start Subscriptions for that Customer with the same payment method)
  //  5. Create a Subscription
  //  6. Provision your service
  //  7. Take into account SCA/3DS and handle authentication [2]

  const handleSubmit = async (e) => {
   e.preventDefault();
   if(!stripe || !elements) {
     return;
   }
   addMessage('Creating payment Intent.')

   //Create payment intent on the server
   const { clientSecret } = await fetch("/create-payment-intent", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       paymentMethodType: 'card',
       currency: 'usd'

     }),
   }).then((r) => r.json());

    addMessage("Payment Intent created.");

    //Confirm the payment on the client
    const {paymentIntent} = await stripe.confirmCardPayment(
      clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      }
    )
    addMessage(`PaymentIntent (${paymentIntent.id}): ${paymentIntent.status}`)
  }

   const handleCustomer = async (e) => {

     const {} = await fetch("/payment-sheet", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         paymentMethodType: "card",
         currency: "usd",
         name: name,
         email: email,
         description: description,
         amount: amount,
         number: number,
         exp_month: exp_month,
         exp_year: exp_year,
         cvc: cvc,
       }),
     }).then((r) => r.json());
   }
  

  return (
    <div className="main">
      <div>
        <div className="p-row">
          <div className="s-half">
            <h4>stripe listen --forward-to localhost:4242/webhook</h4>
            <h4>ngrok http 3000 --host-header=rewrite</h4>
          </div>
          <div className="s-half">
            <label>
              plan 1
              <button
                id="p-one"
                name="amount"
                value={300}
                onClick={handleAmount}
                className="s-box"
              >
                $8.00/mo
              </button>
            </label>
            <label>
              plan 2
              <button
                id="p-two"
                name="amount"
                value={800}
                onClick={handleAmount}
                className="s-box"
              >
                $3.00/mo
              </button>
            </label>
          </div>
        </div>
        <div className="p-row">
          <div className="half">
            <label>
              name
              <input
                label="name"
                type="text"
                name="name"
                value={name}
                onChange={handleName}
                required
              />
            </label>
            <label>
              email
              <input
                label="email"
                type="text"
                name="email"
                value={email}
                onChange={handleEmail}
                required
              />
            </label>
            <button onClick={handleCustomer} className="pay-button">
              Create Customer
            </button>

          </div>
          <div className="half">
            {/* <form onSubmit={handleSubmit}>
              <label htmlFor="card-element">Card</label>
              <h4>4242424242424242</h4> */}
            {/* <CardElement id="card-element" /> */}
            {/* <div> */}
            {/* {paymentRequest && (
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              )} */}
            {/* </div> */}
            {/* <button className="pay-button">Pay</button> */}
            {/* </form> */}
            <label>
              number
              <input
                label="number"
                type="text"
                name="number"
                onChange={handleNumber}
                value={number}
                required
              />
            </label>
            <label>
              exp_month
              <input
                label="exp_month"
                type="text"
                name="exp_month"
                onChange={handleExpMonth}
                value={exp_month}
                required
              />
            </label>
            <label>
              exp_year
              <input
                label="exp_year"
                type="text"
                name="exp_year"
                onChange={handleExpYear}
                value={exp_year}
                required
              />
            </label>
            <label>
              cvc
              <input
                label="cvc"
                type="text"
                name="cvc"
                onChange={handleCvc}
                value={cvc}
                required
              />
            </label>
          </div>
          <button id="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      <div className="row">
        <div className="p-console">
          <StatusMessages messages={messages} />
          <pre>
            <li className="customer">name: {JSON.stringify(name)}</li>
            <li className="customer">email: {JSON.stringify(email)}</li>
            <li className="product">
              description: {JSON.stringify(description)}
            </li>
            <li className="product">amount: {JSON.stringify(amount)}</li>
          </pre>
          <pre>
            <li className="card">number: {JSON.stringify(number)}</li>
            <li className="card">exp_month: {JSON.stringify(exp_month)}</li>
            <li className="card">exp_year: {JSON.stringify(exp_year)}</li>
            <li className="card">cvc: {JSON.stringify(cvc)}</li>
            <li className="product">customer: {JSON.stringify(customer)}</li>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Form);
