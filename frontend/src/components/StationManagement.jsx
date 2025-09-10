import React, { useState } from "react";
import { Box, Typography, Button, Tabs, Tab, Grid, Card, CardContent } from "@mui/material";
import AddStationDialog from "./AddStationDialog"; // New dialog component

export default function StationManagement() {
  const [tab, setTab] = useState(0);
  const [stations, setStations] = useState([]); // initially no stations
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    price: "",
    status: "Available",
    bookings: 0,
  });

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreate = () => {
    setStations((prev) => [...prev, formData]);
    setFormData({
      name: "",
      type: "",
      location: "",
      price: "",
      status: "Available",
      bookings: 0,
    });
    setOpen(false);
  };

  const filteredStations =
    tab === 0
      ? stations
      : stations.filter((s) => s.type === ["PlayStation", "Pool", "Simulator"][tab - 1]);

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "500vh", color: "#fff", pt: "70px" }}>
      {/* Header container */}
      <Box sx={{ backgroundColor: "#0E111B", p: 3, borderRadius: 2, mx: 0 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Station Management
            </Typography>
            <Typography variant="body2" color="gray">
              Monitor and control gaming stations
            </Typography>
          </Box>
          <Button
            onClick={handleOpen}
            sx={{
              background: "linear-gradient(90deg, #33B2F7, #CF36E1)",
              color: "#fff",
              px: 3,
              py: 1,
              borderRadius: "8px",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": { opacity: 0.9 },
            }}
          >
            + Add Station
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ backgroundColor: "#171c2da1", p: 1, borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            {["All Stations", "PlayStation", "Pool", "Simulator"].map((label, index) => (
              <Tab
                key={label}
                label={label}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  minWidth: "120px",
                  textTransform: "none",
                  color: tab === index ? "#fff" : "gray",
                  background: tab === index ? "#1aa6bc58" : "#1F2937",
                  "&:hover": { opacity: 0.9 },
                }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Stations List */}
        <Box sx={{ backgroundColor: "#0e111b78", p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {filteredStations.map((station, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#171C2D",
                    border: "1px solid #2D3748",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
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
                          fontWeight: 500,
                        }}
                      >
                        {station.status}
                      </Box>
                    </Box>

                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 1 }}>
                      {station.type}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #2D3748",
                        pb: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="#9CA3AF">
                        30 min
                      </Typography>
                      <Typography variant="body2" color="white">
                        LKR {station.price}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 0.5 }}>
                      Location: <span style={{ color: "white" }}>{station.location}</span>
                    </Typography>

                    <Typography variant="body2" color="#9CA3AF">
                      No of bookings: <span style={{ color: "white" }}>{station.bookings}</span>
                    </Typography>

                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        backgroundColor: "#963034",
                        color: "#fff",
                        fontWeight: 600,
                        py: 1,
                        "&:hover": { backgroundColor: "#b91c1c" },
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

      {/* Add Station Dialog Component */}
      <AddStationDialog
        open={open}
        onClose={handleClose}
        onCreate={handleCreate}
        formData={formData}
        setFormData={setFormData}
      />
    </Box>
  );
}
