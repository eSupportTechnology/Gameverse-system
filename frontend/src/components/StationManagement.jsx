import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddStationDialog from "./AddStationDialog";

export default function StationManagement() {
  const [tab, setTab] = useState(0);
  const [stations, setStations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    price: "",
    time: "",
    status: "Available",
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/stations");
      setStations(res.data);
    } catch (err) {
      console.error("Failed to fetch stations", err);
    }
  };

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
      status: "Available",
    });
    setOpen(true);
  };

  const handleEditStation = (station) => {
    setIsEditing(true);
    setEditStation(station);
    const convertMinutesToTime = (minutes) => {
      if (!minutes) return "";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    };
    setFormData({
      ...station,
      time: convertMinutesToTime(station.time),
    });
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

  const handleStationCreatedOrUpdated = (station, updated) => {
    if (updated) {
      setStations((prev) => prev.map((s) => (s.id === station.id ? station : s)));
    } else {
      setStations((prev) => [...prev, station]);
    }
    setOpen(false);
    setEditStation(null);
    setIsEditing(false);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    handleMenuClose();
  };

  const formatTime = (minutes) => {
    if (!minutes) return "0 min";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  const filteredStations = stations.filter((s) => {
    const typeMatch =
      tab === 0
        ? true
        : s.type === ["PS5 Station", "Pool Table", "Racing Simulator"][tab - 1];
    const statusMatch =
      statusFilter === "All" ? true : s.status === statusFilter;
    return typeMatch && statusMatch;
  });

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff", pt: "70px" }}>
      <Box sx={{ backgroundColor: "#0E111B", p: 3, borderRadius: 2 }}>
        {/* Header Row */}
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

        {/* Tabs + Status Filter Row */}
        <Box
          sx={{
            backgroundColor: "#171c2da1",
            p: 1.2,
            borderRadius: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tabs
            value={tab}
            onChange={handleTabChange}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            {["All Stations", "PS5 Stations", "Pool Tables", "Racing Simulators"].map(
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

          {/* Right side filter dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#00FF7F" }} />
              <Typography variant="body2">Available</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#B26DFF" }} />
              <Typography variant="body2">Playing</Typography>
            </Box>

            <Button
              onClick={handleMenuOpen}
              endIcon={<FilterListIcon />}
              sx={{
                backgroundColor: "#1F2937",
                color: "#fff",
                px: 2,
                py: 0.6,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#2D3748" },
              }}
            >
              {statusFilter}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  color: "#fff",
                  mt: 1,
                  borderRadius: "8px",
                },
              }}
            >
              {["All", "Available", "Playing"].map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleStatusChange(option)}
                  sx={{
                    color: "#fff",
                    "&:hover": { backgroundColor: "#374151" },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        {/* Stations Grid */}
        <Box sx={{ backgroundColor: "#0e111b78", p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {filteredStations.map((station) => (
              <Grid key={station.id} item xs={12} sm={6} md={6} lg={4}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#171C2D",
                    border: "1px solid #2D3748",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor:
                              station.status === "Available"
                                ? "#00FF7F"
                                : "#B26DFF",
                          }}
                        />
                        <Box
                          sx={{
                            backgroundColor:
                              station.status === "Available"
                                ? "#065f46"
                                : "#5b2d82",
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

                      <IconButton
                        size="small"
                        onClick={() => handleEditStation(station)}
                        sx={{ color: "#9CA3AF", "&:hover": { color: "#fff" } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="subtitle1" fontWeight={600} color="white" sx={{ mb: 0.5 }}>
                      {station.name}
                    </Typography>
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
                        {formatTime(station.time)}
                      </Typography>
                      <Typography variant="body2" color="white">
                        LKR {station.price}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="#9CA3AF">
                      Location: <span style={{ color: "white" }}>{station.location}</span>
                    </Typography>
                    <Typography variant="body2" color="#9CA3AF" sx={{ mb: 1 }}>
                      No of bookings:{" "}
                      <span style={{ color: "white" }}>{station.bookings || 0}</span>
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#7f1d1d",
                        color: "#fff",
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#991b1b" },
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

      {/* Add/Edit Dialog */}
      <AddStationDialog
        open={open}
        onClose={handleCloseDialog}
        onCreate={handleStationCreatedOrUpdated}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </Box>
  );
}