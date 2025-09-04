import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";

const TopBar = ({ sidebarOpen }) => {
  const drawerWidth = sidebarOpen ? 290 : 70;

  return (
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
            marginLeft:"150px",
            
           }}
        >
          <SearchIcon sx={{ mr: 1 }} />
          <InputBase
            placeholder="Search…"
            sx={{ color: "white", width: "100%" }}
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
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#202939",
                width: "217px",
                height: "40px",
                borderRadius: "6px",
                px: 1.5,
                gap: 1.5,
              }}
            >
              <Avatar
                src="https://via.placeholder.com/40"
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
                  Admin User
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
                  Super Admin
                </Typography>
              </Box>
            </Box>
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

    
  );
};

export default TopBar;