/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import { Backdrop, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState, useEffect } from "react";
import Loaders from "../utils/Loaders";
import axios from "axios";
import { toast } from "react-toastify";
import { NODE_MAILER_ROUTE, insertClearanceApprovalRoute, usermanagementRoute } from "../utils/inventoryApiEnpoints";
import dropdowndata from "../utils/dropdowndata";
const ClearanceApproval = ({
  open,
  onClose,
  setOpenClearanceApprovalModal,
  selectedRow,
  disableBackdropClick,
  getApprovalClearanceList,
  // getClearanceList,
  getRegisteredItems,
  setOpenClearanceDetails,
  user,
  gsiadApproverEmail,
  getAvailableItem
}) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };

  

  //get user head department
  const [departmentHeadEmail, setDepartmentHeadEmail] = useState("");
  const getHeadDepartment = async () => {
    try {
      const response = await axios.post(
        usermanagementRoute,
        {
          emp_id: selectedRow.creator_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setDepartmentHeadEmail(response.data[0].head_email);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedRow != null) {
      getHeadDepartment();
    }
  }, [selectedRow]);

  const [approvalAction, setApprovalAction] = useState("");
  useEffect(() => {
    if (user && user[0].user_role === dropdowndata.getUserRole()[2].value) {
      setApprovalAction("GSIAD APPROVED");
    }

    if (user && user[0].user_role === dropdowndata.getUserRole()[3].value) {
      setApprovalAction("HEAD APPROVED");
    }
    if (user && user[0].user_role === dropdowndata.getUserRole()[5].value) {
      setApprovalAction("HEAD APPROVED");
    }
  }, [user, dropdowndata]);

  /*--------------------Node Mailer--------------------------------------*/
 
  
  let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>

                ${
                  approvalAction == "HEAD APPROVED"
                    ? `The clearance with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} assigned to  ${selectedRow?.assigned_user} has been approved by the Department Head and now requires GSIAD Head approval. Please review the clearance using the following link: <br>`
                    : `The clearance with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} that you created has been approved by the GSIAD Head. You can check the approved clearance using the following link: <br>`
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


  /**if HEAD APPROVED send EMAIL to GSIAD DEPARTMENT cc ASSIGNED USER
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
            approvalAction == "HEAD APPROVED"
              ? `${gsiadApproverEmail}`
              : `${selectedRow?.assigned_user_email}, campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`
          }`,
          cc: `${
            approvalAction == "HEAD APPROVED"
              ? `${selectedRow?.assigned_user_email},catapan.edward@wealthbank.com.ph `
              : `campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph `
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

  const approveClearance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(insertClearanceApprovalRoute, {
        ref_id: selectedRow.ref_id,
        assigned_user: selectedRow.id_emp,
        action: approvalAction,
        job_level: selectedRow.job_level,
        executive_approver: selectedRow.executive_approver,
        approver_remarks: "",
        approver_id: user && user[0].emp_id,
      },
        {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      console.log(response.data);
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          setOpenClearanceApprovalModal(false);
          //close clearance details if open
          setOpenClearanceDetails(false);
          setIsLoading(false); // Stop loading
          toast.success("Clearance Approved!");
          getApprovalClearanceList();

          // getClearanceList();
          getRegisteredItems();
          getAvailableItem();

          //send email
          sendMail();
        }, 3000);
      } else {
        toast.error("Error Occurred!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <React.Fragment>
        {/* Display Loading */}

        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClick={handleBackdropClick}
          sx={{
            "& .MuiDialog-paper": {
              height: "270px", // Adjust the height as needed
            },
          }}
        >
          <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
            <Loaders />
          </Backdrop>
          <DialogTitle>
            {/* <div className="mt-4">For Clearance Approval</div> */}
          </DialogTitle>
          <DialogContent>
            <div className="p-6">
              <div className="text-xl font-bold text-gray-600">
                Confirm Action
              </div>
              {selectedRow && (
                <p className="mt-4 text-sm ">
                  Approve Clearance with{" "}
                  <span className="font-medium">{selectedRow.ref_id} </span>
                  assigned to{" "}
                  <span className="font-medium">
                    {selectedRow.assigned_user}?
                  </span>
                </p>
              )}

              <div className="flex flex-row justify-end mt-8 space-x-4">
                <button
                  className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                  onClick={approveClearance}
                >
                  Yes
                </button>
                <button
                  className="bg-red-600 py-2 px-6 shadow-red-400 shadow-lg rounded-md font-medium text-white hover:bg-red-700"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default ClearanceApproval;
