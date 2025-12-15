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

import CreditCardIcon from "@mui/icons-material/CreditCard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CancelPopup from "../components/CancelPopup";
import EditBookingFrom from "./EditBookingFrom";
import { formatAmount, minutesToHHMMDisplay } from "./SessionDialog";
import BookingForm from "./BookingForm";

export const calculateEndTime = (startTime, durationStr) => {
  if (!startTime) startTime = "00:00";

  const [startHours, startMinutes] = startTime.split(":").map(Number);

  if (isNaN(startHours) || isNaN(startMinutes)) return "00:00";

  let totalMins = 0;

  if (durationStr && typeof durationStr === "string") {
    const hoursMatch = durationStr.match(/(\d+)h/);
    const minsMatch = durationStr.match(/(\d+)m/);

    const h = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const m = minsMatch ? parseInt(minsMatch[1], 10) : 0;

    totalMins = h * 60 + m;
  }

  const startTotalMins = startHours * 60 + startMinutes;
  const endTotalMins = startTotalMins + totalMins;

  const endHours = Math.floor(endTotalMins / 60) % 24;
  const endMinutes = endTotalMins % 60;

  return minutesToHHMMDisplay(endHours * 60 + endMinutes);
};

const BookingDialog = ({ open, onClose, bookings = [],  stations = [] }) => {
  const [activePlayer, setActivePlayer] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!bookings || bookings.length === 0) return null;

  const defaultStation = bookings.find((b) => b && b.station)?.station || "N/A";

  const playerSlots = [0, 1, 2, 3].map((i) => {
    const b = bookings[i] || null;
    return {
      ...b,
      station: b?.station || defaultStation,
      duration: b?.duration || "0h 0m",
      start_time: b?.start_time || "00:00",
      customer_name: b?.customer_name || null,
      phone: b?.phone || null,
      total_amount: b?.total_amount || 0,
      balance_amount: b?.balance_amount || 0,
      online_deposit: b?.online_deposit || 0,
      extended_time: b?.extended_time || 0,
      loyalty_points: b?.loyalty_points || null,
      status: b?.status || "Upcoming",
      id: b?.id || null,
      vr_play: b?.vr_play || null,
    };
  });
  const booking = playerSlots[activePlayer];

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
              {[0, 1, 2, 3].map((i) => {
                const b = bookings[i] || null;
                return (
                  <Box
                    key={i}
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
                    {b && (
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
                );
              })}
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
                        {booking.loyalty_points} pts
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
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <SportsEsportsIcon sx={{ fontSize: 18, color: "gray" }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      color: "#FFFFFF",
                    }}
                  >
                    Session Details
                  </Typography>
                </Box>

                <DetailRow
                  label="Station"
                  value={
                    booking.vr_play === "yes"
                      ? `${booking.station} + VR`
                      : booking.station
                  }
                />
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
                  value={minutesToHHMMDisplay(booking.extended_time)}
                />
              </Box>

              <Box
                sx={{ flex: 1, bgcolor: "#18212F", p: 2, borderRadius: "8px" }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CreditCardIcon sx={{ color: "#8A38F5", fontSize: 18 }} />
                  <Typography fontSize={15} fontWeight={600} color="#FFFFFF">
                    Payment Info
                  </Typography>
                </Box>

                <DetailRow
                  label="Online Deposit"
                  value={`LKR ${formatAmount(booking.online_deposit)}`}
                />
                <Box sx={{ my: 1.5, borderTop: "1px solid #374151" }} />
                <DetailRow
                  label="Total amounts"
                  value={
                    <span style={{ color: "#0CD7FF", fontWeight: 700 }}>
                      {`LKR ${formatAmount(booking.total_amount)}`}
                    </span>
                  }
                />
                <DetailRow
                  label="Balance amounts"
                  value={
                    <span style={{ color: "#0CD7FF", fontWeight: 700 }}>
                      {`LKR ${formatAmount(booking.balance_amount)}`}
                    </span>
                  }
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
        <BookingForm
          open={editOpen}
          handleClose={handleEditClose}
          onBookingCreated={onClose}
          bookings={bookings}
          stations={stations}
          existingBooking={booking}
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
