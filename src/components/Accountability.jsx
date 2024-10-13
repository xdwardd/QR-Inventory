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
import AcknowledgeAccountability from "../Modals/AcknowledgeAccountability";
import DeclinedAccountability from "../Modals/DeclinedAccountability";
import AccountabilityAssetInfo from "../Modals/AccountabilityAssetInfo";
import { v4 as uuidv4 } from "uuid";
import {getAccountableUserRoute} from "../utils/inventoryApiEnpoints"
import axios from "axios";
import Searchbar from "../utils/Searchbar";



const Accountability = ({
  screens,
  gsiadApproverEmail,
}) => {
  const { isAuthenticated, user } = useAuth();

  const [openAccountabilityAssetInfo, setOpenAccountabilityAssetInfo] =
    useState(false);
  const [openAcknowledgeAccountability, setOpenAcknowledgeAccountability] =
    useState(false);
  const [openDeclinedAccountability, setOpenDeclinedAccountability] =
    useState(false);

  const [selectedRow, setSelectedRow] = useState(null);

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
    if (isAuthenticated && userScreens && !userScreens.includes("8")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*----------------------------------------------------------------------*/

  //view For Acknowledgement Modal Info Modal
  const handleOpenAccountabilityAssetInfo = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenAccountabilityAssetInfo(true);
  };

  const closeAccountabilityAssetInfo = () => {
    setOpenAccountabilityAssetInfo(false);
  };

  //Decline Modal
  const handleDeclineAccountability = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenDeclinedAccountability(true);
  };

  const closeDeclinedAccountability = () => {
    setOpenDeclinedAccountability(false);
  };

  //Acknowledge Modal
  const handleAcknowledgeAccountability = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenAcknowledgeAccountability(true);
  };

  const closeAcknowledgeAccountibilty = () => {
    setOpenAcknowledgeAccountability(false);
  };

  /**-------------------------------- Get Accountable User ------------------------------------- */
  const [accountabilityList, setAccountabilitiyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAccountabilityList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        getAccountableUserRoute,
        {
          assigned_user: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // setTimeout(() => {
      //   setAccountabiltiyList(response.data);
      //   setIsLoading(false);
      // }, 3000);
      // Add a unique id (UUID) to each item in the response data
      const dataWithUUID = response.data.map((item) => ({
        ...item,
        id: uuidv4(),
      }));

      setTimeout(() => {
        setAccountabilitiyList(dataWithUUID);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getAccountabilityList();
    }
  }, [user]);
  
  console.log(accountabilityList);
  

  //filter for acknowledgement item
  const forAcknowledgementList = accountabilityList.filter(
    (item) => item.status == "USER-ASSIGNMENT: DEPARTMENT HEAD APPROVED"
  );

  //Acknowledgement
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
      field: "quantity",
      headerName: "Quantity",
      width: 150,
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
      field: "storage_location",
      headerName: "Storage Location",
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
      width: 260,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center mt-1.5 space-x-2">
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
            onClick={(event) =>
              handleOpenAccountabilityAssetInfo(params.row, event)
            }
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
            onClick={(event) =>
              handleAcknowledgeAccountability(params.row, event)
            }
          >
            Acknowledge
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
            onClick={(event) => handleDeclineAccountability(params.row, event)}
          >
            Decline
          </Button>
        </div>
      ),
    },
  ];

  // Close Acknowledgement

  /**Acknowledge and Declined Assets */

  //filter acknowledge item
  const acknowledgeAssets = accountabilityList.filter(
    (item) =>
      item.status == "USER ACCOUNTABILITY: USER ACKNOWLEDGED" ||
      item.status == "USER-CLEARANCE: PENDING FOR DEPARTMENT HEAD APPROVAL" ||
      item.status == "USER-CLEARANCE: DEPARTMENT HEAD DISAPPROVED" ||
      item.status == "USER-CLEARANCE: PENDING FOR GSIAD APPROVAL" ||
      item.status == "USER-CLEARANCE: GSIAD DISAPPROVED" ||
      item.status == "USER-CLEARANCE: USER CLEARED"
  );

  //filter acknowledge item
  const declinedAsset = accountabilityList.filter(
    (item) => item.status == "USER ACCOUNTABILITY: USER DECLINED"
  );

  const [currentView, setCurrentView] = useState("acknowledge_asset"); // Default view is pending
  const [isOpenAcknowledgeAsset, setIsOpenAcknowledgeAsset] = useState(false);
  const [isOpenDeclinedAsset, setIsOpenDeclinedAsset] = useState(false);

  const toggleAcknowledge = () => {
    setCurrentView("acknowledge_asset");
    setIsOpenAcknowledgeAsset(true);
    setIsOpenDeclinedAsset(false);
  };

  const toggleDeclined = () => {
    setCurrentView("declined_asset");
    setIsOpenDeclinedAsset(true);
    setIsOpenAcknowledgeAsset(false);
  };

  const columnListAcknowledgement = [
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
      field: "po_id",
      headerName: "PO ID",
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
      field: "storage_location",
      headerName: "Storage Location",
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
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => (
        <div className="flex justify-center mt-1.5 space-x-2">
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
            onClick={(event) =>
              handleOpenAccountabilityAssetInfo(params.row, event)
            }
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
  const [filteredRows, setFilteredRows] = useState(forAcknowledgementList);

  useEffect(() => {
    const filtered = forAcknowledgementList.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, accountabilityList]);

  /**Search bar */

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 h-full ">
          <Searchbar
            columns={searchColumns}
            setSearchColumn={setSearchColumn}
            setSearchValue={setSearchValue}
            // setFilteredRows={setFilteredRows}
          />
          <div className="">
            <div className="mb-4 flex flex-row justify-between mt-2">
              <div className=" text-sm font-medium flex items-end">
                For Acknowledgement
              </div>
              <div>
                <span className="font-medium text-red-500">
                  {forAcknowledgementList.length}
                </span>{" "}
                Items
              </div>
            </div>

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

              <AccountabilityAssetInfo
                open={openAccountabilityAssetInfo}
                onClose={closeAccountabilityAssetInfo}
                selectedRow={selectedRow}
                setOpenAcknowledgeAccountability={
                  setOpenAcknowledgeAccountability
                }
                setOpenDeclinedAccountability={setOpenDeclinedAccountability}
              />
              <AcknowledgeAccountability
                open={openAcknowledgeAccountability}
                onClose={closeAcknowledgeAccountibilty}
                setOpenAcknowledgeAccountability={
                  setOpenAcknowledgeAccountability
                }
                selectedRow={selectedRow}
                getAccountabilityList={getAccountabilityList}
                setOpenAccountabilityAssetInfo={setOpenAccountabilityAssetInfo}
                user={user}
                gsiadApproverEmail={gsiadApproverEmail}
              />
              <DeclinedAccountability
                open={openDeclinedAccountability}
                onClose={closeDeclinedAccountability}
                setOpenDeclinedAccountability={setOpenDeclinedAccountability}
                selectedRow={selectedRow}
                getAccountabilityList={getAccountabilityList}
                setOpenAccountabilityAssetInfo={setOpenAccountabilityAssetInfo}
                user={user}
                gsiadApproverEmail={gsiadApproverEmail}
              />
            </Box>
          </div>

          {/* Acknowledge and Declined Assets */}
          <div className="flex flex-col mt-10 space-y-8">
            <div className="flex flex-row justify-between">
              <div className="flex justify-start mt-8 gap-3 cursor-pointer">
                <div
                  className="text-md"
                >
                  List of Acknowledge Assets
                </div>
                {/* <div>/</div>
                <div
                  className={`${
                    currentView == `declined_asset`
                      ? "text-blue-500 font-semibold border-b-2 border-blue-500"
                      : "text-l"
                  }`}
                  onClick={toggleDeclined}
                >
                  List of Declined Assets
                </div> */}
              </div>
            </div>
            <div>
              <Box sx={{ height: "400px" }}>
                <DataGrid
                  rows={
                    acknowledgeAssets
                    // currentView == "acknowledge_asset"
                    //   ? acknowledgeAssets
                    //   : declinedAsset
                  }
                  columns={columnListAcknowledgement}
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

                {/* <DeclineModal open={openDeclineModal} onClose={closeModal} /> */}
              </Box>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default Accountability;
