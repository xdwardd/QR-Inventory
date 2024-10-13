/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import axios from "axios";
import { toast } from "react-toastify";
import { NODE_MAILER_ROUTE, insertAssignmentApprovalRoute, registeredItemsApprovalRoute } from "../utils/inventoryApiEnpoints";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DisapproveRegisterAsset = ({
  open,
  onClose,
  disableBackdropClick,
  setOpenDisapproveModal,
  selectedRow,
  selectedRows,
  setSelectedRow,
  setSelectedRowIds,
  getRegisteredItems,
  getForItemApproval,
  setOpenForApprovalInfo,
  user,
  gsiadApproverEmail,
  getDisapproveItems
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

  /*--------------------Node Mailer--------------------------------------*/
    let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               We are pleased to inform you that the assets ${
                 selectedRows && selectedRows.length > 0
                   ? selectedRows.map((row) => row.ref_id).join(", ")
                   : `${selectedRow?.ref_id} - ${selectedRow?.item_name}`
               } you have created has been disapproved by the GSIAD Head. <br> You can review the disapproved assets by clicking the following link: <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>
               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;


  /**if GSIAD APPROVE send EMAIL to HEAD DEPARTMENT
   * if HEAD APPROVE send EMAIL to GSIAD then cc the ASSIGNED user
   */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${selectedRow?.creator_email}`,
          mail_to: `catapan.edward@wealthbank.com.ph`,
          cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph,  lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          // cc: `${gsiadApproverEmail}`,
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

  // //multiple data selected
  // const selecteRefID = selectedRows.map((item) => item.ref_id);
  // // Generate new user info objects with updated screen_id
  // const selected_rows = selecteRefID.map((refId) => ({
  //   ref_id: refId,
  //   approver_remarks: remarks,
  //   action: "Decline",
  //   approver_id: user && user[0].emp_id,
  // }));

  const selected_rows = selectedRows.map((item) => ({
    ...item,
    generated_pending_id: "0",
    assigned_user_email: "",
    approver_remarks: remarks,
    action: "Decline",
    approver_id: user && user[0].emp_id,
  }));

  const disapproveAssignment = async () => {
    event.preventDefault();

    if (remarks == undefined || remarks == "") {
      toast.error("Please input remarks");
      return;
    }

    try {
      setIsLoading(true);

      /*if selected pass parameter ass object else you selected multiple data pass it as array refer relected_row var*/
      let response;
      if (selectedRow) {
        response = await axios.post(
          registeredItemsApprovalRoute,
          [
            {
              ...selectedRow,
              approver_remarks: remarks,
              action: "Decline",
              approver_id: user && user[0].emp_id,
            },
          ],
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        // Reset selectedRow after submission
        setSelectedRow(null);
      } else {
        response = await axios.post(
          registeredItemsApprovalRoute,
          selected_rows,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        // Reset selected_rows after submission
        setSelectedRowIds([]);
      }

      if (response.data[0].retVal === "1") {
        setTimeout(() => {
          setOpenDisapproveModal(false);
          //close assigment info modal if open
          setOpenForApprovalInfo(false);
          setRemarks("");
          setIsLoading(false);
          toast.success("Asset Disapproved!");

          //load approval list to get updated list
          getForItemApproval();

          //
          getDisapproveItems();

          //load  registered items to get updated list
          getRegisteredItems();

          //send email
          sendMail();
        }, 3000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          //close assigment info modal if open
           setOpenForApprovalInfo(false);
           setOpenDisapproveModal(false);
           getForItemApproval();

           toast.error(response.data[0].rspmsg);
        }, 3000);
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "400px", // Adjust the height as needed
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
                    onClick={disapproveAssignment}
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
  );
};

export default DisapproveRegisterAsset;
