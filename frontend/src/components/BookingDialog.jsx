import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

import CancelPopup from "../components/CancelPopup";
import EditBookingFrom from "./EditBookingFrom";
import { minutesToHHMMDisplay } from "./SessionDialog";

// Calculate end time
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
    return "N/A";
  }
};

const BookingDialog = ({ open, onClose, bookings = [] }) => {
  const [activePlayer, setActivePlayer] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!bookings || bookings.length === 0) return null;

  const booking = bookings[activePlayer];

  const statusColors = { upcoming: "#0CD7FF" };
  const statusText = { upcoming: "Upcoming" };

  const handleEditClick = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCancelClick = () => setCancelOpen(true);
  const handleCancelConfirm = () => {
    console.log("Canceling booking:", booking);
    setCancelOpen(false);
    onClose();
  };
  const handleCancelClose = () => setCancelOpen(false);

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
        <Box
          sx={{
            p: 2,
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
              "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pt: 0, mt: 1.5 }}>
            {/* Player Tabs dynamically from bookings */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              {bookings.map((b, i) => (
                <Box
                  key={b.id}
                  onClick={() => setActivePlayer(i)}
                  sx={{
                    flex: 1,
                    cursor: "pointer",
                    p: 1.2,
                    border: "1px solid #2c5d88dc",
                    textAlign: "center",
                    borderRadius: "8px",
                    bgcolor: activePlayer === i ? "#0097A7" : "#2A2D3E",
                    transition: "0.2s ease",
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  {b.is_online === 1 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 10,
                        height: 10,
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
                    Player {String(i + 1).padStart(2, "0")}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Booking Card */}
            <Box
              sx={{
                bgcolor: "#18212F",
                p: 2,
                borderRadius: 2,
                mb: 3,
                border: "1px solid #152833",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: `${statusColors[booking.status]}33`,
                      }}
                    />
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
                  </Box>
                  <Typography
                    sx={{ fontWeight: 700, fontSize: 15, color: "#fff" }}
                  >
                    Name: {booking.customer_name}
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>
                    ID: {booking.id}
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>
                    PN: {booking.phone}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 120 }}>
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: 13,
                      fontWeight: 500,
                      mb: 2,
                    }}
                  >
                    Booking #{booking.id}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <StarIcon sx={{ color: "#FD00B5", fontSize: 18 }} />
                      <Typography
                        sx={{
                          color: "#FD00B5",
                          fontWeight: 700,
                          fontSize: 14,
                          mt: 0.5,
                        }}
                      >
                        {booking.loyalty_points ?? 0} pts
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, mt: 0.5 }}>
                    Loyalty Points
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Session & Payment Info */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box
                sx={{ flex: 1, bgcolor: "#18212F", p: 2, borderRadius: "8px" }}
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
                <DetailRow
                  label="Extended Time"
                  value={minutesToHHMMDisplay(booking.extended_time || 0)}
                />
              </Box>

              <Box
                sx={{ flex: 1, bgcolor: "#18212F", p: 2, borderRadius: "8px" }}
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
            onClick={handleEditClick}
            sx={{
              borderColor: "#323e4fff",
              color: "#eef3f4ff",
              textTransform: "none",
              borderRadius: "8px",
              bgcolor: "#1F2937",
              fontWeight: "bold",
              fontSize: "0.875rem",
              py: 1.5,
              "&:hover": { borderColor: "#1F2937", bgcolor: "#4a596ed8" },
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
              "&:hover": { borderColor: "#dc2626", bgcolor: "#dc262620" },
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

      {editOpen && (
        <EditBookingFrom
          open={editOpen}
          handleClose={handleEditClose}
          booking={booking}
        />
      )}
    </>
  );
};

const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
    <Typography variant="body2" sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
      {label}:
    </Typography>
    <Typography variant="body2" sx={{ color: "#fff", fontSize: "0.875rem" }}>
      {value}
    </Typography>
  </Box>
);

export default BookingDialog;
