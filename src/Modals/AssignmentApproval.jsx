/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import axios from "axios";
import { NODE_MAILER_ROUTE, insertAssignmentApprovalRoute, usermanagementRoute } from "../utils/inventoryApiEnpoints";
import dropdowndata from "../utils/dropdowndata";

const AssignmentApproval = ({
  open,
  onClose,
  setOpenApprovalAssignment,
  disableBackdropClick,
  selectedRow,
  getApprovalList,
  getRegisteredItems,
  setOpenApprovalAssignDetails,
  user,
  gsiadApproverEmail
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
        { emp_id: selectedRow?.id_emp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log(response.data);
      setDepartmentHeadEmail(response.data[0].head_email);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedRow?.id_emp != null) {
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
                  approvalAction == "GSIAD APPROVED"
                    ? `The asset with reference ID ${selectedRow?.ref_id}, assigned to  ${selectedRow?.assigned_user} has been approved by the GSIAD Head and now requires Department Head approval. Please review assignment using the following link: <br>`
                    : `The asset with reference ID ${selectedRow?.ref_id}, assigned to you has been approved by your Department Head. Please review and acknowledge the asset using the following link: <br>`
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

  /**if GSIAD APPROVED send EMAIL to HEAD DEPARTMENT cc MAKER
   * if HEAD APPROVE send EMAIL to USER then cc the GSIAD and MAKER
   *
   *
   * sample email: HEAD : lepaopao.jeirald@wealthbank.com.ph
   *               USER : ${selectedRow?.assigned_user_email}
   *               MAKER: catapan.edward@wealthbank.com.ph
   *               GSIAD: paras.karoljohn@wealthbank.com.ph
   */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          mail_to: `${
            approvalAction == "GSIAD APPROVED"
              ? "lepaopao.jeirald@wealthbank.com.ph" //send email to dept head
              : `${selectedRow?.assigned_user_email}`
          }`,
          // cc: `catapan.edward@wealthbank.com.ph,`,
          cc: `${
            approvalAction == "GSIAD APPROVED"
              ? `${selectedRow?.creator_email}, campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph` //if gsiad approve
              :`campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`
            
            // : `${selectedRow?.creator_email}, ${gsiadApproverEmail}`  //dept head approve
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

  const assignmentApproval = async () => {
    console.log(departmentHeadEmail);
console.log(approvalAction);



    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(insertAssignmentApprovalRoute, {
        id: selectedRow.id,
        ref_id: selectedRow.ref_id,
        assigned_user: selectedRow.id_emp,
        approver_remarks: "",
        action: approvalAction,
        approver_id: user && user[0].emp_id,
      },
        {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      console.log(response.data);
      if (response.data[0].retVal === "1") {
        setTimeout(() => {
          setOpenApprovalAssignment(false);
          //close assignment info modal if open
          setOpenApprovalAssignDetails(false);
          setIsLoading(false);
          toast.success("Assignment Approved!");

          //load approval list to get updated list
          getApprovalList();

          //load  registered items to get updated list
          getRegisteredItems();

          //if retval 1 send email
          sendMail();
        }, 3000);
      } else {
        setTimeout(() => {
           setIsLoading(false);
           setOpenApprovalAssignDetails(false);
           setOpenApprovalAssignment(false);
           toast.error(response.data[0].rspmsg);
           getApprovalList();
        }, 3000);
       
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
          // onClose={onClose}
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
            {/* <div className="mt-4">For Process (Assets From E-Purchasing)</div> */}
          </DialogTitle>
          <DialogContent>
            <div className="p-6">
              <div className="text-xl font-bold text-gray-600">
                Confirm Action
              </div>
              {selectedRow && (
                <p className="mt-4 text-sm ">
                  Approve Assignment{" "}
                  <span className="font-medium">
                    {selectedRow.ref_id} - {selectedRow.item_name}
                  </span>{" "}
                  assigned to{" "}
                  <span className="font-medium">
                    {selectedRow.assigned_user}
                  </span>{" "}
                  ?
                </p>
              )}

              <div className="flex flex-row justify-end mt-8 space-x-4">
                <button
                  className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                  onClick={assignmentApproval}
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

export default AssignmentApproval;
