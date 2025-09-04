import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import StationManagement from "../components/StationManagement";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* {/* <TopBar /> */}
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "#111827", minHeight: "100vh" }}>
        <Routes>
          
          {/* <Route path="/" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>Select a menu from sidebar</Box>} /> */}
          
        
          {/* <Route path="/stations" element={<StationManagement />} /> */}

          
          <Route path="/bookings" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>Bookings Page (Coming soon)</Box>} />
          <Route path="/pos" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>POS System (Coming soon)</Box>} />
          <Route path="/games" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>Other Games (Coming soon)</Box>} />
          <Route path="/users" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>Users & Roles (Coming soon)</Box>} />
          <Route path="/reports" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>Reports (Coming soon)</Box>} />
          <Route path="/settings" element={<Box sx={{ p: 3, mt: 8, color: "white" }}>Settings (Coming soon)</Box>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Home;
