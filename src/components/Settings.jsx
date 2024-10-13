/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useEffect, useState } from "react";
import { Backdrop, Box, Button, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AddUserModal from "../Modals/AddUserModal";
import ViewAccessModal from "../Modals/ViewAccessModal";
import Loaders from "../utils/Loaders";
import { toast } from "react-toastify";
import RemoveUserModal from "../Modals/RemoveUserModal";

import {
  faEye,
  faRemove,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { viewAllAccess, viewAccess } from "../utils/inventoryApiEnpoints";
import Searchbar from "../utils/Searchbar";


const Settings = ({ userList, screens }) => {
  const [userRows, setUserRows] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openViewAccessModal, setOpenViewAccessModal] = useState(false);
  const [openRemoveAccessModal, setOpenRemoveAccessModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewUserAccess, setViewUserAccess] = useState([]);

  const { isAuthenticated, user, logout } = useAuth();
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
    if (isAuthenticated && userScreens && !userScreens.includes("12")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*------------------------------------------------------------------*/

  //Adduser Modal
  const handleAddUser = (row, event) => {
    //  event.stopPropagation(); // Stop event propagation
    setOpenAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setOpenAddUserModal(false);
  };

  //View Access
  const handleViewAccess = (row, event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
    setSelectedRow(row);
    setOpenViewAccessModal(true);
  };

  const closeViewAccessModal = () => {
    setOpenViewAccessModal(false);
  };

  //Remove Access

  const handleRemoveAccess = (row, event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
    setSelectedRow(row);
    setOpenRemoveAccessModal(true);
  };

  const closeRemoveAccessModal = () => {
    setOpenRemoveAccessModal(false);
  };

  const getRowId = (row) => {
    return row.emp_id;
  };

  //get user list
  const getUserManagement = async (row) => {
    try {
      const response = await axios.get(viewAllAccess, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUserRows(response.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserManagement();
  }, []);

  const viewUserAccessInfo = async (row) => {
    event.preventDefault();
    setSelectedRow(row);
    try {
      const response = await axios.post(
        viewAccess,
        { emp_id: row.emp_id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setViewUserAccess(response.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const columns = [
    {
      field: "emp_id",
      headerName: "Employee ID",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
    },
    {
      field: "emp_name",
      headerName: "Name",
      width: 200,
      editable: false,
      sortable: false,
      resizable: false,
    },
    {
      field: "dept_desc",
      headerName: "Department",
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
    },
    {
      field: "position_desc",
      headerName: "Position",
      width: 240,
      editable: false,
      sortable: false,
      resizable: false,
    },
    {
      field: "user_role",
      headerName: "Role",
      width: 200,
      editable: false,
      sortable: false,
      resizable: false,
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
        <div className="flex justify-center mt-4 space-x-4">
          <Tooltip title="View Access">
            <FontAwesomeIcon
              icon={faEye}
              className="h-5 text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={async (event) => {
                await handleViewAccess(params.row, event);
                viewUserAccessInfo(params.row);
              }}
            />
          </Tooltip>
          <Tooltip title="Remove Access ">
            <FontAwesomeIcon
              icon={faTrash}
              className="h-5 text-red-500 hover:text-red-700 cursor-pointer"
              onClick={(event) => handleRemoveAccess(params.row, event)}
            />
          </Tooltip>

          {/* <Button
            sx={{
              paddingTop: "8px",
              fontSize: "10px",
              "&:hover": {
                backgroundColor: "#f54842",
                color: "white",
              },
            }}
            variant="outlined"
            color="error"
            onClick={(event) => handleRemoveAccess(params.row, event)}
          >
            Remove Access
          </Button> */}
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
  const [filteredRows, setFilteredRows] = useState(userRows);

  useEffect(() => {
    const filtered = userRows.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, userRows]);

  /**Search bar */

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 h-screen">
          <div className="mb-4 flex flex-row justify-between">
            <div className="flex items-end">
              <button
                type="button"
                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={handleAddUser}
              >
                Register
              </button>
            </div>
            <Searchbar
              columns={searchColumns}
              setSearchColumn={setSearchColumn}
              setSearchValue={setSearchValue}
            />
          </div>
          

          {/* <Box sx={userRows.length === 0 ? { height: "530px" } : {}}> */}
          <Box sx={{ height: "530px" }}>
            <Backdrop open={isloading} style={{ color: "#fff", zIndex: 1200 }}>
              <Loaders />
            </Backdrop>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={getRowId}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 12,
                  },
                },
              }}
              pageSizeOptions={[12]}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell": {
                  fontSize: "10px", // Font size for cells in rows
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontSize: "12px", // Font size for column headers
                  fontWeight: "bold",
                },
              }}
            />

            <AddUserModal
              open={openAddUserModal}
              onClose={closeAddUserModal}
              setOpenAddUserModal={setOpenAddUserModal}
              getUserManagement={getUserManagement}
              userList={userList}
              user={user}
            />

            <ViewAccessModal
              open={openViewAccessModal}
              selectedRow={selectedRow}
              // setSelectedRow={setSelectedRow}
              userAccess={viewUserAccess}
              onClose={closeViewAccessModal}
              getUserManagement={getUserManagement}
              setOpenViewAccessModal={setOpenViewAccessModal}
              user={user}
            />

            <RemoveUserModal
              open={openRemoveAccessModal}
              selectedRow={selectedRow}
              onClose={closeRemoveAccessModal}
              getUserManagement={getUserManagement}
              setOpenRemoveAccessModal={setOpenRemoveAccessModal}
              user={user}
            />
          </Box>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default Settings;
