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

import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import DisapproveDisposal from "../Modals/DisposalDisapproval";
import { getDisposalApprovalRoute } from "../utils/inventoryApiEnpoints";
import DisposalApproval from "../Modals/DisposalApproval";
import DisposalDetails from "../Modals/DisposalDetails";
import DisposalDisapproval from "../Modals/DisposalDisapproval";
import Searchbar from "../utils/Searchbar";

const ApprovalDisposal = ({ screens }) => {
  const { isAuthenticated, user } = useAuth();

  const [openDisposalDetails, setOpenDisposalDetails] = useState(false);
  const [openDisposalApproval, setOpenDisposalApproval] = useState(false);
  const [openDisposalDisapproval, setOpenDisapprovalDisposal] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  // const [responseData, setResponseData] = useState(null);
  // const [responseFilePath, setResponseFilePath] = useState(null);
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
    if (isAuthenticated && userScreens && !userScreens.includes("6")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*-----------------------------------------------------------------------*/

  //clearance details
  const handleDisposalDetails = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenDisposalDetails(true);
  };

  const closeDisposalDetails = () => {
    setOpenDisposalDetails(false);
  };

  //Disposal Approval  Modal
  const handleDisposalApproval = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenDisposalApproval(true);
  };

  const closeDisposalApproval = () => {
    setOpenDisposalApproval(false);
  };

  //Disposal Disapproval Modal
  const handleDisposalDisapproval = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenDisapprovalDisposal(true);
  };

  const closeDisposalDisapproval = () => {
    setOpenDisapprovalDisposal(false);
  };

  /**-------------------------------- Get for approval List ------------------------------------- */
  const [isLoading, setIsLoading] = useState(false);
  const [approvalDisposalList, setApprovalDisposalList] = useState([]);
  const getApprovalDisposal = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        getDisposalApprovalRoute,
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
        setApprovalDisposalList(response.data);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getApprovalDisposal();
    }
  }, [user]);

  const pendingForDisposalApproval = approvalDisposalList.filter(
    (item) => item.status == "DISPOSAL: FOR DISPOSAL APPROVAL"
  );

  const disposalListHistory = approvalDisposalList.filter(
    (item) => item.status !== "DISPOSAL: FOR DISPOSAL APPROVAL"
  );
  console.log(pendingForDisposalApproval);

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
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },

    {
      field: "action",
      headerName: "Action",
      width: 350,
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
                handleDisposalDetails(params.row, event);
              }}
            >
              View
            </Button>

            <Button
              sx={{
                paddingTop: "8px",
                fontSize: "10px",
                "&:hover": {
                  backgroundColor: "#38a624",
                  color: "white",
                },
              }}
              variant="outlined"
              color="success"
              onClick={(event) => handleDisposalApproval(params.row, event)}
            >
              Aprrove
            </Button>

            <Button
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
              onClick={(event) => handleDisposalDisapproval(params.row, event)}
            >
              Disapprove
            </Button>
          </>
        </div>
      ),
    },
  ];

  const columnsDisposalHistory = [
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
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },

    {
      field: "action",
      headerName: "Action",
      width: 150,
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
                handleDisposalDetails(params.row, event);
              }}
            >
              View
            </Button>
          </>
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
  const [filteredRows, setFilteredRows] = useState(pendingForDisposalApproval);

  useEffect(() => {
    const filtered = pendingForDisposalApproval.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, approvalDisposalList]);

 const [filteredRows1, setFilteredRows1] = useState(disposalListHistory);
  const [searchValue1, setSearchValue1] = useState("");

 useEffect(() => {
   const filtered1 = disposalListHistory.filter((row) => {
     const fieldValue = row[searchColumn];
     return fieldValue
       ?.toString()
       .toLowerCase()
       .includes(searchValue1.toLowerCase());
   });
   setFilteredRows1(filtered1);
 }, [searchColumn, searchValue1, approvalDisposalList]);

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 flex flex-col space-y-20 h-screen">
          <div className="">
            <Searchbar
              columns={searchColumns}
              setSearchColumn={setSearchColumn}
              setSearchValue={setSearchValue}
              // setFilteredRows={setFilteredRows}
            />
            <div className="flex flex-col gap-8">
              <div>
                <div className="mb-2 mt-4 flex flex-row justify-between">
                  <div className=" text-sm font-medium flex items-end mb-2">
                    For Disposal Approval
                  </div>
                  <div>
                    <span className="font-bold text-red-500">
                      {pendingForDisposalApproval.length}
                    </span>{" "}
                    Items
                  </div>
                </div>

                <Box sx={{ height: "400px" }}>
                  <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    loading={isLoading}
                    getRowId={(row) => row.id}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    // disableRowSelectionOnClick
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

                  <DisposalDetails
                    open={openDisposalDetails}
                    onClose={closeDisposalDetails}
                    selectedRow={selectedRow}
                    getApprovalDisposal={getApprovalDisposal}
                    setOpenDisposalDetails={setOpenDisposalDetails}
                    setOpenDisposalApproval={setOpenDisposalApproval}
                    setOpenDisapprovalDisposal={setOpenDisapprovalDisposal}
                    user={user}
                  />

                  <DisposalApproval
                    open={openDisposalApproval}
                    onClose={closeDisposalApproval}
                    selectedRow={selectedRow}
                    getApprovalDisposal={getApprovalDisposal}
                    setOpenDisposalDetails={setOpenDisposalDetails}
                    setOpenDisposalApproval={setOpenDisposalApproval}
                    user={user}
                  />

                  <DisposalDisapproval
                    open={openDisposalDisapproval}
                    onClose={closeDisposalDisapproval}
                    selectedRow={selectedRow}
                    getApprovalDisposal={getApprovalDisposal}
                    setOpenDisposalDetails={setOpenDisposalDetails}
                    setOpenDisapprovalDisposal={setOpenDisapprovalDisposal}
                    user={user}
                  />
                </Box>
              </div>
              <div className="mb-10">
                <Searchbar
                  columns={searchColumns}
                  setSearchColumn={setSearchColumn}
                  setSearchValue={setSearchValue1}
                  // setFilteredRows={setFilteredRows}
                />
                <div className="mb-2 mt-4 flex flex-row justify-between">
                  <div className=" text-sm font-medium flex items-end mb-2">
                    Disposal History
                  </div>
                  <div>
                    <span className="font-bold text-red-500">
                      {disposalListHistory.length}
                    </span>{" "}
                    Items
                  </div>
                </div>

                <Box sx={{ height: "400px" }}>
                  <DataGrid
                    rows={filteredRows1}
                    columns={columnsDisposalHistory}
                    getRowId={(row) => row.id}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    pageSizeOptions={[5]}
                    // disableRowSelectionOnClick
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
                </Box>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};
export default ApprovalDisposal;
