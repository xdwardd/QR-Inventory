import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react'
import TruncatedText from '../utils/TruncatedText,';

const ItemDetails = ({open, setOpenItemDetailsModal, selectedRow, user}) => {
 const [fullWidth, setFullWidth] = React.useState(true);
 const [maxWidth, setMaxWidth] = React.useState("md");
 
    
    
   console.log(selectedRow);
   
    return (
      <div>
        <React.Fragment>
          {/* Display Loading */}

          <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            sx={{
              "& .MuiDialog-paper": {
                height: "700px", // Adjust the height as needed
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
                <div className="text-sm">Asset Details</div>
              </DialogTitle>
              <DialogActions>
                <FontAwesomeIcon
                  icon={faClose}
                  className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
                  onClick={() => setOpenItemDetailsModal(false)}
                />
              </DialogActions>
            </div>
            <DialogContent>
              <div className=" bg-slate-400 h-full">
                <div className="p-8 flex flex-row justify-between space-x-4 flex-wrap  bg-slate-400 max-h-fit">
                  {selectedRow && (
                    <>
                      <div className="ml-4 w-80">
                        <ul className="flex flex-col gap-1">
                          {selectedRow.assigned_user != "" && (
                            <li className="flex flex-row justify-between text-xs">
                              <strong>Assigned User:</strong>{" "}
                              <span className="flex w-48 font-medium text-xs">
                                {selectedRow.assigned_user}
                              </span>
                            </li>
                          )}

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
                              className="flex w-48 font-medium text-xs"
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
                              style={{ wordBreak: "break-word" }} // Add this line
                            >
                              <TruncatedText
                                text={selectedRow.remarks}
                                limit={80}
                              />
                              {/* {selectedRow.description} */}
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div>
 {((selectedRow &&
                        selectedRow.status ===
                          "ASSET-UPDATED: PENDING FOR GSIAD APPROVAL") ||
                        (selectedRow &&
                          selectedRow.status ===
                            "ASSET-UPDATED: GSIAD APPROVED") ||
                        (selectedRow &&
                          selectedRow.status ===
                            "ASSET-UPDATED: GSIAD DISAPPROVED")) && (
                        <div className="mt-10">
                          <div className="font-bold text-xs">
                            Updated By :{" "}
                            <span className="font-medium">
                              {selectedRow.creator_id}
                            </span>
                          </div>
                        </div>
                        )}
                      
                      <div className="mt-2">
                        {((selectedRow &&
                          selectedRow.status ===
                            "USER-ASSIGNMENT: GSIAD DISAPPROVED") ||
                          (selectedRow &&
                            selectedRow.status ===
                              "USER-ASSIGNMENT: DEPARTMENT HEAD DISAPPROVED") ||
                          (selectedRow &&
                            selectedRow.status ===
                              "USER-CLEARANCE: DEPARTMENT HEAD DISAPPROVED") ||
                          (selectedRow &&
                            selectedRow.status ===
                              "USER ACCOUNTABILITY: USER DECLINED") ||
                          (selectedRow &&
                            selectedRow.status ===
                              "USER-CLEARANCE: GSIAD DISAPPROVED") ||
                          (selectedRow &&
                            selectedRow.status ===
                              "DISPOSAL: GSIAD DISAPPROVED") ||
                          (selectedRow &&
                            selectedRow.status ===
                              "ASSET-UPDATED: GSIAD DISAPPROVED")) && (
                          <div className="flex flex-row justify-between text-xs gap-2">
                            <h4 className="font-bold">Disapproved Remarks:</h4>

                            <TruncatedText
                              text={selectedRow.approver_remarks}
                              limit={80}
                            />
                          </div>
                        )}
                      </div>
                      </div>
                     
                    </>
                  )}
                </div>

                
              </div>
            </DialogContent>
            <DialogActions sx={{ marginBottom: "1rem", marginRight: "1rem" }}>
              {/* <Button
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
              onClick={(event) => setOpenRegisterApprovalModal(true)}
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
              onClick={(event) => setOpenDisapproveModal(true)}
            >
              Disapprove
            </Button> */}
            </DialogActions>
            {/* <DialogActions>
            <Button sx={{ fontSize: "10px" }} onClick={onClose}>
              Close
            </Button>
          </DialogActions> */}
          </Dialog>
        </React.Fragment>
      </div>
    );
}

export default ItemDetails
