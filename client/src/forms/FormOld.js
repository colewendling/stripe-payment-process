import { React, useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import StatusMessages, { useMessages } from "../StatusMessages";
import "./Form.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Form = () => {
  const elements = useElements();
  const stripe = useStripe();
  
  // const [amount, setAmount] = useState(300);

  // const [name, setName] = useState("Susan Example");
  // const [email, setEmail] = useState("susan@example.com");

  // const [number, setNumber] = useState(4242424242424242);
  // const [exp_month, setExpiryMonth] = useState(12);
  // const [exp_year, setExpiryYear] = useState(2024);
  // const [cvc, setCvc] = useState(444);

  const [state, setState] = useState({ 
    name: 'Michael',
    email: '',
    amount: 300,
    number: 1,
    exp_month: 12,
    exp_year: 2024,
    cvc: 444 
  });

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false // toggle flag after first render/mounting
      return;
    }
    console.log(state) // do something after state has updated
  }, [state])
 

  const handleClick = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    addMessage(`Amount Changed to: `, amount);
  };

   const handleAmount = (e) => {
     const newAmount = e.target.value;
     console.log(newAmount)
     setAmount(e.target.value);
   };

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
    console.log(customer);

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
    <div className="p-form">
      <div className="product-container">
        <button value={300} onClick={setState({amount: 300})} className="product-box">
          $3.00/mo
        </button>
        <button value={800} onClick={handleAmount} className="product-box">
          $8.00/mo
        </button>
        <div className="product-box">
          amount:
          <div>
            {/* {(`Amount: `, state.amount + '.00')} */}
          </div>
          </div>
      </div>
      <h3 className="p-title">1. card payment</h3>
      <form onSubmit={handleSubmit}>
        {/* <label>
          name
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          email
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          number
          <input
            type="text"
            name="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </label>
        <label>
          cvc
          <input
            type="text"
            name="cvc"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            required
          />
        </label>
        <label>
          exp_month
          <input
            type="text"
            name="exp_month"
            value={exp_month}
            onChange={(e) => setExpiryMonth(e.target.value)}
            required
          />
        </label> */}
        {/* <label>
          exp_year
          <input
            type="text"
            name="exp_year"
            value={exp_year}
            onChange={(e) => setExpiryYear(e.target.value)}
            required
          />
        </label> */}

        {/* <CardElement id="card-element" /> */}
        <button>Submit</button>
      </form>
      <StatusMessages messages={messages} />
    </div>
  );
};

export default withRouter(Form);
