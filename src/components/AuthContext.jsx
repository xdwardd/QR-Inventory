/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedUser = localStorage.getItem("auth_user");
    return !!storedUser; // Convert to boolean
  });
  const [user, setUser] = useState(null);
  const [previousRoute, setPreviousRoute] = useState();

  useEffect(() => {
    // Retrieve user data from local storage on component mount
    const storedUser = localStorage.getItem("auth_user");
    const storedPreviousRoute = localStorage.getItem("previousRoute");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      // Check if there is a previous route stored and set it
      if (storedPreviousRoute) {
        setPreviousRoute(storedPreviousRoute);
      }
    }
  }, []);

  //check token 
   const [token, setToken] = useState(localStorage.getItem("access_token"));
   const [isTokenExpired, setIsTokenExpired] = useState(false);
    useEffect(() => {
      const checkTokenExpiration = () => {
        const tokenExpiryTime = localStorage.getItem("token_expiry");

        if (!tokenExpiryTime) return;

        if (new Date().getTime() > tokenExpiryTime) {
          setIsTokenExpired(true);
        }
      };

      checkTokenExpiration();
      const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

      return () => clearInterval(interval);
    }, []);

  // Login function
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);

    // Store user data in local storage
    localStorage.setItem("auth_user", JSON.stringify(userData));
    localStorage.setItem("previousRoute", window.location.pathname);
    // localStorage.setItem("access_token")
    // localStorage.setItem("presentRoute", "/inventory/assetmanagement");

    // console.log(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("previousRoute", window.location.pathname);
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry")
    // Clear the previous route when logging out
    setPreviousRoute(null);
  };

  const rememberRoute = () => {
    // Store the current route in local storage
    localStorage.setItem("previousRoute", window.location.pathname);
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        login,
        logout,
        rememberRoute,
        previousRoute,
        token,
        setToken,
        isTokenExpired,
        setIsTokenExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
