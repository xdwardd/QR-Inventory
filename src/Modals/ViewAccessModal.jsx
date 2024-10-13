/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Loaders from "../utils/Loaders";
import { toast } from "react-toastify";
import axios from "axios";
import { insertAccessRoute } from "../utils/inventoryApiEnpoints";
import dropdowndata from "../utils/dropdowndata";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



const ViewAccessModal = ({
  open,
  onClose,
  disableBackdropClick,
  selectedRow,
  userAccess,
  setOpenViewAccessModal,
  getUserManagement,
  user
}) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with the user role from the selectedRow
  const initialUserRole = selectedRow?.user_role;
  const [userRole, setUserRole] = useState(initialUserRole);
  const [screenInfo, setScreenInfo] = useState({
    screen: [], // Convert to strings to match checkbox values
    response: [], // Also set default screens for response
  });
  useEffect(() => {
    if (selectedRow && selectedRow.user_role) {
      setUserRole(selectedRow.user_role);
    }
  }, [selectedRow]);

  // Update the checked state of checkboxes based on userAccess
  useEffect(() => {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"][name="screen"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = userAccess.some(
        (item) => item.screen_id.toString() === checkbox.value
      );
    });
  }, [userAccess]);

  useEffect(() => {
    const initialCheckedScreens = userAccess.map((item) => item.screen_id);
    setScreenInfo({
      ...screenInfo,
      screen: initialCheckedScreens,
    });
  }, [userAccess]);

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setUserRole(selectedRole);
    const role = dropdowndata.getUserRole().find((role) => role.value === selectedRole);

    if (role) {
      // const screensForRole = role.screens.map(String);
      const screensForRole = role.screens.map(String); // Convert to strings to match checkbox values
      const checkboxes = document.querySelectorAll(
        'input[type="checkbox"][name="screen"]'
      );

      checkboxes.forEach((checkbox) => {
        checkbox.checked = screensForRole.includes(checkbox.value);
      });

      setScreenInfo({
        ...screenInfo,
        screen: screensForRole,
      });
    }
  };

  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;

    // Case 1: The user checks the box
    if (checked) {
      setScreenInfo((prevScreenInfo) => ({
        screen: [...prevScreenInfo.screen, value],
        response: [...prevScreenInfo.screen, value],
      }));
    }
    // Case 2: The user unchecks the box
    else {
      setScreenInfo((prevScreenInfo) => ({
        screen: prevScreenInfo.screen.filter(
          (screenValue) => screenValue !== value
        ),
        response: prevScreenInfo.response.filter(
          (screenValue) => screenValue !== value
        ),
      }));
    }
  };

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  const screen = screenInfo.screen;
  // Generate new user info objects with updated screen_id
  const updatedUserInfos = screen.map((screenId) => ({
    emp_id: selectedRow.emp_id,
    screen_id: screenId,
    user_role: userRole,
    creator_id: user && user[0].emp_id,
  }));

  async function updateUserAccess(event) {
    event.preventDefault();

    console.log(updatedUserInfos);
    if (updatedUserInfos.length == 0) {
      toast.error("Please Select Screen!");
      return;
    }
    if (updatedUserInfos[0].emp_id === undefined) {
      toast.error("Error Occurred!");
      return;
    }
    if (
      updatedUserInfos[0].user_role == undefined ||
      updatedUserInfos[0].user_role == ""
    ) {
      toast.error("Please select user role!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        insertAccessRoute,
        updatedUserInfos,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          toast.success("Access Updated!"); // Display success message

          getUserManagement();
          setOpenViewAccessModal(false);
          //Fetch Registered Data
          setScreenInfo({
            screen: [],
            response: [],
          });
        }, 2000);
      } else {
        toast.error("Error Ouccured!");
      }

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
              {/* <CircularProgress color="inher" />  */}
              <Loaders />
            </Backdrop>
            <div className="mt-2 bg-slate-400 w-full">
              {selectedRow && (
                <form
                  action=""
                  className="p-6 w-full"
                  onSubmit={updateUserAccess}
                >
                  <div className="grid grid-cols-4 gap-2">
                    <div className="">
                      <label
                        htmlFor="emp_id"
                        className="block text-left text-sm text-gray-900"
                      >
                        Employee ID
                      </label>
                      <input
                        type="text"
                        id="emp_id"
                        name="emp_id"
                        value={selectedRow.emp_id || ""}
                        className="bg-slate-300 border text-xs border-gray-500 text-gray-900 outline-none block w-full p-2.5 "
                        disabled
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="dept_desc"
                        className="block text-left text-sm text-gray-900"
                      >
                        Department
                      </label>
                      <input
                        type="text"
                        id="dept_desc"
                        name="dept_desc"
                        value={selectedRow.dept_desc || ""}
                        className="bg-slate-300  border border-gray-500 text-gray-900 text-xs outline-none block w-full p-2.5  "
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-subgrid gap-4 col-span-2">
                      <div className="col-start-2"></div>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="emp_name"
                        className="block text-left text-sm text-gray-900"
                      >
                        Employee Name
                      </label>
                      <input
                        type="text"
                        id="emp_name"
                        name="emp_name"
                        value={selectedRow.emp_name || ""}
                        className="bg-slate-300 border border-gray-500 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        disabled
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="position_desc"
                        className="block text-left text-sm text-gray-900"
                      >
                        Position
                      </label>
                      <input
                        type="text"
                        id="position_desc"
                        name="position_desc"
                        value={selectedRow.position_desc || " "}
                        className="bg-slate-300 border border-gray-500 text-gray-900 text-xs outline-none block w-full p-2.5 "
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
                        id="role"
                        name="role"
                        value={userRole}
                        className="border text-gray-900 text-xs  w-full  block p-2.5 border-gray-700 outline-none "
                        onChange={handleRoleChange}
                      >
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
                    <div className="mt-1 w-1/2 flex flex-row space-x-6  bg-slate-100 rounded-md border border-gray-600">
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
                            value="8"
                            name="screen"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                            onChange={handleChange}
                          />
                          <label
                            htmlFor="accountability"
                            className="ms-2 text-md font-medium text-gray-700"
                          >
                            Accountability
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
                            value="12"
                            name="screen"
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
      
      </Dialog>
    </React.Fragment>
  );
};

export default ViewAccessModal;
