import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, Chip } from "@mui/material";
import { sampleBookings } from '../assets/assets.js';
import BookingDetails from './BookingDetails.jsx';

// status colors mapping
const statusColors = {
  upcoming: "#0CD7FF",
  inprogress: "#9A60E8",
  completed: "#FD00B5",
};

const BookingGrid = ({ apiBookings = [], loading = false, onBookingUpdated }) => {
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Log API bookings for development purposes
  useEffect(() => {
    if (apiBookings.length > 0) {
      console.log('API bookings in grid component:', apiBookings);
    }
  }, [apiBookings]);

  const handleOpen = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };
  return (
    <div style={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px", }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 2,
          p: 2,
          alignItems: "stretch",
        }}
      >
        {/* First display API bookings */}
        {apiBookings.map((booking, i) => {
          const statusColor = statusColors[booking.status.toLowerCase()] || "#9CA3AF";
          return (
            <Card
              key={`api-${booking.id}`}
              sx={{
                bgcolor: "#171C2D",
                borderRadius: "12px",
                pb: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                height: 238,
                border: "2px solid #0CD7FF" // Highlight API bookings
              }}
            >
              <CardContent>
                {/* Status Badge */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: statusColor,
                    }}
                  />
                  <Chip
                    label={booking.status}
                    size="small"
                    sx={{
                      bgcolor: statusColor,
                      color: '#FFFFFF',
                      fontWeight: "bold",
                      px: 2
                    }}
                  />
                </Box>

                {/* User + Details */}
                <Typography
                  variant="h6"
                  fontSize={16}
                  fontWeight={500}
                  color="#fff"
                  mb={0.5}
                >
                  {booking.customer_name}
                </Typography>
                <Typography color="#9CA3AF" fontSize={12} mb={0.5}>
                  {booking.station}
                </Typography>
                <Typography color="#FFFFFF" fontSize={12} mb={1}>
                  Gaming Session
                </Typography>

                {/* Time */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={12} color="#fff">
                    Time:
                  </Typography>
                  <Typography fontSize={12} fontWeight={500} color="#fff">
                    {booking.original_start_time || booking.start_time}
                  </Typography>
                </Box>

                {/* Duration */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={12} color="#FFFFFF">
                    Duration:
                  </Typography>
                  <Typography fontSize={12} color="#0CD7FF">
                    {booking.duration}
                  </Typography>
                </Box>

                {/* Price */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={12} color="#FFFFFF">
                    Price:
                  </Typography>
                  <Typography fontSize={12} color="#0CD7FF">
                    LKR {booking.amount}
                  </Typography>
                </Box>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#374151",
                    color: "#fff",
                    borderRadius: "8px",
                    py: 0.2,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1F2937" },
                  }}
                  onClick={() => handleOpen(booking)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Then display sample bookings */}
        {sampleBookings.map((booking, i) => {
          const statusColor = statusColors[booking.status.toLowerCase()] || "#9CA3AF";
          return (
            <Card
              key={`sample-${i}`}
              sx={{
                bgcolor: "#171C2D",
                borderRadius: "12px",
                pb: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                height: 238,
                opacity: 0.7 // Make sample bookings slightly transparent
              }}
            >
              <CardContent>
                {/* Status Badge */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: statusColor,
                    }}
                  />
                  <Chip
                    label={booking.status}
                    size="small"
                    sx={{
                      bgcolor: statusColor,
                      color: '#FFFFFF',
                      fontWeight: "bold",
                      px: 2
                    }}
                  />
                </Box>

                {/* User + Details */}
                <Typography
                  variant="h6"
                  fontSize={16}
                  fontWeight={500}
                  color="#fff"
                  mb={0.5}
                >
                  {booking.user}
                </Typography>
                <Typography color="#9CA3AF" fontSize={12} mb={0.5}>
                  {booking.station}
                </Typography>
                <Typography color="#FFFFFF" fontSize={12} mb={1}>
                  {booking.game}
                </Typography>

                {/* Time */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={12} color="#fff">
                    Time:
                  </Typography>
                  <Typography fontSize={12} fontWeight={500} color="#fff">
                    {booking.time}
                  </Typography>
                </Box>

                {/* Price */}
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontSize={12} color="#FFFFFF">
                    Price:
                  </Typography>
                  <Typography fontSize={12} color="#0CD7FF">
                    LKR {booking.price}
                  </Typography>
                </Box>

                {/* Loyalty Price */}
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography fontSize={12} color="#FFFFFF">
                    Loyalty Price:
                  </Typography>
                  <Typography fontSize={12} color="#8A38F5">
                    {booking.loyaltyPrice}
                  </Typography>
                </Box>


                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: "#374151",
                    color: "#fff",
                    borderRadius: "8px",
                    py: 0.2,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#1F2937" },
                  }}
                  onClick={() => handleOpen(booking)}
                >
                  View
                </Button>
              </CardContent>
              

            </Card>

          );
        })}

      </Box>

      {/* BookingDetails dialog - moved outside loops to handle both API and sample bookings */}
      <BookingDetails
        open={open}
        handleClose={handleClose}
        booking={selectedBooking}
        onBookingUpdated={onBookingUpdated}
      />

    </div>
  )
}

export default BookingGrid
 