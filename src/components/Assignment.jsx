/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  Autocomplete,
  Backdrop,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Loaders from "../utils/Loaders";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AssigmentInfo from "../Modals/AssigmentInfo";

//assigment api
import { NODE_MAILER_ROUTE, userassignment } from "../utils/inventoryApiEnpoints";
import AssignmentCofirmation from "../Modals/AssignmentCofirmation";
import Searchbar from "../utils/Searchbar";


const Assignment = ({
  userList,
  registeredItems,
  getRegisteredItems,
  availableItem,
  getAvailableItem,
  getApprovalList,
  screens,
  gsiadApproverEmail 
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [openViewAssignment, setOpenViewAssignment] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeID, setEmployeeID] = useState();
  const [employeeName, setEmployeeName] = useState();
  const [employeeDept, setEmployeeDept] = useState();
  const [employeeEmail, setEmployeeEmail] = useState();
  const [employeeJobLevel, setEmployeeJobLevel] = useState();
  const [employeeExecutiveApprover, setEmployeeExcutiveApprover] = useState();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const navigate = useNavigate();

  //user screen access
  let userScreens;
  if (user) {
    userScreens = user.map((item) => item.screen_id);
  }

  let userDefaultScreen;
  if (user) {
    userDefaultScreen = screens.find(
      ({ screen_id }) => screen_id == user[0].screen_id
    );
  }

  // Inside your component function
  useEffect(() => {
    if (isAuthenticated && userScreens && !userScreens.includes("2")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*------------------------------------------------------------------*/

  const selectedRows = availableItem.filter((row) =>
    selectedRowIds.includes(row.ref_id)
  );

  const selecteRefID = selectedRows.map((item) => item.ref_id);

  const handleViewClick = (row, event) => {
    setOpenViewAssignment(true);
    setSelectedRow(row);
  };

  const closeViewAssign = () => {
    setOpenViewAssignment(false);
  };

  const handleAutocompleteChange = (event, value) => {
    setSelectedEmployee(value);
    setEmployeeID(value?.id_emp || "");
    setEmployeeName(value?.emp_name.toUpperCase() || "");
    setEmployeeDept(value?.dept_desc || "");
    setEmployeeEmail(value?.wb_email || "");
    setEmployeeJobLevel(value?.job_level || "");
    setEmployeeExcutiveApprover(value?.executive_approver || "");
  };

  const selectedReferenceID = selectedRows.map((item) => item.ref_id);
  /*--------------------Node Mailer--------------------------------------*/
  
  
   let msg = `<span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               Asset/s with reference ID ${selectedReferenceID} assigned to ${employeeName} - ${employeeID} requires your review/checking/approval. Please review assignment using the following link: <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;

  /**Send Email to GSIAD */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${gsiadApproverEmail}`,
          mail_to: `catapan.edward@wealthbank.com.ph`,
          // cc: user && user[0].wb_email,
          cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          subject: "QR inventory",
          msg: msg,
          systemName: "QR-INVENTORY",
        },
      ]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Generate new user info objects with updated screen_id
  const AssignInfo = selecteRefID.map((refId) => ({
    assigned_user: employeeID,
    assigned_user_email: employeeEmail,
    job_level: employeeJobLevel,
    user_name: employeeName,
    user_dept: employeeDept,
    ref_id: refId,
    creator_id: user && user[0].emp_id,
    creator_email: user && user[0].wb_email,
    aprrover_id: "",
    approver_remarks: "",
    executive_approver: employeeExecutiveApprover,
    status: "USER-ASSIGNMENT: PENDING FOR GSIAD APPROVAL",
  }));

  //open modal
  const username = AssignInfo.map((item) => item.user_name);

  const handleOpenModal = () => {
    if (AssignInfo.length == 0) {
      toast.error("No item selected");
      return;
    }
    if (
      AssignInfo[0].assigned_user == undefined ||
      AssignInfo[0].assigned_user == ""
    ) {
      toast.error("User is required!");
      return;
    }
    setOpenConfirmModal(true);
  };

  //insert userassignment
  const handleUserAssignment = async () => {

   
    

    try {
      setIsLoading(true);
      const response = await axios.post(userassignment, AssignInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log(response.data);
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          toast.success("Successfully Assign"); // Display success message
          setOpenConfirmModal(false);
          //sendMail
          sendMail();

          setSelectedEmployee(null);
          setSelectedRowIds([]);
          getRegisteredItems();

          //load to get updated list
          getAvailableItem();

          //load get appproval routes
          // getApprovalList();
        }, 3000);
      } else {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading
          toast.error(response.data[0].rspmsg); // Display success message
          setOpenConfirmModal(false);

          setSelectedEmployee(null);
          setSelectedRowIds([]);
          getRegisteredItems();

          //load to get updated list
          getAvailableItem();

          //load get appproval routes
          // getApprovalList();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }

    if (selectedRows.length === 0) {
      toast.error("Please Select Asset!");
      return false;
    }
  };

  const columns = [
    {
      field: "ref_id",
      headerName: "Reference ID",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "fixed_asset",
      headerName: "Fixed Asset",
      width: 200,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 80,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "unit",
      headerName: "Unit",
      width: 80,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 300,
      editable: false,
      sortable: true,
      resizable: false,
      headerAlign: "center",
    },

    {
      field: "action",
      headerName: "Action",
      width: 100,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="">
          <Button
            sx={{
                paddingTop: "8px",

              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#2f74eb",
                color: "white",
              },
            }}
            variant="outlined"
            color="primary"
            onClick={(event) => handleViewClick(params.row, event)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  /** Search Bar */
  // Columns to exclude from search functionality
  const columnsToExclude = ["action", "quantity"];

  // Filter columns to exclude
  const searchColumns = columns.filter(
    (col) => !columnsToExclude.includes(col.field)
  );

  const [searchColumn, setSearchColumn] = useState(searchColumns[0].field); // Default to the first column
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(availableItem);

  useEffect(() => {
    const filtered = availableItem.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, availableItem]);

  /**Search bar */

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 h-screen">
          <div className="flex flex-row items-end justify-between">
            <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1500 }}>
              <Loaders />
            </Backdrop>
            <div className="text-sm font-medium text-gray-600 dark:text-white">
              <label htmlFor="Assign User" className="block mb-2">
                Assign User
              </label>
              <Autocomplete
                disablePortal
                className="border border-gray-700 text-gray-700 "
                options={userList}
                value={selectedEmployee}
                onChange={handleAutocompleteChange}
                // onChange={(event, value) => {
                //   setEmployeeID(value.id_emp);
                //   setEmployeeName(value.emp_name);
                //   setEmployeeDept(value.dept_desc);
                //   setEmployeeEmail(value.wb_email);
                // }}
                getOptionLabel={(option) =>
                  option.emp_name.toUpperCase() + " - " + option.id_emp
                }
                isOptionEqualToValue={(props, option) => (
                  <Box component="li" {...props}>
                    {option.emp_name}
                  </Box>
                )}
                sx={{
                  "& .MuiInputBase-root": {
                    height: "35px", // Height of the input field
                    width: "400px",
                    // padding: "1.8px 4px 4.5px 2px",
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
                    {...params}
                    className="bg-white text-gray-700 hover:outline-none"
                  />
                )}
              />
            </div>
            <Searchbar
              columns={searchColumns}
              setSearchColumn={setSearchColumn}
              setSearchValue={setSearchValue}
              // setFilteredRows={setFilteredRows}
            />
          </div>

          <div className="mb-2 mt-4 text-gray-900 font-medium flex flex-row justify-between">
            <div>Available Assets</div>
            <div>
              {" "}
              <span className="font-bold text-red-500">
                {availableItem.length}
              </span>{" "}
              Items
            </div>
          </div>

          {/* <Box sx={availableItem.length === 0 ? { height: "500px" } : {}}> */}
          <Box sx={{ height: "450px" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.ref_id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 8,
                  },
                },
              }}
              pageSizeOptions={[8]}
              disableRowSelectionOnClick
              checkboxSelection
              onRowSelectionModelChange={(newSelection) =>
                setSelectedRowIds(newSelection)
              }
              rowSelectionModel={selectedRowIds}
              // isRowSelectable={isRowSelectable}
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: "10px", // Font size for cells in rows
                  textAlign: "center",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontSize: "12px", // Font size for column headers
                  fontWeight: "bold",
                },
              }}
            />
            <AssigmentInfo
              open={openViewAssignment}
              onClose={closeViewAssign}
              selectedRow={selectedRow}
            />
          </Box>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-600 py-3 px-8 mb-2 text-white rounded-md hover:bg-blue-700"
              onClick={handleOpenModal}
            >
              Assign
            </button>

            <AssignmentCofirmation
              open={openConfirmModal}
              setOpenConfirmModal={setOpenConfirmModal}
              handleUserAssignment={handleUserAssignment}
              username={username}
            />
          </div>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Assignment;


