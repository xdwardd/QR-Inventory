/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import { Backdrop, Dialog, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loaders from "../utils/Loaders";
import { NODE_MAILER_ROUTE, insertAccountableUserRoute, usermanagementRoute } from "../utils/inventoryApiEnpoints";

const AcknowledgeAccountability = ({
  open,
  onClose,
  disableBackdropClick,
  setOpenAcknowledgeAccountability,
  selectedRow,
  getAccountabilityList,
  setOpenAccountabilityAssetInfo,
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
        //get head department email
        { emp_id: user && user[0].emp_id },
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
    getHeadDepartment();
  }, []);

  /*--------------------Node Mailer--------------------------------------*/
  // let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px;'>
  //              Hello!  <br><br> Registered Asset ${selectedRow?.ref_id} - ${selectedRow?.item_name} was Acknowledged by ${selectedRow?.assigned_user} .
  //              <br><br>
  //              Disregard this email. Testing QR Inventory System Mailer. <br>Thank you for your cooperation.<br>
  //              <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply.</span>
  //              </span>`;


   let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
                Asset with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name}
                was Acknowledged by ${selectedRow?.assigned_user}. <br> You can check the acknowledged assets by clicking the following link:<br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>
               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${departmentHeadEmail}`,
          mail_to: `lepaopao.jeirald@wealthbank.com.ph`,  // email to to head cc gsiad and creator
          cc: `${gsiadApproverEmail}, ${selectedRow?.creator_email}, campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          // cc: `${
          //   approvalAction == "HEAD APPROVED" ? selectedRow?.wb_email : ""
          // }`,
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

  const acknowledgeAccountability = async () => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        insertAccountableUserRoute,
        {
          ref_id: selectedRow.ref_id,
          assigned_user: selectedRow.assigned_user,
          approver_remarks: "",
          action: "Approve",
          job_level: selectedRow.job_level,
          executive_approver: selectedRow.executive_approver,
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
          setOpenAcknowledgeAccountability(false);
          //close accountability info modal if open
          setOpenAccountabilityAssetInfo(false);
          setIsLoading(false);
          toast.success("Successfully Acknowledge");
          getAccountabilityList();
          //sendmail
           sendMail();
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
        {/* Display Loading */}

        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClose={onClose}
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
                  Are you sure you want to Acknowledge{" "}
                  <span className="font-medium">
                    {selectedRow.ref_id} - {selectedRow.item_name}
                  </span>{" "}
                  ?
                </p>
              )}

              <div className="flex flex-row justify-end mt-8 space-x-4">
                <button
                  className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                  onClick={acknowledgeAccountability}
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

export default AcknowledgeAccountability;
