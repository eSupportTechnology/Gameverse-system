import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StationManagement from "../components/StationManagement";

const Station = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 70 : 230;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, bgcolor: "#000", minHeight: "100vh" }}>
        {/* TopBar always visible */}
        <TopBar sidebarWidth={sidebarWidth} />

        {/* StationManagement content */}
        <Box sx={{ mt: 8, p: 2 }}>
          <StationManagement />
        </Box>
      </Box>
    </Box>
  );
};

export default Station;
