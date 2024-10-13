/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState, useRef, useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, Backdrop, Box, TextField } from "@mui/material";
import axios from "axios";

import { toast } from "react-toastify";
import Loaders from "../utils/Loaders";
import dropdowndata from "../utils/dropdowndata";
import { NODE_MAILER_ROUTE, registerItemRoute } from "../utils/inventoryApiEnpoints";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RegisteredPendingItems = ({
  open,
  onClose,
  selectedRow,
  setSelectedRow,
  setOpenRegisterModal,
  getPendingItems,
  getRegisteredItems,
  getForItemApproval,
  storageLocation,
  getStorageLocation,
  gsiadApproverEmail,
  user
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [isLoading, setIsLoading] = useState(false); // Shared loading state
  const [selectedStorageLocation, setSelectedStorageLocation] = useState(null);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setSelectedRow((prevValue) => ({
      ...prevValue,
      [event.target.name]: newValue, // Update the field that triggered the event
    }));
  };



  //warranty
  const [displayWarranty, setDisplayWarranty] = useState("");
  const handleInputWarrantyChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Keep only numeric input
    setSelectedRow({
      ...selectedRow,
      warranty: value,
    });
    setDisplayWarranty(value ? `${value} month/s` : ""); // Check if value is not empty, then add "month/s" else ""
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedStorageLocation(newValue);
  };

  const updatedItem = [
    {
      ...selectedRow,
      ref_id: "0",
      po_id: "0",
      item_id: "0",
      item_name: selectedRow?.item_name.toUpperCase(),
      pending_po_id: selectedRow?.po_id,
      pending_item_id: selectedRow?.item_id,
      generated_pending_id: selectedRow?.generated_pending_id,
      storage_location: selectedStorageLocation?.branch_desc,
      warranty: displayWarranty,
      status: "REGISTRATION FOR APPROVAL",
      creator_id: user && user[0].emp_id,
      creator_role: user && user[0].user_role,
      creator_email: user && user[0].wb_email,
    },
  ];

  // const gsiadApproverEmail =  gsiadApprover.map((item) => item.wb_email);

  /*--------------------Node Mailer--------------------------------------*/
 let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               Asset/s has been created and requires your review/checking/approval. Please review and approve the asset/s using the following link: <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          mail_to: `${gsiadApproverEmail}`,
          cc: `${
            user && user[0].wb_email
          }, campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          subject: "QR Inventory Testing",
          msg: msg,
          systemName: "QR-INVENTORY",
        },
      ]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  /*--------------------Node Mailer--------------------------------------*/

  //i remove id object in selected row
  const updatedRows = updatedItem.map(({ id, ...rest }) => rest);
  
  async function resgisterPendingItems(event) {
    event.preventDefault();

    console.log(updatedRows);
    //words limit
    const description = updatedRows[0].description.trim().split(/\s+/);
    if (description.length > 500) {
      toast.error("Description is too large please input atleast 500 words.");
      return;
    }
    const remarks = updatedRows[0].remarks.trim().split(/\s+/);
    if (remarks.length > 500) {
      toast.error("Remarks is too large please input atleast 500 words");
      return;
    }

    if (updatedRows[0].date_received >= updatedRows[0].date_expire) {
      toast.error(
        "Date expire should not be the same or earlier than date received."
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(registerItemRoute,
        updatedRows,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );

      console.log(response.data[0].retVal);
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          toast.success(response.data[0].rspmsg); // Display success message
          setOpenRegisterModal(false);
           setDisplayWarranty("");
          getPendingItems();
          getRegisteredItems();
          getStorageLocation();
          getForItemApproval();

          //send email
           sendMail();
        }, 2000);
      } else {
        setTimeout(() => {
          toast.error(response.data[0].rspmsg);
          setIsLoading(false);
          setOpenRegisterModal(false);
          setDisplayWarranty("");
          getPendingItems();
          getRegisteredItems();
          getStorageLocation();
          getForItemApproval();

        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        sx={{
          "& .MuiDialog-paper": {
            height: "1000px", // Adjust the height as needed
          },
        }}
      >
        <div className="flex flex-row justify-between">
          <DialogTitle>
            <div className="">Register Pending Assets</div>
          </DialogTitle>
          <DialogActions>
            <FontAwesomeIcon
              icon={faClose}
              className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
              onClick={() => {
                setOpenRegisterModal(false);
                setDisplayWarranty("");
              }}
            />
          </DialogActions>
        </div>

        <DialogContent>
          <div>
            {" "}
            {/* Spinners */}
            <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
              {/* <CircularProgress color="inher" />  */}
              <Loaders />
            </Backdrop>
            <div className="">
              <div className=" bg-slate-400 w-full ">
                {selectedRow && (
                  <form
                    action=""
                    className="p-4 w-full"
                    onSubmit={resgisterPendingItems}
                  >
                    <div className="grid grid-cols-4 gap-2">
                      <div className=" col-span-2">
                        <label
                          htmlFor="asset_code"
                          className="text-left text-xs text-gray-900"
                        >
                          Fixed Asset Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="fixed_asset"
                          name="fixed_asset"
                          value={selectedRow.fixed_asset}
                          className="border bg-slate-300 border-gray-600 text-gray-900 text-xs w-full  block p-2 outline-none "
                          readOnly
                        ></input>
                      </div>
                      {/* <div className="mb-5 col-span-2">
                        <label
                          htmlFor="item_id"
                          className="text-left text-xs text-gray-900"
                        >
                          Item ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="item_id"
                          name="item_id"
                          value={selectedRow.item_id}
                          className="bg-gray-50 border border-gray-600 text-gray-900 text-xs outline-none block  p-2 "
                          onChange={handleInputChange}
                          disabled
                          required
                        />
                      </div> */}
                      <div className="col-span-2">
                        <label
                          htmlFor="item_name"
                          className=" text-left text-xs text-gray-900"
                        >
                          Item Name <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          id="item_name"
                          name="item_name"
                          value={selectedRow.item_name}
                          className=" bg-slate-300 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2"
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-left text-xs text-gray-900"
                        >
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          //  ref={quantityRef}
                          type="number"
                          id="quantity"
                          name="quantity"
                          value={selectedRow.quantity}
                          className="bg-slate-300 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2 "
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-left text-xs text-gray-900"
                        >
                          Price <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          className="bg-gray-300 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2 "
                          value={selectedRow.price} // Display the state value in the input
                          onChange={handleInputChange}
                          disabled
                          // onBlur={handlePriceBlur}
                          // required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="date_received"
                          className="block text-left text-xs text-gray-900"
                        >
                          Date Recieved <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="date_received"
                          name="date_received"
                          value={selectedRow.date_received}
                          className="bg-gray-300 border border-gray-600 text-gray-900 text-xs outline-none block w-full pt-2 p-1.5"
                          // onChange={handleInputChange}
                          // required
                          readOnly  
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="price"
                          className="block text-left text-xs text-gray-900"
                        >
                          Warranty <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="warranty"
                          name="warranty"
                          value={displayWarranty}
                          className="bg-gray-50 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2 "
                          onChange={handleInputWarrantyChange}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="date_expire"
                          className="block text-left text-xs text-gray-900"
                        >
                          Expiration Date{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          //ref={dateExpireRef}
                          type="date"
                          id="date_expire"
                          name="date_expire"
                          className="bg-gray-50 border border-gray-600 text-gray-900 text-xs outline-none block w-full pt-2 p-1.5 "
                          onChange={handleInputChange}
                          //onBlur={handleDateBlur}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="unit"
                          className="block text-left text-xs text-gray-900"
                        >
                          Unit <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="unit"
                          name="unit"
                          value={selectedRow.unit}
                          className="bg-gray-300 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2 "
                          onChange={handleInputChange}
                          required
                          readOnly
                        />
                      </div>
                      <div className="col-span-1">
                        <label
                          htmlFor="item_name"
                          className="block text-left text-xs text-gray-900"
                        >
                          Storage Location{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <Autocomplete
                          className="border text-xs border-gray-600"
                          options={storageLocation}
                          value={selectedStorageLocation}
                          onChange={handleAutocompleteChange}
                          name="storage_location"
                          //  getOptionLabel={(option) => option.branch_desc}
                          getOptionLabel={(option) => option.branch_desc}
                          isOptionEqualToValue={(props, option) => (
                            <Box component="li" {...props}>
                              {option.branch_desc}
                            </Box>
                          )}
                          sx={{
                            //width: "full", // Control the width of the Autocomplete
                            "& .MuiInputBase-root": {
                              height: "32px", // Height of the input field
                              padding: "1.8px 4px 4.5px 5px",
                              borderRadius: "0px",
                              borderWidth: "0px",
                              fontSize: "12px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none", // Remove the default outline border
                            },
                          }}
                          renderInput={(params) => (
                            <TextField
                              name="storage_location"
                              {...params}
                              className="bg-white hover:outline-none"
                              required
                            />
                          )}
                        />
                      </div>
                      {(selectedRow?.fixed_asset ===
                        dropdowndata.getFixedAsset()[0].value ||
                        selectedRow?.fixed_asset ===
                          dropdowndata.getFixedAsset()[2].value) && (
                        <div>
                          <label
                            htmlFor="model_number"
                            className="block text-left text-xs text-gray-900"
                          >
                            Model Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="model_number"
                            name="model_number"
                            className="bg-gray-50 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2 "
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      )}
                      {(selectedRow?.fixed_asset ===
                        dropdowndata.getFixedAsset()[0].value ||
                        selectedRow?.fixed_asset ===
                          dropdowndata.getFixedAsset()[2].value) && (
                        <div className="col-span-2">
                          <>
                            <label
                              htmlFor="serial_number"
                              className="block text-left text-xs text-gray-900"
                            >
                              Serial Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="serial_number"
                              name="serial_number"
                              className="bg-gray-50 border border-gray-600 text-gray-900 text-xs outline-none block w-full p-2"
                              onChange={handleInputChange}
                              required
                            />
                          </>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-900">
                        Description <span className="text-red-500">*</span>
                      </div>
                      <textarea
                        className="resize-none border text-xs border-gray-600 rounded-md p-2 w-full h-24 outline-none "
                        name="description"
                        onChange={handleInputChange}
                        placeholder="Enter your text here..."
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <div className="text-xs text-gray-900">
                        Remarks <span className="text-red-500">*</span>
                      </div>
                      <textarea
                        className="resize-none text-xs border border-gray-600 rounded-md p-2 w-full h-20 outline-none "
                        name="remarks"
                        onChange={handleInputChange}
                        placeholder="Enter your text here..."
                        required
                      />
                    </div>

                    <div className="flex justify-end mt-2">
                      <Button
                        sx={{
                          paddingTop: "8px",
                          fontSize: "10px",
                          "&:hover": {
                            backgroundColor: "#2f74eb",
                            color: "white",
                          },
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Register
                      </Button>
                    </div>
                  </form>
                )}
              </div>
              {/* <div className="mt-8">
                <button className="bg-blue-500 rounded-md text-white px-8 py-4 shadow-lg hover:bg-blue-600">
                  Import
                </button>
              </div> */}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default RegisteredPendingItems;
