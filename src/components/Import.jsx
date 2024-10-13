import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import React, {createElement, useState} from 'react'
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import { Backdrop, Button, Toolbar } from '@mui/material';
import Loaders from '../utils/Loaders';
import axios from 'axios';

import {registerItemRoute } from '../utils/inventoryApiEnpoints';
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as XLSX from "xlsx";
import dropdowndata from '../utils/dropdowndata';


  //Register Template for Qr Inventory
  const columns = [
    {
      field: "fixed_asset",
      headerName: "Fixed Asset",
     
    },
    {
      field: "item_name",
      headerName: "Item Name",
    
    },
    {
      field: "price",
      headerName: "Price",
    
    },
    {
      field: "quantity",
      headerName: "Quantity",
    
    },
    {
      field: "warranty",
      headerName: "Warranty",
    
    },
    {
      field: "date_received",
      headerName: "Date Received",
    
    },
    {
      field: "date_expire",
      headerName:"Date Expire",
    
    },
    {
      field: "model_number",
      headerName: "Model Number",
    
    },
    {
      field: "serial_number",
      headerName: "Serial Number",
    
    },
    {
      field: "unit",
      headerName: "Unit",
    
    },
    {
      field: "storage_location",
      headerName: "Storage Location",
    
    },
    {
      field: "description",
      headerName: "Description",
    
    },
    {
      field: "remarks",
      headerName: "Remarks",
    
    },
  ];

  const rows = [
    {
      fixed_asset: "ELECTRONIC COMPUTERS",
      item_name: "Mouse 123",
      price: "100",
      quantity: "1",
      warranty: "13 month/s",
      date_received: "05/06/2023",
      date_expire: "05/07/2025",
      model_number: "MN-3403434",
      serial_number: "SN-3943849",
      unit: "PC/S",
      storage_location: "HEAD OFFICE",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      remarks: "Lorem ipsum dolor sit amet, consectetur",
    },
    {
      fixed_asset: "LEASEHOLD IMPROVEMENTS",
      item_name: "AXIAL FANS",
      price: "500.25",
      quantity: "5",
      warranty: "1 month/s",
      date_received: "06/24/2023",
      date_expire: "07/23/2025",
      model_number: "",
      serial_number: "",
      unit: "PC/S",
      storage_location: "TAGUIG",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      remarks: "Lorem ipsum dolor sit amet, consectetur",
    },
    {
      fixed_asset: "OFFICE MACHINE",
      item_name: "BallPen",
      price: "100",
      quantity: "1",
      warranty: "3 month/s",
      date_received: "01/02/2021",
      date_expire: "02/04/2023",
      model_number: "MN-0012302311",
      serial_number: "SN-002381111",
      unit: "BOX",
      storage_location: "AYALA",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      remarks: "Lorem ipsum dolor sit amet, consectetur",
    },

    {
      fixed_asset: "PASSENGER CAR",
      item_name: "ACRYLIC STANDEE",
      price: "1500.00",
      quantity: "1",
      warranty: "15 month/s",
      date_received: "02/02/2002",
      date_expire: "03/02/2023",
      model_number: "MN-00123234234",
      serial_number: "SN-002322342348",
      unit: "SET",
      storage_location: "HEAD OFFICE",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      remarks: "Lorem ipsum dolor sit amet, consectetur",
    },
  ];


