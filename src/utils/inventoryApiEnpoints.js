// // apiendpoints.js

// export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
// export const NODE_MAILER_ROUTE = import.meta.env.VITE_APP_NODE_MAILER_ROUTE;
// export const FILE_PATH_ROUTE = import.meta.env.VITE_APP_FILE_PATH_ROUTE;

// export const inventorylogin = `${API_BASE_URL}login`;
// export const registerItemRoute = `${API_BASE_URL}register`;
// export const getForItemApprovalListRoute = `${API_BASE_URL}availableItems/forApprovalList`;
// export const getAvailableItemRoute = `${API_BASE_URL}availableItems`;
// export const registeredItemsApprovalRoute = `${API_BASE_URL}availableItems/insertItemApproval`;
// export const registeredItemsUpdatedList = `${API_BASE_URL}availableItems/getUpdatedItemList`;
// export const registeredItemsUpdatedApproval = `${API_BASE_URL}availableItems/insertUpdatedItemApproval`;
// export const updateItemsRoute = `${API_BASE_URL}updatedItems/insertUpdatedItems`;
// export const getQr = `${API_BASE_URL}qr/getQr`;
// export const usermanagementRoute = `${API_BASE_URL}usermanagement`;
// export const insertAccessRoute = `${API_BASE_URL}usermanagement/insertAccess`;
// export const viewAllAccess = `${API_BASE_URL}usermanagement/allAccess`;
// export const viewAccess = `${API_BASE_URL}usermanagement/viewAccess`;
// export const removeAccessRoute = `${API_BASE_URL}usermanagement/removeAccess`;
// export const pendingItemsRoute = `${API_BASE_URL}pendingItems`;
// export const getAssign = `${API_BASE_URL}userassignment/getAssign`;
// export const userassignment = `${API_BASE_URL}userassignment/assign`;
// export const getApprovalRoute = `${API_BASE_URL}userassignment/getApproval`;
// export const insertAssignmentApprovalRoute = `${API_BASE_URL}userassignment/insertApproval`;
// export const getItemNameRoute = `${API_BASE_URL}itemName`;
// export const getClearanceListRoute = `${API_BASE_URL}clearance/getClearanceList`;
// export const createClearanceRoute = `${API_BASE_URL}clearance/createClearance`;
// export const getClearanceApprovalRoute = `${API_BASE_URL}clearance/getClearanceApproval`;
// export const insertClearanceApprovalRoute = `${API_BASE_URL}clearance/insertClearanceApproval`;
// export const clearanceAttachmentRoute = `${API_BASE_URL}clearance/attachment`;
// export const getStorageLocationRoute = `${API_BASE_URL}pendingItems/branch`;
// export const getAccountableUserRoute = `${API_BASE_URL}accountable/getAccountableList`;
// export const insertAccountableUserRoute = `${API_BASE_URL}accountable/insertAccountableUser`;
// export const insertDisposalRoute = `${API_BASE_URL}disposal/createDisposal`;
// export const getDisposalListRoute = `${API_BASE_URL}disposal/getDisposalList`;
// export const getDisposalApprovalRoute = `${API_BASE_URL}disposal/getDisposalApproval`;
// export const insertDisposalApprovalRoute = `${API_BASE_URL}disposal/insertDisposalApproval`;
// export const disposalAttachmentRoute = `${API_BASE_URL}disposal/attachment`;
// export const getGsiadApproverRoute = `${API_BASE_URL}usermanagement/getGsiadApprover`;


/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

//local user 
//export const API_BASE_URL = "http://10.86.1.46:3002/";

export const API_BASE_URL = "http://192.168.100.68:3002/";
export const NODE_MAILER_ROUTE = "http://10.86.0.84:7030/mailer"; 
export const FILE_PATH_ROUTE = "http://192.168.100.68/"; 

//export const FILE_PATH_ROUTE = "http://10.86.1.46/"; 


export const inventorylogin = API_BASE_URL + "login";
export const registerItemRoute = API_BASE_URL + "register";
export const disapprovedRegisteredItemsRoute = API_BASE_URL + "register/disapprovedItems"
export const deleteItemsRoute = API_BASE_URL + "register/deleteItems"
export const getForItemApprovalListRoute = API_BASE_URL + "availableItems/forApprovalList";
export const getAvailableItemRoute = API_BASE_URL + "availableItems";
export const registeredItemsApprovalRoute = API_BASE_URL + "availableItems/insertItemApproval";
export const registeredItemsUpdatedList = API_BASE_URL + "availableItems/getUpdatedItemList";
export const registeredItemsUpdatedApproval = API_BASE_URL + "availableItems/insertUpdatedItemApproval";
export const updateItemsRoute = API_BASE_URL + "updatedItems/insertUpdatedItems";
export const getQr = API_BASE_URL + "qr/getQr";
export const usermanagementRoute = API_BASE_URL + "usermanagement";
export const insertAccessRoute = API_BASE_URL + "usermanagement/insertAccess";
export const viewAllAccess = API_BASE_URL + "usermanagement/allAccess";
export const viewAccess = API_BASE_URL + "usermanagement/viewAccess";
export const removeAccessRoute = API_BASE_URL + "usermanagement/removeAccess";
export const pendingItemsRoute = API_BASE_URL + "pendingItems";
export const getAssign = API_BASE_URL + "userassignment/getAssign";
export const userassignment = API_BASE_URL + "userassignment/assign";
export const getApprovalRoute = API_BASE_URL + "userassignment/getApproval";
export const insertAssignmentApprovalRoute = API_BASE_URL + "userassignment/insertApproval";
export const getItemNameRoute = API_BASE_URL + "itemName";
export const getClearanceListRoute = API_BASE_URL + "clearance/getClearanceList";
export const getClearanceListMasterRoute = API_BASE_URL + "clearance/getClearanceListMaster";
export const createClearanceRoute = API_BASE_URL + "clearance/createClearance";
export const getClearanceApprovalRoute = API_BASE_URL + "clearance/getClearanceApproval";
export const insertClearanceApprovalRoute = API_BASE_URL + "clearance/insertClearanceApproval";
export const clearanceAttachmentRoute = API_BASE_URL + "clearance/attachment";
export const getStorageLocationRoute = API_BASE_URL + "pendingItems/branch";
export const getAccountableUserRoute = API_BASE_URL + "accountable/getAccountableList";
export const insertAccountableUserRoute = API_BASE_URL + "accountable/insertAccountableUser";
export const insertDisposalRoute = API_BASE_URL + "disposal/createDisposal";
export const getDisposalListRoute = API_BASE_URL + "disposal/getDisposalList";
export const getDisposalApprovalRoute = API_BASE_URL + "disposal/getDisposalApproval";
export const insertDisposalApprovalRoute = API_BASE_URL + "disposal/insertDisposalApproval";
export const disposalAttachmentRoute = API_BASE_URL + "disposal/attachment";
export const getGsiadApproverRoute = API_BASE_URL + "usermanagement/getGsiadApprover";