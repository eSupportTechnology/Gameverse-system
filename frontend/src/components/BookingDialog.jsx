// components/BookingDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

// Import CancelPopup
import CancelPopup from "../components/CancelPopup";

// Mock players data with separate booking data - ALL UPCOMING
const mockPlayers = [
  {
    id: 1,
    name: "Player 01",
    online: true,
    booking: {
      id: "123456",
      customer_name: "Nithin Kumar",
      phone: "+94 725656963",
      station: "PS5 Station 1",
      start_time: "12:00",
      duration: "2h 0m",
      extended_time: "00.00",
      online_deposit: "000",
      total_amount: "400",
      balance_amount: "000",
      loyalty_points: 150,
      status: "upcoming"
    },
  },
  {
    id: 2,
    name: "Player 02",
    online: false,
    booking: {
      id: "789012",
      customer_name: "Aravind Silva",
      phone: "+94 714589632",
      station: "PS5 Station 2",
      start_time: "14:00",
      duration: "1h 30m",
      extended_time: "00.15",
      online_deposit: "200",
      total_amount: "500",
      balance_amount: "300",
      loyalty_points: 120,
      status: "upcoming"
    },
  },
  {
    id: 3,
    name: "Player 03",
    online: true,
    booking: {
      id: "345678",
      customer_name: "Ravindu Perera",
      phone: "+94 765432198",
      station: "PS5 Station 3",
      start_time: "16:30",
      duration: "2h 0m",
      extended_time: "00.10",
      online_deposit: "100",
      total_amount: "400",
      balance_amount: "100",
      loyalty_points: 180,
      status: "upcoming"
    },
  },
  {
    id: 4,
    name: "Player 04",
    online: false,
    booking: {
      id: "901234",
      customer_name: "Sahan Wijesinghe",
      phone: "+94 778956321",
      station: "PS5 Station 4",
      start_time: "18:00",
      duration: "2h 30m",
      extended_time: "00.20",
      online_deposit: "300",
      total_amount: "700",
      balance_amount: "400",
      loyalty_points: 200,
      status: "upcoming"
    },
  },
];

// Helper function to calculate end time
const calculateEndTime = (startTime, duration) => {
  if (!startTime || !duration) return "N/A";

  try {
    const [hours, minutes] = startTime.split(":").map(Number);
    const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);

    if (durationMatch) {
      const durationHours = parseInt(durationMatch[1]);
      const durationMinutes = parseInt(durationMatch[2]);

      let endHours = hours + durationHours;
      let endMinutes = minutes + durationMinutes;

      if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
      }

      return `${String(endHours).padStart(2, "0")}:${String(
        endMinutes
      ).padStart(2, "0")}`;
    }

    return duration;
  } catch (error) {
    return "12:30";
  }
};

