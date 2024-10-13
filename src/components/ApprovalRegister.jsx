import { Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react'
import { useAuth } from "./AuthContext";

import ApprovalRegisterModal from '../Modals/ApprovalRegisterModal';
import ForApprovalItemInfo from '../Modals/ForApprovalItemInfo';
import DisapproveRegisterAsset from '../Modals/DisapproveRegisterAsset';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Searchbar from '../utils/Searchbar';

const ApprovalRegister = ({
  forItemApproval,
  getForItemApproval,
  getRegisteredItems,
  getAvailableItem,
  screens,
  gsiadApproverEmail,
  getDisapproveItems
}) => {
  const { isAuthenticated, user } = useAuth();

  const [openRegisterApprovalModal, setOpenRegisterApprovalModal] =
    useState(false);
  const [openDisapproveModal, setOpenDisapproveModal] = useState(false);
  const [openForApprovalInfo, setOpenForApprovalInfo] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (forItemApproval.length !== 0) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [forItemApproval]);

  //selecting multiple
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const selectedRows = forItemApproval.filter((row) =>
    selectedRowIds.includes(row.ref_id)
  );

  //end

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
    if (isAuthenticated && userScreens && !userScreens.includes("3")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*-----------------------------------------------------------------------*/

  //Approve Assignment Modal
  const handlRegisterApproval = () => {
    if (selectedRows.length == 0) {
      toast.error("No item selected!");
      return;
    } else {
      setOpenRegisterApprovalModal(true);
    }
  };

  const closeRegisterApproval = () => {
    setOpenRegisterApprovalModal(false);
  };

  //Approve Assignment Modal
  const handleForApprovalInfo = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenForApprovalInfo(true);
    setSelectedRowIds([]);
  };

  const closeForApprovalInfo = () => {
    setOpenForApprovalInfo(false);
  };

  //DisApprove Assignment Modal
  const handleForDisapproveAsset = () => {
    // event.stopPropagation(); // Stop event propagation
    // setSelectedRow(row);
    // setOpenDisapproveModal(true);
    if (selectedRows.length == 0) {
      toast.error("No item selected!");
      return;
    } else {
      setOpenDisapproveModal(true);
    }
  };

  const closeDisapproveAsset = () => {
    setOpenDisapproveModal(false);
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
      field: "item_name",
      headerName: "Item Name",
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
    },

    {
      field: "date_received",
      headerName: "Date Received",
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
      field: "action",
      headerName: "Action",
      width: 100,
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
            onClick={(event) => handleForApprovalInfo(params.row, event)}
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
  const [filteredRows, setFilteredRows] = useState(forItemApproval);

  useEffect(() => {
    const filtered = forItemApproval.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, forItemApproval]);

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 flex flex-col h-screen ">
          <Searchbar
            columns={searchColumns}
            setSearchColumn={setSearchColumn}
            setSearchValue={setSearchValue}
            // setFilteredRows={setFilteredRows}
          />
          <div className="mb-4 mt-4 flex flex-row justify-between">
            <div className="text-sm font-medium flex items-end">
              Items For Approval
            </div>
            <div>
              <span className="font-bold text-red-500">
                {forItemApproval.length}
              </span>{" "}
              Items
            </div>
          </div>

          {/* <Box sx={forItemApproval.length === 0 ? { height: "530px" } : {}}> */}
          <Box sx={{ height: "530px" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.ref_id}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 15,
                  },
                },
              }}
              pageSizeOptions={[15]}
              // onRowClick={(params, event) => handleRowClick(params, event)}
              // disableRowSelectionOnClick

              checkboxSelection
              onRowSelectionModelChange={(newSelection) =>
                setSelectedRowIds(newSelection)
              }
              loading={isLoading}
              rowSelectionModel={selectedRowIds}
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
            <ForApprovalItemInfo
              open={openForApprovalInfo}
              onClose={closeForApprovalInfo}
              selectedRow={selectedRow}
              setOpenForApprovalInfo={setOpenForApprovalInfo}
              setOpenRegisterApprovalModal={setOpenRegisterApprovalModal}
              setOpenDisapproveModal={setOpenDisapproveModal}

              // setOpenApprovalAssignDetails={setOpenApprovalAssignDetails}
              // getApprovalList={getApprovalList}
              // getRegisteredItems={getRegisteredItems}
            />

            <ApprovalRegisterModal
              open={openRegisterApprovalModal}
              onClose={closeRegisterApproval}
              selectedRow={selectedRow}
              selectedRows={selectedRows}
              setSelectedRow={setSelectedRow}
              setSelectedRowIds={setSelectedRowIds}
              setOpenRegisterApprovalModal={setOpenRegisterApprovalModal}
              // setOpenApprovalAssignDetails={setOpenApprovalAssignDetails}
              // getApprovalList={getApprovalList}
              getRegisteredItems={getRegisteredItems}
              getForItemApproval={getForItemApproval}
              setOpenForApprovalInfo={setOpenForApprovalInfo}
              getAvailableItem={getAvailableItem}
              user={user}
              gsiadApproverEmail={gsiadApproverEmail}
            />
            <DisapproveRegisterAsset
              open={openDisapproveModal}
              onClose={closeDisapproveAsset}
              selectedRow={selectedRow}
              selectedRows={selectedRows}
              setSelectedRow={setSelectedRow}
              setSelectedRowIds={setSelectedRowIds}
              getForItemApproval={getForItemApproval}
              getRegisteredItems={getRegisteredItems}
              setOpenForApprovalInfo={setOpenForApprovalInfo}
              setOpenDisapproveModal={setOpenDisapproveModal}
              getAvailableItem={getAvailableItem}
              getDisapproveItems={getDisapproveItems}
              user={user}
              gsiadApproverEmail={gsiadApproverEmail}
            />
          </Box>
          <div className="flex flex-row justify-end gap-2 mt-4">
            <Button
              sx={{
                paddingTop: "8px",
                fontSize: "10px",
                "&:hover": {
                  backgroundColor: "#38a624",
                  color: "white",
                },
              }}
              variant="contained"
              color="success"
              onClick={handlRegisterApproval}
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
              variant="contained"
              color="error"
              onClick={handleForDisapproveAsset}
            >
              Disapprove
            </Button>
          </div>
        </div>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
};

export default ApprovalRegister
