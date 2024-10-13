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
import Button from "@mui/material/Button";
import Sidebar from "./Sidebar";
import ClearanceModal from "../Modals/ClearanceModal";

import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import { getAccountableUserRoute, getClearanceListMasterRoute, getClearanceListRoute } from "../utils/inventoryApiEnpoints";
import ClearanceDetails from "../Modals/ClearanceDetails";
import Searchbar from "../utils/Searchbar";



const Clearance = ({
  screens,
  gsiadApproverEmail,
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  const [openClearanceModal, setOpenClearanceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

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
    if (isAuthenticated && userScreens && !userScreens.includes("9")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*------------------------------------------------------------------*/

  const handleCreateClearance = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setOpenClearanceModal(true);
    setSelectedRow(row);
  };
  const closeModal = () => {
    setOpenClearanceModal(false);
  };

  /**-------------------------------- Get Clearance List ------------------------------------- */
  const [clearanceList, setClearanceList] = useState([]);
  const getClearanceList= async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        getClearanceListMasterRoute,
        {
          emp_id: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTimeout(() => {
        setIsLoading(false);
        setClearanceList(response.data);
        console.log(response.data);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getClearanceList();
    }
  }, [user]);



  // /**-------------------------------- Get Clearance List ------------------------------------- */

  // const [clearanceList, setClearanceList] = useState([]);
  // const getClearanceList = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.post(
  //       getClearanceListRoute,
  //       {
  //         emp_id: user && user[0].emp_id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       }
  //     );
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       setClearanceList(response.data);
  //       console.log(response.data);
  //     }, 3000);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (user != null) {
  //     getClearanceList();
  //   }
  // }, [user]);

  // const filteredClearanceList = clearanceList.filter(
  //   (item) =>
  //     item.status == "USER ACCOUNTABILITY: USER ACKNOWLEDGED" ||
  //     item.status == "USER-CLEARANCE: DEPARTMENT HEAD DISAPPROVED" ||
  //     item.status == "USER-CLEARANCE: GSIAD DISAPPROVED"
  // );

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
      field: "item_name",
      headerName: "Item Name",
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "assigned_user",
      headerName: "Assigned User",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => params.value.toUpperCase(), // Add this line
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
      field: "warranty",
      headerName: "Warranty",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "date_expire",
      headerName: "Expiration Date",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "model_number",
      headerName: "Model Number",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "serial_number",
      headerName: "Serial Number",
      width: 150,
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
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },

    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Button
          sx={{
            paddingTop: "8px",
            fontSize: "10px",
            backgroundColor: "#455A64",
            borderColor: "#FFA000",
            border: "1px, solid",
            color: "white",
            "&:hover": {
              borderColor: "#636363",
              border: "1px, solid",
              backgroundColor: "#37474F",
              color: "white",
            },
          }}
          // variant="outlined"
          // color="error"
          onClick={(event) => handleCreateClearance(params.row, event)}
        >
          Create Clearance
        </Button>
      ),
    },
  ];

  /**------------------Get Created Clearance ----------------------- */

  const [createdClearanceList, setCreatedClearanceList] = useState([]);
  const [openClearanceDetails, setOpenClearanceDetails] = useState(false);

  //clearance details
  const handleClearanceDetails = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenClearanceDetails(true);
  };

  const closeClearanceDetails = () => {
    setOpenClearanceDetails(false);
  };

  const getCreatedClearanceList = async () => {
    try {
      // setIsLoading(true);
      const response = await axios.post(
        getClearanceListRoute,
        {
          assigned_user: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setCreatedClearanceList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getCreatedClearanceList();
    }
  }, [user]);

  // //filter clearance
  // const clearanceCreated = createdClearanceList.filter(
  //   (item) =>
  //     item.status == "USER-CLEARANCE: PENDING FOR DEPARTMENT HEAD APPROVAL" ||
  //     item.status == "USER-CLEARANCE: DEPARTMENT HEAD DISAPPROVED" ||
  //     item.status == "USER-CLEARANCE: PENDING FOR GSIAD APPROVAL" ||
  //     item.status == "USER-CLEARANCE: GSIAD DISAPPROVED" ||
  //     item.status == "USER-CLEARANCE: USER CLEARED"
  // );

  const createdClearanceColumns = [
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
      field: "item_name",
      headerName: "Item Name",
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "assigned_user",
      headerName: "Assigned User",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => params.value.toUpperCase(), // Add this line
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
      field: "warranty",
      headerName: "Warranty",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "date_expire",
      headerName: "Expiration Date",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "model_number",
      headerName: "Model Number",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "serial_number",
      headerName: "Serial Number",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 350,
      editable: false,
      sortable: false,
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
        <div className="flex justify-center mt-1.5 space-x-2">
          <>
            <Button
              sx={{
                paddingTop: "8px",
                fontSize: "10px",
                "&:hover": {
                  backgroundColor: "#3492eb",
                  color: "white",
                },
              }}
              variant="outlined"
              color="primary"
              onClick={(event) => {
                handleClearanceDetails(params.row, event);
              }}
            >
              View
            </Button>
          </>
        </div>
      ),

      //   valueGetter: (value, row) =>
      //     `${row.firstName || ""} ${row.lastName || ""}`,
    },
  ];

  // /** Search Bar */
  // // // Columns to exclude from search functionality
  const columnsToExclude = ["action", "quantity"];

  // // // Filter columns to exclude
  const searchColumns = columns.filter(
    (col) => !columnsToExclude.includes(col.field)
  );

  const [searchColumn, setSearchColumn] = useState(searchColumns[0].field); // Default to the first column
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(clearanceList);

  useEffect(() => {
    const filtered = clearanceList.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, clearanceList]);

  // /**Search bar */

  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen p-6">
          {/* <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
            <Loaders />
          </Backdrop> */}

          <Searchbar
            columns={searchColumns}
            setSearchColumn={setSearchColumn}
            setSearchValue={setSearchValue}
            // setFilteredRows={setFilteredRows}
          />

          <div className="mb-2 mt-4 flex flex-row items-end justify-between">
            <div>Clearance Creation</div>
            <div>
              <span className="font-bold text-red-500">
                {clearanceList.length}
              </span>{" "}
              Items
            </div>
          </div>

          <div className="">
            {/* <Box sx={filteredClearanceList.length === 0 ? { height: "530px" } : {}}> */}
            <Box sx={{ height: "400px" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row.id}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                loading={isLoading}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
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
              <ClearanceModal
                open={openClearanceModal}
                selectedRow={selectedRow}
                onClose={closeModal}
                setOpenClearanceModal={setOpenClearanceModal}
                getClearanceList={getClearanceList}
              
                user={user}
                gsiadApproverEmail={gsiadApproverEmail}
                getCreatedClearanceList={getCreatedClearanceList}
              />
            </Box>

            {/* For Clearance Approval */}
            <div className="mt-8 mb-8">
              <div className="mb-2 flex flex-row items-end justify-between">
                <div>For Clearance Approval</div>
                <div>
                  <span className="font-bold text-red-500">
                    {createdClearanceList.length}
                  </span>{" "}
                  Items
                </div>
              </div>

              <Box sx={{ height: "400px" }}>
                <DataGrid
                  rows={createdClearanceList}
                  columns={createdClearanceColumns}
                  getRowId={(row) => row.id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  disableRowSelectionOnClick
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
                <ClearanceDetails
                  open={openClearanceDetails}
                  onClose={closeClearanceDetails}
                  setOpenClearanceDetails={setOpenClearanceDetails}
                  selectedRow={selectedRow}
                />
              </Box>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default Clearance;
