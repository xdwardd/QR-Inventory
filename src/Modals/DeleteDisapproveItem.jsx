import { Backdrop, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, {useState} from 'react'
import Loaders from '../utils/Loaders';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { deleteItemsRoute } from '../utils/inventoryApiEnpoints';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteDisapproveItem = ({
  open,
  setOpenDeleteModal,
  selectedRow,
  getDisapproveItems,
  user
}) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState();

  const deleteDisapproveItems = async () => {
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
        deleteItemsRoute,
        [{
          ref_id: selectedRow.ref_id,
          approver_remarks: remarks,
          action: "Delete",
          approver_id: user && user[0].emp_id,
        }],
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
          setOpenDeleteModal(false);
          //close accountability info modal if open
            toast.success("Item Deleted!"); 
          getDisapproveItems();
          setRemarks("");
          //send mail
          //  sendMail();
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
              onClick={() => setOpenDeleteModal(false)}
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
                      onClick={deleteDisapproveItems}
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

export default DeleteDisapproveItem
