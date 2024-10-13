/****  Code History QR INVENTORY SYSTEM
* New = N001

* -------------------------------------------------------------
* ID   |      Name         |    Date       |   Remarks  
* -------------------------------------------------------------
* N001 |     Edward        | 04/15/2024    | Create Code
 
 ****/

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { deepOrange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";

import Tooltip from "@mui/material/Tooltip";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { Backdrop } from "@mui/material";
import Loaders from "../utils/Loaders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faPowerOff, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "white",
          color: "black", // Change background color
          fontSize: "16px", // Change font size
          // Add other custom styles as needed
        },
      },
    },
  },
});
// Example theme

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function AvatarUser({ isAuthenticated, user, logout }) {
  const [isLoading, setIsLoading] = React.useState(false);
 
 
  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
        logout(() => {
          setIsLoading(false);
        });
     }, 3000);
  };

  return (
    <>
      <Backdrop open={isLoading} style={{ color: "#fff", zIndex: 1200 }}>
        <Loaders />
      </Backdrop>{" "}
      <div className="bg-[#2f63a2] h-full">
        <ThemeProvider theme={theme}>
          <Stack
            direction="row"
            spacing={2}
            className="items-center justify-between"
          >
            {user && (
              <>
                <Stack direction="row" spacing={2} sx={{ height: "2.5rem" }}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      sx={{ bgcolor: deepOrange[500] }}
                      alt={user[0].emp_name}
                      src="/static/images/avatar/1.jpg"
                    />
                  </StyledBadge>
                  <div className="text-white capitalize text-sm tracking-wide">
                    {user[0].emp_name}
                    <span className="block text-xs capitalize">
                      {user[0].dept_desc}
                    </span>
                  </div>
                </Stack>
                <div className="mt-4 ">
                  <Tooltip title="Logout">
                    <FontAwesomeIcon
                      icon={faArrowRightFromBracket}
                      className="w-8 h-8 text-white dark:text-white cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110  duration-300"
                      onClick={handleLogout}
                    />
                   
                  </Tooltip>
                </div>
              </>
            )}
          </Stack>
        </ThemeProvider>
      </div>
    </>
  );
}
