import React, { useState } from 'react'
import { Box } from "@mui/material";
import TopBar from "../components/TopBar";
import Sidebar from '../components/Sidebar';
import WebManagement from '../components/WebManagement';


const WebPortal = () => {
  const [collapsed, setCollapsed] = useState(false);
    const sidebarWidth = collapsed ? 70 : 230;
  return (
    <div>
      <Box sx={{ display: "flex" }}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            
            <Box sx={{ flexGrow: 1, bgcolor: "#000", minHeight: "100vh" ,}}>
              {/* TopBar always visible */}
              <TopBar sidebarWidth={sidebarWidth} />
      
              
              <Box sx={{ mt: 8, p: 2}}>
                <WebManagement/>
              </Box>
            </Box>
          </Box>
    </div>
  )
}

export default WebPortal
