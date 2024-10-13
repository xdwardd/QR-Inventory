/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-grow items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-7xl text-blue-500 tracking-tight font-extrabold ">
          404 Not Found
        </h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-500 md:text-4xl dark:text-white">
          Something's missing.
        </p>
        <p className="text-gray-600 text-2xl">
          Oops! The page you are looking for could not be found.
        </p>
        <a
          href="/"
          className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          {" "}
          Go back to Login{" "}
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