const Import = ({
  getRegisteredItems,
  registeredItems,
  storageLocation,
  itemName,
  user,
  getForItemApproval,
}) => {
  const [excelData, setExcelData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileInputValue, setFileInputValue] = useState("");

  // Step 4: Handle file upload and parsing
  const handleFileUpload = (event) => {
    setFileInputValue(event.target.value);
    console.log(event.target.files);
    const file = event.target.files[0];

    if (
      file.type !=
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast.error("Invalid file only accept excel file");
      setFileInputValue(""); // Update key to reset input
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array", cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      //  const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const formatExcelDate = (date) => {
        if (date instanceof Date) {
          return `${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()}`;
        }
        return date;
      };

      const cleanString = (str) => {
        if (typeof str === "string") {
          return str.replace(/\s+/g, " ").trim(); // Replace multiple spaces with a single space and trim
        }
        return str;
      };

      // Generate unique IDs for each row
      const formattedData = parsedData.map((row) => ({
        fixed_asset: cleanString(row[0]),
        item_name: cleanString(row[1]),
        price: cleanString(row[2]),
        quantity: cleanString(row[3]),
        warranty: cleanString(row[4]),
        date_received: formatExcelDate(row[5]),
        date_expire: formatExcelDate(row[6]),
        model_number: cleanString(row[7]),
        serial_number: cleanString(row[8]),
        unit: cleanString(row[9]),
        storage_location: cleanString(row[10]),
        description: cleanString(row[11]),
        remarks: cleanString(row[12]),

        id: uuidv4(), // You can adjust this based on your preference
      }));

      const uploadedColumn = parsedData[0];
      const defaultColumn = columns.map((item) => item.headerName);

      const missingColumn = defaultColumn.filter(
        (element) => !uploadedColumn.includes(element)
      );

      if (missingColumn != 0) {
        toast.error(`Missing column ${missingColumn}`);
        setFileInputValue("");
        return;
      }

      /**end find missing column */

      //date validation
      function isValidDate(dateString) {
        // Check if the date string matches the format MM/DD/YYYY
        const regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (!regex.test(dateString)) {
          return false;
        }

        // Parse the date parts
        const [month, day, year] = dateString.split("/").map(Number);
        const date = new Date(year, month - 1, day);

        // Check if the date object is valid and the components match
        return (
          date instanceof Date &&
          !isNaN(date) &&
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      }

      //fixed asset date
      const dropdownFixedAsset = dropdowndata
        .getFixedAsset()
        .map((item) => item.value);
      const uploadedFixedAsset = formattedData
        .slice(1)
        .map((item) => item.fixed_asset);

      //unit data
      const dropdownUnit = dropdowndata.getUnit().map((item) => item.value);
      const uploadedUnit = formattedData.slice(1).map((item) => item.unit);

      //storage location data
      const branchLocation = storageLocation.map((item) => item.branch_desc);
      const uploadedBranchLocation = formattedData
        .slice(1)
        .map((item) => item.storage_location);
            

      // item name data
      const validItemName = itemName.map((item) => item.item_name);
      const uploadedItemName = formattedData
        .slice(1)
        .map((item) => item.item_name);

      /**--------------- Error Validation in importing Excel File ------------------- */
      const errorFixedAsset = uploadedFixedAsset.filter(
        (element) => !dropdownFixedAsset.includes(element)
      );
      if (errorFixedAsset != 0) {
        toast.error(`${errorFixedAsset} are not valid asset. Please check.`);
        setFileInputValue("");
        return;
      }

      if (formattedData.find((item) => item.fixed_asset == undefined)) {
        toast.error(
          "Some of rows has empty Fixed Asset. Please check your file!"
        );
        setFileInputValue("");
        return;
      }

      /*------------- checking item name ---------------------*/
      const errorItemName = uploadedItemName.filter(
        (element) => !validItemName.includes(element)
      );
      if (errorItemName != 0) {
        toast.error(`${errorItemName} are not valid item name. Please check.`);
        setFileInputValue("");
        return;
      }
      if (formattedData.find((item) => item.item_name == undefined)) {
        toast.error("Some of rows has empty Item name. Please check your file!");
        setFileInputValue("");
        return;
      }

      /*-------------------------quantity validation-----------------------*/

      //check if quantity is undefined
      if (formattedData.find((item) => item.quantity == undefined)) {
        toast.error("Some of rows has empty qantity. Please check your file!");
        setFileInputValue("");
        return;
      }

      //validate quantity
      function isValidQuantity(quantityString) {
        // Check if the quantity string is a valid whole number
        const regex = /^\d+$/;
        return regex.test(quantityString);
      }

      const uploadedQuantity = formattedData
        .slice(1)
        .map((item) => item.quantity);
      const invalidQuantities = uploadedQuantity.filter(
        (quantityString) => !isValidQuantity(quantityString)
      );

      if (invalidQuantities != 0) {
        toast.error(`${invalidQuantities} not a valid quantity. Please check.`);
        setFileInputValue("");
        return;
      }

      /*------------------------price validation---------------------------*/

      //check if price is undefined
      if (formattedData.find((item) => item.price == undefined)) {
        toast.error("Some of rows has empty price. Please check your file!");
        setFileInputValue("");
        return;
      }

      //validate prie
      function isValidPrice(priceString) {
        // Check if the price string is a valid number
        const regex = /^\d+(\.\d{1,2})?$/;
        return regex.test(priceString);
      }

      const uploadedPrice = formattedData.slice(1).map((item) => item.price);
      const invalidPrices = uploadedPrice.filter(
        (priceString) => !isValidPrice(priceString)
      );

      if (invalidPrices != 0) {
        toast.error(`${invalidPrices} not a valid price. Please check.`);
        setFileInputValue("");
        return;
      }
      /*------------------------end price validation---------------------------*/

      /*------------------------warranty validation---------------------------*/

      //check if warranty is undefined
      if (formattedData.find((item) => item.warranty == undefined)) {
        toast.error("Some of rows has empty Warranty. Please check your file!");
        setFileInputValue("");
        return;
      }

      //validate warranty
      function isValidWarranty(warrantyString) {
        // Check if the warranty string matches the format number followed by "month/s",
        const regex = /^\d+(\\d+)?\s*(month\/s|months)$/;
        return regex.test(warrantyString);
      }

      const uploadedWarranty = formattedData
        .slice(1)
        .map((item) => item.warranty);
      // const validWarranties = array.filter(isValidWarranty);
      const invalidWarranties = uploadedWarranty.filter(
        (warrantyString) => !isValidWarranty(warrantyString)
      );

      if (invalidWarranties != 0) {
        toast.error(
          `${invalidWarranties} not a warranty. Please input warranty like 5 month/s.`
        );
        setFileInputValue("");
        return;
      }

      /*------------------------warranty validation---------------------------*/

      /* ----------------checking uploaded invalid date received--------------------*/
      const uploadedDateReceived = formattedData.map(
        (item) => item.date_received
      );
      const invalidDates = uploadedDateReceived
        .slice(1)
        .filter((dateString) => !isValidDate(dateString));

      if (invalidDates != 0) {
        toast.error(
          `${invalidDates} invalid date received format. Please check.`
        );
        setFileInputValue("");
        return;
      }

      if (formattedData.find((item) => item.date_received == undefined)) {
        toast.error(
          "Some of rows has empty Date received. Please check your file!"
        );
        setFileInputValue("");
        return;
      }

      /* ---------------- end checking uploaded invalid date received --------------------*/

      /* ---------------- end checking uploaded invalid date expire--------------------*/
      const uploadedDateExpire = formattedData.map((item) => item.date_expire);
      const invalidDateExpire = uploadedDateExpire
        .slice(1)
        .filter((dateString) => !isValidDate(dateString));

      if (invalidDateExpire != 0) {
        toast.error(
          `${invalidDateExpire} invalid date expire format. Please check.`
        );
        setFileInputValue("");
        return;
      }
      if (formattedData.find((item) => item.date_expire == undefined)) {
        toast.error(
          "Some of rows has empty Date expire. Please check your file!"
        );
        setFileInputValue("");
        return;
      }

      /* ---------------- end checking uploaded invalid date expire--------------------*/

      /*------------checking unit column--------------------*/
      // check if uploaded unit exist in unit dropdown data

      const errorUnit = uploadedUnit.filter(
        (element) => !dropdownUnit.includes(element)
      );
      if (errorUnit != 0) {
        toast.error(`${errorUnit} are not valid unit. Please check.`);
        setFileInputValue("");
        return;
      }

      if (formattedData.find((item) => item.unit == undefined)) {
        toast.error("Some of rows has empty Unit. Please check your file!");
        setFileInputValue("");
        return;
      }

      /*------------checking storage location--------------------*/
      //check if uploaded storage location are valid and exist in database
      const errorBranchLocation = uploadedBranchLocation.filter(
        (element) => !branchLocation.includes(element)
      );
      if (errorBranchLocation != 0) {
        toast.error(
          `${errorBranchLocation} are not valid storage location. Please check.`
        );
        setFileInputValue("");
        return;
      }
      if (formattedData.find((item) => item.storage_location == undefined)) {
        toast.error(
          "Some of rows has empty Storage Location. Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }

      if (formattedData.find((item) => item.description == undefined)) {
        toast.error(
          "Some of rows has empty Description. Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }

      if (formattedData.find((item) => item.remarks == undefined)) {
        toast.error("Some of rows has empty Remarks. Please check your file!");
        setFileInputValue(""); // Update key to reset input
        return;
      }

      if (
        formattedData.find(
          (item) =>
            item.fixed_asset.toUpperCase() == "ELECTRONIC COMPUTERS" &&
            item.quantity != 1
        )
      ) {
        toast.error(
          "Fixed Asset ELECTRONIC COMPUTERS quantity must only be 1. Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }

      if (
        formattedData.find(
          (item) =>
            item.fixed_asset.toUpperCase() == "ELECTRONIC COMPUTERS" &&
            item.model_number == undefined
        )
      ) {
        toast.error(
          "Fixed Asset ELECTRONIC COMPUTERS requires model number. Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }

      if (
        formattedData.find(
          (item) =>
            item.fixed_asset.toUpperCase() == "ELECTRONIC COMPUTERS" &&
            item.serial_number == undefined
        )
      ) {
        toast.error(
          "Fixed Asset ELECTRONIC COMPUTERS requires serial number. Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }

      if (
        formattedData.find(
          (item) =>
            item.fixed_asset.toUpperCase() == "OFFICE MACHINE" &&
            item.quantity != 1
        )
      ) {
        toast.error("Fixed Asset OFFICE MACHINE quantity must only be 1");
        setFileInputValue(""); // Update key to reset input
        return;
      }
      if (
        formattedData.find(
          (item) =>
            item.fixed_asset.toUpperCase() == "OFFICE MACHINE" &&
            item.model_number == undefined
        )
      ) {
        toast.error(
          "Fixed Asset OFFICE MACHINE requires model number. Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }
      if (
        formattedData.find(
          (item) =>
            item.fixed_asset.toUpperCase() == "OFFICE MACHINE" &&
            item.serial_number == undefined
        )
      ) {
        toast.error(
          "Fixed Asset OFFICE MACHINE requires serial number.  Please check your file!"
        );
        setFileInputValue(""); // Update key to reset input
        return;
      }

      /**---------------End Error Validation in importing Excel File ------------------- */

      setExcelData(formattedData);
    };
    reader.readAsArrayBuffer(file);
  };


  const selectedRows = excelData
    .slice(1)
    .filter((row) => selectedRowIds.includes(row.id));

    const reformatDate = (date) => {
      const [month, day, year] = date.split("/");
      return `${year}-${month}-${day}`;
    };


  // const uuid = require("uuid");
  // Function to split array of items by quantity
  function splitItemsByQuantity(selectedRows) {
    const result = [];

    selectedRows.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        //refer register asset for the parameters
        const newItem = {
           ...item,
          fixed_asset: item.fixed_asset.toUpperCase(),
          quantity: 1,
          ref_id: "0",
          item_id: "0",
          ro_id: "0",
          po_id: "0",
          item_code: "0",
          pending_po_id: "",
          pending_item_id: "",
          generated_pending_id: "0",
          date_received: reformatDate(item.date_received),
          date_expire: reformatDate(item.date_expire),
          assign_user: "",
          hash_qr: "",
          total: "",
          status: "REGISTRATION FOR APPROVAL",
          creator_id: user && user[0].emp_id,
          creator_role: user && user[0].user_role,
          creator_email: user && user[0].wb_email,
        };
        // Generate unique ID for each new item using UUID
        newItem.id = uuidv4(); // Generate a new UUID
        result.push(newItem);
      }
    });

    return result;
  }

  // Split the original object into 5 instances
  const splitInstances = splitItemsByQuantity(selectedRows);


  const handleSubmit = async () => {
    
    event.preventDefault();

    
    if(excelData.length == 0) {
      toast.error("No Data Found!")
      return;
    }
    if (splitInstances.length == 0) {
      toast.error("No Item Selected!");
      return;
    }

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post(registerItemRoute,  splitInstances, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      console.log(response.data);
      console.log(response.data[0].retVal);
      if (response.data[0].retVal == "1") {
        setTimeout(() => {
          // Simulate a delay of 2 seconds

          setIsLoading(false); // Stop loading
          setFileInputValue("");
          setExcelData([]);
          toast.success("Successfully Registered!"); // Display success message
          //load regestered items
          getRegisteredItems();
          getForItemApproval();
        }, 2000);
      } else {
        setTimeout(() => {
          toast.error("Error Ouccured!");
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        // Simulate a delay of 2 seconds
        setIsLoading(false); // Stop loading
        toast.error(error.message); // Display success message
      }, 3000);
    }
  };

  /**download template  / Export to excel*/

  const handleExport = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create a worksheet from the rows data
    const worksheetData = [
      columns.map((col) => col.headerName),
      ...rows.map((row) => [
        row.fixed_asset,
        row.item_name,
        row.price,
        row.quantity,
        row.warranty,
        row.date_received,
        row.date_expire,
        row.model_number,
        row.serial_number,
        row.unit,
        row.storage_location,
        row.description,
        row.remarks,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set the column widths
    worksheet["!cols"] = [
      { width: 30 }, // Fixed Asset
      { width: 30 }, // Item Name
      { width: 20 }, // Quantity
      { width: 10 }, // Price
      { width: 20 }, // Warranty
      { width: 25 }, // Date Received
      { width: 20 }, // Date Expire
      { width: 20 }, // Model Number
      { width: 25 }, // Serial Number
      { width: 25 }, // Unit
      { width: 20 }, // Storage Location
      { width: 40 }, // Description
      { width: 40 }, // Remarks
    ];
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "InventoryTemplate.xlsx");
  };

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          variant="contained"
          color="success"
          onClick={handleExport}
          sx={{
            fontSize: "12px",
            margin: "8px",
            "&:hover": {
              backgroundColor: "#38a624",
              color: "white",
            },
          }}
        >
          <FontAwesomeIcon icon={faDownload} />
          <span className="ml-2"></span> Download Template
        </Button>
        {/* <GridToolbarExport /> */}
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
        {/* <CircularProgress color="inher" />  */}
        <Loaders />
      </Backdrop>
      <form className="w-full">
        <label htmlFor="file-input" className="sr-only">
          Choose file
        </label>
        <input
          type="file"
          name="file-input"
          id="file-input"
          value={fileInputValue}
          onChange={handleFileUpload}
          className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
                    file:bg-gray-400 file:border-0
                    file:me-4
                    file:py-3 file:px-4"
        />

        <div className="mt-8" style={{ height: 450, width: "100%" }}>
          <DataGrid
            rows={excelData.slice(1)}
            columns={[
              { field: "fixed_asset", headerName: "Fixed Asset", width: 200 },
              { field: "item_name", headerName: "Item Name", width: 200 },
              { field: "price", headerName: "Price", width: 100 },
              { field: "quantity", headerName: "Quantity", width: 80 },
              { field: "warranty", headerName: "Warranty", width: 100 },
              {
                field: "date_received",
                headerName: "Date Received",
                width: 120,
              },
              { field: "date_expire", headerName: "Date Expire", width: 100 },
              {
                field: "model_number",
                headerName: "Model Number",
                width: 150,
              },
              {
                field: "serial_number",
                headerName: "Serial Number",
                width: 150,
              },
              { field: "unit", headerName: "Unit", width: 80 },
              {
                field: "storage_location",
                headerName: "Storage Location",
                width: 150,
              },
              { field: "description", headerName: "Description", width: 150 },
              { field: "remarks", headerName: "Remarks", width: 150 },
            ]}
            getRowId={(row) => row.id} // Specify a custom ID for each row
            checkboxSelection
            onRowSelectionModelChange={(newSelection) =>
              setSelectedRowIds(newSelection)
            }
            slots={{
              toolbar: CustomToolbar,
            }}
            rowSelectionModel={selectedRowIds}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 15,
                },
              },
            }}
            pageSizeOptions={[15]}
            sx={{
              "& .MuiDataGrid-cell": {
                fontSize: "10px", // Font size for cells in rows
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontSize: "12px", // Font size for column headers
                fontWeight: "bold",
              },
            }}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="py-2 px-6 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
          >
            Register Asset
          </button>
        </div>
      </form>
    </div>
  );
};

export default Import
