import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Autocomplete, Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState, useRef }  from 'react'
import dropdowndata from '../utils/dropdowndata';
import { toast } from 'react-toastify';
import { updateItemsRoute } from '../utils/inventoryApiEnpoints';
import axios from 'axios';
import Loaders from '../utils/Loaders';

const UpdateDisapproveItem = ({
  open,
  selectedRow,
  setOpenUpdateModal,
  storageLocation,
 
  getForItemApproval,
  getStorageLocation,
  getDisapproveItems,
  user,
  gsiadApproverEmail,
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [isLoading, setIsLoading] = useState(false); // Shared loading state
  const [newData, setNewData] = useState();

  useEffect(() => {
    if (selectedRow != null) {
      setNewData(selectedRow);
    }
  }, [selectedRow]);
  const formRef = useRef();

  // Initialize with the user selected storage location

  const [storageLoc, setStorageLoc] = useState(
    selectedRow && selectedRow?.storage_location
  );

  useEffect(() => {
    if (selectedRow && selectedRow?.storage_location !== "") {
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

  async function handleSubmit(event) {
    event.preventDefault();
    //   console.log(newData);
    //  console.log(selectedRow.status)

    if (selectedRow.status == "DISPOSAL: ITEM DISPOSED") {
      toast.error("Can't update Diposed Item!");
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

      if (response.data[0].retVal === "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          setOpenUpdateModal(false)
          toast.success("Item Updated. Need Registration Approval."); // Display success message
          getDisapproveItems();

          // getForItemApproval();
          //send mail
          //  sendMail();
        }, 3000);
      } else {
        toast.error("Error Ouccured!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <React.Fragment>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button> */}

        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          W
          sx={{
            "& .MuiDialog-paper": {
              height: "1000px", // Adjust the height as needed
            },
          }}
        >
          <div className="flex flex-row justify-between">
            <DialogTitle>
              <div className="text-sm">Register Asset</div>
            </DialogTitle>
            <DialogActions>
              <FontAwesomeIcon
                icon={faClose}
                className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
                onClick={() => setOpenUpdateModal(false)}
              />
            </DialogActions>
          </div>
          <DialogContent>
            <div>
              <Backdrop
                open={isLoading}
                style={{ color: "#fff", zIndex: 1200 }}
              >
              
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
                          Fixed Asset Name{" "}
                          <span className="text-red-500">*</span>
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
                          //   onKeyDown={blockInvalidChar}
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
                          Expiration Date{" "}
                          <span className="text-red-500">*</span>
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
                          readOnly
                        />
                      </div>

                      <div className="col-span-1">
                        <label
                          htmlFor="serial_number"
                          className="block text-left text-xs text-gray-900"
                        >
                          Storage Location{" "}
                          <span className="text-red-500">*</span>
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
                            Serial Number{" "}
                            <span className="text-red-500">*</span>
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
    </div>
  );
};

export default UpdateDisapproveItem
