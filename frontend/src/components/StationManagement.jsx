import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddStationDialog from "./AddStationDialog";

export default function StationManagement() {
  const [tab, setTab] = useState(0);
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    price: "",
    status: "Available",
    bookings: 0,
    time: "",
  });

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleOpen = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      type: "",
      location: "",
      price: "",
      status: "Available",
      bookings: 0,
      time: "",
    });
    setOpen(true);
  };

  const handleEdit = (station, index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData(station);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCreateOrUpdate = () => {
    if (isEditing) {
      setStations((prev) =>
        prev.map((s, idx) => (idx === editIndex ? formData : s))
      );
    } else {
      setStations((prev) => [...prev, formData]);
    }
    setFormData({
      name: "",
      type: "",
      location: "",
      price: "",
      status: "Available",
      bookings: 0,
      time: "",
    });
    setOpen(false);
  };

  const filteredStations =
    tab === 0
      ? stations
      : stations.filter(
          (s) => s.type === ["PlayStation", "Pool", "Simulator"][tab - 1]
        );

  return (
    <Box
      sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", pt: "70px" }}
    >
      {/* Header */}
      <Box sx={{ backgroundColor: "#0E111B", p: 3, borderRadius: 2 }}>
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
            {["All Stations", "PlayStation", "Pool", "Simulator"].map(
              (label, index) => (
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
              )
            )}
          </Tabs>
        </Box>

        {/* Stations List */}
        <Box sx={{ backgroundColor: "#0e111b78", p: 3, borderRadius: 2 }}>
          <Grid container spacing={3} justifyContent="flex-start">
            {filteredStations.map((station, idx) => (
              <Grid key={idx} item xs={12} sm={6} md={6} lg={4}>
                <Card
                  sx={{
                    p: 3, // more padding inside card
                    borderRadius: 2,
                    minWidth: 280, // ensures card never gets too small
                    backgroundColor: "#171C2D",
                    border: "1px solid #2D3748",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    {/* Top row: dot + status left, pencil right */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {/* Round status dot */}
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor:
                              station.status === "Available"
                                ? "#22C55E"
                                : "#F59E0B",
                          }}
                        />
                        {/* Status pill */}
                        <Box
                          sx={{
                            backgroundColor:
                              station.status === "Available"
                                ? "#065F46"
                                : "#92400E",
                            px: 2,
                            py: 0.5,
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: "white",
                          }}
                        >
                          {station.status}
                        </Box>
                      </Box>

                      {/* Pencil Icon */}
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(station, idx)}
                        sx={{
                          color: "#9CA3AF",
                          "&:hover": { color: "#fff" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Station Name */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="white"
                      sx={{ mb: 0.5 }}
                    >
                      {station.name}
                    </Typography>

                    {/* Station Type */}
                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 1 }}>
                      {station.type}
                    </Typography>

                    {/* Time + Price */}
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
                        {station.time || "30 min"}
                      </Typography>
                      <Typography variant="body2" color="white">
                        LKR {station.price}
                      </Typography>
                    </Box>

                    {/* Location + Bookings */}
                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 0.5 }}>
                      Location: <span style={{ color: "white" }}>{station.location}</span>
                    </Typography>

                    <Typography variant="body2" color="#9CA3AF">
                      No of bookings: <span style={{ color: "white" }}>{station.bookings}</span>
                    </Typography>

                    {/* Set Offline Button */}
                    <Button
                      fullWidth
                      sx={{
                        mt: 2,
                        backgroundColor: "#c51a1f41",
                        color: "#fff",
                        border: "1px solid #c51a1f",
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

      {/* Dialog */}
      <AddStationDialog
        open={open}
        onClose={handleClose}
        onCreate={handleCreateOrUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </Box>
  );
}