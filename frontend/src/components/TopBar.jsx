import React from "react";
import {
  AppBar,
  Toolbar,
  InputBase,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const TopBar = ({ sidebarOpen }) => {
  const drawerWidth = sidebarOpen ? 230 : 70;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "#1f2937",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#374151",
            borderRadius: "8px",
            px: 2,
            marginLeft:"150px",
            py: 0.5,
            width: "50%",
          }}
        >
          <SearchIcon sx={{ mr: 1 }} />
          <InputBase
            placeholder="Search…"
            sx={{ color: "white", width: "100%" }}
          />
        </Box>

        {/* Right Side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton sx={{ color: "white" }}>
            <NotificationsIcon />
          </IconButton>
          <Avatar alt="Admin User" src="" />
          <Typography variant="body1">Admin User</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;