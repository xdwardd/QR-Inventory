/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import Sidebar from "./Sidebar";

import { useAuth } from "./AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
// import Chart from "./Chart";
import { Avatar, Divider} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faComputer, faDownload, faEnvelopesBulk, faToolbox, faTools } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import dropdowndata from "../utils/dropdowndata";
import ApexCharts from "apexcharts";
import bg from "../assets/testjose.png"
import { deepOrange } from "@mui/material/colors";
import { toast } from "react-toastify";
//import ReactApexChart from "react-apexcharts";
 
const columns = [
  {
    field: "ref_id",
    headerName: "Reference ID",
    width: 150,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
  {
    field: "item_id",
    headerName: "Item ID",
    width: 150,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
  {
    field: "fixed_asset",
    headerName: "Fixed Asset",
    width: 250,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
  {
    field: "item_name",
    headerName: "Item Name",
    width: 250,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 80,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
  {
    field: "price",
    headerName: "Price",
    width: 150,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },

  {
    field: "storage_location",
    headerName: "Storage Location",
    width: 150,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
  {
    field: "status",
    headerName: "Status",
    width: 350,
    editable: false,
    sortable: false,
    resizable: false,
    headerAlign: "center",
  },
];


const Reports = ({registeredItems, screens }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [currentView, setCurrentView] = useState("reports"); // Default view is pending

  const [isOpenEC, setIsOpenEC] = useState(false);
  const [isOpenLI, setIsOpenLI] = useState(false);
  const [isOpenOM, setIsOpenOM] = useState(false);
  const [isOpenGF, setIsOpenGF] = useState(false);
  const [isOpenPC, setIsOpenPC] = useState(false);
  const [isOpenAllRegistered, setIsOpenAllRegistered] = useState(false);
  const [isOPenDisposedItem, setIsOpenDisposedItem] = useState(false);

  const toggleReports = () => {
    setCurrentView("reports");
    setIsOpenEC(false);
    setIsOpenLI(false);
    setIsOpenOM(false);
    setIsOpenGF(false);
    setIsOpenPC(false);
  };
  const toggleEC = () => {
    setCurrentView("electronic_computers");
    setIsOpenEC(true);
    setIsOpenLI(false);
    setIsOpenOM(false);
    setIsOpenGF(false);
    setIsOpenPC(false);
    setIsOpenAllRegistered(false);
    setIsOpenDisposedItem(false);
  
  };
  const toggleLI = () => {
    setCurrentView("leasehold_improvements");
    setIsOpenEC(false);
    setIsOpenLI(true);
    setIsOpenOM(false);
    setIsOpenGF(false);
    setIsOpenPC(false);
    setIsOpenAllRegistered(false);
    setIsOpenDisposedItem(false);

   
    
  };
  const toggleOM = () => {
    setCurrentView("office_machine");
    setIsOpenEC(false);
    setIsOpenLI(false);
    setIsOpenOM(true);
    setIsOpenGF(false);
    setIsOpenPC(false);
    setIsOpenAllRegistered(false);
    setIsOpenDisposedItem(false);
  };

  const toggleGF = () => {
    setCurrentView("general_fixtures");
    setIsOpenEC(false);
    setIsOpenLI(false);
    setIsOpenOM(false);
    setIsOpenGF(true);
    setIsOpenPC(false);
    setIsOpenAllRegistered(false);
    setIsOpenDisposedItem(false);
  };
  const togglePC = () => {
    setCurrentView("passenger_car");
    setIsOpenEC(false);
    setIsOpenLI(false);
    setIsOpenOM(false);
    setIsOpenGF(false);
    setIsOpenPC(true);
    setIsOpenAllRegistered(false);
    setIsOpenDisposedItem(false);
  };
  const toggleAllRegistered = () => {
    setCurrentView("all_registered");
    setIsOpenEC(false);
    setIsOpenLI(false);
    setIsOpenOM(false);
    setIsOpenGF(false);
    setIsOpenPC(false);
    setIsOpenAllRegistered(true);
    setIsOpenDisposedItem(false);
  };
  const toggleDisposed = () => {
    setCurrentView("disposed");
    setIsOpenEC(false);
    setIsOpenLI(false);
    setIsOpenOM(false);
    setIsOpenGF(false);
    setIsOpenPC(false);
    setIsOpenAllRegistered(false);
    setIsOpenDisposedItem(true);
  };

  const navigate = useNavigate();

  //user screen access
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
    if (isAuthenticated && userScreens && !userScreens.includes("10")) {
      const defaultPath = userDefaultScreen && `/${userDefaultScreen.path}`;
      navigate(defaultPath);
    }
  }, [isAuthenticated, userScreens, userDefaultScreen, navigate]);

  /*------------------------------------------------------------------*/

  const getRowId = (row) => {
    return row.ref_id;
  };

  /**download template  / Export to excel*/

  const exportToExcel = () => {
    const exportColumn = [
      {
        field: "ref_id",
        headerName: "Reference ID",
      },
      {
        field: "item_id",
        headerName: "Item ID",
      },
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
        headerName: "Date Expire",
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
    ];

    const updatedRows = registeredItems.map(
      ({
        assigned_user_email,
        assigned_user,
        description,
        item_code,
        pending_item_id,
        pending_po_id,
        po_id,
        remarks,
        // status,
        total,
        ro_id,
        ...rest
      }) => rest
    );


    const electronicComputerRow = updatedRows.filter(
      (item) => item.fixed_asset == dropdowndata.getFixedAsset()[0].value
    );
    const leaseholdImprovementRow = updatedRows.filter(
      (item) => item.fixed_asset == dropdowndata.getFixedAsset()[1].value
    );
    const officeMachineRow = updatedRows.filter(
      (item) => item.fixed_asset == dropdowndata.getFixedAsset()[2].value
    );
    const generalFixturesRow = updatedRows.filter(
      (item) => item.fixed_asset == dropdowndata.getFixedAsset()[3].value
    );
    const passengerCarRow = updatedRows.filter(
      (item) => item.fixed_asset == dropdowndata.getFixedAsset()[4].value
    );

    const disposalListRow = updatedRows.filter(
      (item) => item.status === "DISPOSAL: ITEM DISPOSED"
    );

   

    let filteredRows;
    switch (currentView) {
      case "electronic_computers":
        filteredRows = electronicComputerRow;
        break;
      case "leasehold_improvements":
        filteredRows = leaseholdImprovementRow;
        break;
      case "office_machine":
        filteredRows = officeMachineRow;
        break;
      case "general_fixtures":
        filteredRows = generalFixturesRow;
        break;
      case "passenger_car":
        filteredRows = passengerCarRow;
        break;
      case "disposed":
        filteredRows = disposalListRow;
        break;
      default:
        filteredRows = updatedRows; // Default to all rows if view is not recognized
    }

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    //    Create a worksheet from the rows data
    const worksheetData = [
      exportColumn.map((col) => col.headerName),

      //Perform SwitchCase here
      ...filteredRows.map((row) => [
        row.ref_id,
        row.item_id,
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
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set the column widths
    worksheet["!cols"] = [
      { width: 20 }, // Ref ID
      { width: 20 }, // Item ID
      { width: 30 }, // Fixed Asset
      { width: 30 }, // Item Name
      { width: 10 }, // Price
      { width: 20 }, // Warranty
      { width: 25 }, // Date Received
      { width: 20 }, // Date Expire
      { width: 20 }, // Model Number
      { width: 25 }, // Serial Number
      { width: 25 }, // Unit
      { width: 40 }, // Storage Location
    ];


    if (worksheetData.length == 1) {
      toast.error("There is no data to export.")
      return;
    }
    
    
    // // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    (() => {
      switch (currentView) {
        case "electronic_computers":
          XLSX.writeFile(workbook, "Electronic_Computers.xlsx");
          break;
        case "leasehold_improvements":
          XLSX.writeFile(workbook, "Leasehold_Improvements.xlsx");
          break;
        case "office_machine":
          XLSX.writeFile(workbook, "Office_Machine.xlsx");
          break;
        case "general_fixtures":
          XLSX.writeFile(workbook, "General_Fixtures.xlsx");
          break;
        case "passenger_car":
          XLSX.writeFile(workbook, "Passenger_Car.xlsx");
          break;
        case "all_registered":
          XLSX.writeFile(workbook, "All_Items.xlsx");
          break;
        case "disposed":
          XLSX.writeFile(workbook, "Disposed_Items.xlsx");
          break;
        default:
          // Handle the default case if necessary
          return null;
      }
    })();
    //Generate and download the Excel file
  };

  //Disposed Item Chart
  const [chartKey, setChartKey] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Add or remove 'dark' class to the <html> tag when toggling dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);


  const getChartOptions = () => {
    return {
      series: [52, 26, 20, 23, 5],
      colors: ["#9061f9", "#76a9fa", "#0e9f6e", "#e74694", "#06b6d4"],
      chart: {
        height: 420,
        width: "100%",
        type: "pie",
      },
      stroke: {
        colors: ["white"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: "100%",
          dataLabels: {
            offset: -25,
          },
        },
      },
      labels: [
        "Electronic Computers",
        "Leasehold Improvements",
        "Office Machine",
        "General Fixtures",
        "Passenger Car",
      ],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "Inter, sans-serif",
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "";
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + "";
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

  const chartRef = useRef(null);
  useEffect(() => {
    const chartElement = chartRef.current;

    if (chartElement) {
      const chart = new ApexCharts(chartElement, getChartOptions());
      chart.render();

      // Cleanup function to destroy the chart on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [chartKey]);

  // New Register Asset Chart

  const leaseholdList = [
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-01-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-02-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-02-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-02-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-02-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-02-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-02-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-03-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-03-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-04-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-04-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-04-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-04-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-04-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-05-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-05-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-05-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-06-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-06-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-07-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-07-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-07-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-07-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-08-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-08-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-09-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-09-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-09-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-09-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-09-04" },
    { fixed_asset: "LEASEHOLD IMPROVEMENTS", date_received: "2024-09-04" },
  ];

  const electronicComputers = [
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-01-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-01-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-01-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-01-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-02-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-03-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-03-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-03-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-05-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-05-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-05-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-05-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-06-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-06-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-07-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-07-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-07-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-07-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-07-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-07-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-08-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-08-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-08-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-08-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-09-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-09-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-09-04" },
    { fixed_asset: "ELECTRONIC COMPUTERS", date_received: "2024-09-04" },
  ];

  const officeMachine = [
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-01-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-01-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-02-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-02-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-02-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-02-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-03-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-03-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-05-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-05-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-05-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-05-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-05-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-05-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-06-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-06-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-06-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-07-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-07-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-07-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-07-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-07-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-08-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-08-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-08-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
    { fixed_asset: "OFFICE MACHINE", date_received: "2024-09-04" },
  ];

  const generalFixtures = [
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-02-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-02-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-03-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-03-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-03-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-03-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-03-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-04-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-04-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-05-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-05-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-05-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-05-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-06-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-06-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-07-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-07-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-07-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-07-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-07-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-08-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-08-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
    { fixed_asset: "GENERAL FIXTURES", date_received: "2024-09-04" },
  ];

  const passengerCar = [
    { fixed_asset: "PASSENGER CAR", date_received: "2024-01-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-01-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-01-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-01-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-03-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-03-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-03-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-03-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-03-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-04-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-04-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-04-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-05-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-06-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-06-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-07-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-07-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-07-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-07-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-07-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-08-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-08-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-08-04" },
    { fixed_asset: "PASSENGER CAR", date_received: "2024-09-04" },
  ];

  const allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthIndex = new Date().getMonth(); // 0-based index of the current month
  const monthsUntilCurrent = allMonths.slice(0, currentMonthIndex + 1);

  /* Electronics Data */
  const months = electronicComputers.map((dateObj) => {
    const date = new Date(dateObj.date_received);
    return date.toLocaleString("default", { month: "long" });
  });

  // const presentMonths = [...new Set(months)];

  // Initialize monthCount with all monthsUntilCurrent set to 0
  const monthCount = monthsUntilCurrent.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Increment the counts for each month present in the `months` array
  months.forEach((month) => {
    monthCount[month] += 1;
  });

  const countsOnly = Object.values(monthCount);

  /* End Electronics Data */

  /* Leasehold  Data */
  const months2 = leaseholdList.map((dateObj) => {
    const date = new Date(dateObj.date_received);
    return date.toLocaleString("default", { month: "long" });
  });

  // Initialize monthCount with all monthsUntilCurrent set to 0
  const monthCount2 = monthsUntilCurrent.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Increment the counts for each month present in the `months` array
  months2.forEach((month) => {
    monthCount2[month] += 1;
  });
  const countsOnly2 = Object.values(monthCount2);
  /* Leasehold  Data */

  /* Office Machine  Data */
  const months3 = officeMachine.map((dateObj) => {
    const date = new Date(dateObj.date_received);
    return date.toLocaleString("default", { month: "long" });
  });

  // Initialize monthCount with all monthsUntilCurrent set to 0
  const monthCount3 = monthsUntilCurrent.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Increment the counts for each month present in the `months` array
  months3.forEach((month) => {
    monthCount3[month] += 1;
  });
  const countsOnly3 = Object.values(monthCount3);
  /*End Office Machine  Data */

  /* General Fixtures  Data */
  const months4 = generalFixtures.map((dateObj) => {
    const date = new Date(dateObj.date_received);
    return date.toLocaleString("default", { month: "long" });
  });

  // Initialize monthCount with all monthsUntilCurrent set to 0
  const monthCount4 = monthsUntilCurrent.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Increment the counts for each month present in the `months` array
  months4.forEach((month) => {
    monthCount4[month] += 1;
  });
  const countsOnly4 = Object.values(monthCount4);
  /* End General Fixtures  Data */

  /* Passenger Car  Data */
  const months5 = passengerCar.map((dateObj) => {
    const date = new Date(dateObj.date_received);
    return date.toLocaleString("default", { month: "long" });
  });

  // Initialize monthCount with all monthsUntilCurrent set to 0
  const monthCount5 = monthsUntilCurrent.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  // Increment the counts for each month present in the `months` array
  months5.forEach((month) => {
    monthCount5[month] += 1;
  });
  const countsOnly5 = Object.values(monthCount5);
  /* Passenger Car  Data */

  const getChart2 = () => {
    return {
      // add data series via arrays, learn more here: https://apexcharts.com/docs/series/
      series: [
        {
          name: "Electronic Computers",
          data: countsOnly,
          color: "#9061f9",
        },
        {
          name: "Leasehold Improvements",
          data: countsOnly2,
          color: "#76a9fa",
        },
        {
          name: "Office Machine",
          data: countsOnly3,
          color: "#0e9f6e",
        },
        {
          name: "General Fixtures",
          data: countsOnly4,
          color: "#e74694",
        },
        {
          name: "Passenger Car",
          data: countsOnly5,
          color: "#06b6d4",
        },
      ],
      chart: {
        height: "100%",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      legend: {
        show: true,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -26,
        },
      },
      xaxis: {
        categories: monthsUntilCurrent,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: function (value) {
            return value;
          },
        },
      },
    };
  };

  const chartRef2 = useRef(null);
  useEffect(() => {
    const chartElement = chartRef2.current;

    if (chartElement) {
      const chart = new ApexCharts(chartElement, getChart2());
      chart.render();

      // Cleanup function to destroy the chart on unmount
      return () => {
        chart.destroy();
      };
    }
  }, [chartKey]);

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          onClick={exportToExcel}
          sx={{
            color: "white",
            fontSize: "12px",
            margin: "8px",
            backgroundColor: (() => {
              if (isOpenEC) return "#9061f9";
              if (isOpenLI) return "#76a9fa";
              if (isOpenOM) return "#0e9f6e";
              if (isOpenLI) return "#42A5F5";
              if (isOpenGF) return "#e74694";
              if (isOpenPC) return "#06b6d4";
              if (isOpenAllRegistered) return "#43A047";
              if (isOPenDisposedItem) return "#757575";
              // Add more conditions if necessary
              return "defaultColor"; // Fallback color
            })(),
            "&:hover": {
              backgroundColor: (() => {
                if (isOpenEC) return "#7E57C2";
                if (isOpenLI) return "#2196F3";
                if (isOpenOM) return "#0b6e4c";
                if (isOpenGF) return "#c23278";
                if (isOpenPC) return "#06b6d4";
                if (isOpenAllRegistered) return "#388E3C";
                if (isOPenDisposedItem) return "#616161";
                // Add more conditions if necessary
                return "defaultColor"; // Fallback color
              })(),
            },
          }}
        >
          <FontAwesomeIcon icon={faDownload} />
          <span className="ml-2"></span> Export To Excel
        </Button>
        {/* <GridToolbarExport /> */}
      </GridToolbarContainer>
    );
  };
  const PrintCustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          onClick={exportToExcel}
          sx={{
            color: "white",
            fontSize: "12px",
            margin: "8px",
          }}
        >
          <FontAwesomeIcon icon={faDownload} />
          <span className="ml-2"></span> Print QR Codes
        </Button>
        {/* <GridToolbarExport /> */}
      </GridToolbarContainer>
    );
  };

  const electronicComputerList = registeredItems.filter(
    (item) => item.fixed_asset == dropdowndata.getFixedAsset()[0].value
  );
  const leaseholdImprovementList = registeredItems.filter(
    (item) => item.fixed_asset == dropdowndata.getFixedAsset()[1].value
  );
  const officeMachineList = registeredItems.filter(
    (item) => item.fixed_asset == dropdowndata.getFixedAsset()[2].value
  );
  const generalFixturesList = registeredItems.filter(
    (item) => item.fixed_asset == dropdowndata.getFixedAsset()[3].value
  );
  const passengerCarList = registeredItems.filter(
    (item) => item.fixed_asset == dropdowndata.getFixedAsset()[4].value
  );
  const disposedItemList = registeredItems.filter(
    (item) => item.status == "DISPOSAL: ITEM DISPOSED"
  );
  return (
    <>
      {isAuthenticated ? (
        <div className="p-8 h-screen">
          <div className="mb-4 flex flex-row gap-4 ">
            {/* <div onClick={toggleReports}>GO BACK</div> */}

            <Box
              sx={{ height: "60px" }}
              className={`border rounded-lg w-64 text-white  border-gray-300 flex flex-row bg-purple-500 cursor-pointer ${
                isOpenEC ? "shadow-lg shadow-purple-600" : ""
              } `}
              onClick={toggleEC}
            >
              <div className="w-1/4 h-full text-lg bg-purple-600 rounded-l-lg flex justify-center items-center">
                <FontAwesomeIcon icon={faComputer} className="items-center" />
              </div>
              <div className="w-3/4 h-full ml-2">
                <div className="text-lg font-bold">
                  {electronicComputerList.length}
                </div>
                <span className="text-xs block">Electronic Computers</span>
              </div>
            </Box>

            <Box
              sx={{ height: "60px" }}
              className={`border rounded-lg w-64 text-white  border-gray-300 flex flex-row bg-blue-400 cursor-pointer ${
                isOpenLI ? "shadow-lg shadow-blue-600" : ""
              }`}
              onClick={toggleLI}
            >
              <div className="w-1/4 h-full text-lg bg-blue-500 rounded-l-lg flex justify-center items-center">
                <FontAwesomeIcon icon={faToolbox} />
              </div>
              <div className="w-3/4 h-full ml-2">
                <div className="text-lg font-bold">
                  {leaseholdImprovementList.length}
                </div>
                <span className="text-xs block">Leasehold Improvements</span>
              </div>
            </Box>

            <Box
              sx={{ height: "60px" }}
              className={`border rounded-lg w-64 text-white  border-gray-300 flex flex-row bg-green-500 cursor-pointer ${
                isOpenOM ? "shadow-lg shadow-green-600" : ""
              }`}
              onClick={toggleOM}
            >
              <div className="w-1/4 h-full text-lg bg-green-600 rounded-l-lg flex justify-center items-center">
                <FontAwesomeIcon icon={faEnvelopesBulk} />
              </div>
              <div className="w-3/4 h-full ml-2">
                <div className="text-lg font-bold">
                  {officeMachineList.length}
                </div>
                <span className="text-xs block">Office Machine</span>
              </div>
            </Box>
            <Box
              sx={{ height: "60px" }}
              className={`border rounded-lg w-64 text-white  border-gray-300 flex flex-row bg-pink-500 cursor-pointer ${
                isOpenGF ? "shadow-lg shadow-pink-600" : ""
              } `}
              onClick={toggleGF}
            >
              <div className="w-1/4 h-full text-lg bg-pink-600 rounded-l-lg flex justify-center items-center">
                <FontAwesomeIcon icon={faTools} />
              </div>
              <div className="w-3/4 h-full ml-2">
                <div className="text-lg font-bold">
                  {generalFixturesList.length}
                </div>
                <span className="text-xs block">General Fixtures</span>
              </div>
            </Box>
            <Box
              sx={{ height: "60px" }}
              className={`border rounded-lg w-64 text-white  border-gray-300 flex flex-row bg-cyan-500 cursor-pointer ${
                isOpenPC ? "shadow-lg shadow-cyan-600" : ""
              }`}
              onClick={togglePC}
            >
              <div className="w-1/4 h-full text-lg bg-cyan-600 rounded-l-lg flex justify-center items-center">
                <FontAwesomeIcon icon={faCar} />
              </div>
              <div className="w-3/4 h-full ml-2">
                <div className="text-lg font-bold">
                  {passengerCarList.length}
                </div>
                <span className="text-xs block">Passenger Car</span>
              </div>
            </Box>
          </div>
          {(() => {
            switch (currentView) {
              case "reports":
                return (
                  <div className="mt-8">
                    <div className="flex justify-end mb-4">
                      <label className="ui-switch">
                        <input
                          type="checkbox"
                          onClick={() => setIsDarkMode((prevMode) => !prevMode)}
                        />
                        <div className="slider">
                          <div className="circle"></div>
                        </div>
                      </label>
                    </div>
                    <div className="flex flex-row gap-4 w-full">
                      <div className="max-w-sm w-1/3 h-full border  bg-white rounded-lg shadow-lg shadow-gray-300 dark:bg-gray-800 p-4 md:p-6">
                        <div className="flex justify-between items-start w-full ">
                          <div className="flex-col items-center">
                            <div className="flex items-center">
                              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">
                                Disposed Items
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div
                          className="py-6"
                          id="pie-chart"
                          ref={chartRef}
                        ></div>
                        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                          <div className="flex justify-between items-center pt-5">
                            <a
                              href="#"
                              className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
                              onClick={toggleDisposed}
                            >
                              View Disposed Items
                              <svg
                                className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="w-2/3 h-full bg-white border rounded-lg shadow-lg shadow-gray-300 dark:bg-gray-800 p-4 md:p-6">
                        <div className="flex justify-between mb-5">
                          <div>
                            <h5 className="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">
                              Registered Items ({new Date().getFullYear()})
                            </h5>
                          </div>
                          <div className=" text-xl font-bold text-gray-900 dark:text-white pb-2">
                            <span className="text-red-500">
                              {registeredItems.length}
                            </span>{" "}
                            Items
                          </div>
                        </div>
                        <div
                          className="py-6 w-full"
                          id="legend-chart"
                          ref={chartRef2}
                        ></div>
                        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
                          <div className="flex justify-between items-center pt-5">
                            <a
                              href="#"
                              className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
                              onClick={toggleAllRegistered}
                            >
                              View Registered Items
                              <svg
                                className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 6 10"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 9 4-4-4-4"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              case "electronic_computers":
                return (
                  <>
                    <div className="text-lg mb-4 mt-10">
                      Electronic Computers
                    </div>
                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={electronicComputerList}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        pageSizeOptions={[15]}
                        disableRowSelectionOnClick
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              case "leasehold_improvements":
                return (
                  <>
                    <div className="text-lg mb-4 mt-10">
                      Leasehold Improvements
                    </div>
                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={leaseholdImprovementList}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        pageSizeOptions={[15]}
                        disableRowSelectionOnClicks
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              case "office_machine":
                return (
                  <>
                    <div className="text-lg mb-4 mt-10">Office Machine</div>
                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={officeMachineList}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        pageSizeOptions={[15]}
                        disableRowSelectionOnClick
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              case "general_fixtures":
                return (
                  <>
                    <div className="text-lg mb-4 mt-10">General Fixtures</div>
                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={generalFixturesList}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        pageSizeOptions={[15]}
                        disableRowSelectionOnClick
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              case "passenger_car":
                return (
                  <>
                    <div className="text-lg mb-4 mt-10">Passenger Car</div>
                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={passengerCarList}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        pageSizeOptions={[15]}
                        disableRowSelectionOnClick
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              case "all_registered":
                return (
                  <>
                    <div className="flex flex-row justify-between mb-4 mt-10">
                      <div className="text-lg ">All Registered Items</div>
                      <div>
                        <span className="text-red-500 font-semibold">
                          {registeredItems.length}
                        </span>{" "}
                        Items
                      </div>
                    </div>

                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={registeredItems}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        checkboxSelection
                        pageSizeOptions={[15]}
                        disableRowSelectionOnClick
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              case "disposed":
                return (
                  <>
                    <div className="text-lg mb-4 mt-10">Disposed Items</div>
                    <Box sx={{ height: "500px" }}>
                      <DataGrid
                        rows={disposedItemList}
                        columns={columns}
                        getRowId={getRowId}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 15,
                            },
                          },
                        }}
                        pageSizeOptions={[15]}
                      
                        disableRowSelectionOnClick
                        slots={{
                          toolbar: CustomToolbar,
                        }}
                        sx={{
                          "& .MuiDataGrid-cell": {
                            fontSize: "10px", // Font size for cells in rows
                            textAlign: "center",
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontSize: "12px", // Font size for column headers
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </Box>
                  </>
                );
              default:
                return null;
            }
          })()}
          {currentView !== "reports" && (
            <div className="mt-2 flex justify-between">
              <Button
                variant="contained"
                onClick={() => {
                  setChartKey((prevKey) => prevKey + 1); // Trigger chart re-render
                  toggleReports();
                }}
                sx={{
                  fontSize: "10px",
                }}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  fontSize: "10px",
                }}
              >
               Print QR Codes
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default Reports;