const BookingDialog = ({ open, onClose, onEdit }) => {
  const [activePlayer, setActivePlayer] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const player = mockPlayers[activePlayer];
  const booking = player.booking;

  // Status colors - Only upcoming needed
  const statusColors = {
    upcoming: "#0CD7FF",
  };

  const statusText = {
    upcoming: "Upcoming"
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(booking);
    }
    console.log("Editing booking:", booking);
  };

  const handleCancelClick = () => {
    setCancelOpen(true);
  };

  const handleCancelConfirm = () => {
    console.log("Canceling booking:", booking);
    setCancelOpen(false);
    onClose();
  };

  const handleCancelClose = () => {
    setCancelOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#111827",
            color: "#fff",
            borderRadius: "12px",
            border: "1px solid #333",
          },
        }}
      >
        {/* Header with Close Icon */}
        <Box sx={{ p: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: "1.25rem" }}
          >
            Booking Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#9CA3AF",
              "&:hover": {
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pt: 0 }}>
            {/* Player Tabs - Fixed with corner online indicators */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              {mockPlayers.map((p, i) => (
                <Box
                  key={p.id}
                  onClick={() => setActivePlayer(i)}
                  sx={{
                    flex: 1,
                    cursor: "pointer",
                    p: 1.2,
                    textAlign: "center",
                    borderRadius: "8px",
                    bgcolor: activePlayer === i ? "#0097A7" : "#2A2D3E",
                    border: "1px solid #3A3D4F",
                    transition: "0.2s ease",
                    position: "relative",
                    overflow: "visible", // This allows the dot to show outside
                    "&:hover": { bgcolor: "#374151" },
                  }}
                >
                  {/* Online indicator - Positioned at corner with reduced size and no border */}
                  {p.online && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -2, // Position slightly above the top border
                        right: -2, // Position slightly outside the right border
                        width: 10, // Reduced size
                        height: 10, // Reduced size
                        borderRadius: "50%",
                        bgcolor: "#00FF00",
                        boxShadow: "0 0 6px 2px rgba(0,255,0,0.6)",
                        zIndex: 2,
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: activePlayer === i ? "bold" : "normal",
                      fontSize: "0.875rem",
                    }}
                  >
                    {p.name}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Booking Card */}
            <Box
              sx={{
                bgcolor: "#18212F",
                p: 2,
                borderRadius: "8px",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    sx={{
                      bgcolor: `${statusColors[booking.status]}33`,
                      color: statusColors[booking.status],
                      borderRadius: "12px",
                      px: 1.5,
                      py: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    {statusText[booking.status]}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                    }}
                  >
                    Booking #{booking.id}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#FD00B5",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                  }}
                >
                  {booking.loyalty_points} pts
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ color: "#fff", fontWeight: "bold", mb: 0.5 }}
              >
                Name : {booking.customer_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#9CA3AF", fontSize: "0.875rem", mb: 0.5 }}
              >
                ID : {booking.id}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}
              >
                PN : {booking.phone}
              </Typography>
            </Box>

            {/* Session Details & Payment Info */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {/* Session Details */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "#18212F",
                  p: 2,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", fontSize: "0.875rem", mb: 1.5 }}
                >
                  🎮 Session Details
                </Typography>

                <DetailRow label="Station" value={booking.station} />
                <DetailRow
                  label="Time"
                  value={`${booking.start_time} - ${calculateEndTime(
                    booking.start_time,
                    booking.duration
                  )}`}
                />
                <DetailRow label="Duration" value={booking.duration} />
                <DetailRow label="Extended Time" value={booking.extended_time} />
              </Box>

              {/* Payment Info */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "#18212F",
                  p: 2,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", fontSize: "0.875rem", mb: 1.5 }}
                >
                  💳 Payment Info
                </Typography>
                <DetailRow
                  label="Online Deposit"
                  value={`LKR ${booking.online_deposit}`}
                />
                <DetailRow
                  label="Total amounts"
                  value={`LKR ${booking.total_amount}`}
                />
                <DetailRow
                  label="Balance amounts"
                  value={`LKR ${booking.balance_amount}`}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions sx={{ p: 3, pt: 0, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              borderColor: "#0CD7FF",
              color: "#0CD7FF",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              bgcolor: "#0CD7FF10",
              fontSize: "0.875rem",
              py: 1.5,
              "&:hover": {
                borderColor: "#0CD7FF",
                bgcolor: "#0CD7FF20",
              },
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CloseIcon />}
            onClick={handleCancelClick}
            sx={{
              borderColor: "#dc2626",
              color: "#dc2626",
              textTransform: "none",
              borderRadius: "8px",
              bgcolor: "#dc262610",
              fontWeight: "bold",
              fontSize: "0.875rem",
              py: 1.5,
              "&:hover": {
                borderColor: "#dc2626",
                bgcolor: "#dc262620",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={handleCancelClose}
        handleConfirm={handleCancelConfirm}
      />
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 1,
    }}
  >
    <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
      {label}:
    </Typography>
    <Typography variant="body2" sx={{ color: "#fff", fontSize: "0.875rem" }}>
      {value}
    </Typography>
  </Box>
);

export default BookingDialog;