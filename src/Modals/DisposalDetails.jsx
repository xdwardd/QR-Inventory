import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import { API_BASE_URL, disposalAttachmentRoute, FILE_PATH_ROUTE } from '../utils/inventoryApiEnpoints';
import { faClose, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TruncatedText from '../utils/TruncatedText,';

const DisposalDetails = ({
  open,
  onClose,
  selectedRow,
  setOpenDisapprovalDisposal,
  setOpenDisposalApproval,
  user
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [isLoading, setIsLoading] = useState(false);

  const viewDisposalAttachment = async (row) => {
    event.preventDefault();

    // Always fetch data when the button is clicked
    fetchData(row);
  };



  console.log(selectedRow);
  
  // Function to fetch attachment data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        disposalAttachmentRoute,
        {
          ref_id: selectedRow.ref_id,
          id: selectedRow.id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setIsLoading(false);

      console.log(response.data[0].filePath);
      

      // Open the attachment link in a new tab/window
      if (response.data[0].filePath) {
         window.open(
           `${FILE_PATH_ROUTE}${response.data[0].filePath}`,
           "_blank"
         );
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user && user[0].user_role);
  return (
    <div>
      <React.Fragment>
        {/* Display Loading */}

        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          // onClose={onClose}
          //  onClick={handleBackdropClick}
          sx={{
            "& .MuiDialog-paper": {
              height: "450px", // Adjust the height as needed
            },
            "@media (min-width: 960px)": {
              "& .MuiDialog-paper": {
                height: "450px", // Adjust height for large screens
              },
            },
          }}
        >
          <div className="flex flex-row justify-between">
            <DialogTitle>
              <div className="text-sm">Diposal Details</div>
            </DialogTitle>
            <DialogActions sx={{ marginRight: "1rem" }}>
              <FontAwesomeIcon
                icon={faClose}
                className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
                onClick={onClose}
              />
            </DialogActions>
          </div>
          <DialogContent>
            <div className=" bg-slate-400 h-full">
              <div className="p-8 flex flex-row space-x-4 flex-wrap bg-slate-400 max-h-fit">
                {selectedRow && (
                  <>
                    <div className="ml-4 w-80">
                      <ul className="flex flex-col gap-1">
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Ref ID:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.ref_id}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Item ID:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.item_id}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>PO ID:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.po_id}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Item Name:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.item_name}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong className="">Fixed Asset:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.fixed_asset}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Quantity:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.quantity}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Price:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.price}
                          </span>
                        </li>

                        <li className="flex flex-row justify-between text-xs">
                          <strong>Unit:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.unit}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong className="">Storage Location:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.storage_location}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="w-80">
                      <ul className="flex flex-col gap-1">
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Item Code:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.item_code}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Model Number:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.model_number}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Serial Number:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.serial_number}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Date Received:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.date_received}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Date Expiration:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.date_expire}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Status:</strong>{" "}
                          <span className="flex w-48 font-medium text-xs">
                            {selectedRow.status}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Description:</strong>{" "}
                          <span
                            className=" w-48 font-medium text-xs"
                            style={{ wordBreak: "break-word" }} // Add this line
                          >
                            <TruncatedText
                              text={selectedRow.description}
                              limit={80}
                            />
                            {/* {selectedRow.description} */}
                          </span>
                        </li>
                        <li className="flex flex-row justify-between text-xs">
                          <strong>Remarks:</strong>{" "}
                          <span
                            className="flex w-48 font-medium text-xs"
                            style={{ wordBreak: "break-word" }}
                          >
                            <TruncatedText
                              text={selectedRow.remarks}
                              limit={80}
                            />
                            {/* {selectedRow.remarks} */}
                          </span>
                        </li>
                        <li className="flex  justify-between text-xs">
                          <strong>Disposal Remarks:</strong>{" "}
                          <span
                            className="w-48 font-medium text-xs"
                            style={{ wordBreak: "break-word" }}
                          >
                            <TruncatedText
                              text={selectedRow.disposal_remarks}
                              limit={80}
                            />
                          </span>
                        </li>

                        <li className="flex flex-row items-end gap-6 text-xs mt-2">
                          <strong>View Attachment:</strong>{" "}
                          <Box
                            sx={{ height: "30px" }}
                            className={`border rounded-lg w-32 text-white  border-gray-300 flex flex-row bg-blue-500 cursor-pointer hover:shadow-lg hover:shadow-blue-600 `}
                            onClick={viewDisposalAttachment}
                          >
                            <div className="w-1/4 h-full text-lg bg-blue-600 rounded-l-lg flex justify-center items-center">
                              <FontAwesomeIcon
                                icon={faPaperclip}
                                className="items-center"
                              />
                            </div>
                            <div className="w-3/4 h-full flex justify-center items-center">
                              <span className="text-xs block">Attachment</span>
                            </div>
                          </Box>
                        </li>
                      </ul>
                    </div>
                    {(selectedRow.status ===
                      "DISPOSAL: GSIAD DISAPPROVED") && (
                      <div className="mt-6 w-full flex justify-start text-xs">
                        <strong className="w-1/5">Disapproved Remarks:</strong>
                        <span
                          className="w-4/5 font-medium text-xs"
                          style={{ wordBreak: "break-word" }}
                        >
                          {selectedRow.approver_remarks}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{ marginBottom: "1rem", marginRight: "1rem" }}>
            {selectedRow?.status === "DISPOSAL: FOR DISPOSAL APPROVAL" &&
              user[0].user_role === "Approver(GSIAD, Department)" && (
                <>
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
                    onClick={() => setOpenDisposalApproval(true)}
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
                    onClick={() => setOpenDisapprovalDisposal(true)}
                  >
                    Disapprove
                  </Button>
                </>
              )}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default DisposalDetails
