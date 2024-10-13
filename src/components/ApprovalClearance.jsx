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
import ClearanceDetails from "../Modals/ClearanceDetails";
import { getClearanceApprovalRoute } from "../utils/inventoryApiEnpoints";
import ClearanceApproval from "../Modals/ClearanceApproval";
import ClearanceDisapproval from "../Modals/ClearanceDisapproval";
import Searchbar from "../utils/Searchbar";



const ApprovalClearance = ({

  screens,
  gsiadApproverEmail,
  getRegisteredItems,
  getAvailableItem
}) => {
  const { isAuthenticated, user } = useAuth();

  const [openDisapproveClearanceModal, setOpenDisapproveClearanceModal] =
    useState(false);
  const [openClearanceApprovalModal, setOpenClearanceApprovalModal] =
    useState(false);
  const [openClearanceDetails, setOpenClearanceDetails] = useState(false);
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
  const handleClearanceDetails = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenClearanceDetails(true);
  };

  const closeClearanceDetails = () => {
    setOpenClearanceDetails(false);
  };

  //Acknowledge Modal
  const approveClearanceClick = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenClearanceApprovalModal(true);
  };

  const closeClearanceApprovalModal = () => {
    setOpenClearanceApprovalModal(false);
  };

  //Decline Modal
  const handleDisapproveClearane = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenDisapproveClearanceModal(true);
  };

  const closeDisapproveClearanceModal = () => {
    setOpenDisapproveClearanceModal(false);
  };

  /**-------------------------------- Get Approval Clearance List ------------------------------------- */

  const [isLoading, setIsLoading] = useState(false);
  const [approvalClearanceList, setApprovalClearanceList] = useState([]);
  const getApprovalClearanceList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        getClearanceApprovalRoute,
        {
          emp_id: user && user[0].emp_id,
          dept_desc: user && user[0].dept_desc,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTimeout(() => {
        setApprovalClearanceList(response.data);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    if (user != null) {
      getApprovalClearanceList();
    }
  }, [user]);


  console.log(approvalClearanceList);
  

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
      headerName: "Name",
      width: 150,
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
      width: 400,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },

    //hide this if status is USER-CLEARANCE: GSIAD APPROVED

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
                handleClearanceDetails(params.row, event);
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
              onClick={(event) => approveClearanceClick(params.row, event)}
            >
              Approve
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
              onClick={(event) => handleDisapproveClearane(params.row, event)}
            >
              Disapprove
            </Button>
          </>
        </div>
      ),

      //   valueGetter: (value, row) =>
      //     `${row.firstName || ""} ${row.lastName || ""}`,
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
  const [filteredRows, setFilteredRows] = useState(approvalClearanceList);

  useEffect(() => {
    const filtered = approvalClearanceList.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, approvalClearanceList]);
  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 flex flex-col space-y-20 h-screen">
          <div className="">
              <Searchbar
              columns={searchColumns}
              setSearchColumn={setSearchColumn}
              setSearchValue={setSearchValue} />
            
            <div className="mb-4 mt-4 flex flex-row justify-between">
              <div className=" text-sm font-medium flex items-end">
                For Clearance Approval
              </div>
              <div>
                <span className="font-medium text-red-500">
                  {approvalClearanceList.length}
                </span>{" "}
                Items
              </div>
            </div>
          
            <div className="flex flex-col gap-8">
              <Box sx={{ height: "550px" }}>
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  getRowId={(row) => row.ref_id}
                  loading={isLoading}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 8,
                      },
                    },
                  }}
                  pageSizeOptions={[8]}
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
                <ClearanceDetails
                  open={openClearanceDetails}
                  onClose={closeClearanceDetails}
                  setOpenClearanceDetails={setOpenClearanceDetails}
                  selectedRow={selectedRow}
                  setOpenClearanceApprovalModal={setOpenClearanceApprovalModal}
                  setOpenDisapproveClearanceModal={
                    setOpenDisapproveClearanceModal
                  }
                  user={user}
                />
                <ClearanceApproval
                  open={openClearanceApprovalModal}
                  onClose={closeClearanceApprovalModal}
                  setOpenClearanceApprovalModal={setOpenClearanceApprovalModal}
                  selectedRow={selectedRow}
                  getApprovalClearanceList={getApprovalClearanceList}
                  setOpenClearanceDetails={setOpenClearanceDetails}
                  user={user}
                  gsiadApproverEmail={gsiadApproverEmail}
                  getRegisteredItems={getRegisteredItems}
                  getAvailableItem={getAvailableItem}
                />

                <ClearanceDisapproval
                  open={openDisapproveClearanceModal}
                  onClose={closeDisapproveClearanceModal}
                  setOpenDisapproveClearanceModal={
                    setOpenDisapproveClearanceModal
                  }
                  selectedRow={selectedRow}
                  getApprovalClearanceList={getApprovalClearanceList}
                  setOpenClearanceDetails={setOpenClearanceDetails}
                  user={user}
                  gsiadApproverEmail={gsiadApproverEmail}
                  getRegisteredItems={getRegisteredItems}
                  getAvailableItem={getAvailableItem}
                />
              </Box>

              {/* <div>
                <div className="mb-4">List of Approved Clearance</div>
                <Box sx={{}}>
                  <DataGrid
                    rows={ApprovedList}
                    columns={approvedClearanceColumn}
                    getRowId={getRowId}
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
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        fontSize: "12px", // Font size for column headers
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Box>
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default ApprovalClearance;