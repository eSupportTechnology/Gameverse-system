import React, { useState } from "react";
import { Box } from "@mui/material";
import SidebarOperater from "./SidebarOperater";
import TopBar from "./TopBar";
import { Outlet } from 'react-router-dom';


export default function OperatorLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 70 : 230;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <SidebarOperater collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, bgcolor: "#000", minHeight: "100vh" }}>
        <TopBar sidebarWidth={sidebarWidth} />

        <Box sx={{ mt: 6, p: 2 }}>
          <Outlet /> {/* Nested operator pages (booking, pos, games) will render here */}
        </Box>
      </Box>
    </Box>
  );
}
