import { React, useState } from "react";
import { withRouter } from "react-router-dom";
import CreateForm from "./forms/CreateForm";
import SelectForm from "./forms/SelectForm";
import PaymentForm from "./forms/PaymentForm";
import "./App.css";

const HomePage = () => {
  const [message, setMessage] = useState({});
  // const oldConsole = console;

  const updateMessage = (data) => {
    console.log(data)
    setMessage(data);
  };

  return (
    <div className="main">
      <div className="row">
        <div className="square">
          {/* <CreateForm updateMessage={updateMessage} /> */}
          <pre>4242424242424242</pre>
        </div>
        <div className="square">
          <PaymentForm updateMessage={updateMessage} />
        </div>
      </div>
      <div className="row">
        <div className="square"></div>
        <div className="square"></div>
      </div>
      <div className="row">
        <div className="console">
          <pre>
            <h4 className="section">1. create customer</h4>
            {/* <li>customer_name: {JSON.stringify(customer.name)}</li>
            <li>customer_id: {JSON.stringify(customer.id)}</li>
            <li>customer_email: {JSON.stringify(customer.email)}</li> */}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default withRouter(HomePage);
