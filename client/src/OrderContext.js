import React, { useContext, useState } from "react";

// const ThemeUpdateContext = React.createContext();

export function useTheme() {
  return useContext(OrderContext);
}

export const OrderContext = React.createContext();
export const OrderProvider = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState({
    id: "",
    object: "payment_method",
    billing_details: {},
    card: {
      brand: "",
      last4: "",
      country: "",
      exp_month: 11,
      exp_year: 1111,
      wallet: {
        type: ""
      }
    },
  });

  const [paymentIntent, setPaymentIntent] = useState({});


  const [orderDetails, setOrderDetails] = useState({
    total: 1,
    payments: 1,
    initialPayment: 1,
    currency: "",
  });

  const [studentInfo, setStudentInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthYear: "",
  });

  const [studentAddress, setStudentAddress] = useState({
    line1: "",
    line2: "",
    country: "",
    postal: "",
    city: "",
    state: "",
    phoneCountry: "",
    phoneNumber: "",
  });

  const [studentBillingAddress, setStudentBillingAddress] = useState({
    line1: "",
    line2: "",
    country: "",
    postal: "",
    city: "",
    state: "",
    phoneCountry: "",
    phoneNumber: "",
  });

  return (
    <OrderContext.Provider
      value={{
        paymentMethod,
        setPaymentMethod,
        studentInfo,
        setStudentInfo,
        studentAddress,
        setStudentAddress,
        orderDetails,
        setOrderDetails,
        studentBillingAddress,
        setStudentBillingAddress,
        paymentIntent,
        setPaymentIntent
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
