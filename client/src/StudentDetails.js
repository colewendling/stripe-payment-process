import React, { useState, useEffect, useContext } from "react";
import { OrderContext } from "./OrderContext";

const StudentDetails = () => {
  const orderCtx = useContext(OrderContext);

  const studentInfo = orderCtx.studentInfo;
  const setStudentInfo = orderCtx.setStudentInfo;
  const studentAddress = orderCtx.studentAddress;
  const setStudentAddress = orderCtx.setStudentAddress;

  const handleStudentInfo = () => {
    setStudentInfo({
      firstName: "Cole",
      lastName: "Wendling",
      email: "cole@wendling.io",
      birthYear: "2000",
    });
  }

    const handleStudentAddress = () => {
      setStudentAddress({
        line1: "3720 US HWY 380 WEST",
        line2: "",
        country: "US",
        postal: "76234",
        city: "Decatur",
        state: "TX",
        phoneCountry: "1",
        phoneNumber: "9403935061",
      });
    };

  return (
    <React.Fragment>
      <div className="student-details">
        <h1>1. Student Details</h1>
        <button onClick={handleStudentInfo} className="student-item">
          Set Student Info
        </button>
        <button onClick={handleStudentAddress} className="student-item">
          Set Student Address
        </button>
        <div className="row">
        <pre className="student-item">
          {JSON.stringify(studentInfo, null, 2)}
        </pre>
        <pre className="student-item">
          {JSON.stringify(studentAddress, null, 2)}
        </pre>
        </div>
      </div>
    </React.Fragment>
  );
};

export default StudentDetails;
