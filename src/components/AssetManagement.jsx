/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import { ThemeProvider } from "@emotion/react";

import React, { Suspense, useEffect, useState } from "react";
import Table from "./Table";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import PendingItems from "./PendingItems";
import Import from "./Import";
import { Badge } from "@mui/material";
import RegisterAsset from "../Modals/RegisterAsset";
import DisapproveRegistration from "./DisapproveRegistration";


const AssetManagement = ({
  registeredItems,
  getForItemApproval,
  getRegisteredItems,
  disapproveItems,
  getDisapproveItems,
  getAvailableItem,
  pendingItems,
  getPendingItems,
  // splitInstances,
  storageLocation,
  getStorageLocation,
  itemName,
  gsiadApproverEmail,
  screens }) => {
   const { isAuthenticated, user, logout } = useAuth();
 
   const [open, setOpen] = useState(false);


   const navigate = useNavigate();
   const [currentView, setCurrentView] = useState("registered"); // Default view is pending

  const [isOpenPending, setIsOpenPending] = useState(false);
  const [isOpenDisapprove, setIsOpenDisapprove] = useState(false);
  const [isOpenImport, setIsOpenImport] = useState(false);
  

   

  const toggleRegistered = () => {
      setCurrentView("registered");
      setIsOpenPending(false);
      setIsOpenImport(false);
      setIsOpenDisapprove(false);
  };

  const toggleDisapprove = () => {
    setCurrentView("disapprove");
    setIsOpenDisapprove(true);
    setIsOpenImport(false);
    setIsOpenPending(false);
  }
  
   const togglePending = () => {
     setCurrentView("pending");
     setIsOpenPending(true);
     setIsOpenImport(false);
     setIsOpenDisapprove(false);
   };

    const toggleImport = () => {
      setCurrentView("import");
      setIsOpenPending(false);
      setIsOpenImport(true);
      setIsOpenDisapprove(false);
  };
  
   //checck  screen access
   let userScreens;
   if (user) {
     userScreens = user.map((item) => item.screen_id);
   }

   let userDefaultScreen;
   if (user) {
     userDefaultScreen = screens.find(
       ({ screen_id }) => screen_id == user[0].screen_id
     );
   }

   // Inside your component function
   useEffect(() => {
     if (isAuthenticated && userScreens && !userScreens.includes("1")) {
       const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
       navigate(defaultPath);
     }
   }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

   /*------------------------------------------------------------------*/

   const handleClose = () => {
     setOpen(false);
   };


   return (
     <>
       {isAuthenticated ? (
         <div className="flex flex-col h-screen">
           <div className="flex flex-row justify-between p-6">
             <div className="flex flex-row gap-2 items-end">
               <div>
                 {/* Render the dialog component */}
                 <RegisterAsset
                   open={open}
                   setOpen={setOpen}
                   handleClose={handleClose}
                   //fetchDataList={fetchDataList}
                   getRegisteredItems={getRegisteredItems}
                   itemName={itemName}
                   getForItemApproval={getForItemApproval}
                   storageLocation={storageLocation}
                   getStorageLocation={getStorageLocation}
                   user={user}
                   gsiadApproverEmail={gsiadApproverEmail}
                 />
               </div>

               <div>
                 <button
                   type="button"
                   className={`${
                     currentView === "registered"
                       ? "shadow-lg shadow-gray-700"
                       : ""
                   } text-gray-800 border border-gray-800 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 cursor-pointer hover:shadow-lg hover:shadow-gray-700`}
                   onClick={toggleRegistered}
                   disabled={currentView === "registered" && !isOpenImport}
                 >
                   Registered Items
                 </button>
               </div>

               <div>
                 {/* <Badge
                   //  badgeContent={splitInstances.length}
                   badgeContent={disapproveItems.length}
                   anchorOrigin={{
                     vertical: "top",
                     horizontal: "right",
                   }}
                   color="error"
                   max={999}
                 > */}
                   <button
                     type="button"
                     className={`${
                       currentView === "disapprove"
                         ? "shadow-lg shadow-red-700 "
                         : ""
                     } text-red-500 border border-red-500 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 cursor-pointer hover:shadow-lg hover:shadow-red-700`}
                     onClick={toggleDisapprove}
                     disabled={currentView === "disapprove" && !isOpenImport}
                   >
                     Disapproved Items
                   </button>
                 {/* </Badge> */}
               </div>

               <div>
                 {/* <Badge
                   //  badgeContent={splitInstances.length}
                   badgeContent={pendingItems.length}
                   anchorOrigin={{
                     vertical: "top",
                     horizontal: "right",
                   }}
                   color="secondary"
                   max={999}
                 > */}
                   <button
                     type="button"
                     className={`${
                       currentView === "pending"
                         ? "shadow-lg shadow-purple-500"
                         : ""
                     }  text-purple-600 border border-purple-500 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 cursor-pointer hover:shadow-lg hover:shadow-purple-500`}
                     onClick={togglePending}
                     disabled={currentView === "pending" && !isOpenImport}
                   >
                     Pending Items
                   </button>
                 {/* </Badge> */}
               </div>
             </div>
             <div>
               <button
                 type="button"
                 className="text-blue-700 border border-blue-700 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 cursor-pointer hover:shadow-lg hover:shadow-blue-600 ring-1 ring-white"
                 onClick={() => setOpen(true)}
               >
                 Register
               </button>
               <button
                 type="button"
                 className={`${
                   currentView === "import"
                     ? "shadow-lg shadow-green-600"
                     : ""
                 } text-green-800 border border-green-800 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 cursor-pointer hover:shadow-lg hover:shadow-green-700`}
                 onClick={toggleImport}
                 disabled={isOpenImport}
               >
                 Import
               </button>
             </div>
           </div>
           <div className="px-6">
             {(() => {
               switch (currentView) {
                 case "pending":
                   return (
                     <PendingItems
                       getRegisteredItems={getRegisteredItems}
                       pendingItems={pendingItems}
                       getPendingItems={getPendingItems}
                       //  splitInstances={splitInstances}
                       storageLocation={storageLocation}
                       getStorageLocation={getStorageLocation}
                       getForItemApproval={getForItemApproval}
                       user={user}
                     />
                   );
                 case "registered":
                   return (
                     <Table
                       registeredItems={registeredItems}
                       getRegisteredItems={getRegisteredItems}
                       getAvailableItem={getAvailableItem}
                       itemName={itemName}
                       storageLocation={storageLocation}
                       getStorageLocation={getStorageLocation}
                       user={user}
                       gsiadApproverEmail={gsiadApproverEmail}
                       getForItemApproval={getForItemApproval}
                     />
                   );

                 case "disapprove":
                   return (
                     <DisapproveRegistration
                       disapproveItems={disapproveItems}
                       getDisapproveItems={getDisapproveItems}
                       storageLocation={storageLocation}
                       user={user}
                     />
                   );
                 case "import":
                   return (
                     <Import
                       getRegisteredItems={getRegisteredItems}
                       storageLocation={storageLocation}
                       itemName={itemName}
                       getForItemApproval={getForItemApproval}
                       user={user}
                     />
                   );
                 default:
                   return null;
               }
             })()}
           </div>
         </div>
       ) : (
         <Navigate to="/" />
       )}
     </>

     // </ThemeProvider>
   );
};
 


export default AssetManagement;

