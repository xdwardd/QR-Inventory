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
import priceFormat from "../utils/priceFormat";
import dropdowndata from "../utils/dropdowndata";
import { NODE_MAILER_ROUTE, getStorageLocationRoute, registerItemRoute } from "../utils/inventoryApiEnpoints";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blockInvalidChar } from "../utils/blockInvalidChar";

const initialData = {
  ref_id: "0",
  item_id: "0",
  po_id: "0",
  pending_po_id: "",
  pending_item_id: "",
  generated_pending_id: "0",
  item_code: "",
  item_name: "",
  quantity: "",
  price: "",
  warranty: "",
  unit: dropdowndata.getUnit()[0].value,
  model_number: "",
  serial_number: "",
  assigned_user: "",
  fixed_asset: dropdowndata.getFixedAsset()[0].value,
  date_received: "",
  date_expire: "",
  description: "",
  storage_location: "",
  remarks: "",
  status: "REGISTRATION FOR APPROVAL",
  creator_id: "",
  creator_role: "",
  creator_email: "",

};

const RegisterAsset = ({
  open,
  setOpen,
  handleClose,
  disableBackdropClick,
  getRegisteredItems,
  itemName,
  getForItemApproval,
  storageLocation,
   getStorageLocation,
  user,
  gsiadApproverEmail
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [isLoading, setIsLoading] = useState(false); // Shared loading state
  const [insertData, setInsertData] = useState(initialData);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedBranch(newValue);
  };

  const handleItemNameChange = (event, newValue) => {
    setSelectedItem(newValue);
  };

  const formRef = useRef();

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\s+/g, " "); // Remove whitespace
    setInsertData({
      ...insertData,
      [event.target.name]: value,
    });
  };

  /*------------Price Validation --------------- */
  const handleInputPriceChange = (event) => {
    const value = event.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); // Keep only numeric input
    setInsertData({
      ...insertData,
      [event.target.name]: value,
    });
  };

  const handlePriceBlur = (event) => {
    const { name, value } = event.target;
    const sanitizedValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    // Format the sanitized input as a price
    const formattedValue = priceFormat(sanitizedValue);
    setInsertData({
      ...insertData,
      [name]: formattedValue,
      // [value]: formattedValue
    });
  };
  /*------------End Price Validation --------------- */



  /*------------Warranty Validation --------------- */
  const [displayWarranty, setDisplayWarranty] = useState("");
  const handleInputWarrantyChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Keep only numeric input
    setInsertData({
      ...insertData,
      warranty: value,
    });
    setDisplayWarranty(value ? `${value} month/s` : ""); // Check if value is not empty, then add "month/s" else ""
  };

  /*------------End Warranty Validation --------------- */

  const handleBackdropClick = (event) => {
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  // Create an array to store the split objects
  const splitAssets = [];

  // Loop through the quantity and create a new object for each iteration
  for (let i = 0; i < insertData.quantity; i++) {
    const singleAsset = { ...insertData };
    singleAsset.quantity = 1;
    singleAsset.warranty = displayWarranty;
    (singleAsset.creator_id = user && user[0].emp_id),
      (singleAsset.creator_role = user && user[0].user_role),
      (singleAsset.creator_email = user && user[0].wb_email);

    {
      selectedItem &&
        ((singleAsset.item_name = selectedItem.item_name.toUpperCase()),
        (singleAsset.item_code = selectedItem.item_code));
    }
    {
      selectedBranch &&
        (singleAsset.storage_location = selectedBranch.branch_desc);
    }

    // Add to the array
    splitAssets.push(singleAsset);
  }

  // Check a condition and set serial_number to empty string for each asset if the condition is met
  if (
    splitAssets.length > 0 &&
    splitAssets[0].fixed_asset !== dropdowndata.getFixedAsset()[0].value &&
    splitAssets[0].fixed_asset !== dropdowndata.getFixedAsset()[2].value
  ) {
    splitAssets.forEach((asset) => {
      asset.serial_number = "";
      asset.model_number = "";
    });
  }

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
          // mail_to: `${gsiadApproverEmail}`,
          mail_to: `catapan.edward@wealthbank.com.ph`,
          cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          // cc: `${
          //   user && user[0].wb_email
          // }, campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
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


  async function handleSubmit(event) {
    event.preventDefault();

    
    

    //words limit
    const description = insertData.description.trim().split(/\s+/);
    if (description.length > 500) {
      toast.error("Description is too large please input atleast 500 words.")
      return;
    }
      const remarks = insertData.remarks.trim().split(/\s+/);
      if (remarks.length > 500) {
        toast.error("Remarks is too large please input atleast 500 words");
        return;
    }
    
    if (insertData.quantity > 100) {
      toast.error("Quantity too large! Please Input atleast 100");
      return false;
    }
    if (
      insertData.fixed_asset === dropdowndata.getFixedAsset()[0].value &&
      insertData.quantity != 1
    ) {
      toast.error("Electronic Computers quantity must only be 1.");
      return;
    }

    
    if (
      insertData.fixed_asset === dropdowndata.getFixedAsset()[2].value &&
      insertData.quantity != 1
    ) {
      toast.error("Office Machine quantity must only be 1.");
      return;
    }

    if (insertData.price == "0.00") {
      toast.error("Input valid price!");
      return;
    }

    if (insertData.date_received >= insertData.date_expire) {
      toast.error(
        "Date expire should not be the same or earlier than date received."
      );
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post(registerItemRoute, splitAssets, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 3 seconds
          setIsLoading(false); // Stop loading
          toast.success(response.data[0].rspmsg); // Display success message

          getRegisteredItems();
          //run get to load for item approval list
          getForItemApproval();
          //close modal
          setOpen(false);
          setDisplayWarranty("");
          setSelectedItem(null);
          setSelectedBranch(null);
          setInsertData({
            ...initialData,
            fixed_asset: dropdowndata.getFixedAsset()[0].value,
          });
          formRef.current.reset();
          // priceRef.current.reset();
          getStorageLocation();

          //if send email if success insertion
           sendMail();
        }, 3000);
      } else {
        setTimeout(() => {
          toast.error(response.data[0].rspmsg);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        // Simulate a delay of 2 seconds
        setIsLoading(false); // Stop loading
        toast.error(error.message); // Display success message
      }, 3000);
    }
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
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "1000px", // Adjust the height as needed
          },
        }}
      >
        <div className="flex flex-row justify-between">
          <DialogTitle>
            <div className="text-sm">Register Assets</div>
          </DialogTitle>
          <DialogActions>
            <FontAwesomeIcon
              icon={faClose}
              className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
              onClick={() => {
                setOpen(false);
                setInsertData({
                  ...initialData,
                  fixed_asset: dropdowndata.getFixedAsset()[0].value,
                });
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
              <div className="mt-2 bg-slate-400 w-full ">
                <form
                  action=""
                  className="p-4 w-full"
                  ref={formRef}
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="asset_code"
                        className="text-left text-xs text-gray-900"
                      >
                        Fixed Asset Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="fixed_asset"
                        name="fixed_asset"
                        className="border border-gray-600 text-gray-900 text-xs w-full  block pt-1.5  p-2 outline-none "
                        onChange={handleInputChange}
                      >
                        {dropdowndata.getFixedAsset().map((item) => (
                          <option key={item.id} value={item.value}>
                            {item.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="item_name"
                        className=" text-left text-xs text-gray-900"
                      >
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <Autocomplete
                        className="border text-xs border-gray-600"
                        options={itemName}
                        value={selectedItem}
                        name="item_name"
                        onChange={handleItemNameChange}
                        getOptionLabel={(option) => option.item_name.toUpperCase()}
                        isOptionEqualToValue={(props, option) => (
                          <Box component="li" {...props}>
                            {option.item_name}
                          </Box>
                        )}
                        sx={{
                          //width: "full", // Control the width of the Autocomplete
                          "& .MuiInputBase-root": {
                            height: "32px", // Height of the input field
                            padding: "1.8px 4px 4px 5px",
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
                            name="item_name"
                            {...params}
                            className="bg-white hover:outline-none"
                            required
                          />
                        )}
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
                        type="number"
                        id="quantity"
                        name="quantity"
                        min={1}
                        onKeyDown={blockInvalidChar}
                        // value={insertData.quantity || ''}
                        className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full p-2 "
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-left text-xs text-gray-900"
                      >
                        Price <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={insertData.price}
                        className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full p-2 "
                        placeholder="Unit Price"
                        onChange={handleInputPriceChange}
                        onBlur={handlePriceBlur}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="date_received"
                        className="block text-left text-xs text-gray-900"
                      >
                        Date Received <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date_received"
                        name="date_received"
                        className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full pt-2 p-1.5"
                        onChange={handleInputChange}
                        required
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
                        className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full p-2 "
                        onChange={handleInputWarrantyChange}
                        placeholder="Enter duration in months"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="date_expire"
                        className="block text-left text-xs text-gray-900"
                      >
                        Expiration Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date_expire"
                        name="date_expire"
                        className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full pt-2 p-1.5 "
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="unit"
                        className="block text-left text-xs text-gray-900"
                      >
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="unit"
                        name="unit"
                        className="border border-gray-600 text-gray-900 text-xs w-full  block pt-1.5  p-2 outline-none "
                        onChange={handleInputChange}
                      >
                        {dropdowndata.getUnit().map((item) => (
                          <option key={item.id} value={item.value}>
                            {item.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label
                        htmlFor="item_name"
                        className="block text-left text-xs text-gray-900"
                      >
                        Storage Location <span className="text-red-500">*</span>
                      </label>
                      <Autocomplete
                        className="border text-xs border-gray-600"
                        options={storageLocation}
                        value={selectedBranch}
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
                    {(insertData.fixed_asset ==
                      dropdowndata.getFixedAsset()[0].value ||
                      insertData.fixed_asset ==
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
                          value={insertData.model_number || ""}
                          className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full p-2 "
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    )}

                    <div className="col-span-2">
                      {(insertData.fixed_asset ==
                        dropdowndata.getFixedAsset()[0].value ||
                        insertData.fixed_asset ==
                          dropdowndata.getFixedAsset()[2].value) && (
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
                            value={insertData.serial_number || ""}
                            className="bg-gray-50 border border-gray-600 text-gray-600 text-xs outline-none block w-full  p-2 "
                            onChange={handleInputChange}
                            required
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-900">
                      Description <span className="text-red-500">*</span>
                    </div>
                    <textarea
                      className="resize-none border text-xs border-gray-600 rounded-md p-2 w-full h-24 outline-none "
                      name="description"
                      onChange={handleInputChange}
                      value={insertData.description || ""}
                      placeholder="Enter your text here..."
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-900">
                      Remarks <span className="text-red-500">*</span>
                    </div>
                    <textarea
                      className="resize-none border border-gray-600 rounded-md text-xs p-2 w-full h-20 outline-none "
                      name="remarks"
                      onChange={handleInputChange}
                      value={insertData.remarks || ""}
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
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default RegisterAsset;
