 /****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/ 

import React, {useState, useEffect} from 'react'
import "./App.css";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetManagement from './components/AssetManagement'
import Assignment from './components/Assignment'
import Accountability from './components/Accountability'
import Clearance from './components/Clearance'
import ApprovalClearance from './components/ApprovalClearance'
import Reports from './components/Reports'
import Login from './components/Login'
import Sidebar from './components/Sidebar';
import ApprovalAssignment from './components/ApprovalAssignment';
import ErrorPage from './components/ErrorPage';
import {ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Settings from './components/Settings';
import "./utils/loader.css"
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import Disposal from './components/Disposal';
import {
  usermanagementRoute,
  getClearanceListRoute,
  getClearanceApprovalRoute,
  getItemNameRoute,
  pendingItemsRoute,
  getAvailableItemRoute,
  getForItemApprovalListRoute,
  registeredItemsUpdatedList,
  getStorageLocationRoute,
  registerItemRoute,
  getGsiadApproverRoute,
  disapprovedRegisteredItemsRoute
} from "./utils/inventoryApiEnpoints";
import ApprovalRegister from './components/ApprovalRegister';
import {AuthProvider } from './components/AuthContext';
import ApprovalUpdatedAsset from './components/ApprovalUpdatedAsset';
import ApprovalDisposal from './components/ApprovalDisposal';
import TokenExpiredModal from './Modals/TokenExpiredModal';
import { log10 } from 'chart.js/helpers';


const screens = [
  { screen_id: 1, path: "inventory/assetmanagement" },
  { screen_id: 2, path: "inventory/assignment" },
  { screen_id: 3, path: "inventory/approval/register" },
  { screen_id: 4, path: "inventory/approval/updateditems" },
  { screen_id: 5, path: "inventory/approval/assignment" },
  { screen_id: 6, path: "inventory/approval/clearance" },
  { screen_id: 7, path: "inventory/approval/disposal" },
  { screen_id: 8, path: "inventory/accountability" },
  { screen_id: 9, path: "inventory/clearance" },
  { screen_id: 10, path: "inventory/reports" },
  { screen_id: 11, path: "inventory/disposal" },
  { screen_id: 12, path: "inventory/settings" },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  /**--------------------------------- Get Registered Items------------------------------------------ */

  const [registeredItems, setRegisteredItems] = useState([]);
  const getRegisteredItems = async () => {
    try {
      const response = await axios.get(registerItemRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      // setIsLoading(false);
      setRegisteredItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRegisteredItems();
  }, []);

  // /**--------------------------------- Get Pending Items------------------------------------------ */
  // const [pendingItems, setPendingItems] = useState([]);
  // const getPendingItems = async () => {
  //   try {
  //     const response = await axios.get(pendingItemsRoute, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //     });

  //     setPendingItems(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // // useEffect to get pending items when the token changes
  // useEffect(() => {
  //   getPendingItems();
  // }, []); // Add token as a dependency

  // // Function to split array of items by quantity
  // function splitItemsByQuantity(pendingItems) {
  //   const result = [];

  //   pendingItems.forEach((item) => {
  //     for (let i = 0; i < item.quantity; i++) {
  //       const newItem = { ...item, quantity: 1 };
  //       // Generate unique ID for each new item using UUID
  //      newItem.id = uuidv4(); // Generate a new UUID
  //       result.push(newItem);
  //     }
  //   });

  //   return result;
  // }

  // // Split the original object into 5 instances
  // const splitInstances = splitItemsByQuantity(pendingItems);

  /**--------------------------------- End Pending List------------------------------------------ */

  /**--------------------------------- Get User List------------------------------------------ */
  const [userList, setUserList] = useState([]);
  const getUserList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(usermanagementRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUserList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  /**-------------------------------- Get Storage Location ------------------------------------- */
  const [storageLocation, setStorageLocation] = useState([]);
  const getStorageLocation = async () => {
    try {
      const response = await axios.get(getStorageLocationRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setStorageLocation(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStorageLocation();
  }, []);

  /**-------------------------------- Get List Item Name ------------------------------------- */
  const [itemName, setItemName] = useState([]);
  const getItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getItemNameRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setItemName(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  /**-------------------------------- Get Items for aprroval list  ------------------------------------- */
  const [forItemApproval, setForItemApproval] = useState([]);
  const getForItemApproval = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getForItemApprovalListRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setForItemApproval(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getForItemApproval();
  }, []);

  /**-------------------------------- Get registered Item  ------------------------------------- */
  const [availableItem, setAvailableItem] = useState([]);
  const getAvailableItem = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getAvailableItemRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setAvailableItem(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAvailableItem();
  }, []);

  /**-------------------------------- Get Disapprove Items ------------------------------------- */
  const [disapproveItems, setDisapproveItems] = useState([]);
  const getDisapproveItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(disapprovedRegisteredItemsRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });


      setDisapproveItems(response.data)      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDisapproveItems();
  }, []);



  
  /**-------------------------------- Get GSIAD Approver  ------------------------------------- */
  const [gsiadApprover, setGsiadApprover] = useState([]);
  const getGsiadApprover = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getGsiadApproverRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setGsiadApprover(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGsiadApprover();
  }, []);

  const gsiadApproverEmail = gsiadApprover.map((item) => item.wb_email);

  return (
    <AuthProvider>
      <BrowserRouter>
        <TokenExpiredModal />
        <Routes>
          {/* <Route path="/login" element={<Login screens={screens} />} /> */}
          <Route
            path="/"
            element={
              <Login
                screens={screens}
                getRegisteredItems={getRegisteredItems}
                // getPendingItems={getPendingItems}
                getStorageLocation={getStorageLocation}
                getItems={getItems}
                getUserList={getUserList}
                getForItemApproval={getForItemApproval}
                getAvailableItem={getAvailableItem}
              />
            }
          />{" "}
          <Route path="*" element={<ErrorPage />} />
          <Route path="/inventory" element={<ErrorPage />} />
          {/* Set /login as the default route */}
          <Route path="/inventory" element={<Sidebar />}>
            <Route
              path="assetmanagement"
              index
              element={
                <AssetManagement
                  registeredItems={registeredItems}
                  getRegisteredItems={getRegisteredItems}
                  // pendingItems={pendingItems}
                  // getPendingItems={getPendingItems}
                  itemName={itemName}
                  screens={screens}
                  getAvailableItem={getAvailableItem}
                  getForItemApproval={getForItemApproval}
                  disapproveItems={disapproveItems}
                  getDisapproveItems={getDisapproveItems}
                  storageLocation={storageLocation}
                  setStorageLocation={setStorageLocation}
                  getStorageLocation={getStorageLocation}
                  gsiadApproverEmail={gsiadApproverEmail}
                />
              }
            />
            <Route
              path="assignment"
              element={
                <Assignment
                  userList={userList}
                  getUserList={getUserList}
                  // registeredItems={registeredItems}
                  getRegisteredItems={getRegisteredItems}
                  availableItem={availableItem}
                  getAvailableItem={getAvailableItem}
                  screens={screens}
                  gsiadApproverEmail={gsiadApproverEmail}
                />
              }
            />
            <Route
              path="approval/register"
              element={
                <ApprovalRegister
                  forItemApproval={forItemApproval}
                  getForItemApproval={getForItemApproval}
                  getRegisteredItems={getRegisteredItems}
                  getAvailableItem={getAvailableItem}
                  getDisapproveItems={getDisapproveItems}
                  screens={screens}
                  gsiadApproverEmail={gsiadApproverEmail}
                />
              }
            />
            <Route
              path="approval/updateditems"
              element={
                <ApprovalUpdatedAsset
                  getRegisteredItems={getRegisteredItems}
                  getAvailableItem={getAvailableItem}
                  screens={screens}
                />
              }
            />
            <Route
              path="approval/clearance"
              element={
                <ApprovalClearance
                  gsiadApproverEmail={gsiadApproverEmail}
                  screens={screens}
                  getRegisteredItems={getRegisteredItems}
                  getAvailableItem={getAvailableItem}
                />
              }
            />
            <Route
              path="approval/assignment"
              element={
                <ApprovalAssignment
                  getRegisteredItems={getRegisteredItems}
                  screens={screens}
                  gsiadApproverEmail={gsiadApproverEmail}
                />
              }
            />
            <Route
              path="approval/disposal"
              element={
                <ApprovalDisposal
                  getRegisteredItems={getRegisteredItems}
                  screens={screens}
                />
              }
            />
            <Route
              path="accountability"
              element={
                <Accountability
                  // accountabilityList={accountabilityList}
                  // getAccountabilityList={getAccountabilityList}
                  gsiadApproverEmail={gsiadApproverEmail}
                  screens={screens}
                />
              }
            />
            <Route
              path="clearance"
              element={
                <Clearance
                  gsiadApproverEmail={gsiadApproverEmail}
                  screens={screens}
                />
              }
            />
            <Route
              path="reports"
              element={
                <Reports registeredItems={registeredItems} screens={screens} />
              }
            />
            <Route
              path="disposal"
              element={
                <Disposal
                  gsiadApproverEmail={gsiadApproverEmail}
                  getRegisteredItems={getRegisteredItems}
                  screens={screens}
                />
              }
            />
            <Route
              path="settings"
              element={
                <Settings
                  userList={userList}
                  getUserList={getUserList}
                  screens={screens}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
    <ToastContainer
      position='top-right'
      autoClose={3000}
      closeOnClick={false}
      hideProgressBar={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme='colored'
    
    />
    <App/>
  </React.StrictMode>
);

// export default App
