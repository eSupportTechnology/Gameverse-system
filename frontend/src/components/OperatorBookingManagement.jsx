import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import OperatorBookingForm from "./OperatorBookingForm";
import OperatorBookingGrid from "./OperatorBookingGrid";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";
//import { bookings as dummyBookings } from "../assets/assets.js";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const OperatorBookingManagement = () => {
  const [view, setView] = React.useState("timeline");
  const [date, setDate] = React.useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [apiBookings, setApiBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Helper function to normalize time formats for matching
  const normalizeTimeFormat = (timeString) => {
    if (!timeString) return "";

    // If it's already in HH:MM format, convert to 12-hour format for matching
    const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];

      // Convert 24-hour to 12-hour format to match timeSlots
      if (hours === 0) {
        return `12:${minutes}`;
      } else if (hours > 12) {
        return `${String(hours - 12).padStart(2, "0")}:${minutes}`;
      } else if (hours < 10) {
        // Pad single digit hours with zero to match timeSlots format
        return `${String(hours).padStart(2, "0")}:${minutes}`;
      } else {
        return `${hours}:${minutes}`;
      }
    }

    return timeString;
  };

  // Helper function to match station names
  const matchStation = (apiStation, uiStationName) => {
    if (!apiStation || !uiStationName) return false;

    const normalizedApi = apiStation.toLowerCase().trim();
    const normalizedUI = uiStationName.toLowerCase().trim();

    // Direct match
    if (normalizedApi === normalizedUI) return true;

    // Handle station1, station2 format from API
    if (normalizedApi === "station1" && normalizedUI.includes("station 1"))
      return true;
    if (normalizedApi === "station2" && normalizedUI.includes("station 2"))
      return true;
    if (normalizedApi === "station3" && normalizedUI.includes("station 3"))
      return true;

    // Handle PSS Station format
    if (
      normalizedApi.includes("station 1") &&
      normalizedUI.includes("station 1")
    )
      return true;
    if (
      normalizedApi.includes("station 2") &&
      normalizedUI.includes("station 2")
    )
      return true;
    if (
      normalizedApi.includes("station 3") &&
      normalizedUI.includes("station 3")
    )
      return true;

    // Handle pool stations
    if (normalizedApi.includes("pool") && normalizedUI.includes("pool"))
      return true;

    return false;
  };

  // Function to Fetch bookings from backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/operator-bookings`
      );

      if (response.data.success) {
        console.log("API bookings fetched:", response.data.data);
        console.log("Sample booking for debugging:", response.data.data[0]);
        // Map API bookings to the frontend's expected shape
        const mapBooking = (b) => {
          // Normalize status mapping between backend and frontend
          const statusMap = {
            pending: "upcoming",
            confirmed: "inprogress",
            cancelled: "completed", // choose an appropriate fallback
            completed: "completed",
          };

          const normalizedTime = normalizeTimeFormat(
            b.start_time || b.startTime || b.time || ""
          );
          console.log(
            `Mapping booking: original time=${b.start_time}, normalized=${normalizedTime}, station=${b.station}`
          );

          return {
            id: b.id,
            // frontend uses `customer_name` in many places
            customer_name: b.customer_name || b.customerName || b.user || "",
            // booking grid expects `station` string like 'station1' or human readable names
            station: b.station || "",
            // timeline and grid use `start_time` / `time` - use normalized time for timeline matching
            start_time: normalizedTime,
            time: normalizedTime,
            // keep original time for display purposes
            original_start_time: b.start_time || b.startTime || b.time || "",
            // include booking date
            booking_date: b.booking_date || b.date || "",
            duration: b.duration || "",
            amount: b.amount ?? b.full_amount ?? b.price ?? 0,
            // normalize status
            status: (
              statusMap[b.status] ||
              b.status ||
              "upcoming"
            ).toLowerCase(),
            // include other optional fields used by sampleBookings
            user: b.customer_name || b.user || "",
            phone: b.phone_number || b.phone || "",
            // include extended_time for editing
            extended_time: b.extended_time || "",
          };
        };

        const normalized = response.data.data.map(mapBooking);
        setApiBookings(normalized);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]);

  // Function to trigger refresh (to be passed to BookingForm)
  const refreshBookings = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };

  // Sample stations and bookings
  const stations = [
    { name: "PSS Station 1", subname: "PSS Station 1", rate: "$12.5/hr" },
    { name: "PSS Station 2", subname: "PSS Station 1", rate: "$12.5/hr" },
    { name: "PSS Station 1", subname: "PSS Station 1", rate: "$12.5/hr" },
    { name: "PSS Station 3", subname: "PSS Station 1", rate: "$12.5/hr" },
    { name: "8 Ball Pool(Suprime)", subname: "Pool", rate: "$12.5/hr" },
    { name: "8 Ball Pool(Premium)", subname: "Pool", rate: "$12.5/hr" },
  ];

  const timeSlots = [
    "12:00",
    "12:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
  ];

  const statusColors = {
    upcoming: "#0CD7FF",
    inprogress: "#9A60E8",
    completed: "#FD00B5",
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "1E1E1E",
        color: "#fff",
        minHeight: "100vh",
        overflowX: "hidden",
        ml: 0,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{
          xs: "flex-start",
          sm: "flex-start",
          md: "space-between",
        }}
        alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
        mb={2}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="h5" fontWeight="bold" fontSize={24}>
            Operator Booking Management
          </Typography>
          <Typography variant="body2" color="gray" fontSize={16}>
            Manage reservations and station schedules
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          display="flex"
          gap={2}
          mt={{ xs: 2, sm: 2, md: 0 }} // spacing when stacked
          width={{ xs: "100%", sm: "100%", md: "auto" }} // take full width in small screens
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            sx={{
              borderRadius: "12px",
              "& .MuiToggleButton-root": {
                bgcolor: "#1F2937",
                color: "#8CA3AF",
                border: "none",
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: "500",
                fontSize: 16,
                "&.Mui-selected": {
                  bgcolor: "#00E5FF",
                  color: "#fff",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#00d1eb",
                },
                "&:hover": {
                  bgcolor: "#374151",
                },
              },
            }}
          >
            <ToggleButton sx={{ px: 2, py: 1 }} value="timeline">
              Timeline
            </ToggleButton>
            <ToggleButton sx={{ px: 2, py: 1 }} value="grid">
              Grid
            </ToggleButton>
          </ToggleButtonGroup>

          <Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                borderRadius: "6px",
                px: 6,
                py: 1,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": {
                  background: "linear-gradient(to right, #0bbfe0, #732ed1)",
                },
              }}
              onClick={() => setOpenDialog(true)}
            >
              + New Booking
            </Button>
            <OperatorBookingForm
              open={openDialog}
              handleClose={() => setOpenDialog(false)}
              onBookingCreated={refreshBookings}
            />
          </Box>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{
          xs: "flex-start",
          sm: "flex-start",
          md: "space-between",
        }}
        px={1.5}
        py={1.5}
        borderRadius="10px"
        bgcolor="#0E111B"
        alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
        mb={2}
      >
        {/* <DatePicker
          label="Select Date"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          sx={{
            input: { color: "#fff" },
            "& .MuiInputBase-input": { color: "#fff" },
          }}
        /> */}

        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ style: { height: "40px", padding: "0 12px" } }}
          sx={{
            bgcolor: "#1F2937",
            cursor: "pointer",
            input: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
            },
            mb: { xs: 2, sm: 2, md: 0 },
          }}
        />

        <Box display="flex" gap={3}>
          {/* Upcoming */}
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: statusColors.upcoming,
              }}
            />
            <Typography color="#fff" fontSize={12}>
              Upcoming
            </Typography>
          </Box>

          {/* Inprogress */}
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: statusColors.inprogress,
              }}
            />
            <Typography color="#fff" fontSize={12}>
              Inprogress
            </Typography>
          </Box>

          {/* Completed */}
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: statusColors.completed,
              }}
            />
            <Typography color="#fff" fontSize={12}>
              Completed
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Booking Timeline */}
      {view === "timeline" && (
        <Paper
          sx={{
            p: 2,
            borderRadius: "12px",
            bgcolor: "#0E111B",
            height: "100vh",
          }}
        >
          <Box sx={{ display: "flex", width: "100%" }}>
            {/* Left Column (Station names) */}
            <Box
              sx={{
                flex: "0 0 200px", // fixed width for station names
                pr: 2,
              }}
            >
              {/* Header */}
              <Typography
                fontWeight="bold"
                mb={1}
                fontSize={14}
                sx={{ color: "white" }}
              >
                Stations
              </Typography>

              {/* Station rows */}
              {stations.map((station, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.2,
                    width: "100%",
                    maxWidth: 185,
                    height: 50,
                    py: 1,
                    px: 2,
                    bgcolor: "#171E2A",
                    mb: 1,
                    borderRadius: "10px",
                  }}
                >
                  <Typography fontWeight="bold" color="#FFFFFF" fontSize={12}>
                    {station.name}
                  </Typography>
                  <Typography fontWeight={500} color="#9CA3AF" fontSize={12}>
                    {station.subname}
                  </Typography>
                  <Typography variant="caption" color="#0CD7FF" fontSize={12}>
                    {station.rate}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Right Column (Scrollable Time Slots and Bookings) */}
            <Box
              sx={{
                overflowX: "auto",
                flex: 1,
                // Scrollbar styling
                "&::-webkit-scrollbar": {
                  height: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#9CA3AF",
                  borderRadius: "4px",
                },
                // scrollbarColor: "#171E2A ", // for Firefox
                // scrollbarWidth: "thin", // for Firefox
              }}
            >
              <Box sx={{ maxWidth: 50, mx: 2 }}>
                {/* Header Row */}
                <Box sx={{ display: "flex", mb: 2 }}>
                  {timeSlots.map((slot) => (
                    <Box
                      key={slot}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 56,
                        textAlign: "center",
                        mr: 1,
                        border: "1px solid #0E111B",
                      }}
                    >
                      <Typography variant="body2" color="#FFFFFF">
                        {slot}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Booking Rows */}
                {stations.map((station, i) => {
                  console.log(`Rendering station ${i}: ${station.name}`);
                  return (
                    <Box key={i} sx={{ display: "flex", mb: 2 }}>
                      {timeSlots.map((slot) => {
                        // First look for a booking in the API data using improved matching
                        const apiBooking = apiBookings.find((b) => {
                          const stationMatch = matchStation(
                            b.station,
                            station.name
                          );
                          const timeMatch =
                            normalizeTimeFormat(b.start_time) ===
                            normalizeTimeFormat(slot);

                          console.log(
                            `Checking booking ${b.id}: station="${b.station}" vs "${station.name}" (match: ${stationMatch}), time="${b.start_time}" vs "${slot}"  (normalized match: ${timeMatch})`
                          );

                          if (stationMatch && timeMatch) {
                            console.log(
                              `Found match: API booking ${b.id} matches slot ${slot} and station ${station.name}`
                            );
                          }
                          return stationMatch && timeMatch;
                        });

                        return (
                          // <Box
                          //   key={slot}
                          //   sx={{
                          //     minWidth: 56,
                          //     height: 56,
                          //     border: "1px solid #222",
                          //     bgcolor: booking ? statusColors[booking.status] : "transparent",
                          //     display: "flex",
                          //     alignItems: "center",
                          //     justifyContent: "center",
                          //     borderRadius: "8px",
                          //     mr: 1,
                          //   }}
                          // >
                          //   {booking && (
                          //     <Typography fontSize="0.75rem" fontWeight="bold">
                          //       {booking.user}
                          //     </Typography>
                          //   )}
                          // </Box>
                          <Box
                            key={slot}
                            sx={{
                              minWidth: 56,
                              height: 56,
                              border: apiBooking
                                ? `1px solid ${statusColors[apiBooking.status]}`
                                : "1px solid #222", // border color from status
                              bgcolor: apiBooking
                                ? statusColors[apiBooking.status]
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                              mr: 1,
                              position: "relative",
                              overflow: "hidden",
                              "&::after": apiBooking
                                ? {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    bgcolor: "rgba(0,0,0,0.8)",
                                    borderRadius: "8px",
                                  }
                                : {},
                            }}
                          >
                            {apiBooking && (
                              <Typography
                                fontSize={10}
                                fontWeight={400}
                                zIndex={1}
                                color="#FFFFFF"
                              >
                                {apiBooking.customer_name || apiBooking.user}
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {view === "grid" && (
        <OperatorBookingGrid
          apiBookings={apiBookings}
          loading={loading}
          onBookingUpdated={refreshBookings}
        />
      )}

      {/* Loading indicator for API data */}
      {loading && (
        <Box position="fixed" bottom={20} right={20} zIndex={9999}>
          <CircularProgress size={30} sx={{ color: "#0CD7FF" }} />
        </Box>
      )}
    </Box>
  );
};

export default OperatorBookingManagement;
