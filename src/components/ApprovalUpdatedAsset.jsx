import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

import axios from "axios";
import { registeredItemsUpdatedList } from "../utils/inventoryApiEnpoints";
import UpdatedAssetDisapproval from "../Modals/UpdatedAssetDisapproval";
import UpdatedAssetApproval from "../Modals/UpdatedAssetApproval";
import UpdatedAssetDetails from "../Modals/UpdatedAssetDetails";
import Searchbar from "../utils/Searchbar";

const ApprovalUpdatedAsset = ({
  getRegisteredItems,
  getAvailableItem,
  screens
}) => {
  const { isAuthenticated, user } = useAuth();

  //Modals
  const [selectedRow, setSelectedRow] = useState(null);
  const [openUpdateAssetDetails, setOpenUpdateAssetDetails] = useState(false);

  const [openUpdateAssetApproval, setOpenUpdateAssetApproval] = useState(false);
  const [openUpdateAssetDisapproval, setOpenUpdateAssetDisapproval] =
    useState(false);

  const navigate = useNavigate();

  /** -----------------Get Updated Register Items -------------------------*/
  const [isLoading, setIsLoading] = useState(false);
  const [updatedAssetList, setUpdatedAssetList] = useState([]);

  const getUpdatedAssetList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        registeredItemsUpdatedList,
        {
          emp_id: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Assuming you have the token object defined elsewhere
          },
        }
      );
      setTimeout(() => {
        setUpdatedAssetList(response.data);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getUpdatedAssetList();
    }
  }, [user]);

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
    if (isAuthenticated && userScreens && !userScreens.includes("4")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  // updated asset details
  const handleUpdateAssetDetails = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenUpdateAssetDetails(true);
  };

  const handleCloseUpdateAssetDetails = () => {
    setOpenUpdateAssetDetails(false);
  };

  // approval modal
  const handleUpdateAssetApproval = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenUpdateAssetApproval(true);
  };

  const handleCloseUpdateAssetApproval = () => {
    setOpenUpdateAssetApproval(false);
  };

  // disapproval modal
  const handleUpdateAssetDisapproval = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenUpdateAssetDisapproval(true);
  };

  const handleCloseUpdateAssetDisapproval = () => {
    setOpenUpdateAssetDisapproval(false);
  };

  // const handleRowClick = (params, event) => {
  //   event.stopPropagation(); // Stop event propagation
  //   setSelectedRow(params.row);
  // };

  const updateListColumns = [
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
      field: "item_id",
      headerName: "Item ID",
      width: 250,
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
      width: 360,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },

    {
      field: "action",
      headerName: "Action",
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",

      renderCell: (params) => (
        <div className="flex flex-row items-center space-x-2 mt-2 justify-center">
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
            onClick={(event) => handleUpdateAssetDetails(params.row, event)}
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
            onClick={(event) => handleUpdateAssetApproval(params.row, event)}
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
            onClick={(event) => handleUpdateAssetDisapproval(params.row, event)}
          >
            Disapprove
          </Button>
        </div>
      ),
    },
  ];

  /** Search Bar */
  // Columns to exclude from search functionality
  const columnsToExclude = ["action", "quantity"];

  // Filter columns to exclude
  const searchColumns = updateListColumns.filter(
    (col) => !columnsToExclude.includes(col.field)
  );

  const [searchColumn, setSearchColumn] = useState(searchColumns[0].field); // Default to the first column
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(updatedAssetList);

  useEffect(() => {
    const filtered = updatedAssetList.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, updatedAssetList]);

  /**Search bar */

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6">
          <Searchbar
            columns={searchColumns}
            setSearchColumn={setSearchColumn}
            setSearchValue={setSearchValue}
            // setFilteredRows={setFilteredRows}
          />
          <div className="mb-4 mt-4 text-gray-600 flex flex-row justify-between">
            <div className="font-medium ">Updated Items</div>
            <div>
              <span className="font-bold text-red-500">
                {updatedAssetList.length}
              </span>{" "}
              Items
            </div>
          </div>

          {/* <Box sx={updatedAssetList.length === 0 ? { height: "530px" } : {}}> */}
          <Box sx={{ height: "550px" }}>
            <DataGrid
              columns={updateListColumns}
              rows={filteredRows}
              getRowId={(row) => row.ref_id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              loading={isLoading}
              pageSizeOptions={[15]}
              //  onRowClick={(params, event) => handleRowClick(params, event)}
              // disableSelectionOnClick
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

            <UpdatedAssetDetails
              open={openUpdateAssetDetails}
              selectedRow={selectedRow}
              onClose={handleCloseUpdateAssetDetails}
              setOpenUpdateAssetDetails={setOpenUpdateAssetDetails}
              setOpenUpdateAssetApproval={setOpenUpdateAssetApproval}
              setOpenUpdateAssetDisapproval={setOpenUpdateAssetDisapproval}
              getUpdatedAssetList={getUpdatedAssetList}
              getRegisteredItems={getRegisteredItems}
              user={user}
            />
            <UpdatedAssetApproval
              open={openUpdateAssetApproval}
              selectedRow={selectedRow}
              onClose={handleCloseUpdateAssetApproval}
              setOpenUpdateAssetApproval={setOpenUpdateAssetApproval}
              setOpenUpdateAssetDetails={setOpenUpdateAssetDetails}
              getUpdatedAssetList={getUpdatedAssetList}
              getRegisteredItems={getRegisteredItems}
              getAvailableItem={getAvailableItem}
              user={user}
            />
            <UpdatedAssetDisapproval
              open={openUpdateAssetDisapproval}
              selectedRow={selectedRow}
              onClose={handleCloseUpdateAssetDisapproval}
              setOpenUpdateAssetDisapproval={setOpenUpdateAssetDisapproval}
              setOpenUpdateAssetDetails={setOpenUpdateAssetDetails}
              getUpdatedAssetList={getUpdatedAssetList}
              getRegisteredItems={getRegisteredItems}
              getAvailableItem={getAvailableItem}
              user={user}
            />
          </Box>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default ApprovalUpdatedAsset;
