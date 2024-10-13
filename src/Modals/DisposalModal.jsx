/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, {useState, useEffect, useRef} from "react";
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import Loaders from "../utils/Loaders";
import { useAuth } from "../components/AuthContext"

import { NODE_MAILER_ROUTE, insertDisposalRoute } from "../utils/inventoryApiEnpoints";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuidv4 } from "uuid";

const DisposalModal = ({
  open,
  onClose,
  selectedRow,
  disableBackdropClick,
  setOpenDisposalModal,
  getDisposalList,
  gsiadApproverEmail,
  getDisposalForApprovalList,
  getRegisteredItems
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [isLoading, setIsLoading] = useState(false);

  const [disposalFile, setDisposalFile] = useState("");
  const fileInputRef = useRef(null);

  const [remarks, setRemarks] = useState("");
  const [data, setData] = useState({
    Main_Data: {
      def_id: "",
      ref_id: "",
      disposal_remarks: remarks,
      creator_id: "", //
      creator_email: "",
      approver_remarks: "",
      approver_id: ""
    },
  });

  useEffect(() => {
    // If selectedRows has items and the ref_id has changed, update the ref_id in the state
    setData((prevData) => ({
      ...prevData,
      Main_Data: {
        ...prevData.Main_Data,
        dip_id: '0',
        ref_id: selectedRow?.ref_id,
        disposal_remarks: remarks,
        // user_assign: selectedRow?.assign_user, // Assuming ref_id is a single value, not an array
        creator_id: user && user[0].emp_id, // Assuming ref_id is a single value, not an array
        creator_email: user && user[0].wb_email,
        approver_remarks: "",
        approver_id: "",
      },
    }));
  }, [
    selectedRow,
    data.Main_Data.def_id,
    data.Main_Data.ref_id,
    remarks,
    data.Main_Data.creator_id,
    data.Main_Data.creator_email,
    data.Main_Data.approver_remarks,
    data.Main_Data.approver_id
  ]);



  function handleFileUpload(event) {

     event.stopPropagation();
     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

     // Check if the user has selected a file
     if (event.target.files.length > 0) {
       const file = event.target.files[0];

       console.log(file);
       

       // Check if the file type is allowed
       if (allowedTypes.includes(file.type)) {
         // File type is allowed, proceed with processing
         setDisposalFile(file);
       } else {
         // File type is not allowed, show error message and reset file input
         toast.error("Only PDF, JPEG, and PNG files are allowed.");
         setDisposalFile("");

         if (fileInputRef.current) {
           fileInputRef.current.value = ""; // Reset the input field
         }
       }
     } else {
       // No file is selected (user clicked cancel), so reset the file state
       setDisposalFile("");

       if (fileInputRef.current) {
         fileInputRef.current.value = ""; // Reset the input field
       }
     }
  }

  useEffect(() => {
    console.log(disposalFile);
  }, [disposalFile]); // This will run whenever clearanceFile changes

  //test

  /*--------------------Node Mailer--------------------------------------*/
  // let msg = `  <span style='font-family: Trebuchet MS, serif; font-size: 14px;'>
  //              Hello!  <br><br> Registered Asset ${selectedRow?.ref_id} - ${selectedRow?.item_name} disposal created. Pending for GSIAD approval.
  //              <br><br>
  //              Disregard this email. Testing QR Inventory System Mailer. <br>Thank you for your cooperation.<br>
  //              <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply.</span>
  //              </span>`;

    let msg = `<span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               A disposal was created asset with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} requires your review/checking/approval. Please review the created disposal using the following link: <br>
               <a href="http://192.168.100.68/" target="_blank">QR Inventory</a>.
               <br><br>

               Should you have any inquires or require any assistance, please don't hesitate to contact <a href="#" target="_blank">itsupport@wealthbank.com.ph</a>
               <br>
               <strong> Your prompt attention to this matter is highly appreciated.</strong>

               <br><br>

               Disregard this email. Testing QR Inventory System Mailer. <br>
               <span style='color: gray;'>This is a System-Generated E-mail. Please do not reply. Wealthbank - Research & Development Unit</span>
               </span>`;

  /*Email to GSIAD if disposal created cc to none
   */

  const sendMail = async () => {
    try {
      const response = await axios.post(NODE_MAILER_ROUTE, [
        {
          // mail_to: `${departmentHeadEmail}`,
          mail_to: `${gsiadApproverEmail}`,
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

  const createDisposal = async () => {
    event.preventDefault();
    console.log(selectedRow.ref_id);

    const formData = new FormData();
    formData.append("testFile_" + uuidv4(), disposalFile);
    formData.append("data", JSON.stringify([data]));

    console.log(data);
    console.log(disposalFile);
    // console.log(remarks);

    if (disposalFile == "" || disposalFile == null) {
      toast.error("Attachment is required!");
      return;
    }

    if (remarks == "") {
      toast.error("Remarks is required!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(insertDisposalRoute, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data[0]);
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          
          setIsLoading(false); // Stop loading
          toast.success(response.data[0].rspmsg); // Display success message
          setDisposalFile(null)
          getDisposalList();
          setOpenDisposalModal(false);
          setRemarks("")
          getRegisteredItems();
          getDisposalForApprovalList();
          //send mail
          sendMail();
        }, 3000);
      } else {
         setTimeout(() => {
           getDisposalList();
           setOpenDisposalModal(false);
           setDisposalFile(null)
           setIsLoading(false); // Stop loading
           toast.error(response.data[0].rspmsg);
         }, 3000);
      

      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Error Occured");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <React.Fragment>
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClose={onClose}
          onClick={disableBackdropClick}
          sx={{
            "& .MuiDialog-paper": {
              height: "850px", // Adjust the height as needed
            },
          }}
        >
          <div className="flex flex-row justify-between">
            <DialogTitle>
              <div className="text-sm">Create Disposal</div>
            </DialogTitle>
            <DialogActions>
              <FontAwesomeIcon
                icon={faClose}
                className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
                onClick={() => {
                  onClose(),
                  setDisposalFile(null)
                }}
              />
            </DialogActions>
          </div>
          <DialogContent>
            <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
              {/* <CircularProgress color="inher" />  */}
              <Loaders />
            </Backdrop>
            <div>
              <div className="mt-2 bg-slate-400 w-full ">
                <form action="" className="p-6 w-full">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="mb-5 col-span-2">
                      <label
                        htmlFor="asset_code"
                        className="text-left text-xs text-gray-900"
                      >
                        Fixed Asset Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fixed_asset"
                        name="fixed_asset"
                        value={selectedRow?.fixed_asset || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5"
                        readOnly
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="item_name"
                        className=" text-left text-xs text-gray-900"
                      >
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="item_name"
                        name="item_name"
                        value={selectedRow?.item_name || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5"
                        readOnly
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="quantity"
                        className="block text-left text-xs text-gray-900"
                      >
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={selectedRow?.quantity || ""}
                        min={1}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        readOnly
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-left text-xs text-gray-900"
                      >
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={selectedRow?.price || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        readOnly
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="date_received"
                        className="block text-left text-xs text-gray-900"
                      >
                        Date Recieved <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date_received"
                        name="date_received"
                        value={selectedRow?.date_received || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full pt-2 p-2.5"
                        readOnly
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="block text-left text-xs text-gray-900"
                      >
                        Warranty <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="warranty"
                        name="warranty"
                        value={selectedRow?.warranty || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full  p-2.5 "
                        readOnly
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="date_expire"
                        className="block text-left text-xs text-gray-700"
                      >
                        Expiration Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="date_expire"
                        name="date_expire"
                        value={selectedRow?.date_expire || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full pt-2 p-2.5 "
                        readOnly
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="unit"
                        className="block text-left text-xs text-gray-900"
                      >
                        Unit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="unit"
                        name="unit"
                        value={selectedRow?.unit || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        readOnly
                      />
                    </div>
                    <div className="col-span-1">
                      <label
                        htmlFor="serial_number"
                        className="block text-left text-xs text-gray-900"
                      >
                        Storage Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        value={selectedRow?.storage_location || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        readOnly
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="model_number"
                        className="block text-left text-xs text-gray-900"
                      >
                        Model Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="model_number"
                        name="model_number"
                        value={selectedRow?.model_number || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        readOnly
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="serial_number"
                        className="block text-left text-xs text-gray-900"
                      >
                        Serial Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="serial_number"
                        name="serial_number"
                        value={selectedRow?.serial_number || ""}
                        className="bg-slate-300 border border-gray-700 text-gray-900 text-xs outline-none block w-full p-2.5 "
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="file-input" className="sr-only">
                      Choose file
                    </label>
                    <input
                      type="file"
                      name="file-input"
                      id={`fileInput_${selectedRow?.ref_id}`}
                      className="block w-full border bg-slate-50 border-gray-700 shadow-sm  text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 readOnly:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
                    file:bg-gray-400 file:border-0
                    file:me-4
                    file:py-3 file:px-4"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-gray-900">
                      Remarks <span className="text-red-500">*</span>
                    </div>
                    <textarea
                      className="resize-none border text-xs border-gray-700 rounded-md p-2 w-full h-20 "
                      name="remarks"
                      onChange={() => setRemarks(event.target.value)}
                      placeholder="Enter your text here..."
                      required
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
                      onClick={createDisposal}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </DialogContent>
          {/* <DialogActions>
            <Button sx={{ fontSize: "12px" }} onClick={onClose}>
              Close
            </Button>
          </DialogActions> */}
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default DisposalModal;
