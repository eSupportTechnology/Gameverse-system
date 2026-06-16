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
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { ToastContainer } from 'react-toastify';
import { AppContext } from "../context/AppContext";

const TopBar = ({ sidebarOpen }) => {

  const { loggedUser, logoutUser, globalSearch, setGlobalSearch, notifications, unreadCount, markAllRead, clearNotifications } = useContext(AppContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

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
            {/* Notification Bell */}
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
                onClick={(e) => setNotifAnchorEl(e.currentTarget)}
              >
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  overlap="circular"
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* Notification Popover */}
            <Popover
              open={Boolean(notifAnchorEl)}
              anchorEl={notifAnchorEl}
              onClose={() => { setNotifAnchorEl(null); markAllRead(); }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  backgroundColor: "#111827",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid #1F2937",
                  boxShadow: "0px 8px 24px rgba(0,0,0,0.5)",
                  width: 340,
                  maxHeight: 420,
                  display: "flex",
                  flexDirection: "column",
                },
              }}
            >
              {/* Header */}
              <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1F2937" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#F9FAFB" }}>
                  Notifications
                </Typography>
                {notifications.filter((n) => !n.read).length > 0 && (
                  <Typography
                    onClick={clearNotifications}
                    sx={{ fontSize: 12, color: "#0CD7FF", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                  >
                    Clear all
                  </Typography>
                )}
              </Box>

              {/* Notification List */}
              <Box sx={{ overflowY: "auto", flex: 1, "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: "#374151", borderRadius: "4px" } }}>
                {notifications.filter((n) => !n.read).length === 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 6, gap: 1 }}>
                    <NotificationsIcon sx={{ fontSize: 36, color: "#374151" }} />
                    <Typography sx={{ fontSize: 13, color: "#6B7280" }}>No notifications yet</Typography>
                  </Box>
                ) : (
                  notifications.filter((n) => !n.read).map((notif) => (
                    <Box
                      key={notif.id}
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        px: 2,
                        py: 1.5,
                        borderBottom: "1px solid #1F2937",
                        "&:last-child": { borderBottom: "none" },
                        "&:hover": { backgroundColor: "#1F2937" },
                      }}
                    >
                      <Box sx={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #0CD7FF22, #8A38F522)", border: "1px solid #0CD7FF44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "#0CD7FF" }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#F9FAFB" }}>{notif.title}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#9CA3AF", mt: 0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{notif.message}</Typography>
                        <Typography sx={{ fontSize: 11, color: "#4B5563", mt: 0.5 }}>{notif.time}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </Popover>

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