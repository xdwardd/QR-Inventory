/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import DisposalModal from "../Modals/DisposalModal";
import ApproveDisposal from "../Modals/DisposalApproval";
import DisapproveDisposal from "../Modals/DisposalDisapproval";
import DisposalDetails from "../Modals/DisposalDetails";
import { useAuth } from "./AuthContext";

import { Navigate, useNavigate } from "react-router-dom";
import { getDisposalApprovalRoute, getDisposalListRoute } from "../utils/inventoryApiEnpoints";
import axios from "axios";
import Searchbar from "../utils/Searchbar";

const Disposal = ({ screens, gsiadApproverEmail, getRegisteredItems }) => {
  const [openDisposalModal, setOpenDisposalModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const [openDisposalDetails, setOpenDisposalDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  /**check user access*/
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

  // Check if user has access to this screen. else return to user default screen
  useEffect(() => {
    if (isAuthenticated && userScreens && !userScreens.includes("11")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  const handleDisposalModal = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setOpenDisposalModal(true);
    setSelectedRow(row);
  };
  const closeDisposalModal = () => {
    setOpenDisposalModal(false);
  };

  //Disposal Details
  const handleDisposalDetails = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setOpenDisposalDetails(true);
    setSelectedRow(row);
  };
  const closeDisposalDetails = () => {
    setOpenDisposalDetails(false);
  };

  /**Get Disposal Lists */
  const [disposalList, setDisposalList] = useState([]);
  const getDisposalList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        getDisposalListRoute,
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
        setDisposalList(response.data);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getDisposalList();
    }
  }, [user]);

  /**Get Disposal Lists */
  const [disposalForApprovaList, setDisposalForApprovalList] = useState([]);
  const getDisposalForApprovalList = async () => {
    try {
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
      setDisposalForApprovalList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getDisposalForApprovalList();
    }
  }, [user]);

  /**Disposal Creation */
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
      field: "po_id",
      headerName: "PO ID",
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
      width: 200,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => (
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
          onClick={(event) => handleDisposalModal(params.row, event)}
        >
          Create Disposal
        </Button>
      ),
    },
  ];

  /**Disposal Creation */
  const columnsForApproval = [
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
      field: "po_id",
      headerName: "PO ID",
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
      field: "creator_id",
      headerName: "Creator ID",
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
      width: 150,
      sortable: false,
      headerAlign: "center",
      renderCell: (params) => (
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
          onClick={(event) => handleDisposalDetails(params.row, event)}
        >
          View
        </Button>
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
  const [filteredRows, setFilteredRows] = useState(disposalList);

  useEffect(() => {
    const filtered = disposalList.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, disposalList]);

  /**Search bar */

  // console.log(disposalForApprovaList);
  /**End Disposal Creation */
  return (
    <>
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">
          <div className="p-6 flex flex-col gap-2">
            <Searchbar
              columns={searchColumns}
              setSearchColumn={setSearchColumn}
              setSearchValue={setSearchValue}
              // setFilteredRows={setFilteredRows}
            />

            <div>
              <div className="mb-4 flex flex-row justify-between">
                <div className=" text-sm font-medium flex items-end">
                  Disposal Creation
                </div>
                <div>
                  <span className="font-medium text-red-500">
                    {disposalList.length}
                  </span>{" "}
                  Items
                </div>
              </div>

              {/* <Box sx={disposalList.length === 0 ? { height: "530px" } : {}}> */}
              <Box sx={{ height: "400px" }}>
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  getRowId={(row) => row.id}
                  loading={isLoading}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[10]}
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
                <DisposalModal
                  open={openDisposalModal}
                  selectedRow={selectedRow}
                  onClose={closeDisposalModal}
                  setOpenDisposalModal={setOpenDisposalModal}
                  getDisposalList={getDisposalList}
                  getDisposalForApprovalList={getDisposalForApprovalList}
                  gsiadApproverEmail={gsiadApproverEmail}
                  getRegisteredItems={getRegisteredItems}
                />
              </Box>
            </div>

            <div>
              <div className="mb-4 mt-8 flex flex-row justify-between">
                <div className=" text-sm font-medium flex items-end">
                  Disposal For Approval
                </div>
                <div>
                  <span className="font-medium text-red-500">
                    {disposalForApprovaList.length}
                  </span>{" "}
                  Items
                </div>
              </div>

              {/* <Box sx={disposalList.length === 0 ? { height: "530px" } : {}}> */}
              <Box sx={{ height: "400px" }}>
                <DataGrid
                  rows={disposalForApprovaList}
                  columns={columnsForApproval}
                  getRowId={(row) => row.id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[10]}
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

                <DisposalModal
                  open={openDisposalModal}
                  selectedRow={selectedRow}
                  onClose={closeDisposalModal}
                  setOpenDisposalModal={setOpenDisposalModal}
                  getDisposalList={getDisposalList}
                  gsiadApproverEmail={gsiadApproverEmail}
                  getDisposalForApprovalList={getDisposalForApprovalList}
                  getRegisteredItems={getRegisteredItems}
                />

                <DisposalDetails
                  open={openDisposalDetails}
                  onClose={closeDisposalDetails}
                  selectedRow={selectedRow}
                  setOpenDisposalDetails={setOpenDisposalDetails}
                  user={user}
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

export default Disposal;
