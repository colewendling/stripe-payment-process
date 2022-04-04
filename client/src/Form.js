import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { useElements, useStripe } from "@stripe/react-stripe-js";
import StatusMessages, { useMessages } from "./StatusMessages";

import "./Form.css";

const Form = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("Michael Test");
  const [email, setEmail] = useState("michael@test.com");
  const [description, setDescription] = useState("April 3");
  const [amount, setAmount] = useState(300);
  const [number, setNumber] = useState(4242424242424242);
  const [exp_month, setExpMonth] = useState(12);
  const [exp_year, setExpYear] = useState(2024);
  const [cvc, setCvc] = useState(444);

  const [customer, setCustomer] = useState({});

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

  //  0. Init Git
  //  1. Create a customer
  //  2. Collect the payment information securely using Stripe.js
  //  3. Attach the PaymentMethod to the Customer
  //  4. (Optionally) save that as the invoice settings default payment method (because you can pass the PaymentMethod to the Subscription creation as a default payment method, but it's good practice so that you can start Subscriptions for that Customer with the same payment method)
  //  5. Create a Subscription
  //  6. Provision your service
  //  7. Take into account SCA/3DS and handle authentication [2]

  const handleSubmit = () => {
    alert(inputField);
  };



  return (
    <div className="main">
      <div>
        <div className="p-row">
           <div className="p-row">
          <label>
            plan 1
            <button
              id="p-one"
              name="amount"
              value={300}
              onClick={handleAmount}
              className="p-box"
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
              className="p-box"
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
          </div>
          <div className="half">
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
          <button id="submit-button" onclick={handleSubmit}>Submit</button>
          
        </div>
      </div>
      <div className="row">
        <div className="p-console">
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
          </pre>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Form);
