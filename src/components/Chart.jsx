import React from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Button } from "@mui/material";
import { log10 } from "chart.js/helpers";



const dates = [
  { date_received: "2024-01-10T16:00:00.000Z" },
  { date_received: "2024-02-10T16:00:00.000Z" },
  { date_received: "2024-02-10T16:00:00.000Z" },
  { date_received: "2024-03-10T16:00:00.000Z" },
  { date_received: "2024-03-10T16:00:00.000Z" },
  { date_received: "2024-04-10T16:00:00.000Z" },
  { date_received: "2024-04-10T16:00:00.000Z" },
  { date_received: "2024-04-10T16:00:00.000Z" },
  { date_received: "2024-04-10T16:00:00.000Z" },
  { date_received: "2024-04-10T16:00:00.000Z" },
  { date_received: "2024-06-10T16:00:00.000Z" },
  { date_received: "2024-06-10T16:00:00.000Z" },
  { date_received: "2024-06-10T16:00:00.000Z" },
  { date_received: "2024-06-10T16:00:00.000Z" },
  { date_received: "2024-06-10T16:00:00.000Z" },
  { date_received: "2024-07-10T16:00:00.000Z" },
  { date_received: "2024-07-10T16:00:00.000Z" },
  { date_received: "2024-07-10T16:00:00.000Z" },
  { date_received: "2024-07-10T16:00:00.000Z" },
];

const months = dates.map(dateObj => {
  const date = new Date(dateObj.date_received);
  return date.toLocaleString('default', { month: 'long' });
});


const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


const currentMonthIndex = new Date().getMonth(); // 0-based index of the current month
const monthsUntilCurrent = allMonths.slice(0, currentMonthIndex + 1);


const presentMonths = [...new Set(months)];

const missingMonths = monthsUntilCurrent.filter(
  (month) => !presentMonths.includes(month)
);



// Combine and sort by month sequence
const completeMonths = [...months, ...missingMonths].sort(
  (a, b) => monthsUntilCurrent.indexOf(a) - monthsUntilCurrent.indexOf(b)
);

const monthCount = completeMonths.reduce((acc, month) => {
  acc[month] = (acc[month] || 0) + 1;
  return acc;
}, {});

const monthNumbers = Object.values(monthCount);

// const juneItems = 
const Chart = () => {
  const data = {
    labels: [
      "EC",
      "LI",
      "OM",
      "GF",
      "PC",
    ],
    datasets: [
      {
        label: `Disposed Items per Asset ${new Date().getFullYear()}`,
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(188, 118, 244, 0.8)",
          "rgba(72, 187, 242, 0.8)",
          "rgba(20, 192, 97, 0.8)",
          "rgba(255, 60, 143, 0.8)",
          "rgba(6, 186, 220, 0.8)",
          
        ],
        borderColor: [
          "rgba(145, 23, 244, 0.8)",
          "rgba(9, 145, 247, 0.8)",
          "rgba(2, 163, 74, 0.8)",
          "rgba(190, 2, 83, 0.8)",
          "rgba(5, 152, 179, 0.8)",
        
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    }
  };

  

  const test = monthNumbers;
    
    /*Line Chart*/
     const dataLineChart = {
       labels: [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sept",
         "Oct",
         "Nov",
         "Dec",
       ],
       datasets: [
         {
           label: `Monthly Data ${new Date().getFullYear()} `,
           data: test,
           fill: false,
           borderColor: "rgba(75, 192, 192, 1)",
           backgroundColor: "rgba(75, 192, 192, 0.2)",
           tension: 0.1,
         },
       ],
     };

     const optionsLineChart = {
       responsive: true,
       plugins: {
         legend: {
           position: "top",
         },
         tooltip: {
           enabled: true,
         },
       },
       scales: {
        
        //  y: {
        //    display: true,
        //    title: {
        //      display: true,
        //      text: "Value",
        //    },
        //  },
       },
     };


    return (
      <div className="flex flex-row justify-between gap-6">
        <div className="w-1/2 flex flex-col justify-center bg-white shadow-gray-800 shadow-lg">
          <div className="text-lg font-semibold text-gray-600">
            Registered Assets
          </div>
          <div className="flex justify-center w-full">
            <Line data={dataLineChart} options={optionsLineChart} />
          
          </div>
        </div>
        <div className="w-1/2 flex flex-col justify-center">
          <div className="text-lg font-semibold text-gray-600">
            Disposed Items
          </div>
          <div className=" flex flex-col justify-center">
            <Bar data={data} options={options} />
            {/* <Button variant="outlined" className="w-1/2">TEST</Button> */}
          </div>
        </div>
      </div>
    );
      
};

export default Chart;
