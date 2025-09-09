import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StationManagement from "../components/StationManagement";

const Station = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 70 : 230;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#000" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#000",
        }}
      >
        <TopBar sidebarWidth={sidebarWidth} />

        {/* Content */}
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <StationManagement />
        </Box>
      </Box>
    </Box>
  );
};

export default Station;
