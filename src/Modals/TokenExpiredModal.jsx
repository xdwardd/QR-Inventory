import React, {useState} from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Loaders from "../utils/Loaders";

const TokenExpiredModal = () => {
  const { isTokenExpired, setIsTokenExpired, setToken } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginRedirect = () => {
    setIsLoading(true)
    setTimeout(() => {
      setToken(null);
      setIsLoading(false)
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_expiry");
      setIsTokenExpired(false); // Close the modal
      navigate("/");
    }, 3000);
 
  };
  

  if (!isTokenExpired) return null;

  console.log(isTokenExpired);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isTokenExpired}
      sx={{
        "& .MuiDialog-paper": {
          height: "250px", // Adjust the height as needed
        },
      }}
    >
      <Backdrop
        open={isLoading}
        sx={{
          color: "#fff",
          zIndex: 1200,
        }}
      >
        <Loaders />
      </Backdrop>
      {/* <DialogTitle>Session Expired</DialogTitle> */}
      <DialogContent>
        <div className="p-6 mt-6 ">
          <div className="text-xl font-bold text-gray-600 ">
           User Session Expired
          </div>
          <div className="mt-4 flex flex-row gap-2">
            <p className="text-md">
              You have been logged out. Please log in again.
            </p>
            <div
              className="font-bold text-blue-500 cursor-pointer hover:underline hover:text-blue-700"
              onClick={handleLoginRedirect}
            >
              Login
            </div>
          </div>

          {/* <div className="flex flex-row justify-end mt-8 space-x-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginRedirect}
            >
              Login
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenExpiredModal;
