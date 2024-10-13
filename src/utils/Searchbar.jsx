import React from "react";

const Searchbar = ({ columns, setSearchColumn, setSearchValue }) => {
  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="flex justify-end mt-4">
      <select
        onChange={handleSearchColumnChange}
        className="text-gray-500 bg-gray-100 px-2 py-2 border text-xs border-gray-400 outline-none "
      >
        {columns.map((column) => (
          <option key={column.field} value={column.field}>
            {column.headerName}
          </option>
        ))}
      </select>
      <div className="relative">
        <input
          type="text"
          className="text-sm w-64 text-gray-500 bg-gray-100 px-2 py-2 border border-gray-400 outline-none"
          placeholder="Search..."
          onChange={handleSearchValueChange}
        />
        <svg
          className="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Searchbar;
