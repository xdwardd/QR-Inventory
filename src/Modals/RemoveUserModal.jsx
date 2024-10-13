/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import axios from "axios";
import { toast } from "react-toastify";
import { removeAccessRoute } from "../utils/inventoryApiEnpoints";

const RemoveUserModal = ({
  open,
  onClose,
  selectedRow,
  disableBackdropClick,
  getUserManagement,
  setOpenRemoveAccessModal,
  user
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };
  const removeUserAccess = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        removeAccessRoute,
        { emp_id: selectedRow.emp_id, creator_id: user && user[0].emp_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      console.log(response);
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          setOpenRemoveAccessModal(false);
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          toast.success("Access Removed!"); // Display success message
          getUserManagement();
        }, 3000);
      } else {
        toast.error("Error Ouccured!");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {/* Display Loading */}

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "270px",
            width: "600px", // Adjust the height as needed
          },
        }}
      >
        <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
          <Loaders />
        </Backdrop>
        <DialogTitle>
          {/* <div className="mt-4">For Process (Assets From E-Purchasing)</div> */}
        </DialogTitle>
        <DialogContent>
          <div className="p-6">
            <div className="text-xl font-bold text-gray-600">
              Confirm Action
            </div>
            {selectedRow && (
              <p className="mt-4 text-md ">
                Are you sure you want to remove{" "}
                <span className="font-bold">{selectedRow.emp_name}</span>?
              </p>
            )}

            <div className="flex flex-row justify-end mt-8 space-x-4">
              <button
                className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                onClick={removeUserAccess}
              >
                Yes
              </button>
              <button
                className="bg-red-600 py-2 px-6 shadow-red-400 shadow-lg rounded-md font-medium text-white hover:bg-red-700"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default RemoveUserModal;
