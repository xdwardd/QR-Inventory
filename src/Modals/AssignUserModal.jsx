/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import { toast } from "react-toastify";

//Data
const initialData = {
  asset_code: "",
  date_received: "",
  item_name: "",
  received_date: "",
  warranty: "",
  date_expire: "",
  serial_number: "",
  description: "",
  assign_user: "",
};

const AssignUserModal = ({ open, onClose, disableBackdropClick }) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false); // Shared loading state

  const formRef = useRef();

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\s+/g, " "); // Remove whitespace
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  function onSubmit(event) {
    event.preventDefault();

    setIsLoading(true); // Start loading
    setTimeout(() => {
      // Simulate a delay of 2 seconds
      setIsLoading(false); // Stop loading
      toast.success("Assigned Successfully!"); // Display success message
      //reset form
      setFormData({
        initialData,
      });

      //reset form after submission
      formRef.current.reset();
    }, 3000);
  }
  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button> */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={onClose}
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "900px", // Adjust the height as needed
          },
        }}
      >
        <DialogTitle>
          <div className="mt-4">Assign User</div>
        </DialogTitle>
        <DialogContent>
          <div>
            <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
              {/* <CircularProgress color="inher" />  */}
              <Loaders />
            </Backdrop>
            <div className="mt-2 bg-slate-400 w-full ">
              <form
                action=""
                className="p-6 w-full"
                ref={formRef}
                onSubmit={onSubmit}
              >
                <div className="grid grid-cols-4 gap-2">
                  <div className="">
                    <label
                      htmlFor="asset_code"
                      className="block text-left text-sm text-gray-700"
                    >
                      Asset Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="asset_code"
                      name="asset_code"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="">
                    <label
                      htmlFor="date_received"
                      className="block text-left text-sm text-gray-700"
                    >
                      Date Received <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_received"
                      name="date_received"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full  pt-3 p-2.5  "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-subgrid gap-4 col-span-2">
                    <div className="col-start-2"></div>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="item_name"
                      className="block text-left text-sm text-gray-700"
                    >
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="item_name"
                      name="item_name"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-left text-sm text-gray-700"
                    >
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-left  text-sm text-gray-700"
                    >
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="da"
                      className="block text-left text-sm text-gray-700"
                    >
                      Date Recieved <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="userId"
                      name="userId"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full pt-3 p-2.5 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="warranty"
                      className="block text-left text-sm text-gray-700"
                    >
                      Warranty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="warranty"
                      name="warranty"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date_expire"
                      className="block text-left text-sm text-gray-700"
                    >
                      Expiration Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_expire"
                      name="date_expire"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full pt-3 p-2.5"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="model_number"
                      className="block text-left text-sm text-gray-700"
                    >
                      Model Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="model_number"
                      name="model_number"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="serial_number"
                      className="block text-left text-sm text-gray-700"
                    >
                      Serial Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="serial_number"
                      name="serial_number"
                      className="bg-gray-50 border border-gray-400 text-gray-600 text-sm outline-none block w-full p-3 "
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </div>
                  <textarea
                    className="resize-none border border-gray-400 rounded-md p-2 w-full h-40 "
                    name="description"
                    onChange={handleInputChange}
                    placeholder="Enter your text here..."
                    required
                  />
                </div>

                <div className="mb-4 mt-1">
                  <label
                    htmlFor="Assign User"
                    className="block text-sm font-medium text-gray-600 dark:text-white"
                  >
                    Assign User
                  </label>
                  <select
                    id="assign_user"
                    name="assign_user"
                    className="border border-gray-400 text-gray-600 text-sm w-96 block p-3 outline-none "
                    onChange={handleInputChange}
                  >
                    <option value="user1">User One</option>
                    <option value="user2">User Two</option>
                    <option value="user3">User Three</option>
                    <option value="user4">User Four</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-600 tracking-wider px-8 py-2 rounded-md  text-white font-bold hover:bg-blue-700">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AssignUserModal;
