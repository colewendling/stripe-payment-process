import {React, useState, useEffect }from "react";
import { withRouter } from "react-router-dom";
import "../App.css";
import StatusMessages, { useMessages } from "../StatusMessages";
import {
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";


const CreateForm = ({ updateMessage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("Cole Wendling");
  const [email, setEmail] = useState("cole.wendling@example.com");
  const [customer, setCustomer] = useState({});
  const [status, setStatus] = useState("");
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
    })
    .then((res) => res.json())
    
           addMessage("Customer Created.");

    // updateMessage(customer);
    // setCustomer(customer)
    // console.log(customer)
    // setStatus(`New Customer was created: `, customer);
  };



  return (
    <div className="create-form">
      <h3>1. create customer</h3>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Create Customer</button>
      </form>
      <StatusMessages messages={messages} />
    </div>
  );
};

export default withRouter(CreateForm);
