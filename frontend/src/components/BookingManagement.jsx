// BookingManagement.jsx (Updated)
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
import BookingForm from "./BookingForm";
import BookingGrid from "./BookingGrid";
import BookingDialog from "./BookingDialog"; // For Upcoming
import SessionDialog from "./SessionDialog"; // For In Progress
import CompletedBookingDialog from "./CompletedBookingDialog"; // For Completed
import axios from "axios";

const BookingManagement = () => {
  const [view, setView] = React.useState("timeline");
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [apiBookings, setApiBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Separate states for each dialog type
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);
  const [inProgressDialogOpen, setInProgressDialogOpen] = useState(false);
  const [completedDialogOpen, setCompletedDialogOpen] = useState(false);
  const [stations, setStations] = useState([]);

  const fetchStations = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/stations");
      const mappedStations = response.data.map((s) => ({
        ...s,
        displayPrice: s.price ? `$${s.price}/hr` : "$0/hr",
      }));

      setStations(mappedStations);
    } catch (error) {
      console.error("Error fetching stations:", error);
      setStations([]);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Scrollbar styles
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#1F2937",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "linear-gradient(45deg, #0CD7FF, #8A38F5)",
      borderRadius: "10px",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "linear-gradient(45deg, #00E5FF, #9A60E8)",
    },
    "&::-webkit-scrollbar-corner": {
      background: "#1F2937",
    },
    // Firefox support
    scrollbarWidth: "thin",
    scrollbarColor: "#949c9da4 #1F2937",
  };

  // Helper functions
  const normalizeTimeFormat = (timeString) => {
    if (!timeString) return "";

    const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];

      if (hours === 0) {
        return `12:${minutes}`;
      } else if (hours > 12) {
        return `${String(hours - 12).padStart(2, "0")}:${minutes}`;
      } else if (hours < 10) {
        return `${String(hours).padStart(2, "0")}:${minutes}`;
      } else {
        return `${hours}:${minutes}`;
      }
    }

    return timeString;
  };

  const matchStation = (apiName, uiName, stationsList = stations) => {
    if (!apiName || !uiName) return false;

    const clean = (str) =>
      str
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    const uiClean = clean(uiName);

    return stationsList.some((s) => {
      const apiClean = clean(s.name);
      return (
        apiClean === uiClean ||
        apiClean.includes(uiClean) ||
        uiClean.includes(apiClean)
      );
    });
  };
  const formatBookingDate = (bookingDate) => {
    if (!bookingDate) return "";
    return bookingDate.split("T")[0]; // Extract YYYY-MM-DD
  };

  const autoUpdateStatuses = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/auto-update-bookings");
      fetchBookings(); // Refresh bookings after updating
    } catch (error) {
      console.error("Error auto-updating statuses:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => {
      autoUpdateStatuses();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/bookings");

      if (response.data.success) {
        const mapBooking = (b) => {
          const statusMap = {
            pending: "upcoming",
            confirmed: "inprogress",
            cancelled: "completed",
            completed: "completed",
          };

          const normalizedTime = normalizeTimeFormat(
            b.start_time || b.startTime || b.time || ""
          );

          return {
            id: b.id,
            customer_name: b.customer_name || b.customerName || b.user || "",
            station: b.station || "",
            start_time: normalizedTime,
            time: normalizedTime,
            original_start_time: b.start_time || b.startTime || b.time || "",
            booking_date: b.booking_date || b.date || "",
            duration: b.duration || "",
            amount: b.amount ?? b.full_amount ?? b.price ?? 0,
            status: (
              statusMap[b.status] ||
              b.status ||
              "upcoming"
            ).toLowerCase(),
            user: b.customer_name || b.user || "",
            phone: b.phone_number || b.phone || "",
            extended_time: b.extended_time || "",
            players: b.players || [],
            online_deposit: b.online_deposit || 0,
            total_amount: b.total_amount || b.amount || 0,
            balance_amount: b.balance_amount || 0,
            vr_play: b.vr_play || "",
          };
        };
        const normalized = response.data.data.map(mapBooking);

        setApiBookings(normalized);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Use mock data if API fails
      setApiBookings([]);
    } finally {
      setLoading(false);
    }
  };
  console.log("bookings", apiBookings);
  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]);

  const refreshBookings = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };

  const handleBookingSlotClick = (bookingsArray) => {
    if (!bookingsArray || bookingsArray.length === 0) return;

    setSelectedBooking(bookingsArray);

    const status = bookingsArray[0].status;
    switch (status) {
      case "upcoming":
        setUpcomingDialogOpen(true);
        break;
      case "inprogress":
        setInProgressDialogOpen(true);
        break;
      case "completed":
        setCompletedDialogOpen(true);
        break;
      default:
        setUpcomingDialogOpen(true);
    }
  };

  console.log("sel", selectedBooking);

  // Dialog action handlers
  const handleEditBooking = () => {
    console.log("Edit booking:", selectedBooking);
    setUpcomingDialogOpen(false);
    // Implement edit functionality
  };

  const handleCancelBooking = () => {
    console.log("Cancel booking:", selectedBooking);
    setUpcomingDialogOpen(false);
    // Implement cancel functionality
  };

  const handleUpdateTime = () => {
    console.log("Update time for:", selectedBooking);
    // Implement time update functionality
  };

  const handleEndSession = () => {
    console.log("End session for:", selectedBooking);
    setInProgressDialogOpen(false);
    // Implement end session functionality
  };

  const handleCollectPayment = () => {
    console.log("Collect payment for:", selectedBooking);
    setCompletedDialogOpen(false);
    // Implement collect payment functionality
  };

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
        ...scrollbarStyles,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Typography variant="h5" fontWeight="bold" fontSize={24}>
            Booking Management
          </Typography>
          <Typography color="#fff" fontSize={13}>
            Manage bookings and station schedules
          </Typography>
        </Box>

        <Box
          display="flex"
          gap={2}
          mt={{ xs: 2, sm: 2, md: 0 }}
          width={{ xs: "100%", sm: "100%", md: "auto" }}
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
                "&.Mui-selected": { bgcolor: "#00E5FF", color: "#fff" },
                "&.Mui-selected:hover": { bgcolor: "#00d1eb" },
                "&:hover": { bgcolor: "#374151" },
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
            <BookingForm
              open={openDialog}
              handleClose={() => setOpenDialog(false)}
              onBookingCreated={refreshBookings}
              stations={stations}
              bookings={apiBookings}
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
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            style: {
              height: "40px",
              padding: "0 12px",
              color: "#fff",
            },
          }}
          sx={{
            bgcolor: "#1F2937",
            cursor: "pointer",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
            },
            "& .MuiInputBase-input": {
              color: "#fff",
            },
            mb: { xs: 2, sm: 2, md: 0 },
          }}
        />

        <Box display="flex" gap={3}>
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
            overflow: "auto",
            ...scrollbarStyles,
          }}
        >
          <Box sx={{ display: "flex", width: "100%" }}>
            {/* Left Column */}
            <Box sx={{ flex: "0 0 200px", pr: 2 }}>
              <Typography
                fontWeight="bold"
                mb={1}
                fontSize={14}
                sx={{ color: "white" }}
              >
                Stations
              </Typography>
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
                    {station.type}
                  </Typography>
                  <Typography variant="caption" color="#0CD7FF" fontSize={12}>
                    {station.price}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Right Column */}
            <Box
              sx={{
                overflowX: "auto",
                flex: 1,
                ...scrollbarStyles,
              }}
            >
              <Box sx={{ maxWidth: 50, mx: 2 }}>
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
                      }}
                    >
                      <Typography variant="body2" color="#FFFFFF">
                        {slot}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {stations.map((station, i) => (
                  <Box key={i} sx={{ display: "flex", mb: 2 }}>
                    {timeSlots.map((slot) => {
                      const bookingsForSlot = apiBookings.filter(
                        (b) =>
                          b.station === station.name &&
                          b.start_time === slot &&
                          formatBookingDate(b.booking_date) === date
                      );

                      return (
                        <Box
                          key={slot}
                          sx={{
                            minWidth: 56,
                            height: 56,
                            border: bookingsForSlot.length
                              ? `1px solid ${
                                  statusColors[bookingsForSlot[0].status]
                                }`
                              : "1px solid #222",
                            bgcolor: bookingsForSlot.length
                              ? statusColors[bookingsForSlot[0].status]
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            mr: 1,
                            position: "relative",
                            overflow: "hidden",
                            cursor: bookingsForSlot.length
                              ? "pointer"
                              : "default",
                            "&::after": bookingsForSlot.length
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
                            "&:hover": bookingsForSlot.length
                              ? {
                                  transform: "scale(1.05)",
                                  transition: "transform 0.2s",
                                  boxShadow: `0 0 8px ${
                                    statusColors[bookingsForSlot[0].status]
                                  }`,
                                }
                              : {},
                          }}
                          onClick={() =>
                            bookingsForSlot.length &&
                            handleBookingSlotClick(bookingsForSlot)
                          }
                        >
                          {bookingsForSlot.length > 0 && (
                            <Typography
                              fontSize={10}
                              fontWeight={400}
                              zIndex={1}
                              color="#FFFFFF"
                            >
                              {bookingsForSlot
                                .map((b) => b.customer_name)
                                .join(", ")}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {view === "grid" && (
        <Box sx={scrollbarStyles}>
          <BookingGrid
            apiBookings={apiBookings}
            loading={loading}
            onBookingUpdated={refreshBookings}
          />
        </Box>
      )}

      {loading && (
        <Box position="fixed" bottom={20} right={20} zIndex={9999}>
          <CircularProgress size={30} sx={{ color: "#0CD7FF" }} />
        </Box>
      )}

      {/* All Three Dialogs */}
      <BookingDialog
        open={upcomingDialogOpen}
        onClose={() => setUpcomingDialogOpen(false)}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
        bookings={selectedBooking}
      />

      <SessionDialog
        open={inProgressDialogOpen}
        onClose={() => setInProgressDialogOpen(false)}
        onEndSession={handleEndSession}
        bookings={selectedBooking}
      />

      <CompletedBookingDialog
        open={completedDialogOpen}
        onClose={() => setCompletedDialogOpen(false)}
        onCollectPayment={handleCollectPayment}
        bookings={selectedBooking}
      />
    </Box>
  );
};

export default BookingManagement;
