/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Loaders from "../utils/Loaders";
import axios from "axios";
import { toast } from "react-toastify";
import {
  NODE_MAILER_ROUTE,
  insertClearanceApprovalRoute,
} from "../utils/inventoryApiEnpoints";
import dropdowndata from "../utils/dropdowndata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const ClearanceDisapproval = ({
  open,
  onClose,
  selectedRow,
  disableBackdropClick,
  setOpenClearanceDetails,
  setOpenDisapproveClearanceModal,
  getApprovalClearanceList,
  getRegisteredItems,

  user,
}) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState();

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  const [approvalAction, setApprovalAction] = useState("");
  useEffect(() => {
    if (user && user[0].user_role === dropdowndata.getUserRole()[2].value) {
      setApprovalAction("GSIAD DISAPPROVED");
    }

    if (user && user[0].user_role === dropdowndata.getUserRole()[3].value) {
      setApprovalAction("HEAD DISAPPROVED");
    }
    if (user && user[0].user_role === dropdowndata.getUserRole()[5].value) {
      setApprovalAction("HEAD DISAPPROVED");
    }
  }, [user, dropdowndata]);

  /*--------------------Node Mailer--------------------------------------*/
  // let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px;'>
  //             ${
  //               approvalAction == "HEAD DISAPPROVED"
  //                 ? `Hello!  <br><br>  Registered Asset ${selectedRow?.ref_id} assigned to ${selectedRow?.assigned_user} clearance was disapproved by HEAD Department`
  //                 : `Hello!  <br><br>  Registered Asset ${selectedRow?.ref_id} - ${selectedRow?.item_name} assigned to ${selectedRow?.assigned_user} clearance was disapproved by GSIAD`
  //             } <br><br>
  //              Disregard this email. Testing QR Inventory System Mailer.
  //              Thank you for your cooperation.<br>
  //              <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply.</span>
  //              </span>`;


   
    let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>

                ${
                  approvalAction == "HEAD APPROVED"
                    ? `The clearance with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} that you created has been disapproved your Department Head. Please review the disapproved clearance using the following link: <br>`
                    : `The clearance with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} that you created has been disapproved by the GSIAD Head. Please review the disapproved clearance using the following link: <br>`
                } <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;

  /**if HEAD DISAPPROVED send EMAIL to user cc
   * if GSIAD APPROVED send EMAIL to ASSIGNED USER  then cc the DEPT HEAD
   *
   * sample gsiad head email : paras.karoljohn@wealthbank.com.ph
   * sample dept head email: lepaopao.jeirald@wealthbank.com.ph.
   */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          mail_to: `${
            approvalAction == "HEAD DISAPPROVED"
              ? `${selectedRow?.assigned_user_email}`
              : `campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`
          }`,
          cc: `${
            approvalAction == "HEAD DISAPPROVED"
              ? `catapan.edward@wealthbank.com.ph`
              : `campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`
          }`,
          subject: "QR Inventory Testing",
          msg: msg,
          systemName: "QR-INVENTORY",
        },
      ]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  /*--------------------Node Mailer--------------------------------------*/

  console.log(selectedRow);

  const disapproveClearance = async () => {
    event.preventDefault();

    if (remarks == undefined || remarks == "") {
      toast.error("Please input remarks");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        insertClearanceApprovalRoute,
        {
          ref_id: selectedRow.ref_id,
          assigned_user: selectedRow.id_emp,
          action: approvalAction,
          job_level: selectedRow.job_level,
          executive_approver: selectedRow.executive_approver,
          approver_remarks: remarks,
          approver_id: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(response.data);
      if (response.data[0].retVal === "1") {
        setTimeout(() => {
          false;
          setIsLoading(false);
          setOpenDisapproveClearanceModal(false);
          //close clearance details if open
          setOpenClearanceDetails(false);
          toast.success(response.data[0].rspmsg);
          //   getAccountabilityList();
          setRemarks("");
          getApprovalClearanceList();
          getRegisteredItems();
          getAvailableItem();

          //send email
          //  sendMail();
        }, 3000);
      } else {
        setIsLoading(false);
        toast.error(response.data[0].rspmsg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <React.Fragment>
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClick={handleBackdropClick}
          sx={{
            "& .MuiDialog-paper": {
              height: "350px", // Adjust the height as needed
            },
          }}
        >
          {/* Loading */}
          <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
            <Loaders />
          </Backdrop>

          <DialogActions>
            <FontAwesomeIcon
              icon={faClose}
              className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
              onClick={onClose}
            />
          </DialogActions>
          <DialogContent>
            <div>
              <div className=" bg-gray-300 w-full ">
                <form action="" className="p-4 w-full">
                  <div>
                    <div className="text-sm mb-2 text-gray-700">
                      Remarks <span className="text-red-500">*</span>
                    </div>
                    <textarea
                      name="remarks"
                      className="resize-none border border-gray-400 rounded-md text-xs p-2 w-full h-32 outline-none"
                      placeholder="Enter your text here..."
                      onChange={() => setRemarks(event.target.value)}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      sx={{
                        paddingTop: "8px",
                        fontSize: "10px",
                        "&:hover": {
                          backgroundColor: "#2f74eb",
                          color: "white",
                        },
                      }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      onClick={disapproveClearance}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </DialogContent>
          {/* <DialogActions>
            <Button sx={{ fontSize: "10px" }} onClick={onClose}>
              Close
            </Button>
          </DialogActions> */}
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default ClearanceDisapproval;
