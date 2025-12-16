import React, { useState, useEffect} from "react";
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
import successicon from "../assets/success.png";
import endSessionIcon from "../assets/q.png";
import sucessicon from "../assets/success.png";
// import UpdateSuccessDialog from "../components/UpdateSuccess";

import axios from "axios";

// POPUPS
import CancelPopup from "../components/CancelPopup";
import EditBookingFrom from "./EditBookingFrom";
import EndSessionPopup from "../components/Endsession";
import PaymentSuccessPopup from "../components/paymentsuccess";

import UpdateSuccessDialog from "../components/UpdateSuccess";
import BookingForm from "./BookingForm";

//const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);
// const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);
// function BookingDetails() {
// const [state, setState] = useState(0); // ✅ inside component
// return <div>Details</div>;
// }

const statusColors = {
  upcoming: "#0CD7FF",
  inprogress: "#9A60E8",
  completed: "#FD00B5",
};
/*
const BookingDetails = ({ open, handleClose, booking, onBookingUpdated }) => {

  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);

  const [time, setTime] = useState(0);
  const [timeUpdate, setTimeUpdate] = useState(false);

  // +15 minutes
  const handleIncrease = () => setTime(prev => prev + 15);

  // -15 minutes
  const handleDecrease = () => setTime(prev => Math.max(0, prev - 15));

  */


const BookingDetails = ({
  open,
  handleClose,
  onClose,
  booking,
  onBookingUpdated,
  bookings = [],
  stations: initialStations = [],
}) => {
  const [stations, setStations] = useState(initialStations);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [timeUpdate, setTimeUpdate] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false); // ✅ Moved inside component

  useEffect(() => {
  const fetchStations = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/stations");
      setStations(response.data);
    } catch (error) {
      console.error("Failed to fetch stations", error);
    }
  };

  if (open) fetchStations();
}, [open]);


  // +15 minutes
  const handleIncrease = () => setTime((prev) => prev + 15);
  // -15 minutes
  const handleDecrease = () => setTime((prev) => Math.max(0, prev - 15));
  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);
  const handleEditClose = () => {
    setEditOpen(false);
  };
  // Cancel Booking
  const handleConfirm = async () => {
    if (!booking?.id) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${booking.id}`,
        { status: "cancelled" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("aToken")
              ? `Bearer ${localStorage.getItem("aToken")}`
              : "",
          },
        }
      );

      if (response.data.success) {
        setCancelOpen(false);
        handleClose(false);
        onBookingUpdated?.();
      }
    } catch (error) {
      alert("Failed to cancel booking");
      setCancelOpen(false);
    }
  };

  // Update Time

  /*
  const handleUpdateTime = async () => {
    if (!booking?.id) return;

    try {
      const updatedDuration = `${time} min`;

      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${booking.id}`,
        { duration: updatedDuration },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("aToken")
              ? `Bearer ${localStorage.getItem("aToken")}`
              : ""
          }
        }
      );

      if (response.data.success) {
        setTimeUpdate(true);
        onBookingUpdated?.();
        setTimeout(() => setTimeUpdate(false), 2000);
      }

    } catch (error) {
      alert("Failed to update booking time");
    }
  };
