/*
import React from "react";
import { Box, Typography, Button, Tabs, Tab, Grid, Card, CardContent } from "@mui/material";

const stations = [
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5+VR (PS V R2)", type: "Play Station", status: "Playing", price: 300, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5+VR (PS V R2)", type: "Play Station", status: "Playing", price: 300, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
];

export default function StationManagement() {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <Box sx={{ mt: 3, color: "#fff" }}>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600}>Station Management</Typography>
          <Typography variant="body2" color="gray">Monitor and control gaming stations</Typography>
        </Box>
        <Button variant="contained" sx={{ background: "linear-gradient(to right, #33B2F7, #CF36E1)" }}>+ Add Station</Button>
      </Box>

      
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="All Stations" />
        <Tab label="PlayStation" />
        <Tab label="Pool" />
        <Tab label="Arcade" />
      </Tabs>

      
      <Grid container spacing={2}>
        {stations.map((station, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ backgroundColor: "#1A1A2E", p: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{station.name}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: station.status === "Available" ? "green" : "purple",
                      fontWeight: 500,
                    }}
                  >
                    {station.status}
                  </Typography>
                </Box>
                <Typography variant="body2" color="gray">{station.type}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>30 min | LKR {station.price}</Typography>
                <Typography variant="body2">Location: Zone A</Typography>
                <Typography variant="body2">No of bookings: {station.bookings}</Typography>
                <Button
                  fullWidth
                  sx={{
                    mt: 1,
                    backgroundColor: "#8B0000",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#a00" },
                  }}
                >
                  Set offline
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


import React from "react";
import { Box, Typography, Button, Tabs, Tab, Grid, Card, CardContent } from "@mui/material";

const stations = [
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5+VR (PS V R2)", type: "Play Station", status: "Playing", price: 300, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5+VR (PS V R2)", type: "Play Station", status: "Playing", price: 300, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
];

export default function StationManagement() {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
  
  
  

  
  
  
  

<Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", pt: "50px" }}>
  
  <Box sx={{ backgroundColor: "#0E111B", p: 3, borderRadius: 2, mx: 3 }}>
    
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" fontWeight={600}>Station Management</Typography>
      <Typography variant="body2" color="gray">Monitor and control gaming stations</Typography>
    </Box>

    
    <Box sx={{ backgroundColor: "#171c2da1", p: 1, borderRadius: 2, mb: 3 }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="All Stations" />
        <Tab label="PlayStation" />
        <Tab label="Pool" />
        <Tab label="Arcade" />
      </Tabs>
    </Box>

    
    <Box sx={{ backgroundColor: "#0e111b78", p: 3, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {stations.map((station, idx) => (
          <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ p: 2, borderRadius: 2,backgroundColor:"#171c2da1" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>{station.name}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: station.status === "Available" ? "green" : "purple",
                      fontWeight: 500,
                    }}
                  >
                    {station.status}
                  </Typography>
                </Box>
                <Typography variant="body2" color="gray">{station.type}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>30 min | LKR {station.price}</Typography>
                <Typography variant="body2">Location: Zone A</Typography>
                <Typography variant="body2">No of bookings: {station.bookings}</Typography>
                <Button
                  fullWidth
                  sx={{
                    mt: 1,
                    backgroundColor: "#9CA3AF",
                    color: "#000",
                    "&:hover": { backgroundColor: "#A0A9B0" },
                  }}
                >
                  Set offline
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
</Box>

        
        
        
        
        */

import React from "react";
import { Box, Typography, Button, Tabs, Tab, Grid, Card, CardContent } from "@mui/material";

const stations = [
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5+VR (PS V R2)", type: "Play Station", status: "Playing", price: 300, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
  { name: "PS5+VR (PS V R2)", type: "Play Station", status: "Playing", price: 300, bookings: 6 },
  { name: "PS5 Station 2", type: "Play Station", status: "Available", price: 100, bookings: 6 },
];

export default function StationManagement() {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", pt: "50px" }}>
      {/* Main header container */}
      <Box sx={{ backgroundColor: "#0E111B", p: 3, borderRadius: 2, mx: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>Station Management</Typography>
          <Typography variant="body2" color="gray">Monitor and control gaming stations</Typography>
        </Box>

        {/* Tabs inside white bar */}
        <Box sx={{ backgroundColor: "#171c2da1", p: 1, borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="All Stations" />
            <Tab label="PlayStation" />
            <Tab label="Pool" />
            <Tab label="Arcade" />
          </Tabs>
        </Box>

        {/* Card section inside white background */}
        <Box sx={{ backgroundColor: "#0e111b78", p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {stations.map((station, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  backgroundColor: "#171C2D",
                  border: "1px solid #2D3748",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                }}>
                  <CardContent sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Typography variant="subtitle1" fontWeight={600} color="white">
                        {station.name}
                      </Typography>
                      <Box
                        sx={{
                          backgroundColor: station.status === "Available" ? "#065F46" : "#6D28D9",
                          color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 500
                        }}
                      >
                        {station.status}
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 1 }}>
                      {station.type}
                    </Typography>
                    
                    <Box sx={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      borderBottom: "1px solid #2D3748",
                      pb: 1,
                      mb: 1
                    }}>
                      <Typography variant="body2" color="#9CA3AF">30 min</Typography>
                      <Typography variant="body2" color="white">LKR {station.price}</Typography>
                    </Box>
                    
                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 0.5 }}>
                      Location: <span style={{ color: "white" }}>Zone A</span>
                    </Typography>
                    
                    <Typography variant="body2" color="#9CA3AF">
                      No of bookings: <span style={{ color: "white" }}>{station.bookings}</span>
                    </Typography>
                    
                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        backgroundColor: "#9CA3AF",
                        color: "#000",
                        fontWeight: 600,
                        py: 1,
                        "&:hover": { backgroundColor: "#D1D5DB" },
                      }}
                    >
                      Set offline
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
            
        
    
  
  

