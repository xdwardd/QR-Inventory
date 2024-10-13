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
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import axios from "axios";
import { toast } from "react-toastify";
import { NODE_MAILER_ROUTE, insertAssignmentApprovalRoute, usermanagementRoute } from "../utils/inventoryApiEnpoints";
import dropdowndata from "../utils/dropdowndata";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AssignmentDisapproval = ({
  open,
  onClose,
  disableBackdropClick,
  setOpenDisapproveModal,
  selectedRow,
  getApprovalList,
  setOpenApprovalAssignDetails,
  getRegisteredItems,
  user, 
  gsiadApproverEmail
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

  //get user head department
  const [departmentHeadEmail, setDepartmentHeadEmail] = useState("");
  const getHeadDepartment = async () => {
    try {
      const response = await axios.post(
        usermanagementRoute,
        {
          emp_id: selectedRow?.id_emp,
        },
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

  /*--------------------Node Mailer--------------------------------------*/
  // let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px;'>
  //             ${
  //               approvalAction == "GSIAD DISAPPROVED"
  //                 ? `Hello!  <br><br>  Registered Asset ${selectedRow?.ref_id} assigned to ${selectedRow?.assigned_user} was disapproved by GSIAD.`
  //                 : `Hello!  <br><br>  Registered Asset ${selectedRow?.ref_id} assigned to ${selectedRow?.assigned_user} was disapproved by Department HEAD.`
  //             } <br><br>
  //              Disregard this email. Testing QR Inventory System Mailer.
  //              Thank you for your cooperation.<br>
  //              <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply.</span>
  //              </span>`;
  
      let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>

                ${
                  approvalAction == "GSIAD DISAPPROVED"
                    ? `The asset with reference ID ${selectedRow?.ref_id}, assigned to  ${selectedRow?.assigned_user} has been disapproved by GSIAD Head. Please review the disapproved assignment using the following link: <br>`
                    : `The asset with reference ID ${selectedRow?.ref_id}, assigned to  ${selectedRow?.assigned_user} has been disapproved by Department Head. Please review the disapproved assignment using the following link: <br>`
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

  /**if GSIAD DISAPPROVED send EMAIL to MAKER cc HEAD and ASSIGNED USER
   * if HEAD DISAPPROVE send EMAIL to ASSIGNED USER then cc the GSIAD and MAKER
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
            approvalAction == "GSIAD DISAPPROVED"
              ? `${selectedRow?.creator_email}`
              : `${selectedRow?.creator_email}`
          }`,
          // cc: `catapan.edward@wealthbank.com.ph,`,
          cc: `${
            approvalAction == "GSIAD DISAPPROVED"
              ? `campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`
              : `${selectedRow?.creator_email}, ${gsiadApproverEmail}, campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`
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

  const disapproveAssignment = async () => {
    event.preventDefault();
   
    if (remarks == undefined || remarks == "") {
      toast.error("Please input remarks");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(insertAssignmentApprovalRoute, {
        ref_id: selectedRow.ref_id,
        assigned_user: selectedRow.id_emp,
        approver_remarks: remarks,
        action: approvalAction,
        approver_id: user && user[0].emp_id,

      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`
          }
        }
      );
      console.log(response.data);
      if (response.data[0].retVal === "1") {
        setTimeout(() => {
          setOpenDisapproveModal(false);
          //close assignment info modal if open
          setOpenApprovalAssignDetails(false);
          setIsLoading(false);
          toast.success("Assignment Disapproved!");
          setRemarks("");
          //load approval list to get updated list
          getApprovalList();

          //load  registered items to get updated list
          getRegisteredItems();

          //send Email
          sendMail();
        }, 3000);
      } else {
        setTimeout(() => {
          setOpenDisapproveModal(false);
          setOpenApprovalAssignDetails(false);
          setIsLoading(false);
          toast.error(response.data[0].rspmsg);
         getApprovalList();

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

export default AssignmentDisapproval;
