/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

const fixedAssets = [
  { id: 1, value: "ELECTRONIC COMPUTERS" },
  { id: 2, value: "LEASEHOLD IMPROVEMENTS" },
  { id: 3, value: "OFFICE MACHINE" },
  { id: 4, value: "GENERAL FIXTURES" },
  { id: 5, value: "PASSENGER CAR" },
];

const userRole = [
  { id: 1, value: "Maker", screens: [1, 2, 8, 9, 10, 11] },
  { id: 2, value: "User", screens: [8,9] },
  { id: 3, value: "Approver(GSIAD, Department)", screens: [3, 4, 5, 6, 7, 8, 9,10] },
  { id: 4, value: "Approver(HEAD, Department)", screens: [5, 6, 8, 9] }, 
  { id: 5, value: "Admin", screens: [8, 9, 12] },
  { id: 6, value: "Approver(Executive)", screens: [5, 6, 8, 9] },
];


const unit = [
  { id: 1, value: "PC/S" },
  { id: 2, value: "REAM" },
  { id: 3, value: "PAD" },
  { id: 4, value: "BOX" },
  { id: 5, value: "BTL" },
  { id: 6, value: "GAL" },
  { id: 7, value: "PACK" },
  { id: 8, value: "ROLL" },
  { id: 9, value: "SET" },
  { id: 10, value: "U/M" },
];

class dropdowndata {
  getFixedAsset() {
    return fixedAssets;
  }

  getUserRole() {
    return userRole;
  }

  getUnit() {
    return unit;
  }
}

export default new dropdowndata();
