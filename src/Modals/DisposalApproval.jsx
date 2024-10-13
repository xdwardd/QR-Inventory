import { Backdrop, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, {useState} from 'react'
import Loaders from '../utils/Loaders';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NODE_MAILER_ROUTE, insertDisposalApprovalRoute } from '../utils/inventoryApiEnpoints';



const DisposalApproval = ({
  open,
  onClose,
  selectedRow,
  setOpenDisposalDetails,
  setOpenDisposalApproval,
  disableBackdropClick,
  getApprovalDisposal,
  user,
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

              
                The disposal with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} has been approved by GSIAD Head. You can check the disposed asset using the following link: <br>
                 <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;

  /**if GSIAD APPROVED send email sa maker.
   */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${departmentHeadEmail}`,
          mail_to: `${selectedRow?.creator_email}`,
          cc: `campo.lavynmary@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, lepaopao.jeirald@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
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

  const disposeItem = async () => {
    event.preventDefault();
    console.log(selectedRow.assign_user);

    try {
      setIsLoading(true);
      const response = await axios.post(
        insertDisposalApprovalRoute,
        {
          id: selectedRow.id,
          ref_id: selectedRow.ref_id,
          // dip_id: selectedRow.dip_id,
          // assigned_user: selectedRow.assigned_user,
          approver_remarks: "",
          action: "GSIAD APPROVED",
          approver_id: user && user[0].emp_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.data[0].retVal === "1") {
        setTimeout(() => {
          setOpenDisposalApproval(false);

          //close disposal details if open
          setOpenDisposalDetails(false);

          setIsLoading(false);
          toast.success("Item Successfully Disposed!");
          getApprovalDisposal();
          //send mail
          sendMail()
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
                  Are you sure you want to Dispose{" "}
                  <span className="font-medium">
                    {selectedRow.ref_id} - {selectedRow.item_name}
                  </span>{" "}
                  ?
                </p>
              )}

              <div className="flex flex-row justify-end mt-8 space-x-4">
                <button
                  className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                  onClick={disposeItem}
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

export default DisposalApproval;
