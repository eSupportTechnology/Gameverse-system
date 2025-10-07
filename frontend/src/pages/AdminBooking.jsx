import React, { useState } from 'react'
import { Box } from "@mui/material";
import TopBar from "../components/TopBar";
import AdminBookingsManagement from '../components/AdminBookingsManagement';
import Sidebar from '../components/Sidebar';

const AdminBooking = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 70 : 230;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Box sx={{ flexGrow: 1, bgcolor: "#000", minHeight: "100vh" ,}}>
        {/* TopBar always visible */}
        <TopBar sidebarWidth={sidebarWidth} />

        
        <Box sx={{ mt: 8, p: 2}}>
          <AdminBookingsManagement/>
        </Box>
      </Box>
    </Box>
  )
}
export default AdminBooking
