import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import PosSystem from "../components/pos-system";

const Pos = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 70 : 230;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#0f172a" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#000",
      }}>
        <TopBar sidebarWidth={sidebarWidth} />
        <Box sx={{ mt: 8, p: 2 }}>
          <PosSystem />
        </Box>
      </Box>
    </Box>
  );
};

export default Pos;
