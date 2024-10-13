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
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NODE_MAILER_ROUTE, insertAccountableUserRoute, usermanagementRoute } from "../utils/inventoryApiEnpoints";
const DeclinedAccountability = ({
  open,
  onClose,
  setOpenDeclinedAccountability,
  selectedRow,
  disableBackdropClick,
  getAccountabilityList,
  setOpenAccountabilityAssetInfo,
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
  //              Hello!  <br><br> Registered Asset ${selectedRow?.ref_id} - ${selectedRow?.item_name} was Declined by ${selectedRow?.assigned_user}.
  //              <br><br>
  //               Disregard this email. Testing QR Inventory System Mailer.
  //              Thank you for your cooperation.<br>
  //              <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply.</span>
  //              </span>`;

   let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
                Asset with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name}
                was Declined by ${selectedRow?.assigned_user}. <br> You can check the declined assets by clicking the following link:<br>
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
          mail_to: `lepaopao.jeirald@wealthbank.com.ph`,
          // cc: `${selectedRow?.creator_email}, ${gsiadApproverEmail}`,
          cc: `${gsiadApproverEmail}, ${selectedRow?.creator_email}, campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          subject: "QR inventory",
          msg: msg,
          systemName: "QR-INVENTORY",
        },
      ]);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const declinedAccountability = async () => {
    event.preventDefault();
    console.log(selectedRow);
    console.log(remarks);
    if (remarks == undefined || remarks == "") {
      toast.error("Please input remarks");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        insertAccountableUserRoute,
        {
          ref_id: selectedRow.ref_id,
          assigned_user: selectedRow.assigned_user,
          approver_remarks: remarks,
          action: "Decline",
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
          false;
          setIsLoading(false);
          setOpenDeclinedAccountability(false);
          //close accountability info modal if open
          setOpenAccountabilityAssetInfo(false);
          toast.success("Item Declined!");
          getAccountabilityList();
          setRemarks("");
          //send mail
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

          <DialogActions sx={{ marginRight: "1rem" }}>
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
                      onClick={declinedAccountability}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default DeclinedAccountability;
