import { faEye, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Divider, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect} from 'react'
import DisapproveItemDetails from '../Modals/DisapproveItemDetails';
import UpdatedAsset from '../Modals/UpdatedAsset';
import UpdateDisapproveItem from '../Modals/UpdateDisapproveItem';
import DeleteDisapproveItem from '../Modals/DeleteDisapproveItem';
import Searchbar from '../utils/Searchbar';

const DisapproveRegistration = ({disapproveItems, getDisapproveItems, user, storageLocation}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDelete = (row) => {
    setOpenDeleteModal(true);
    setSelectedRow(row);
  };

  const handleUpdate = (row) => {
    setOpenUpdateModal(true);
    setSelectedRow(row);
  };

  const handleView = (row) => {
    setOpenViewModal(true);
    setSelectedRow(row);
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
      field: "item_id",
      headerName: "Item ID",
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
      width: 200,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",

      renderCell: (params) => (
        <div className="flex flex-row items-center gap-4 mt-2 justify-center">
          <Tooltip title="View Item">
            <FontAwesomeIcon
              icon={faEye}
              className="h-5 text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={(event) => handleView(params.row, event)}
            />
          </Tooltip>
          {/* <Tooltip title="Update Item">
            <FontAwesomeIcon
              icon={faPencil}
              className="h-5 text-green-700 hover:text-green-600 cursor-pointer"
              onClick={(event) => handleUpdate(params.row, event)}
            />
          </Tooltip> */}
          <Tooltip title="Delete Item">
            <FontAwesomeIcon
              icon={faTrash}
              className="h-5 text-red-500  hover:text-red-600 cursor-pointer"
              onClick={(event) => handleDelete(params.row, event)}
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
  const [filteredRows, setFilteredRows] = useState(disapproveItems);

  useEffect(() => {
    const filtered = disapproveItems.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, disapproveItems]);

  /**Search bar */

  return (
    <div>
      <Divider />
      <Searchbar
        columns={searchColumns}
        setSearchColumn={setSearchColumn}
        setSearchValue={setSearchValue}
        // setFilteredRows={setFilteredRows}
      />
      <div className="mb-4 flex flex-row justify-between mt-2">
        <div className=" text-sm font-medium flex items-end">
          Disapprove Items
        </div>
        <div>
          <span className="font-medium text-red-500">
            {disapproveItems.length}
          </span>{" "}
          Items
        </div>
      </div>
      <Box sx={{ height: "500px" }}>
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

        <DisapproveItemDetails
          open={openViewModal}
          setOpenViewModal={setOpenViewModal}
          selectedRow={selectedRow}
        />

        <UpdateDisapproveItem
          open={openUpdateModal}
          storageLocation={storageLocation}
          getDisapproveItems={getDisapproveItems}
          setOpenUpdateModal={setOpenUpdateModal}
          user={user}
          selectedRow={selectedRow}
        />
        <DeleteDisapproveItem
          open={openDeleteModal}
          setOpenDeleteModal={setOpenDeleteModal}
          getDisapproveItems={getDisapproveItems}
          user={user}
          selectedRow={selectedRow}
        />
      </Box>
    </div>
  );
}

export default DisapproveRegistration
