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
import PrintQrModal from "../Modals/PrintQrModal";
import axios from "axios";
import {Divider, Tooltip, Button} from "@mui/material";
import {faEye,faPencil,faPrint} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "./AuthContext";
import {
  registeredItemsUpdatedList,
} from "../utils/inventoryApiEnpoints";
import UpdateAsset from "../Modals/UpdatedAsset";
import Searchbar from "../utils/Searchbar";
import ItemDetails from "../Modals/ItemDetails";
import QRCode from "qrcode.react";


export default function Table({
  registeredItems,
  getRegisteredItems,
  getAvailableItem,
  getForItemApproval,
  storageLocation,
  getStorageLocation,
  user,
  gsiadApproverEmail
}) {
  // const { user } = useAuth();

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openPrintQRModal, setOpenPrintQRModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [responseQr, setResponseQr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (registeredItems.length !== 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [registeredItems]);

  /** -----------------Get Updated Register Items -------------------------*/
  const [updatedAssetList, setUpdatedAssetList] = useState([]);

  const getUpdatedAssetList = async () => {
    try {
      const response = await axios.post(
        registeredItemsUpdatedList,
        {
          emp_id: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setUpdatedAssetList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getUpdatedAssetList();
    }
  }, [user]);

  //Update
  const handleUpdateClick = (row, event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
    setSelectedRow(row);
    // console.log(row);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedRow(null);
  };

  const handleRowClick = (params, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(params.row);
  };

  //Print QR
  const handlePrintQRClick = (row, event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
    setOpenPrintQRModal(true);
    setSelectedRow(row);
    //console.log(row.invent_id);
  };

  const handleClosePrintQRModal = () => {
    setOpenPrintQRModal(false);
  };

  //Open Item Details

  const [openItemDetailsModal, setOpenItemDetailsModal] = useState(false);

  const handleOpenItemDetails = (row, event) => {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
    setSelectedRow(row);
    setOpenItemDetailsModal(true)
    
  }




  //Print QR
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
    // {
    //   field: "item_id",
    //   headerName: "Item ID",
    //   width: 150,
    //   editable: false,
    //   sortable: false,
    //   resizable: false,
    //   headerAlign: "center",
    // },
    {
      field: "item_name",
      headerName: "Item Name",
      width: 250,
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
      width: 150,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",

      renderCell: (params) => (
        <div className="flex flex-row items-center space-x-4 mt-4 justify-center">
          <Tooltip title="View Asset">
            <FontAwesomeIcon
              icon={faEye}
              className="h-5 text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={(event) => handleOpenItemDetails(params.row, event)}
            />
          </Tooltip>
          <Tooltip title="Update Asset">
            <FontAwesomeIcon
              icon={faPencil}
              className="h-5 text-green-500 hover:text-green-700 cursor-pointer"
              onClick={(event) => handleUpdateClick(params.row, event)}
            />
          </Tooltip>

          <Tooltip title="Print QR">
            <FontAwesomeIcon
              icon={faPrint}
              className="h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={async (event) => {
                await handlePrintQRClick(params.row, event);
                // handleGetQr(params.row);
              }}
            />
          </Tooltip>
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
  const [filteredRows, setFilteredRows] = useState(registeredItems);

  useEffect(() => {
    const filtered = registeredItems.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, registeredItems]);

  /**Search bar */

  return (
    <div className="mb-10">
      <Divider />
      <Searchbar
        columns={searchColumns}
        setSearchColumn={setSearchColumn}
        setSearchValue={setSearchValue}
      />
      <div>
        <div className="mb-4 flex flex-row justify-between mt-2">
          <div className=" text-sm font-medium flex items-end">
            Registered Items
          </div>
          <div>
            <span className="font-medium text-red-500">
              {registeredItems.length}
            </span>{" "}
            Items
          </div>
        </div>

        {/* <Box sx={registeredItems.length === 0 ? { height: "530px" } : {}}> */}

        <Box sx={{ height: "530px" }}>
          <DataGrid
            columns={columns}
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
            onRowClick={(params, event) => handleRowClick(params, event)}
            disableSelectionOnClick
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
          <ItemDetails
            open={openItemDetailsModal}
            setOpenItemDetailsModal={setOpenItemDetailsModal}
            selectedRow={selectedRow}
            user={user}
          />

          <UpdateAsset
            open={openUpdateModal}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            onClose={handleCloseUpdateModal}
            getRegisteredItems={getRegisteredItems}
            getForItemApproval={getForItemApproval}
            getAvailableItem={getAvailableItem}
            setOpeUpdateModal={setOpenUpdateModal}
            updatedAssetList={updatedAssetList}
            getUpdatedAssetList={getUpdatedAssetList}
            storageLocation={storageLocation}
            getStorageLocation={getStorageLocation}
            user={user}
            gsiadApproverEmail={gsiadApproverEmail}
          />
          <PrintQrModal
            open={openPrintQRModal}
            selectedRow={selectedRow}
            responseQr={responseQr}
            onClose={handleClosePrintQRModal}
          />
        </Box>
      </div>

      {/* <div>Ignore these changes</div>
      <div className="flex flex-col items-center">
        {registeredItems.map((item, index) => {
          const qrValue = `
        -- QR Inventory System -- 
        Ref ID: ${item.ref_id}
        Fixed Asset: ${item.fixed_asset}
        Item Name: ${item.item_name}
        Quantity: ${item.quantity}
        Price: ${item.price}
        Date Received: ${item.date_received}
        Date Expire: ${item.date_expire}
        Model Number: ${item.model_number}
        Serial Number: ${item.serial_number}
        Storage Location: ${item.storage_location}
        `;

          return (
            <div key={index} className="m-4">
              <QRCode value={qrValue} size={300} />
              <p>
                {item.item_name} - {item.ref_id}
              </p>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}