*/

  const handleEndSession = () => {
    setEndSessionOpen(true);
  };

  const handleEndSessionConfirmed = () => {
    setEndSessionOpen(false);
    // ❌ Do NOT open payment success here
  };

  const handleUpdateTime = async () => {
    if (!booking?.id) return;

    try {
      const updatedDuration = `${time} min`;

      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${booking.id}`,
        { duration: updatedDuration },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("aToken")
              ? `Bearer ${localStorage.getItem("aToken")}`
              : "",
          },
        }
      );

      if (response.data.success) {
        onBookingUpdated?.();
        // Open the popup
        setUpdateSuccessOpen(true);
      }
    } catch (error) {
      alert("Failed to update booking time");
    }
  };

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
          {/* TOP SECTION */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "#18212F",
              p: 2,
              borderRadius: "12px",
              mb: 1,
            }}
          >
            {/* LEFT */}
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

              <Typography variant="h6" fontSize={16}>
                {booking.customer_name}
              </Typography>
              <Typography fontSize={12} color="#9CA3AF">
                {booking.phone_number}
              </Typography>
              <Typography fontSize={10} color="#FFFFFF">
                {booking.email}
              </Typography>
            </Box>

            {/* RIGHT */}
            <Box textAlign="right">
              <Typography fontSize={12} color="#FFFFFF" mb={1}>
                Booking #{booking.id}
              </Typography>

              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-end"
                gap={1}
              >
                <StarIcon sx={{ color: "#C2048F" }} />
                <Typography fontWeight="bold" color="#C2048F" fontSize={18}>
                  {booking.loyaltyPrice}
                </Typography>
              </Box>

              <Typography fontSize={16} color="#fff">
                Loyalty Points
              </Typography>
            </Box>
          </Box>

          {/* SESSION + PAYMENT INFO */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mt: 2,
            }}
          >
            {/* SESSION */}
            <Box
              sx={{ flex: 1, bgcolor: "#18212F", p: 2, borderRadius: "12px" }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <SportsEsportsIcon sx={{ color: "#9CA3AF" }} />
                <Typography fontSize={16} fontWeight={600}>
                  Session Details
                </Typography>
              </Box>

              <Row label="Station" value={booking.station} />
              <Row label="Time" value={booking.start_time} />
              <Row label="Duration" value={booking.duration} />
            </Box>

            {/* PAYMENT */}
            <Box
              sx={{ flex: 1, bgcolor: "#18212F", p: 2, borderRadius: "12px" }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <CreditCardIcon sx={{ color: "#8A38F5" }} />
                <Typography fontSize={16} fontWeight={600}>
                  Payment Info
                </Typography>
              </Box>

              {/* <Row label="Method" value={booking.paymentMethod || 'Cash'} /> */}
              <Row
                label="Online Deposit"
                value={`LKR ${booking.onlineDeposit || "0"}`}
              />

              <hr style={{ border: "none", borderTop: "1px solid #374151" }} />

              <Row
                label="Total Amount"
                value={`LKR ${booking.amount}`}
                highlight
              />
              <Row
                label="Balance Amount"
                value={`LKR ${booking.balanceAmount ?? 0}`}
                highlight
              />
            </Box>
          </Box>

          {/* INPROGRESS ACTIONS */}
          {booking.status === "inprogress" && (
            <Box sx={{ mt: 2 }}>
              {/* TIME CONTROL */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <TimeButton label="–" onClick={handleDecrease} />
                  <TimeDisplay value={`${time} min`} />
                  <TimeButton label="+" onClick={handleIncrease} />
                </Box>

                <Button
                  onClick={handleUpdateTime}
                  sx={{
                    background:
                      "linear-gradient(90deg, #00c6ff 0%, #7d2cff 100%)",
                    py: 1.5,
                    px: 3,
                    borderRadius: "8px",
                    color: "#fff",
                    width: "250px",
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                >
                  Update Time
                </Button>
              </Box>

              {/* END SESSION */}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  sx={{
                    background:
                      "linear-gradient(90deg, #FD00B5 0%, #8A38F5 100%)",
                    fontSize: 14,
                    color: "#fff",
                    py: 1.5,
                    maxWidth: "300px",
                  }}
                  onClick={handleEndSession}
                >
                  <img
                    src={arrowicon}
                    alt=""
                    style={{ width: 12, marginRight: 8 }}
                  />
                  End Session
                </Button>
              </Box>
            </Box>
          )}

          {/* UPCOMING */}
          {booking.status === "upcoming" && (
            <Box display="flex" gap={2} mt={2}>
              <Button
                fullWidth
                sx={{
                  fontSize: 14,
                  bgcolor: "#1F2937",
                  color: "#fff",
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

          {/* COMPLETED – COLLECT PAYMENT */}
          {booking.status === "completed" && (
            <Button
              fullWidth
              sx={{
                background: "linear-gradient(90deg, #8A38F5 0%, #0CD7FF 100%)",
                fontSize: 14,
                color: "#fff",
                py: 1.5,
                mt: 2,
              }}
              onClick={() => setPaymentSuccessOpen(true)}
            >
              Collect Payment
            </Button>
          )}

          {/* POPUPS */}
          <CancelPopup
            open={cancelOpen}
            handleCancelClose={handleCancelClose}
            handleConfirm={handleConfirm}
          />
          <BookingForm
            open={editOpen}
            handleClose={handleEditClose}
            onBookingCreated={onClose}
            bookings={bookings}
            stations={stations}
            existingBooking={booking}
          />

          <EndSessionPopup
            open={endSessionOpen}
            onClose={() => setEndSessionOpen(false)}
            onConfirm={handleEndSessionConfirmed}
            icon={endSessionIcon}
          />

          <PaymentSuccessPopup
            open={paymentSuccessOpen}
            onClose={() => setPaymentSuccessOpen(false)}
            icon={successicon}
          />

          <UpdateSuccessDialog
            open={updateSuccessOpen}
            onClose={() => setUpdateSuccessOpen(false)}
          />

          {/* TIME UPDATE SUCCESS */}
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
                sx={{
                  background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: 24,
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Update Successful !
              </Typography>

              <Button
                onClick={() => setTimeUpdate(false)}
                sx={{
                  px: 8,
                  fontSize: 14,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(90deg, rgba(12, 215, 255, 0.4), rgba(138, 56, 245, 0.4))",
                  color: "white",
                }}
              >
                Ok
              </Button>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDetails;

// ---------- SMALL UI COMPONENTS ----------
const Row = ({ label, value, highlight }) => (
  <Box display="flex" justifyContent="space-between">
    <Typography fontSize={14} color="#A6AAB0">
      {label}:
    </Typography>
    <Typography
      fontSize={14}
      sx={{
        color: highlight ? "#0CD7FF" : "#FFFFFF",
        fontWeight: highlight ? 600 : 400,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const TimeButton = ({ label, onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      width: 40,
      height: 40,
      borderRadius: "8px",
      border: "none",
      bgcolor: "#2c2f3a",
      color: "#fff",
      fontSize: "20px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": { bgcolor: "#374151" },
    }}
  >
    {label}
  </Box>
);

const TimeDisplay = ({ value }) => (
  <Box
    sx={{
      px: 3,
      py: 1.5,
      borderRadius: "8px",
      bgcolor: "#1f2230",
      color: "#FFFFFF",
      fontWeight: 600,
      minWidth: "100px",
      textAlign: "center",
      fontSize: 16,
    }}
  >
    {value}
  </Box>
);
