
import React, { useState } from 'react'
import { Box, Dialog, DialogContent } from "@mui/material";
import TopBar from "../components/TopBar";
import Sidebar from '../components/Sidebar';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);
  const sidebarWidth = collapsed ? 70 : 230;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Box sx={{ flexGrow: 1, bgcolor: "#000", minHeight: "100vh", }}>
        {/* TopBar always visible */}
        <TopBar sidebarWidth={sidebarWidth} />


        <Box sx={{ mt: 8, p: 2 }}>
          <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: 6,
                bgcolor: "#0A192F"
              },
            }}
          >
            <DialogContent>
              <LoginForm />
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
    </Box>
  )
}

export default Login

