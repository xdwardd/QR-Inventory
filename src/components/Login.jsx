/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "./AuthContext";
import { inventorylogin } from "../utils/inventoryApiEnpoints";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";



const Login = ({
  screens,
  // getPendingItems,
  getRegisteredItems,
  getStorageLocation,
  getItems,
  getForItemApproval,
  getAvailableItem,
  getUserList,
}) => {
  const { isAuthenticated, login, rememberRoute, previousRoute, setUser } =
    useAuth();
  const [loginData, setLoginData] = useState({
    Username: "",
    Userpassword: "",
    ip: "",
    sysName: "WDB-INVENTORY",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordVisibilityToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async () => {
    if (loginData.Username == "") {
      toast.error("User ID is required!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(inventorylogin, loginData);

      login(response.data.data);
      if (response.data.data[0].retVal == 0) {
        setIsLoading(false);
        toast.error(response.data.data[0].errmsg);
        localStorage.removeItem("auth_user");
        return;
      } else {
        setTimeout(() => {
          // setIsLoading(false);
          localStorage.setItem(
            "access_token",
            response.data.token.access_token
          );
          const expiryTime =
            new Date().getTime() + response.data.token.token_expiry * 1000;
          localStorage.setItem("token_expiry", expiryTime);
          const userDefaultScreen = screens.find(
            ({ screen_id }) => screen_id == response.data.data[0].screen_id
          );

          // Ensure token is set before making the call to getPendingItems
          setIsLoading(false);
          // getPendingItems();
          getRegisteredItems();
          getStorageLocation();
          getItems();
          getForItemApproval();
          getAvailableItem();
          getUserList();
          navigate(userDefaultScreen.path);
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("No response from server!");
      setUser(null);
      // localStorage.removeItem("auth_user", JSON.stringify(userData));
      return;
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\s+/g, " "); // Remove whitespace
    setLoginData({
      ...loginData,
      [event.target.name]: value,
    });
  };

  if (isAuthenticated) {
    // Navigate to the previous page
    <Navigate to={previousRoute} />;
  }

  return (
    <>
      <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
        <Loaders />
      </Backdrop>

      <div className="h-screen bg-white flex justify-center items-center w-full">
        <form className="relative z-10 bg-white shadow-2xl mt-4 mx-auto border rounded p-8 w-[32rem] h-[28rem]">
          <div className="text-center mb-6">
            <p className="text-2xl font-semibold  text-gray-600">
              QR-INVENTORY SYSTEM
            </p>
          </div>
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-left mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              User ID
            </label>
            <input
              type="text"
              id="username"
              name="Username"
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg outline-none block w-full p-3 "
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-5 ">
            <label
              htmlFor="password"
              className="block text-left mb-2 text-sm font-medium text-gray-600 dark:text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="password"
                name="Userpassword"
                className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg outline-none block w-full p-3 "
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                onClick={handlePasswordVisibilityToggle}
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                />
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center mt-10">
            <button
              type="button"
              id="login"
              className="w-full text-lg font-bold text-white bg-gradient-to-l from-sky-500 to-indigo-500 px-6 py-4 rounded-md border hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600  "
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </form>
        <footer className="w-full absolute bottom-0 left-0 right-0 z-0">
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="w-full h-64" // Set the height of the SVG
          >
            <path
              d="M0,60 C150,100 350,20 500,60 L500,150 L0,150 Z"
              fill="rgb(32, 129, 227)" /* Light Steel Blue */
              className="wave-move"
            />
          </svg>
        </footer>

        {/* CSS for wave animation */}
        <style>{`
          @keyframes waveAnimation {
            0% {
              d: path("M0,60 C150,100 350,20 500,60 L500,150 L0,150 Z");
            }
            100% {
              d: path("M0,60 C150,20 350,100 500,60 L500,150 L0,150 Z");
            }
          }

          .wave-move {
            animation: waveAnimation 6s infinite alternate ease-in-out;
          }
        `}</style>
      </div>

      {/* Wave Footer Section */}
      {/* Moving Wave Footer */}
    </>
  );
};

export default Login;
