import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Button,
  Popover,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ToastContainer } from 'react-toastify';
import { AppContext } from "../context/AppContext";

const TopBar = ({ sidebarOpen }) => {

  const { loggedUser, logoutUser, globalSearch, setGlobalSearch } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logoutUser();
    handleClose();
    window.location.href = "/admin/login";
  };

  const drawerWidth = sidebarOpen ? 290 : 70;

  return (
    <>
      <ToastContainer />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#000000",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Search Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#202939",
              transition: "background-color .2s ease",
              "&:hover": { backgroundColor: "#243447" },
              borderRadius: "8px",
              height: "40px",
              width: "518px",
              px: 2,
              marginLeft: "150px",

            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
           <InputBase
  placeholder="Search…"
  sx={{ color: "white", width: "100%" }}
  value={globalSearch}
  onChange={(e) => setGlobalSearch(e.target.value)}
/>

          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
            {/* Notification */}
            <Box
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#202939",
                borderRadius: "8px",
              }}
            >
              <IconButton
                size="small"
                sx={{ color: "#8A8F98", width: 24, height: 24 }}
              >
                <Badge
                  badgeContent={1}
                  color="secondary"
                  overlap="circular"
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* User Info */}
            <Box
              onClick={handleOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-between',
                backgroundColor: "#202939",
                width: "217px",
                height: "40px",
                borderRadius: "6px",
                px: 1.5,
                gap: 1.5,
              }}
            >

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={loggedUser?.avatar || "https://via.placeholder.com/40"}
                  alt="Admin User"
                  sx={{ width: 30, height: 30 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 0.1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#D1D5DB",
                      lineHeight: 1.2,
                    }}
                  >
                    {loggedUser?.role
                      ? loggedUser.role === "admin"
                        ? "Admin"
                        : loggedUser.role === "super_admin"
                          ? "Super Admin"
                          : "Operator"
                      : "User"}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 400,
                      fontSize: "10px",
                      color: "#8B8B8D",
                      lineHeight: 1.2,
                    }}
                  >
                    {loggedUser?.fullname || "Guest"}
                  </Typography>
                </Box>

              </Box>

              <IconButton
                size="small"
                onClick={handleOpen}
                sx={{
                  color: "#9CA3AF",
                  p: 0.5,
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  cursor: 'pointer',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>

            {/* Popover Box */}
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  backgroundColor: "#202939",
                  color: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
                  minWidth: "200px",
                  p: 2,
                },
              }}
            >
              {/* Profile Info Inside Popup */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Avatar
                  src={loggedUser?.avatar || "https://via.placeholder.com/40"}
                  alt={loggedUser?.fullname || "User"}
                  sx={{ width: 45, height: 45 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                    {loggedUser?.fullname || "Guest"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                    }}
                  >
                    {loggedUser?.role
                      ? loggedUser.role === "admin"
                        ? "Admin"
                        : loggedUser.role === "super_admin"
                          ? "Super Admin"
                          : "Operator"
                      : "User"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ backgroundColor: "#374151", mb: 1 }} />

              <Button
                fullWidth
                variant="contained"
                onClick={handleLogout}
                sx={{
                  background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                  color: "white",
                  fontWeight: 'bold',
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#DC2626" },
                }}
              >
                Logout
              </Button>
            </Popover>
          </Box>

        </Toolbar>
        {/* Horizontal Line */}
        <Box
          sx={{
            position: "fixed",
            top: "65px", // height of AppBar
            left: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            height: "1px",
            backgroundColor: "#1E2A38",
            zIndex: 1100,
          }}
        />
      </AppBar>
    </>

  );
};

export default TopBar;