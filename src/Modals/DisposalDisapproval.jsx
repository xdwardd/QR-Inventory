import { Backdrop, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, {useState} from 'react'
import Loaders from '../utils/Loaders';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NODE_MAILER_ROUTE, insertDisposalApprovalRoute } from '../utils/inventoryApiEnpoints';
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DisposalDisapproval = ({
  open,
  onClose,
  selectedRow,
  disableBackdropClick,
  getApprovalDisposal,
  setOpenDisposalDetails,
  setOpenDisapprovalDisposal,
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
  // let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px;'>
  //              Hello!  <br><br> Registered Asset ${selectedRow?.ref_id} - ${selectedRow?.item_name} for disposal was disapproved by GSIAD.
  //              <br><br>
  //              Disregard this email. Testing QR Inventory System Mailer. <br>Thank you for your cooperation.<br>
  //              <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply.</span>
  //              </span>`;

     
  let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>

              
                The disposal with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} has been disapproved by GSIAD Head. Please review the disapproved disposal using the following link: <br>
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
          
          mail_to: `${selectedRow?.creator_email}`,
          cc: `paras.karoljohn@wealthbank.com.ph`,
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

  const disapproveDisposal = async () => {
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
        insertDisposalApprovalRoute,
        {
          id: selectedRow.id,
          ref_id: selectedRow.ref_id,
          // assigned_user: selectedRow.assign_user,
          approver_remarks: remarks,
          action: "GSIAD DISAPPROVED",
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
          setOpenDisapprovalDisposal(false);
          //close clearance details if open
          setOpenDisposalDetails(false);
          toast.success("Disposal Disapproved!");
          setRemarks("");
          getApprovalDisposal();
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
                      onClick={disapproveDisposal}
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

export default DisposalDisapproval;
