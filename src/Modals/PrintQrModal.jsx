/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import QRCode from "qrcode.react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const PrintQrModal = ({
  open,
  onClose,
  disableBackdropClick,
  responseQr,
  selectedRow,
  qrSize = 300,
}) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");
  //const [loading, setLoading] = usesState(true);

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
    }
  };


  const qrValue = `
    -- QR Inventory System -- 

    Ref ID: ${selectedRow?.ref_id}
    Fixed Asset: ${selectedRow?.fixed_asset}
    Item Name: ${selectedRow?.item_name}
    Quantity: ${selectedRow?.quantity}
    Price: ${selectedRow?.price}
    Date Received: ${selectedRow?.date_received}
    Date Expire: ${selectedRow?.date_expire}
    Model Number: ${selectedRow?.model_number}
    Serial Number: ${selectedRow?.serial_number}
    Storage Location: ${selectedRow?.storage_location}
  `;

  return (
    <>
      <React.Fragment>
        <Dialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          open={open}
          onClose={onClose}
          onClick={handleBackdropClick}
          sx={{
            "& .MuiDialog-paper": {
              height: "450px",
              width: "500px", // Adjust the height as needed
            },
          }}
        >
          <DialogActions>
            <FontAwesomeIcon
              icon={faClose}
              className="h-5 p-2 text-red-500 hover:bg-red-100  hover:rounded-md cursor-pointer"
              onClick={onClose}
            />
          </DialogActions>
          <DialogContent>
            <div className="flex justify-center">
              <QRCode value={qrValue} size={qrSize} />
            </div>
           
            {/* <div className="flex justify-center mx-auto">
              <img src={responseQr} alt="" className="h-96" />
            </div> */}
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </>
  );
};

export default PrintQrModal;
