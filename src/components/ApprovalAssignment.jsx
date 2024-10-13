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

import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import ApprovalAssignInfo from "../Modals/ApprovalAssignInfo";


import { getApprovalRoute } from "../utils/inventoryApiEnpoints";
import { toast } from "react-toastify";
import dropdowndata from "../utils/dropdowndata";
import Login from "./Login";
import AssignmentApproval from "../Modals/AssignmentApproval";
import AssignmentDisapproval from "../Modals/AssignmentDisapproval";
import Searchbar from "../utils/Searchbar";


const ApprovalAssignment = ({
 
  getRegisteredItems,
  screens,
  gsiadApproverEmail
}) => {
  const { isAuthenticated, user } = useAuth();

  const [openDisapproveModal, setOpenDisapproveModal] = useState(false);
  const [openApprovalAssignment, setOpenApprovalAssignment] = useState(false);
  useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openApprovalAssignDetails, setOpenApprovalAssignDetails] =
    useState(false);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
    if (isAuthenticated && userScreens && !userScreens.includes("5")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*-----------------------------------------------------------------------*/

  //View Approval Assignment Modal
  const handleViewDetails = (row, event) => {
    setOpenApprovalAssignDetails(true);
    setSelectedRow(row);
  };

  const closeViewDetails = () => {
    setOpenApprovalAssignDetails(false);
  };

  //Disapprove Assigment Modal
  const handleDisapproveAssignment = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenDisapproveModal(true);
  };

  const closeDisapproveAssigmentModal = () => {
    setOpenDisapproveModal(false);
  };

  //Approve GSAID Assignment Modal
  const handleApprovalAssignment = (row, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedRow(row);
    setOpenApprovalAssignment(true);
  };

  const closeApprovalAssignment = () => {
    setOpenApprovalAssignment(false);
  };

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
      width: 250,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      // renderCell: (params) => params.value.toUpperCase(), // Add this line
    },
    {
      field: "assigned_user",
      headerName: "Assigned User",
      width: 200,
      editable: false,
      sortable: false,
      resizable: false,
      headerAlign: "center",
      renderCell: (params) => params.value.toUpperCase(), // Add this line
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
      width: 300,
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
            onClick={(event) => handleViewDetails(params.row, event)}
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
            onClick={(event) => handleApprovalAssignment(params.row, event)}
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
            onClick={(event) => handleDisapproveAssignment(params.row, event)}
          >
            Disapprove
          </Button>
        </div>
      ),
    },
  ];

  /**-------------------------------- Get Assignment Approval List ------------------------------------- */

  const [approvalList, setApprovalList] = useState([]);
  const getApprovalList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        getApprovalRoute,
        {
          emp_id: user && user[0].emp_id, // Ensuring user is not null before accessing its properties
          dept_desc: user && user[0].dept_desc,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTimeout(() => {
        setApprovalList(response.data);
        setIsLoading(false);
      }, 3000);

      if (response.data[0].retVal == 0) {
        toast.error(response.data[0].rspmsg);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Checking if user is not null before calling getApprovalList
    if (user !== null) {
      getApprovalList();
    }
  }, [user]);

  //filter list for GSIAD
  const gsiadApprovalList = approvalList.filter(
    (item) => item.status == "USER-ASSIGNMENT: PENDING FOR GSIAD APPROVAL"
  );

  //filter list for GSIAD
  const headDepartmentApprovalList = approvalList.filter(
    (item) =>
      item.status == "USER-ASSIGNMENT: PENDING FOR DEPARTMENT HEAD APPROVAL"
  );

  /** Search Bar */
  // Columns to exclude from search functionality
  // const columnsToExclude = ["action", "quantity"];

  // // Filter columns to exclude
  // const searchColumns = columns.filter(
  //   (col) => !columnsToExclude.includes(col.field)
  // );

  // const assignmentApprovalList =
  //   user && user[0].user_role === dropdowndata.getUserRole()[2].value
  //     ? gsiadApprovalList
  //     : headDepartmentApprovalList;

  // console.log(assignmentApprovalList);

  // const [searchColumn, setSearchColumn] = useState(searchColumns[0].field); // Default to the first column
  // const [searchValue, setSearchValue] = useState("");
  // const [filteredRows, setFilteredRows] = useState(assignmentApprovalList);

  // useEffect(() => {
  //   const filtered = assignmentApprovalList.filter((row) => {
  //     const fieldValue = row[searchColumn];
  //     return fieldValue
  //       ?.toString()
  //       .toLowerCase()
  //       .includes(searchValue.toLowerCase());
  //   });
  //   setFilteredRows(filtered);
  // }, [searchColumn, searchValue, headDepartmentApprovalList,  gsiadApprovalList]);

  /** Search Bar */
  // Columns to exclude from search functionality
  const columnsToExclude = ["action", "quantity"];

  // Filter columns to exclude
  const searchColumns = columns.filter(
    (col) => !columnsToExclude.includes(col.field)
  );

  const [searchColumn, setSearchColumn] = useState(searchColumns[0].field); // Default to the first column
  const [searchValue, setSearchValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(approvalList);

  useEffect(() => {
    const filtered = approvalList.filter((row) => {
      const fieldValue = row[searchColumn];
      return fieldValue
        ?.toString()
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
    setFilteredRows(filtered);
  }, [searchColumn, searchValue, approvalList]);

  return (
    <>
      {isAuthenticated ? (
        <div className="p-6 flex flex-col space-y-20 h-screen ">
          <div className="">
            <Searchbar
              columns={searchColumns}
              setSearchColumn={setSearchColumn}
              setSearchValue={setSearchValue}
              // setFilteredRows={setFilteredRows}
            />
            <div className="mb-4 mt-4 flex flex-row justify-between">
              <div className="mt-2 text-sm font-medium flex items-end">
                For Assignment Approval
              </div>
              <div>
                <span className="font-medium text-red-500">
                  {approvalList.length}
                </span>{" "}
                Items
              </div>
            </div>

            {/* <Box sx={gsiadApprovalList.length === 0 && headDepartmentApprovalList.length === 0  ? { height: "530px" } : {}}> */}
            <Box sx={{ height: "550px" }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row.id}
                loading={isLoading}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 15,
                    },
                  },
                }}
                pageSizeOptions={[15]}
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

              <ApprovalAssignInfo
                open={openApprovalAssignDetails}
                onClose={closeViewDetails}
                selectedRow={selectedRow}
                setOpenApprovalAssignDetails={setOpenApprovalAssignDetails}
                setOpenDisapproveModal={setOpenDisapproveModal}
                setOpenApprovalAssignment={setOpenApprovalAssignment}
              />
              <AssignmentApproval
                open={openApprovalAssignment}
                onClose={closeApprovalAssignment}
                selectedRow={selectedRow}
                setOpenApprovalAssignment={setOpenApprovalAssignment}
                setOpenApprovalAssignDetails={setOpenApprovalAssignDetails}
                getApprovalList={getApprovalList}
                getRegisteredItems={getRegisteredItems}
                user={user}
                gsiadApproverEmail={gsiadApproverEmail}
              />

              <AssignmentDisapproval
                open={openDisapproveModal}
                onClose={closeDisapproveAssigmentModal}
                selectedRow={selectedRow}
                setOpenApprovalAssignDetails={setOpenApprovalAssignDetails}
                setOpenDisapproveModal={setOpenDisapproveModal}
                getApprovalList={getApprovalList}
                getRegisteredItems={getRegisteredItems}
                user={user}
                gsiadApproverEmail={gsiadApproverEmail}
              />
            </Box>
          </div>
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default ApprovalAssignment;
