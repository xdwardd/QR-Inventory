/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import React, { useState, useEffect } from "react";
import { Link,  Outlet} from "react-router-dom";

import { Avatar, Divider } from "@mui/material";
import AvatarUser from "../Modals/AvatarUser";

import { useAuth } from "./AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faAngleUp, faClipboard, faCopy, faGear, faPenToSquare, faQrcode, faTrashCan, faUserGear, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";

const Sidebar = () => {
  const { isAuthenticated, user, logout, rememberRoute, previousRoute } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [selectedLink, setSelectedLink] = useState(window.location.pathname.replace("/inventory/", ""));


  useEffect(() => {
  
    if (selectedLink == '') {
        if (user && user[0].screen_id === "1") {
          setSelectedLink("assetmanagement");
        } else if (user && user[0].screen_id === "2") {
          setSelectedLink("assignment");
        } else if (user && user[0].screen_id === "3") {
          setSelectedLink("approval/register");
        } else if (user && user[0].screen_id === "4") {
          setSelectedLink("approval/updateditems");
        } else if (user && user[0].screen_id === "5") {
          setSelectedLink("approval/assignment");
        } else if (user && user[0].screen_id === "6") {
          setSelectedLink("approval/clearance");
        } else if (user && user[0].screen_id === "7") {
          setSelectedLink("approval/disposal");
        } else if (user && user[0].screen_id === "8") {
          setSelectedLink("accountability");
        } else if (user && user[0].screen_id === "9") {
          setSelectedLink("clearance");
        } else if (user && user[0].screen_id === "10") {
          setSelectedLink("reports");
        } else if (user && user[0].screen_id === "11") {
          setSelectedLink("disposal");
        } else if (user && user[0].screen_id === "12") {
          setSelectedLink("settings");
        }
    }

}, [user]);
  

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  //if Approval was clicked show submenu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  let userScreens;
  if (user) {
    userScreens = user.map((item) => item.screen_id);
  }

  
  return (
    <>
      <div className="">
        <div className="flex flex-col h-full">
          <div className="flex flex-row">
            <div className="fixed inset-y-0 left-0 z-10 w-1/5 overflow-y-auto ">
              {" "}
              <div className="flex flex-col bg-[#2f63a2] h-full">
                <div className="p-6 gap-2 flex flex-row space-x-2">
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={faQrcode} className="text-white" />
                  </div>

                  <Link
                    // to={`assetmanagement`}
                    // onClick={() => {
                    //   handleLinkClick("assetmanagement");
                    //   rememberRoute();
                    //   if (isDropdownOpen) {
                    //     setIsDropdownOpen(false); // Close the dropdown if it's open
                    //   }
                    // }}
                    className="font-medium tracking-wider text-white text-md"
                  >
                    {" "}
                    QR INVENTORY
                  </Link>
                </div>
                <Divider />
                <ul className="px-6 py-4 w-full">
                  <li
                    className={`mb-8 rounded-md p-2 text-sm mx-auto ${
                      userScreens && userScreens.includes("1")
                        ? "visible"
                        : "hidden"
                    } ${
                      selectedLink === "assetmanagement"
                        ? "bg-white text-gray-800"
                        : "text-white hover:rounded-none  hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to={`assetmanagement`}
                      onClick={() => {
                        handleLinkClick("assetmanagement");
                        rememberRoute();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }
                      }}
                    >
                      {" "}
                      <div className="flex gap-4 items-center justify-start">
                        <FontAwesomeIcon icon={faUserGear} />
                        <span className="inline-block">Register Assets</span>
                      </div>
                    </Link>
                  </li>

                  <li
                    className={`mb-4 rounded-md p-2 text-sm ${
                      userScreens && userScreens.includes("2")
                        ? "visible"
                        : "hidden"
                    }   ${
                      selectedLink === "assignment"
                        ? "bg-white text-gray-800"
                        : " text-white hover:rounded-none hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to="assignment"
                      onClick={() => {
                        handleLinkClick("assignment");
                        rememberRoute();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }
                      }}
                    >
                      <div className="flex gap-4 items-center justify-start">
                        <FontAwesomeIcon icon={faAddressBook} />
                        <span className="inline-block">Assignment</span>
                      </div>
                    </Link>
                  </li>
                  {/* // ) : (
                    //   toast.info("Access not allowed!")
                    // )} */}
                  <li
                    className={`${
                      userScreens &&
                      ["3", "4", "5", "6", "7"].some((screen) =>
                        userScreens.includes(screen)
                      )
                        ? "visible"
                        : "hidden"
                    }`}
                  >
                    <Link
                      to={"approval/register"}
                      className={`flex items-center mb-4 ${
                        selectedLink === "approval/register"
                          ? " "
                          : "hover:rounded-none  border-white"
                      }`}
                      onClick={() => {
                        handleLinkClick("approval/register");
                        rememberRoute();
                        toggleDropdown();
                      }}
                    >
                      <div
                        id="dropdownDefaultButton"
                        className={` text-white text-sm rounded-md focus:ring-4 focus:outline-none p-3 text-center inline-flex items-center cursor-pointer ${
                          selectedLink === "approval/register"
                            ? " text-white"
                            : "hover:rounded-none hover:border-l-4 border-white"
                        }`}
                        onClick={() => {
                          handleLinkClick("approval/register");
                          rememberRoute();
                          toggleDropdown();
                        }}
                        type="button"
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="mr-3"
                        />
                        Approval
                      </div>
                      <div className="w-full flex justify-center">
                        <FontAwesomeIcon
                          icon={isDropdownOpen ? faAngleDown : faAngleUp}
                          className="text-white"
                        />
                      </div>
                    </Link>

                    {/* Conditional rendering of submenu based on isDropdownOpen state */}
                    {isDropdownOpen && (
                      <ul className="sub-menu ml-2">
                        <li
                          className={`mb-2 ${
                            userScreens && userScreens.includes("3")
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <Link
                            to="approval/register"
                            className={`block py-2 px-8 rounded-md  text-sm ${
                              selectedLink === "approval/register"
                                ? "bg-white text-gray-800"
                                : "text-white hover:rounded-md hover:text-gray-800 hover:bg-white"
                            } `}
                            onClick={() => {
                              handleLinkClick("approval/register");
                              rememberRoute();
                            }}
                          >
                            Register
                          </Link>
                        </li>
                        <li
                          className={`mb-2 ${
                            userScreens && userScreens.includes("4")
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <Link
                            to="approval/updateditems"
                            className={`block py-2 px-8 rounded-md  text-sm ${
                              selectedLink === "approval/updateditems"
                                ? "bg-white text-gray-800"
                                : "text-white hover:rounded-md hover:text-gray-800 hover:bg-white"
                            } `}
                            onClick={() => {
                              handleLinkClick("approval/updateditems");
                              rememberRoute();
                            }}
                          >
                            Updated Item
                          </Link>
                        </li>
                        <li
                          className={`mb-2 ${
                            userScreens && userScreens.includes("5")
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <Link
                            to="approval/assignment"
                            className={`block py-2 px-8 rounded-md text-sm ${
                              selectedLink === "approval/assignment"
                                ? "bg-white text-gray-800"
                                : " text-white hover:rounded-md hover:text-gray-800 hover:bg-white"
                            } `}
                            onClick={() => {
                              handleLinkClick("approval/assignment");
                              rememberRoute();
                            }}
                          >
                            Assignment
                          </Link>
                        </li>
                        <li
                          className={`mb-2 ${
                            userScreens && userScreens.includes("6")
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <Link
                            to="approval/clearance"
                            className={`block py-2 px-8 rounded-md  text-sm ${
                              selectedLink === "approval/clearance"
                                ? "bg-white text-gray-800"
                                : "text-white hover:rounded-md hover:text-gray-800 hover:bg-white"
                            } `}
                            onClick={() => {
                              handleLinkClick("approval/clearance");
                              rememberRoute();
                            }}
                          >
                            Clearance
                          </Link>
                        </li>
                        <li
                          className={`mb-2 ${
                            userScreens && userScreens.includes("7")
                              ? "visible"
                              : "hidden"
                          }`}
                        >
                          <Link
                            to="approval/disposal"
                            className={`block py-2 px-8 rounded-md  text-sm ${
                              selectedLink === "approval/disposal" &&
                              window.location.pathname
                                ? "bg-white text-gray-800"
                                : "text-white hover:rounded-md hover:text-gray-800 hover:bg-white"
                            } `}
                            onClick={() => {
                              handleLinkClick("approval/disposal");
                              rememberRoute();
                            }}
                          >
                            Disposal
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li
                    className={`mb-4 rounded-md p-2 text-sm  ${
                      userScreens && userScreens.includes("8")
                        ? "visible"
                        : "hidden"
                    }  ${
                      selectedLink === "accountability"
                        ? "bg-white text-gray-800"
                        : "text-white hover:rounded-none hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to={"accountability"}
                      // to="accountability"
                      onClick={() => {
                        handleLinkClick("accountability");
                        rememberRoute();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }
                      }}
                    >
                      <div className="flex gap-3 items-center justify-start">
                        <FontAwesomeIcon icon={faUserPen} />
                        <span className="inline-block">Accountability</span>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={`mb-4 rounded-md p-2 text-sm ${
                      userScreens && userScreens.includes("9")
                        ? "visible"
                        : "hidden"
                    } ${
                      selectedLink === "clearance"
                        ? "bg-white text-gray-800"
                        : " text-white hover:rounded-none hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to="clearance"
                      onClick={() => {
                        handleLinkClick("clearance");
                        rememberRoute();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }
                      }}
                    >
                      <div className="flex gap-4 items-center justify-start">
                        <FontAwesomeIcon icon={faClipboard} />
                        <span className="inline-block">Clearance</span>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={`mb-4 rounded-md p-2 text-sm ${
                      userScreens && userScreens.includes("10")
                        ? "visible"
                        : "hidden"
                    }   ${
                      selectedLink === "reports"
                        ? "bg-white text-gray-800"
                        : "text-white hover:rounded-none hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to="reports"
                      onClick={() => {
                        handleLinkClick("reports");
                        rememberRoute();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }
                      }}
                    >
                      <div className="flex gap-4 items-center justify-start">
                        <FontAwesomeIcon icon={faCopy} />
                        <span className="inline-block">Reports</span>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={`mb-4 rounded-md p-2 text-sm ${
                      userScreens && userScreens.includes("11")
                        ? "visible"
                        : "hidden"
                    }   ${
                      selectedLink === "disposal"
                        ? "bg-white text-gray-800"
                        : "text-white hover:rounded-none hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to="disposal"
                      onClick={() => {
                        handleLinkClick("disposal");
                        rememberRoute();
                        if (isDropdownOpen) {
                          setIsDropdownOpen(false); // Close the dropdown if it's open
                        }
                      }}
                    >
                      <div className="flex gap-4 items-center justify-start">
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span className="inline-block">Disposal</span>
                      </div>
                    </Link>
                  </li>
                  <li
                    className={`mb-4 rounded-md p-2 text-sm ${
                      userScreens && userScreens.includes("12")
                        ? "visible"
                        : "hidden"
                    } ${
                      selectedLink === "settings"
                        ? "bg-white text-gray-800"
                        : "text-white hover:rounded-none hover:border-l-4 border-white"
                    }`}
                  >
                    <Link
                      to="settings"
                      onClick={() => {
                        handleLinkClick("settings");
                        rememberRoute();
                      }}
                    >
                      <div className="flex gap-4 items-center justify-start">
                        <FontAwesomeIcon icon={faGear} />

                        <span className="inline-block">Settings</span>
                      </div>
                    </Link>
                  </li>
                </ul>

                <div className=" h-full flex items-end justify-start mb-8 bg-[#2f63a2]">
                  <div className="w-full inline-block align-bottom">
                    <div className="mb-2">
                      <Divider />
                    </div>
                    <div className="p-6 ">
                      <AvatarUser
                        isAuthenticated={isAuthenticated}
                        user={user}
                        logout={logout}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-row">
              <div className="w-1/5"></div>
              <div className="w-4/5">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
