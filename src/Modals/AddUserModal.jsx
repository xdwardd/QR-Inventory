/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useEffect, useState, useRef } from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import axios from "axios";
import Loaders from "../utils/Loaders";
import { toast } from "react-toastify";
import dropdowndata from "../utils/dropdowndata";
import { insertAccessRoute } from "../utils/inventoryApiEnpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";


const AddUserModal = ({
  open,
  onClose,
  setOpenAddUserModal,
  disableBackdropClick,
  userList,
  getUserManagement,
  user
}) => {
  const formRef = useRef();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [isLoading, setIsLoading] = useState(false);
  // const [userList, setUserList] = useState([]);

  const [employeeID, setEmployeeID] = useState();
  const [employeeName, setEmployeeName] = useState();
  const [employeeDept, setEmployeeDept] = useState();
  const [employeePosition, setEmployeePosition] = useState();
  const [userRole, setUserRole] = useState();
  const [screenInfo, setScreenInfo] = useState({
    screen: [], // Convert to strings to match checkbox values
    response: [], // Also set default screens for response
  });

  // Function to handle role change
  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setUserRole(selectedRole);
    const role = dropdowndata.getUserRole().find((role) => role.value === selectedRole);

    if (role) {
      const screensForRole = role.screens.map(String); // Convert to strings to match checkbox values
      const checkboxes = document.querySelectorAll(
        'input[type="checkbox"][name="screen"]'
      );

      checkboxes.forEach((checkbox) => {
        checkbox.checked = screensForRole.includes(checkbox.value);
      });
      // Update screen info with screens from the selected role
      setScreenInfo({
        screen: role.screens.map(String),
        response: role.screens.map(String), // Also update response with screens from the selected role
      });
    }
  };

  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { screen } = screenInfo;

    // Case 1 : The user checks the box
    if (checked) {
      setScreenInfo({
        screen: [...screen, value],
        response: [...screen, value],
      });
    }

    // Case 2  : The user unchecks the box
    else {
      setScreenInfo({
        screen: screen.filter((e) => e !== value),
        response: screen.filter((e) => e !== value),
      });
    }
  };

  const screen = screenInfo.response;

  // Generate new user info objects with updated screen_id
  const updatedUserInfos = screen.map((screenId) => ({
    emp_id: employeeID,
    screen_id: screenId,
    user_role: userRole,
    creator_id: user && user[0].emp_id,
  }));

  //console.log();

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(updatedUserInfos);
    if (updatedUserInfos.length == 0) {
      toast.error("Please Select Screen!");
      return;
    }
    if (updatedUserInfos[0].emp_id === undefined) {
      toast.error("User is required!");
      return;
    }
    if (
      updatedUserInfos[0].user_role == undefined ||
      updatedUserInfos[0].user_role == ""
    ) {
      toast.error("Role is required!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(insertAccessRoute, updatedUserInfos, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          toast.success(response.data[0].rspmsg); // Display success message
          setEmployeeID("");
          setEmployeeName();
          setEmployeeDept("");
          setEmployeePosition("");
          setUserRole("")

          getUserManagement();
          setOpenAddUserModal(false);
          setScreenInfo({
            screen: [],
            response: [],
          });
        }, 3000);
      } else {
        toast.error("Error Ouccured!");
      }
      // formRef.current.reset();

      console.log(response);
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
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "650px", // Adjust the height as needed
          },
        }}
      >
        <div className="flex flex-row justify-between">
          <DialogTitle>
            <div className="text-sm">Register User</div>
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
              <Loaders />
            </Backdrop>
            <div className="mt-2 bg-slate-400 w-full">
              <form
                action=""
                className="p-6 w-full"
                onSubmit={handleSubmit}
                ref={formRef}
              >
                <div className="grid grid-cols-4 gap-2">
                  <div className="">
                    <label
                      htmlFor="asset_code"
                      className="block text-left text-sm text-gray-900"
                    >
                      Employee ID
                    </label>
                    <input
                      type="text"
                      id="asset_code"
                      name="asset_code"
                      value={employeeID || ""}
                      className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                      disabled
                      required
                    />
                  </div>
                  <div className="">
                    <label
                      htmlFor="date_received"
                      className="block text-left text-sm text-gray-900"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      id="date_received"
                      name="date_received"
                      value={employeeDept || ""}
                      className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5  "
                      disabled
                      required
                    />
                  </div>
                  <div className="grid grid-cols-subgrid gap-4 col-span-2">
                    <div className="col-start-2"></div>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="item_name"
                      className="block text-left text-sm text-gray-900"
                    >
                      Employee Name
                    </label>
                    <Autocomplete
                      disablePortal
                      className="border border-gray-700 text-gray-700"
                      options={userList}
                      onChange={(event, value) => {
                        setEmployeeName(value.emp_name);
                        setEmployeeID(value.id_emp);
                        setEmployeeDept(value.dept_desc);
                        setEmployeePosition(value.position_desc);
                      }}
                      getOptionLabel={(option) => option.emp_name}
                      isOptionEqualToValue={(props, option) => (
                        <Box component="li" {...props}>
                          {option.emp_name}
                        </Box>
                      )}
                      sx={{
                        //width: "full", // Control the width of the Autocomplete
                        "& .MuiInputBase-root": {
                          height: "35px", // Height of the input field
                          padding: "1.8px 4px 7.5px 5px",
                          borderRadius: "0px",
                          borderWidth: "0px",
                          fontSize: "12px",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Remove the default outline border
                        },
                      }}
                      renderInput={(params) => (
                        //   setName({...params}),
                        <TextField
                          {...params}
                          className="bg-white text-gray-700 hover:outline-none"
                        />
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      htmlFor="model_number"
                      className="block text-left text-sm text-gray-900"
                    >
                      Position
                    </label>
                    <input
                      type="text"
                      id="model_number"
                      name="model_number"
                      value={employeePosition || ""}
                      className="bg-gray-50 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                      disabled
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="serial_number"
                      className="block text-left text-sm text-gray-900"
                    >
                      Role
                    </label>
                    <select
                      id="fixed_asset"
                      name="fixed_asset"
                      value={userRole}
                      className="border border-gray-700 text-gray-900 text-xs w-full  block p-2.5 outline-none "
                      // onChange={() => setUserRole(event.target.value)}
                      onChange={handleRoleChange}
                    >
                      <option value="">Select Role</option>{" "}
                      {/* Default option */}
                      {dropdowndata.getUserRole().map((item) => (
                        <option key={item.id} value={item.value}>
                          {item.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <label
                    htmlFor="serial_number"
                    className="block text-left text-lg font-medium text-gray-700"
                  >
                    Screens :
                  </label>

                  <div className="mt-1 w-1/2 flex flex-row space-x-6 border bg-slate-100 border-gray-700 rounded-md">
                    <div className="p-3">
                      <div className="mb-1 flex items-center">
                        <input
                          id="register_asset"
                          type="checkbox"
                          name="screen"
                          value="1"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="register_asset"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Register Asset
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="assignment"
                          type="checkbox"
                          name="screen"
                          value="2"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="assignment"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Assignment
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="approval-register"
                          type="checkbox"
                          name="screen"
                          value="3"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="approval-register"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Approval-Register
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="approval-updateditems"
                          type="checkbox"
                          name="screen"
                          value="4"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="approval-updateditems"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Approval-UpdatedItems
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="approval-assignment"
                          type="checkbox"
                          name="screen"
                          value="5"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="approval-assignment"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Approval-Assignment
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="approval-clearance"
                          type="checkbox"
                          name="screen"
                          value="6"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="approval-clearance"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Approval-Clearance
                        </label>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="mb-1">
                        <input
                          id="approval-disposal"
                          type="checkbox"
                          name="screen"
                          value="7"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="approval-disposal"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Approval-Disposal
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="accountability"
                          type="checkbox"
                          name="screen"
                          value="8"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="accountability"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Accountabilty
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="clearance"
                          type="checkbox"
                          name="screen"
                          value="9"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="clearance"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Clearance
                        </label>
                      </div>

                      <div className="mb-1">
                        <input
                          id="reports"
                          type="checkbox"
                          name="screen"
                          value="10"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="reports"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Reports
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="disposal"
                          type="checkbox"
                          name="screen"
                          value="11"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="disposal"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Disposal
                        </label>
                      </div>
                      <div className="mb-1">
                        <input
                          id="settings"
                          type="checkbox"
                          name="screen"
                          value="12"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                          onChange={handleChange}
                        />
                        <label
                          htmlFor="settings"
                          className="ms-2 text-md font-medium text-gray-700"
                        >
                          Settings
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="flex justify-end mt-2">
                  {/* <button
                    type="submit"
                    className="bg-blue-600 text-xs tracking-wider px-8 py-2 rounded-md  text-white font-bold hover:bg-blue-700"
                  >
                    Submit
                  </button> */}
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
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default AddUserModal;
