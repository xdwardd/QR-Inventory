
/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useRef, useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { toast } from "react-toastify";
import Loaders from "../utils/Loaders";
import { Autocomplete, Backdrop, Box, TextField } from "@mui/material";
import priceFormat from "../utils/priceFormat";
import dropdowndata from "../utils/dropdowndata";
import { NODE_MAILER_ROUTE, getStorageLocationRoute, registerItemRoute, updateItemsRoute } from "../utils/inventoryApiEnpoints";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blockInvalidChar } from "../utils/blockInvalidChar";
import { log10 } from "chart.js/helpers";

const UpdatedAsset = ({
  open,
  onClose,
  disableBackdropClick,
  selectedRow,
  setSelectedRow,
  getRegisteredItems,
  getAvailableItem,
  getUpdatedAssetList,
  getForItemApproval,
  storageLocation,
  getStorageLocation,
  user,
  gsiadApproverEmail
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [isLoading, setIsLoading] = useState(false); // Shared loading state
  const [newData, setNewData] = useState();

  useEffect(() => {
    if (selectedRow != null) {
      setNewData(selectedRow)
    }
  }, [selectedRow])

  const formRef = useRef();

  
  // const [fixedAsset, setFixedAsset] = useState(selectedRow?.fixed_asset);
  // useEffect(() => {
  //   if (selectedRow && selectedRow.fixed_asset) {
  //     setFixedAsset(selectedRow.fixed_asset);
  //   }
  // }, [selectedRow]);

  // // Initialize with the user selected unit
  // const initialUnit = selectedRow?.unit || dropdowndata.getUnit()[0].value;
  // const [selectedUnit, setSelectedUnit] = useState(initialUnit);
  // useEffect(() => {
  //   if (selectedRow && selectedRow.unit) {
  //     setSelectedUnit(selectedRow.unit);
  //   }
  // }, [selectedRow]);



  /*----------------------------------------------------------------*/

  // Initialize with the user selected storage location
  
  const [storageLoc, setStorageLoc] = useState(selectedRow && selectedRow?.storage_location);
  // useEffect(() => {
  //   if (selectedRow?.storage_location !== '') {
  //     setStorageLoc(selectedRow?.storage_location);
  //   }
  // }, [selectedRow]);

useEffect(() => {
  if (selectedRow && selectedRow?.storage_location !== ''
  ) {
    setStorageLoc(selectedRow?.storage_location);
  }
}, [selectedRow]);

const handleAutocompleteChange = (event, newValue) => {
  setStorageLoc(newValue.branch_desc);
};

  // /*----------------------------------------------------------------*/

  const handleInputChange = (event) => {
    const newValue = event.target.value.replace(/\s+/g, " "); // Remove whitespace
    setNewData((prevValue) => ({
      ...prevValue,
      [event.target.name]: newValue, // Update the field that triggered the event
    }));
  };

  /**-------------- Price Validation ------------------- */
  const handleInputPriceChange = (event) => {
    const newValue = event.target.value.replace(/[^0-9.]/g, ""); // Keep only numeric input;
    setNewData((prevValue) => ({
      ...prevValue,
      [event.target.name]: newValue, // Update the field that triggered the event
    }));
  };

  const handlePriceBlur = (event) => {
    const { name, value } = event.target;
    // Sanitize the input by removing all non-numeric characters except for a single decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    const formattedValue = priceFormat(sanitizedValue);
    // Update the state with the formatted value
    setNewData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));
  };

  /**--------------End Price Validation ------------------- */

 const handleInputWarrantyChange = (event) => {
   const newValue = event.target.value.replace(/[^0-9.]/g, ""); // Keep only numeric input
   setNewData((prevValue) => ({
     ...prevValue,
     [event.target.name]: newValue ? `${newValue} month/s` : "",
   }));
 };
  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  /*--------------------Node Mailer--------------------------------------*/
 
  let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               Asset ${selectedRow?.ref_id} - ${selectedRow?.item_name}  has been updated and requires your review/checking/approval. Please review the updated asset/s using the following link: <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;


  /**send email to gsiad */
  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${gsiadApproverEmail}`,
          mail_to: `catapan.edward@wealthbank.com.ph,`,
          // cc: `${
          //   user && user[0].wb_email
          //   }`,
          cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph,  lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
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

  async function handleSubmit(event) {
    event.preventDefault();
    //   console.log(newData);
    //  console.log(selectedRow.status)
    // if (selectedRow.status == "ASSET-UPDATED : PENDING FOR GSIAD APPROVAL") {
    //   toast.error("This item is already updated. Pending for Approval!");
    //   return;
    // }

    if (selectedRow.status == "DISPOSAL: ITEM DISPOSED") {
      toast.error("Can't update Disposed Item!");
      return;
    }
    if (selectedRow.status == "DISPOSAL: FOR DISPOSAL APPROVAL") {
      toast.error("Can't update item. Pending for Disposal!");
      return;
    }
    if (newData.assigned_user != "") {
      toast.error("Item Already Assigned. Unable Update!");
      return;
    }

    //check if there is changes in data
    const hasChanges = Object.keys(selectedRow).some(
      (key) => selectedRow[key] !== newData[key]
    );

    if (!hasChanges && selectedRow?.storage_location == storageLoc) {
      toast.error("No data has been changed.");
      return;
    }

    if (
      newData.fixed_asset === dropdowndata.getFixedAsset()[0].value &&
      newData.quantity != 1
    ) {
      toast.error("Electronic Computer quantity must only be 1");
      return;
    }

    if (newData.price == "0.00") {
      toast.error("Input valid price");
      return;
    }

    if (newData.date_received >= newData.date_expire) {
      toast.error("Date expire should not be earlier than date received.");
      return;
    }

    //words limit
    const description = newData.description.trim().split(/\s+/);
    if (description.length > 500) {
      toast.error("Description is too large please input atleast 500 words.");
      return;
    }
    const remarks = newData.remarks.trim().split(/\s+/);
    if (remarks.length > 500) {
      toast.error("Remarks is too large please input atleast 500 words");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post(
        updateItemsRoute,
        [
          {
            ...newData,
            storage_location: storageLoc,
            status: selectedRow.status,
            creator_id: user && user[0].emp_id,
            creator_role: user && user[0].user_role,
            creator_email: user && user[0].wb_email,
          },
        ],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading

          //closemodal
          onClose();
          toast.success("Successfully Updated!"); // Display success message
          getForItemApproval();
          getRegisteredItems();
          getAvailableItem();
          getUpdatedAssetList();
          //send mail
           sendMail();
        }, 3000);
      } else {
        setIsLoading(false);
        //closemoda
        onClose();
        toast.error(response.data[0].rspmsg);
        getUpdatedAssetList();
      }
    } catch (error) {
      console.log(error);
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
        onClose={onClose}
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "1000px", // Adjust the height as needed
          },
        }}
      >
        <div className="flex flex-row justify-between">
          <DialogTitle>
            <div className="text-sm">Update Asset</div>
          </DialogTitle>
          <DialogActions>
            <FontAwesomeIcon
              icon={faClose}
              className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
              onClick={onClose}
            />
          </DialogActions>
        </div>
        <DialogContent>
          <div>
            <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
              {/* <CircularProgress color="inher" />  */}
              <Loaders />
            </Backdrop>
            <div className=" bg-slate-400 w-full ">
              {selectedRow && (
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
                      <input
                        type="text"
                        id="item_name"
                        name="item_name"
                        value={(newData && newData.fixed_asset) || ""}
                        className="bg-gray-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2"
                        // onChange={handleInputChange}
                        readOnly
                      />
                      {/* <select
                        id="fixed_asset"
                        name="fixed_asset"
                        value={newData && newData.fixed_asset || ''}
                        className="border border-gray-700 text-gray-900 text-xs w-full block p-2 outline-none "
                        onChange={handleInputChange}
                      >
                        {dropdowndata.getFixedAsset().map((item) => (
                          <option key={item.id} value={item.value}>
                            {item.value}
                          </option>
                        ))}
                      </select> */}
                    </div>

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
                        value={(newData && newData.item_name) || ""}
                        className="bg-gray-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2"
                        // onChange={handleInputChange}
                        readOnly
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
                        value={(newData && newData.quantity) || ""}
                        min={1}
                        onKeyDown={blockInvalidChar}
                        className="bg-gray-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2 "
                        // onChange={handleInputChange}
                        readOnly
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
                        value={(newData && newData.price) || ""}
                        className="bg-gray-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2 "
                        // onChange={handleInputPriceChange}
                        // onBlur={handlePriceBlur} // Format the price on blur
                        // required
                        readOnly
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
                        value={(newData && newData.date_received) || ""}
                        className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full pt-2 p-2"
                        onChange={handleInputChange}
                        required
                        // readOnly
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
                        value={
                          newData && newData.warranty
                            ? `${newData && newData.warranty}`
                            : "" || ""
                        }
                        className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full  p-2 "
                        onChange={handleInputWarrantyChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="date_expire"
                        className="block text-left text-xs text-gray-700"
                      >
                        Expiration Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date_expire"
                        name="date_expire"
                        value={(newData && newData.date_expire) || ""}
                        className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full pt-2 p-2 "
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="asset_code"
                        className="block text-left text-xs text-gray-900"
                      >
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={(newData && newData.unit) || ""}
                        className="bg-gray-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2 "
                        // onChange={handleInputPriceChange}
                        // onBlur={handlePriceBlur} // Format the price on blur
                        // required
                        readOnly
                      />
                      {/* <select
                        id="unit"
                        name="unit"
                        value={(newData && newData.unit) || ""}
                        className="border border-gray-700 text-gray-900 text-xs w-full block p-2 outline-none "
                        onChange={handleInputChange}
                      >
                        {dropdowndata.getUnit().map((item) => (
                          <option key={item.id} value={item.value}>
                            {item.value}
                          </option>
                        ))}
                      </select> */}
                    </div>

                    <div className="col-span-1">
                      <label
                        htmlFor="serial_number"
                        className="block text-left text-xs text-gray-900"
                      >
                        Storage Location <span className="text-red-500">*</span>
                      </label>
                      <Autocomplete
                        className="border text-xs border-gray-600"
                        options={storageLocation}
                        value={storageLoc}
                        onChange={handleAutocompleteChange}
                        name="storage_location"
                        getOptionLabel={(option) =>
                          option.branch_desc || storageLoc
                        }
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
                      {/* <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        value={selectedRow.storage_location}
                        className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2"
                        onChange={handleInputChange}
                        required
                      /> */}
                    </div>
                    {((newData &&
                      newData.fixed_asset ==
                        dropdowndata.getFixedAsset()[0].value) ||
                      (newData &&
                        newData.fixed_asset ==
                          dropdowndata.getFixedAsset()[2].value)) && (
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
                          value={(newData && newData.model_number) || ""}
                          className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2"
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    {((newData &&
                      newData.fixed_asset ==
                        dropdowndata.getFixedAsset()[0].value) ||
                      (newData &&
                        newData.fixed_asset ==
                          dropdowndata.getFixedAsset()[2].value)) && (
                      <div className="col-span-2">
                        <label
                          htmlFor="serial_number"
                          className="block text-left text-xs text-gray-900"
                        >
                          Serial Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="serial_number"
                          name="serial_number"
                          value={(newData && newData.serial_number) || ""}
                          className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2"
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-900">
                      Description <span className="text-red-500">*</span>
                    </div>
                    <textarea
                      className="resize-none border text-xs border-gray-700 rounded-md p-2 w-full h-24 "
                      name="description"
                      value={(newData && newData.description) || ""}
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
                      className="resize-none border text-xs border-gray-700 rounded-md p-2 w-full h-20 "
                      name="remarks"
                      value={(newData && newData.remarks) || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your text here..."
                      required
                    />
                  </div>

                  {/* {selectedRow?.status ==
                    "REGISTRATION FOR APPROVAL - GSIAD DISAPPROVED" && (
                    <div className="text-red-600 text-xs mt-2">
                      <div className="font-medium">
                        <span className="font-bold">
                          Status:  </span>
                        {selectedRow?.status}
                      </div>
                      <div className="font-medium">
                        <span className="font-bold">Reason: </span>
                        {selectedRow?.approver_remarks}
                      </div>
                    </div>
                  )} */}

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
              )}
            </div>
          </div>
        </DialogContent>
        {/* <DialogActions>
          <Button sx={{ fontSize: "10px" }} onClick={onClose}>
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
};

export default UpdatedAsset;
