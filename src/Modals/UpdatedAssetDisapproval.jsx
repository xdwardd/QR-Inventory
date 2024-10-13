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
import {
  NODE_MAILER_ROUTE,
  insertAssignmentApprovalRoute,
  registeredItemsApprovalRoute,
  registeredItemsUpdatedApproval,
} from "../utils/inventoryApiEnpoints";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UpdatedAssetDisapproval = ({
  open,
  onClose,
  disableBackdropClick,
  selectedRow,
  setOpenUpdateAssetDisapproval,
  setOpenUpdateAssetDetails,
  getRegisteredItems,
  getUpdatedAssetList,
  getAvailableItem,
  user
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
               The asset with ${selectedRow?.ref_id} that you updated has been disapproved by the GSIAD Head.  Please review the disapproved updated assets using the following link: <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>`;

  /**if GSIAD APPROVED send email sa maker.
   */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${selectedRow?.creator_email}`,
          mail_to: `catapan.edward@wealthbank.com.ph`,
          // cc: ``,
          cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,

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

  const disapproveUpdatedAsset = async () => {
    event.preventDefault();

    if (remarks == undefined || remarks == "") {
      toast.error("Please input remarks");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(registeredItemsUpdatedApproval, {
        ref_id: selectedRow.ref_id,
        approver_remarks: remarks,
        action: "GSIAD DISAPPROVED",
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
          //close assigment info modal if open
          setOpenUpdateAssetDetails(false);
          setOpenUpdateAssetDisapproval(false);

          getUpdatedAssetList();
          setIsLoading(false);
          toast.success("Updated Asset Disapproved!");
          setRemarks("");
          //load approval list to get updated list
          //   getForItemApproval();

          getRegisteredItems();
          getAvailableItem();
          //send email
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
                    onClick={disapproveUpdatedAsset}
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

export default UpdatedAssetDisapproval;
