import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TextField,
} from "@mui/material";
import OperatorBookingForm from './OperatorBookingForm';
import BookingGrid from './BookingGrid';
import { bookings } from '../assets/assets.js';
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const OperatorBookingManagement = () => {

  const [view, setView] = React.useState("timeline");
  const [date, setDate] = React.useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };

  // Sample stations and bookings
  const stations = [
    { name: "PSS Station 1", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "PSS Station 2", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "PSS Station 1", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "PSS Station 3", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "8 Ball Pool(Suprime)", subname: 'Pool', rate: "$12.5/hr" },
    { name: "8 Ball Pool(Premium)", subname: 'Pool', rate: "$12.5/hr" },
  ];

  const timeSlots = [
    "12:00", "12:30", "01:00", "01:30", "02:00", "02:30",
    "03:00", "03:30", "04:00", "04:30", "05:00", "05:30",
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  ];


  const statusColors = {
    upcoming: "#0CD7FF",
    inprogress: "#9A60E8",
    completed: "#FD00B5",
  };

  return (
    <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0, }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }}
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
            Booking Management
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
            <OperatorBookingForm open={openDialog} handleClose={() => setOpenDialog(false)} />
          </Box>
        </Box>
      </Box>


      {/* Toolbar */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2}>
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
            mb: { xs: 2, sm: 2, md: 0 }
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
            <Typography color="#fff" fontSize={12}>Upcoming</Typography>
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
            <Typography color="#fff" fontSize={12}>Inprogress</Typography>
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
            <Typography color="#fff" fontSize={12}>Completed</Typography>
          </Box>

        </Box>
      </Box>

      {/* Booking Timeline */}
      {view === "timeline" && (
        <Paper sx={{ p: 2, borderRadius: "12px", bgcolor: '#0E111B', height: '100vh' }}>
          <Box sx={{ display: "flex", width: "100%", }}>
            {/* Left Column (Station names) */}
            <Box
              sx={{
                flex: "0 0 200px", // fixed width for station names
                pr: 2,
              }}
            >
              {/* Header */}
              <Typography fontWeight='bold' mb={1} fontSize={14} sx={{ color: 'white' }}>
                Stations
              </Typography>

              {/* Station rows */}
              {stations.map((station, i) => (
                <Box key={i} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.2,
                  width: '100%',
                  maxWidth: 185,
                  height: 50,
                  py: 1,
                  px: 2,
                  bgcolor: '#171E2A',
                  mb: 1,
                  borderRadius: '10px'
                }}>
                  <Typography fontWeight="bold" color='#FFFFFF' fontSize={12}>{station.name}</Typography>
                  <Typography fontWeight={500} color='#9CA3AF' fontSize={12}>{station.subname}</Typography>
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
                {stations.map((station, i) => (
                  <Box key={i} sx={{ display: "flex", mb: 2 }}>
                    {timeSlots.map((slot) => {
                      const booking = bookings.find(
                        (b) => b.station === station.name && b.time === slot
                      );
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
                            border: booking ? `1px solid ${statusColors[booking.status]}` : "1px solid #222", // border color from status
                            bgcolor: booking ? statusColors[booking.status] : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            mr: 1,
                            position: "relative",
                            overflow: "hidden",
                            "&::after": booking
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
                          {booking && (
                            <Typography fontSize={10} fontWeight={400} zIndex={1} color='#FFFFFF'>
                              {booking.user}
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

      {view === "grid" &&
        <BookingGrid />
      }



    </Box>
  )
}

export default OperatorBookingManagement;
