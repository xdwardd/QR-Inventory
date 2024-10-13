import { Backdrop, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, {useState} from 'react'
import Loaders from '../utils/Loaders';
import {NODE_MAILER_ROUTE, registeredItemsApprovalRoute } from '../utils/inventoryApiEnpoints';
import { toast } from 'react-toastify';
import axios from 'axios';

const ApprovalRegisterModal = ({
  open,
  onClose,
  selectedRow,
  selectedRows,
  setSelectedRow,
  setSelectedRowIds,
  setOpenRegisterApprovalModal,
  setOpenForApprovalInfo,
  disableBackdropClick,
  getRegisteredItems,
  getForItemApproval,
  getAvailableItem,
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


  /*--------------------Node Mailer--------------------------------------*/
 
  let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               We are pleased to inform you that the assets ${
                 selectedRows && selectedRows.length > 0
                   ? selectedRows.map((row) => row.ref_id).join(", ")
                   : `${selectedRow?.ref_id} - ${selectedRow?.item_name}`
               } you have created has been approved by the GSIAD Head. <br  > You can review the approved assets by clicking the following link: <br>
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
          // mail_to:
          //   selectedRows && selectedRows.length > 0
          //     ? selectedRows.map((row) => row.creator_email).join(", ")
          //     : selectedRow?.creator_email,
          mail_to: `catapan.edward@wealthbank.com.ph`,
          cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
          // cc: `${gsiadApproverEmail}, campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
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

   
  //  //multiple data selected
  //  const selecteRefID = selectedRows.map((item) => item.ref_id);
  //   // Generate new user info objects with updated screen_id
  // const selected_rows = selecteRefID.map((refId) => ({
  //     ...selectedRows,
  //     // ref_id: refId,
  //     approver_remarks: "",
  //     action: "Approve",
  //   approver_id: user && user[0].emp_id,
  //   }));

  const selected_rows = selectedRows.map((item) => ({
    ...item,
    generated_pending_id: "0",
    assigned_user_email: "",
    approver_remarks: "",
    action: "Approve",
    approver_id: user && user[0].emp_id,
  }));

    

  // console.log(user);
  const approveAsset = async () => {
    event.preventDefault();
    console.log(selected_rows);
    
    try {
      setIsLoading(true);
    
      /*if selected pass parameter ass object else you selected multiple data pass it as array refer relected_row var*/
          let response;
          if (selectedRow) {
          response = await axios.post(
            registeredItemsApprovalRoute,
            [
              {
                // ref_id: selectedRow.ref_id,

                ...selectedRow,
                generated_pending_id: "0",
                assigned_user_email: "",
                approver_remarks: "",
                action: "Approve",
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
         
          } else {
            response = await axios.post(
              registeredItemsApprovalRoute,
              selected_rows,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "access_token"
                  )}`,
                },
              }
            );
            // Reset selected_rows after submission
          
          }
      if (response.data[0].retVal === "1") {
        setTimeout(() => {
         
          setIsLoading(false);
          toast.success(response.data[0].rspmsg);
          setOpenRegisterApprovalModal(false);
          setSelectedRow(null);
          setSelectedRowIds([]);
           //close forApprovalDetails if open
          setOpenForApprovalInfo(false);
       
          //  load approval list to get updated list
          getForItemApproval();
          //  load approval list to get updated list
          getAvailableItem();
          //load  registered items to get updated list
          getRegisteredItems();

          //if success
          sendMail();
        }, 3000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setOpenRegisterApprovalModal(false);
           //close forApprovalDetails if open
          setOpenForApprovalInfo(false);
          toast.error(response.data[0].rspmsg);
          getForItemApproval();
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

              {selectedRow && (!selectedRows || selectedRows.length === 0) && (
                <p className="mt-4 text-sm">
                  Approve Asset{" "}
                  <span className="font-medium">
                    {selectedRow.ref_id} - {selectedRow.item_name}
                  </span>{" "}
                  ?
                </p>
              )}

              {selectedRows && selectedRows.length !== 0 && (
                <p className="mt-4 text-sm font-medium"> You selected 
                  <span className='text-red-500 font-bold'>  {selectedRows.length}</span> Items. Approve
                  all ?
                </p>
              )}

              {/* {selectedRow && (
                <p className="mt-4 text-sm ">
                  Approve Asset{" "}
                  <span className="font-medium">
                    {selectedRow.ref_id} - {selectedRow.item_name}
                  </span>{" "}
                  ?
                </p>
              )} */}

              <div className="flex flex-row justify-end mt-8 space-x-4">
                <button
                  className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                  onClick={approveAsset}
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

export default ApprovalRegisterModal
