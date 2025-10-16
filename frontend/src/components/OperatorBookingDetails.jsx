import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import arrowicon from "../assets/arrowicon.png";
import editicon from "../assets/editicon.png";
import crossicon from "../assets/crossicon.png";
import sucessicon from "../assets/sucessicon.png";
import CancelPopup from "../components/CancelPopup";
import EditBookingFrom from "./EditBookingFrom";

// Status color mapping
const statusColors = {
  upcoming: "#0CD7FF",
  inprogress: "#9A60E8",
  completed: "#FD00B5",
};

const OperatorBookingDetails = ({ open, handleClose, bookingId }) => {
  const [booking, setBooking] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [time, setTime] = useState(15);
  const [timeUpdate, setTimeUpdate] = useState(false);

  // Fetch booking details from Laravel backend
  useEffect(() => {
    if (open && bookingId) {
      axios
        .get(`http://127.0.0.1:8000/api/bookings/${bookingId}`)
        .then((res) => {
          setBooking(res.data.data || res.data);
        })
        .catch((err) => {
          console.error("Error fetching booking:", err);
        });
    }
  }, [open, bookingId]);

  // Handle cancel booking
  const handleConfirm = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/bookings/${bookingId}/cancel`);
      alert("Booking cancelled successfully!");
      setCancelOpen(false);
      handleClose(false);
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel booking");
    }
  };

  // Handle extend time
  const handleUpdateTime = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/update-time`, {
          minutes: time,
        });

      setTimeUpdate(true);
    } catch (error) {
      console.error("Update time error:", error);
      alert("Failed to update time");
    }
  };

  // Time controls
  const handleIncrease = () => setTime((prev) => prev + 15);
  const handleDecrease = () => setTime((prev) => Math.max(0, prev - 15));
  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);

  if (!booking) return null;

  const statusColor = statusColors[booking.status?.toLowerCase()] || "#9CA3AF";

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#111827", borderRadius: "12px", color: "#fff" },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
          }}
        >
          <DialogTitle
            sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}
          >
            Booking Details
          </DialogTitle>
          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 0, pb: 2 }}>
          {/* Top Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              bgcolor: "#18212F",
              p: 2,
              borderRadius: "12px",
              mb: 1,
            }}
          >
            {/* Left Side */}
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" alignItems="center" gap={3} mb={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: statusColor,
                  }}
                />
                <Box
                  sx={{
                    bgcolor: statusColor,
                    color: "#fff",
                    px: 2,
                    py: 0.5,
                    borderRadius: "16px",
                    fontSize: "12px",
                  }}
                >
                  {booking.status}
                </Box>
              </Box>

              <Typography variant="h6" fontWeight="500" fontSize={16}>
                {booking.user}
              </Typography>
              <Typography
                variant="body2"
                fontSize={12}
                sx={{ color: "#9CA3AF" }}
              >
                {booking.phone}
              </Typography>
              <Typography
                variant="body2"
                fontSize={10}
                sx={{ color: "#FFFFFF" }}
              >
                {booking.email}
              </Typography>
            </Box>

            {/* Right Side */}
            <Box textAlign="right">
              <Typography
                variant="body2"
                fontSize={12}
                sx={{ color: "#FFFFFF" }}
                mb={1}
              >
                Booking #{booking.id}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                gap={1}
              >
                <StarIcon sx={{ color: "#C2048F" }} />
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#C2048F",
                    fontSize: "18px",
                  }}
                >
                  {booking.loyaltyPrice}
                </Typography>
              </Box>
              <Typography variant="body2" fontSize={16} sx={{ color: "#fff" }}>
                Loyalty Points
              </Typography>
            </Box>
          </Box>

          {/* Session & Payment Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mt: 2,
            }}
          >
            {/* Session Box */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#18212F",
                p: 2,
                borderRadius: "12px",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SportsEsportsIcon sx={{ color: "#9CA3AF" }} />
                <Typography variant="h6" fontSize={16} fontWeight="600">
                  Session Details
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Station:
                </Typography>
                <Typography fontSize={14} color="#FFFFFF">
                  {booking.station}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Time:
                </Typography>
                <Typography fontSize={14} color="#FFFFFF">
                  {booking.time}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Duration:
                </Typography>
                <Typography fontSize={14} color="#FFFFFF">
                  {booking.duration}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Extended Time:
                </Typography>
                <Typography fontSize={14} color="#FFFFFF">
                  {booking.extendedTime}
                </Typography>
              </Box>
            </Box>

            {/* Payment Box */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#18212F",
                p: 2,
                borderRadius: "12px",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CreditCardIcon sx={{ color: "#8A38F5" }} />
                <Typography variant="h6" fontSize={16} fontWeight="600">
                  Payment Info
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Method:
                </Typography>
                <Typography fontSize={14} color="#FFFFFF">
                  {booking.paymentMethod}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Online Deposit:
                </Typography>
                <Typography fontSize={14} color="#FFFFFF">
                  LKR {booking.onlineDeposit}
                </Typography>
              </Box>
              <hr style={{ border: "none", borderTop: "1px solid #374151" }} />
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Total Amount:
                </Typography>
                <Typography
                  fontSize={14}
                  sx={{ color: "#0CD7FF", fontWeight: 600 }}
                >
                  LKR {booking.price}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography fontSize={14} color="#A6AAB0">
                  Balance Amount:
                </Typography>
                <Typography
                  fontSize={14}
                  sx={{ color: "#0CD7FF", fontWeight: 600 }}
                >
                  LKR {booking.balanceAmount}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* In-Progress Time Controls */}
          {booking.status === "inprogress" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "12px",
                }}
              >
                <Box
                  component="button"
                  onClick={handleDecrease}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "4px",
                    border: "none",
                    bgcolor: "#2c2f3a",
                    color: "#fff",
                    fontSize: "20px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#374151" },
                  }}
                >
                  –
                </Box>

                <Box
                  sx={{
                    px: 5,
                    py: 1,
                    borderRadius: "4px",
                    bgcolor: "#1f2230",
                    color: "#aaa",
                    fontWeight: 500,
                    minWidth: "70px",
                    textAlign: "center",
                  }}
                >
                  {time} min
                </Box>

                <Box
                  component="button"
                  onClick={handleIncrease}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "4px",
                    border: "none",
                    bgcolor: "#2c2f3a",
                    color: "#fff",
                    fontSize: "20px",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#374151" },
                  }}
                >
                  +
                </Box>
              </Box>

              <Box
                onClick={handleUpdateTime}
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background:
                    "linear-gradient(90deg, #00c6ff 0%, #7d2cff 100%)",
                  "&:hover": {
                    background: "linear-gradient(to right, #8A38F5, #0CD7FF)",
                  },
                  py: 1,
                  borderRadius: "4px",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Update Time
              </Box>

              {/* Success Popup */}
              <Dialog
                open={timeUpdate}
                PaperProps={{
                  sx: {
                    bgcolor: "#0A192F",
                    borderRadius: "16px",
                    py: 2,
                    px: 8,
                    textAlign: "center",
                    color: "white",
                    border: "1px solid #3B4859",
                  },
                }}
              >
                <DialogContent>
                  <Box sx={{ mb: 1 }}>
                    <img src={sucessicon} alt="" width={80} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: 24,
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Update Successful!
                  </Typography>
                  <Button
                    onClick={() => setTimeUpdate(false)}
                    sx={{
                      px: 8,
                      fontSize: 14,
                      textTransform: "capitalize",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(90deg, rgba(12,215,255,0.4) 0%, rgba(138,56,245,0.4) 73%)",
                      color: "white",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #0CD7FF 0%, #8A38F5 73%)",
                      },
                    }}
                  >
                    Ok
                  </Button>
                </DialogContent>
              </Dialog>
            </Box>
          )}

          {/* Buttons */}
          <Box display="flex" gap={2} mt={2}>
            {booking.status === "inprogress" && (
              <>
                <Button
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(90deg, #FD00B5 0%, #8A38F5 100%)",
                    fontSize: 14,
                    color: "#fff",
                    textTransform: "capitalize",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #8A38F5 0%, #FD00B5 100%)",
                    },
                  }}
                >
                  <img
                    src={arrowicon}
                    alt=""
                    style={{ width: 12, marginRight: 8 }}
                  />
                  End Session
                </Button>

                <Button
                  fullWidth
                  sx={{
                    fontSize: 14,
                    bgcolor: "#1F2937",
                    color: "#fff",
                    textTransform: "capitalize",
                    "&:hover": { bgcolor: "#374151" },
                  }}
                  onClick={() => setEditOpen(true)}
                >
                  <img
                    src={editicon}
                    alt=""
                    style={{ width: 14, marginRight: 8 }}
                  />
                  Edit
                </Button>

                <Button
                  onClick={handleCancelOpen}
                  fullWidth
                  sx={{
                    fontSize: 14,
                    color: "#E6212D",
                    border: "2px solid #973339",
                    bgcolor: "#3E212D",
                    textTransform: "capitalize",
                    "&:hover": { bgcolor: "#973339" },
                  }}
                >
                  <img
                    src={crossicon}
                    alt=""
                    style={{ width: 14, marginRight: 8 }}
                  />
                  Cancel
                </Button>
              </>
            )}

            {booking.status === "upcoming" && (
              <>
                <Button
                  fullWidth
                  sx={{
                    fontSize: 14,
                    bgcolor: "#1F2937",
                    color: "#fff",
                    textTransform: "capitalize",
                    "&:hover": { bgcolor: "#374151" },
                  }}
                  onClick={() => setEditOpen(true)}
                >
                  <img
                    src={editicon}
                    alt=""
                    style={{ width: 14, marginRight: 8 }}
                  />
                  Edit
                </Button>

                <Button
                  onClick={handleCancelOpen}
                  fullWidth
                  sx={{
                    fontSize: 14,
                    color: "#E6212D",
                    border: "2px solid #973339",
                    bgcolor: "#3E212D",
                    textTransform: "capitalize",
                    "&:hover": { bgcolor: "#973339" },
                  }}
                >
                  <img
                    src={crossicon}
                    alt=""
                    style={{ width: 14, marginRight: 8 }}
                  />
                  Cancel
                </Button>
              </>
            )}

            {booking.status === "completed" && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  onClick={handleCancelOpen}
                  sx={{
                    width: "50%",
                    fontSize: 14,
                    color: "#E6212D",
                    border: "2px solid #973339",
                    bgcolor: "#3E212D",
                    textTransform: "capitalize",
                    "&:hover": { bgcolor: "#973339" },
                  }}
                >
                  <img
                    src={crossicon}
                    alt=""
                    style={{ width: 14, marginRight: 8 }}
                  />
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          {/* Cancel Popup */}
          <CancelPopup
            open={cancelOpen}
            handleCancelClose={handleCancelClose}
            handleConfirm={handleConfirm}
          />

          {/* Edit Booking Form */}
          <EditBookingFrom
            open={editOpen}
            handleClose={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperatorBookingDetails;
