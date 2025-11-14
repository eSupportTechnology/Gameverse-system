import React, { useState } from "react";
import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TVOffer from "../pages/TVOffers";

const TVOffersLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#000", minHeight: "100vh" }}>
      {/* Sidebar (overlay mode) */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        variant={isMobile ? "temporary" : "permanent"}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#000",
          minHeight: "100vh",
          width: "100%", // ✅ Always full width
        }}
      >
        {/* Top Bar */}
        <TopBar onMenuClick={handleMenuClick} />

        {/* Space for fixed TopBar */}
        <Toolbar />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* TV Offer section centered */}
          <Box sx={{ width: "100%", maxWidth: "1200px" }}>
            <TVOffer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TVOffersLayout;
