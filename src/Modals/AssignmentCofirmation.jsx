import { Backdrop, Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useState  } from "react";
import Loaders from "../utils/Loaders";

const AssignmentCofirmation = ({open, setOpenConfirmModal, handleUserAssignment, username}) => {
const [fullWidth, setFullWidth] = useState(true);
const [maxWidth, setMaxWidth] = useState("sm");
const [isLoading, setIsLoading] = useState(false);
    
return (
  <div>
    <React.Fragment>
      {/* Display Loading */}

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
       
        sx={{
          "& .MuiDialog-paper": {
            height: "270px", // Adjust the height as needed
          },
        }}
      >
        <DialogTitle>
          {/* <div className="mt-4">For Process (Assets From E-Purchasing)</div> */}
        </DialogTitle>
        <DialogContent>
          <div className="p-6">
            <div className="text-xl font-bold text-gray-600">
              Confirm Action
            </div>
          
              <p className="mt-4 text-sm ">
                Assign selected items to{" "}
                <span className="font-medium">
                  {username[0]}
                </span>{" "}
                ?
              </p>
        

            <div className="flex flex-row justify-end mt-8 space-x-4">
              <button
                className="bg-green-600 py-2 px-8  shadow-green-300 shadow-lg  rounded-md font-medium text-white hover:bg-green-700"
                onClick={handleUserAssignment}
              >
                Yes
              </button>
              <button
                className="bg-red-600 py-2 px-6 shadow-red-400 shadow-lg rounded-md font-medium text-white hover:bg-red-700"
                onClick={() => setOpenConfirmModal(false)}
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
}

export default AssignmentCofirmation
