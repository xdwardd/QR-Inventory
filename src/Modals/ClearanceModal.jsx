/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/
import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import { NODE_MAILER_ROUTE, createClearanceRoute, usermanagementRoute } from "../utils/inventoryApiEnpoints";
import dropdowndata from "../utils/dropdowndata";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuidv4 } from "uuid";

const ClearanceModal = ({
  open,
  onClose,
  selectedRow,
  disableBackdropClick,
  setOpenClearanceModal,
  getClearanceList,
  user,
  gsiadApproverEmail,
  getCreatedClearanceList
}) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };


  

  const [clearanceFile, setClearanceFile] = useState("");
  const fileInputRef = useRef(null);
  const [remarks, setRemarks] = useState("");
  const [data, setData] = useState({
    Main_Data: {
      ref_id: "", // Initialize with an empty value
      clr_id: "",
      clearance_remarks: remarks,
      assigned_user: "", // Assuming assign_user is an array, otherwise, specify how you want to handle multiple assign_user
      user_dept: "",
      assigned_user_email: "",
      approver_id: "",
      approver_remarks: "",
      status: "",
      job_level: "",
      executive_approver: "",
    },
  });

  useEffect(() => {
    // If selectedRows has items and the ref_id has changed, update the ref_id in the state
    setData((prevData) => ({
      ...prevData,
      Main_Data: {
        ...prevData.Main_Data,
        ref_id: selectedRow?.ref_id,
        clearance_remarks: remarks,
        assigned_user: selectedRow?.assigned_user, // Assuming ref_id is a single value, not an array
        user_dept: user && user[0].dept_desc,
        assigned_user_email: user && user[0].wb_email,
        approver_id: "",
        approver_remarks: "",
        // status: "USER-CLEARANCE: PENDING FOR DEPARTMENT HEAD APPROVAL",
        status: selectedRow?.status,
        job_level: selectedRow?.job_level,
        executive_approver: selectedRow?.executive_approver
      },
    }));
  }, [
    selectedRow,
    data.Main_Data.ref_id,
    remarks,
    data.Main_Data.assigned_user,
    data.Main_Data.user_dept,
    data.Main_Data.assigned_user_email,
    data.Main_Data.approver_id,
    data.Main_Data.approver_remarks,
    data.Main_Data.status,
    data.Main_Data.job_level,
    data.Main_Data.executive_approver
  ]);



  function handleFileUpload(event) {
    event.stopPropagation();
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    // Check if the user has selected a file
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      // Check if the file type is allowed
      if (allowedTypes.includes(file.type)) {
        // File type is allowed, proceed with processing
        setClearanceFile(file);
      } else {
        // File type is not allowed, show error message and reset file input
        toast.error("Only PDF, JPEG, and PNG files are allowed.");
        setClearanceFile("");

        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset the input field
        }
      }
    } else {
      // No file is selected (user clicked cancel), so reset the file state
      setClearanceFile("");

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input field
      }
    }
  }


  // useEffect(() => {
  //   console.log(clearanceFile);
  // }, [clearanceFile]); // This will run whenever clearanceFile changes

  //get user head department
  const [departmentHeadEmail, setDepartmentHeadEmail] = useState("");
  const getHeadDepartment = async () => {
    try {
      const response = await axios.post(
        usermanagementRoute,
        {
          emp_id: user && user[0].emp_id,
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
    if (user != null) {
      getHeadDepartment();
    }
  }, [user]);

  /*--------------------Node Mailer--------------------------------------*/

  let msg = `<span style='font-family: Trebuchet MS, serif; font-size: 14px; color: black;'>
               Greetings! <br>
               A clearance was created asset with reference ID ${selectedRow?.ref_id} - ${selectedRow?.item_name} assigned to ${selectedRow?.assigned_user} requires your review/checking/approval. Please review and approve the clearance using the following link: <br>
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
          mail_to: `lepaopao.jeirald@wealthbank.com.ph`,
          // cc: `${selectedRow?.creator_email}, ${gsiadApproverEmail}`,
         cc: `campo.lavynmary@wealthbank.com.ph, paras.karoljohn@wealthbank.com.ph, catapan.edward@wealthbank.com.ph, prieto.homer@wealthbank.com.ph, dagaas.fritzfrancis@wealthbank.com.ph`,
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

  const createClearance = async () => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("attachment_" + uuidv4(), clearanceFile);
    formData.append("data", JSON.stringify([data]));

    // console.log(data);
    console.log(clearanceFile);
    // console.log(remarks);
    console.log(formData);
    console.log(data);
    

    if (clearanceFile == "" || clearanceFile == null) {
      toast.error("Attachment is required!");
      return;
    }

    if (remarks == "") {
      toast.error("Remarks is required!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(createClearanceRoute, formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`

        },
      });
      console.log(response.data);
      if (response.data.retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds
          setIsLoading(false); // Stop loading;
          setOpenClearanceModal(false);
          toast.success("Clearance Created!"); // Display success message
          setClearanceFile(null);
          //reload list
          getClearanceList();
          getCreatedClearanceList();
          //send email clearance is created successfully
          sendMail();
        }, 3000);
      } else {
        setIsLoading(false);
        toast.error("Error Occurred!");
        return;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Error Occurred!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button> */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={onClose}
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "850px", // Adjust the height as needed
          },
        }}
      >
        <div className="flex flex-row justify-between">
          <DialogTitle>
            <div className="">Create Clearance</div>
          </DialogTitle>
          <DialogActions sx={{ marginRight: "1rem" }}>
            <FontAwesomeIcon
              icon={faClose}
              className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
              onClick={() => {
                onClose();
                setClearanceFile(null)
              }}
            />
          </DialogActions>
        </div>
        <DialogContent>
          <div>
            <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
              {/* <CircularProgress color="inher" />  */}
              <Loaders />
            </Backdrop>
            <div className=" bg-slate-400 w-full ">
              <form action="" className="p-6 w-full" onSubmit={createClearance}>
                <div className="grid grid-cols-4 gap-2">
                  <div className=" col-span-2">
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

                  {(selectedRow?.fixed_asset ==
                    dropdowndata.getFixedAsset()[0].value ||
                    selectedRow?.fixed_asset ==
                      dropdowndata.getFixedAsset()[2].value) && (
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
                        className="bg-slate-300 border border-gray-600 text-gray-600 text-xs outline-none block w-full p-2 "
                        readOnly
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    {(selectedRow?.fixed_asset ==
                      dropdowndata.getFixedAsset()[0].value ||
                      selectedRow?.fixed_asset ==
                        dropdowndata.getFixedAsset()[2].value) && (
                      <>
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
                          className="bg-slate-300 border border-gray-600 text-gray-600 text-xs outline-none block w-full  p-2 "
                          readOnly
                        />
                      </>
                    )}
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
                    // onClick={createClearance}
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
  );
};

export default ClearanceModal;
