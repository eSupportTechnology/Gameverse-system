import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import AddStationDialog from "./AddStationDialog";
import CreateSuccessDialog from "./CreateSuccessDialog";
import UpdateSuccessDialog from "./UpdateSuccess";
import StationsGrid from "./StationsGrid";
import { dummyStations } from "../assets/assets";
import { toast } from "react-toastify";

export default function StationManagement() {
  const [tab, setTab] = useState(0);
  const [stations, setStations] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStation, setEditStation] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    price: "",
    time: "",
  });

  const [createSuccessOpen, setCreateSuccessOpen] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);

  // Initialize stations with dummy data on mount
  useEffect(() => {
    setStations(dummyStations);
  }, []);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleOpenAddDialog = () => {
    setIsEditing(false);
    setEditStation(null);
    setFormData({
      name: "",
      type: "",
      location: "",
      price: "",
      time: "",
    });
    setOpen(true);
  };

  const handleEditStation = (station) => {
    setIsEditing(true);
    setEditStation(station);
    
    // Convert minutes back to HH:MM format for editing
    const timeInHHMM = station.time 
      ? `${Math.floor(station.time / 60).toString().padStart(2, '0')}:${(station.time % 60).toString().padStart(2, '0')}`
      : "";
    
    setFormData({
      ...station,
      time: timeInHHMM
    });
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

  const handleDeleteStation = (stationId) => {
    setStations((prev) => prev.filter((s) => s.id !== stationId));
    toast.success("Station deleted successfully!");
  };

  const handleToggleStatus = (stationId) => {
    setStations((prev) => 
      prev.map((station) => {
        if (station.id === stationId) {
          const newStatus = station.status === "Available" ? "Offline" : "Available";
          return { ...station, status: newStatus };
        }
        return station;
      })
    );
    toast.success("Station status updated!");
  };

  // Receives station data after successful create/update from AddStationDialog
  const handleStationCreatedOrUpdated = (station, updated) => {
    if (updated) {
      if (isEditing && editStation) {
        // Update existing station
        setStations((prev) =>
          prev.map((s) => (s.id === editStation.id ? { ...station, id: editStation.id } : s))
        );
        setUpdateSuccessOpen(true);
      } else {
        // Add new station with unique ID
        const newStation = {
          ...station,
          id: Date.now(), // Simple ID generation for frontend-only
          status: "Available",
          bookings: 0
        };
        setStations((prev) => [...prev, newStation]);
        setCreateSuccessOpen(true);
      }
    }
    setOpen(false);
    setEditStation(null);
    setIsEditing(false);
  };

  // Format minutes → HH:MM style text
  const formatTime = (minutes) => {
    if (!minutes) return "0 min";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  // Filter stations based on selected tab
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
      {/* Header & Tabs */}
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
            onClick={handleOpenAddDialog}
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

        {/* Stations Grid */}
        <StationsGrid 
          stations={filteredStations}
          onEditStation={handleEditStation}
          onToggleStatus={handleToggleStatus}
        />
      </Box>

      {/* Add/Edit Station Dialog */}
      <AddStationDialog
        open={open}
        onClose={handleCloseDialog}
        onCreate={handleStationCreatedOrUpdated}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />

      {/* Success Dialogs */}
      <CreateSuccessDialog
        open={createSuccessOpen}
        onClose={() => setCreateSuccessOpen(false)}
      />
      <UpdateSuccessDialog
        open={updateSuccessOpen}
        onClose={() => setUpdateSuccessOpen(false)}
      />
    </Box>
  );
}
