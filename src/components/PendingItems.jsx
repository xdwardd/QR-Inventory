/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { Suspense, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import UpdateModal from "../Modals/UpdatedAsset";
import PrintQrModal from "../Modals/PrintQrModal";
import axios from "axios";
import toCurrency from "../utils/toCurrency";
import { Badge, CircularProgress, Divider } from "@mui/material";
import RegisteredPendingItems from "../Modals/RegisteredPendingItems";
import Searchbar from "../utils/Searchbar";
import Loaders from "../utils/Loaders";
import { pendingItemsRoute } from "../utils/inventoryApiEnpoints";




export default function PendingItems({
  getRegisteredItems,
  // pendingItems,
  // getPendingItems,
  // splitInstances,
  storageLocation,
  getStorageLocation,
  getForItemApproval,
  user
}) {
  const [openRegisterPmodal, setOpenRegisterPmodal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRegisterModal = (row, event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
    setSelectedRow(row);

    setOpenRegisterPmodal(true);
  };

  const closeResgistPendingModal = () => {
    setOpenRegisterPmodal(false);
  };

  const getRowId = (row) => {
    return row.id;
  };

  //Print QR
  const columns = [
    {
      field: "item_id",
      headerName: "Item ID",
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "item_code",
      headerName: "Item Code",
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
      field: "fixed_asset",
      headerName: "Fixed Asset Name",
      width: 200,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 300,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => params.value.toUpperCase(),
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
      field: "action",
      headerName: "Action",
      width: 100,
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
                backgroundColor: "#3492eb",
                color: "white",
              },
            }}
            variant="outlined"
            color="primary"
            onClick={(event) => handleRegisterModal(params.row, event)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  /**--------------------------------- Get Pending Items------------------------------------------ */
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPendingItems = async () => {
    try {
      setLoading(true)
      const response = await axios.get(pendingItemsRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
       
      setPendingItems(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect to get pending items when the token changes
  useEffect(() => {
    getPendingItems();
  }, []); // Add token as a dependency

  /** Search Bar */
  // Columns to exclude from search functionality
  const columnsToExclude = ["action", "quantity"];

  // Filter columns to exclude
  const searchColumns = columns.filter(
    (col) => !columnsToExclude.includes(col.field)
  );

  const [searchColumn, setSearchColumn] = useState(searchColumns[0].field); // Default to the first column
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(pendingItems);

  useEffect(() => {
    const filtered = pendingItems.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, pendingItems]);

  return (
    <>
      <Divider />

      <Searchbar
        columns={searchColumns}
        setSearchColumn={setSearchColumn}
        setSearchValue={setSearchValue}
        // setFilteredRows={setFilteredRows}
      />
      <div className="mb-2 mt-4 text-gray-600 flex flex-row justify-between">
        <div className="font-medium flex items-end ">Pending Items</div>
        <div>
          <span className="font-medium text-red-500">
            {pendingItems.length}
          </span>{" "}
          Items
        </div>
      </div>

      {/* <Box sx={splitInstances.length === 0 ? { height: "530px" } : {}}> */}
      <Box sx={{ height: "500px" }}>
        <DataGrid
          columns={columns}
          // rows={splitInstances}
          rows={filteredRows}
          loading={loading}
          getRowId={getRowId}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[15]}
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

        <RegisteredPendingItems
          open={openRegisterPmodal}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          onClose={closeResgistPendingModal}
          pendingItems={pendingItems}
          getPendingItems={getPendingItems}
          getRegisteredItems={getRegisteredItems}
          setOpenRegisterModal={setOpenRegisterPmodal}
          storageLocation={storageLocation}
          getStorageLocation={getStorageLocation}
          getForItemApproval={getForItemApproval}
          user={user}
        />
      </Box>
    </>
  );
}
