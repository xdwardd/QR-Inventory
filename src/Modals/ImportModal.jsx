/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ImportModal = ({ open, handleClose, disableBackdropClick }) => {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("sm");

  const handleBackdropClick = (event) => {
    // Prevent the dialog from closing when clicking on the backdrop
    if (disableBackdropClick) {
      event.stopPropagation();
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
        onClose={handleClose}
        onClick={handleBackdropClick}
        sx={{
          "& .MuiDialog-paper": {
            height: "300px", // Adjust the height as needed
          },
        }}
      >
        <DialogTitle>
          <div className="mt-4">Filename</div>
        </DialogTitle>
        <DialogContent>
          <form className="w-full">
            <label htmlFor="file-input" className="sr-only">
              Choose file
            </label>
            <input
              type="file"
              name="file-input"
              id="file-input"
              className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
                    file:bg-gray-400 file:border-0
                    file:me-4
                    file:py-3 file:px-4"
            />
            <div className="flex justify-end mt-4">
              <button className="py-2 px-6 rounded-md bg-blue-600 hover:bg-blue-700 text-white">
                Upload
              </button>
            </div>
          </form>
          {/* <form>
                <label className="block">
             
                <input type="file" className="block w-full text-sm text-gray-700 border  border-gray-400 rounded-l-xl
                    file:me-4 file:py-3 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600  file:text-white
                    hover:file:bg-blue-700
                  
                "/>
                        </label>
                        <div className='flex justify-end mt-4'>

                        <button className='py-2 px-6 rounded-md bg-blue-600 text-white'>Upload</button>
                        </div>
            </form> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ImportModal;
