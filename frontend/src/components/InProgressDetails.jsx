// components/InProgressBookingDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import PaymentIcon from "@mui/icons-material/Payment";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// --- mock booking data ---
const bookingData = {
  id: "123456",
  customer_name: "Nithin Kumar",
  phone: "+94 725656963",
  station: "Racing Simulator 1 + VR",
  start_time: "12:00",
  end_time: "12:30",
  duration: "2h 0m",
  extended_time: 0,
  online_deposit: "000",
  total_amount: "400",
  balance_amount: "000",
  loyalty_points: 150,
  status: "inprogress",
};

// --- helpers ---
const pad2 = (n) => String(n).padStart(2, "0");

// Add minutes to an HH:MM time string
const addMinutesToTime = (timeStr, minsToAdd) => {
  const [hh, mm] = timeStr.split(":").map(Number);
  let total = hh * 60 + mm + Math.round(minsToAdd);
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${pad2(newH)}:${pad2(newM)}`;
};

// Convert minutes to "HH:MM" format for display (extended time)
const minutesToHHMMDisplay = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}`;
};

// --- component ---
const InProgressBookingDialog = ({ open, onClose, onEndSession }) => {
  const [booking, setBooking] = useState(bookingData);
  const [customMinutes, setCustomMinutes] = useState(15);

  // sync when booking changes
  useEffect(() => {
    if (booking) {
      setCustomMinutes(booking.extended_time || 15);
    }
  }, [booking]);

  // adjust +/- 15 minutes (min 0)
  const adjustBy = (delta) => {
    setCustomMinutes((prev) => Math.max(0, prev + delta));
  };

  // manual change input
  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    const num = val === "" ? 0 : parseInt(val, 10);
    if (num <= 480) setCustomMinutes(num);
  };

  // commit update: set extended_time and recalc end_time for that booking
  const handleUpdateTime = () => {
    if (!booking) return;
    
    setBooking((prev) => {
      const updated = { ...prev };
      updated.extended_time = Number(customMinutes);
      updated.end_time = addMinutesToTime(updated.end_time, Number(customMinutes));
      return updated;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0F1721",
          color: "#fff",
          borderRadius: "10px",
          border: "1px solid #22303f",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Booking Details</Typography>
        <IconButton onClick={onClose} sx={{ color: "#9CA3AF" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {/* Booking Card */}
        <Box sx={{ bgcolor: "#0E1A24", p: 2, borderRadius: 2, mb: 3, border: "1px solid #152833" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#8B5CF6" }} />
              <Chip
                label="Inprogress"
                sx={{
                  bgcolor: "#8B5CF6",
                  color: "#fff",
                  height: 26,
                  fontWeight: 700,
                  borderRadius: "14px",
                  px: 1.5,
                  fontSize: "12px",
                }}
                size="small"
              />
            </Box>

            <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>Booking #{booking.id}</Typography>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{`Name : ${booking.customer_name}`}</Typography>
            <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>{`ID : ${booking.id}`}</Typography>
            <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>{`PN : ${booking.phone}`}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
            <Box sx={{ textAlign: "right", mr: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                <StarBorderIcon sx={{ color: "#FD00B5", fontSize: 18 }} />
                <Typography sx={{ color: "#FD00B5", fontWeight: 700, fontSize: 14 }}>{booking.loyalty_points} pts</Typography>
              </Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>Loyalty Points</Typography>
            </Box>
          </Box>
        </Box>

        {/* Session + Payment Panels - Two separate boxes with spacing */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          {/* Session Details - Left Box */}
          <Box sx={{ 
            flex: 1,
            bgcolor: "#0E1A24", 
            p: 2, 
            borderRadius: 2,
            border: "1px solid #152833",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <VideogameAssetIcon sx={{ color: "#0CD7FF", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Session Details</Typography>
            </Box>

            <DetailRow label="Station:" value={booking.station} />
            <DetailRow label="Time:" value={`${booking.start_time} - ${booking.end_time}`} />
            <DetailRow label="Duration:" value={booking.duration} />
            <DetailRow label="Extended Time:" value={minutesToHHMMDisplay(booking.extended_time || 0)} />
          </Box>

          {/* Payment Info - Right Box */}
          <Box sx={{ 
            flex: 1,
            bgcolor: "#0E1A24", 
            p: 2, 
            borderRadius: 2,
            border: "1px solid #152833",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <PaymentIcon sx={{ color: "#8B5CF6", fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Payment Info</Typography>
            </Box>

            <DetailRow label="Online Deposit" value={`LKR ${booking.online_deposit}`} />
            <DetailRow 
              label="Total amounts:" 
              value={<span style={{ color: "#0CD7FF", fontWeight: 700 }}>{`LKR ${booking.total_amount}`}</span>} 
            />
            <DetailRow 
              label="Balance amounts:" 
              value={<span style={{ color: "#0CD7FF", fontWeight: 700 }}>{`LKR ${booking.balance_amount}`}</span>} 
            />
          </Box>
        </Box>

        {/* Time Controls */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          gap: 2, 
          mb: 3,
          bgcolor: "#0E1A24",
          p: 3,
          borderRadius: 2,
          border: "1px solid #152833"
        }}>
          <Button
            onClick={() => adjustBy(-15)}
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "#15202a",
              color: "#fff",
              border: "1px solid #22303f",
              fontSize: "18px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#121a21" },
            }}
          >
            −
          </Button>

          <Box sx={{ position: "relative", width: 140 }}>
            <TextField
              value={customMinutes}
              onChange={handleCustomChange}
              inputProps={{ 
                inputMode: "numeric", 
                pattern: "[0-9]*", 
                style: { 
                  textAlign: "center", 
                  fontWeight: 700,
                  color: "#070707ff",
                  padding: "12px 8px",
                  paddingTop: "20px",
                  fontSize: "16px",
                } 
              }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#15202a",
                  borderRadius: 1.5,
                  border: "1px solid #22303f",
                  "& fieldset": { border: "none" },
                },
                "& .MuiInputBase-input": { 
                  color: "#020202ff", 
                },
              }}
            />
            <Typography 
              sx={{ 
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "11px",
                color: "#0b0b0bff",
                pointerEvents: "none",
                fontWeight: 500
              }}
            >
              min
            </Typography>
          </Box>

          <Button
            onClick={() => adjustBy(15)}
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "#15202a",
              color: "#fff",
              border: "1px solid #22303f",
              fontSize: "18px",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#121a21" },
            }}
          >
            +
          </Button>

          <Button
            onClick={handleUpdateTime}
            sx={{
              minWidth: 140,
              height: 44,
              borderRadius: 2,
              background: "linear-gradient(90deg, #00A3FF 0%, #A044FF 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              textTransform: "none",
              ml: 2,
              "&:hover": {
                opacity: 0.95,
              },
            }}
          >
            Update Time
          </Button>
        </Box>

        {/* End Session button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => {
              if (typeof onEndSession === "function") onEndSession(booking);
            }}
            sx={{
              width: "100%",
              height: 48,
              borderRadius: 2,
              background: "linear-gradient(90deg, #FD00B5 0%, #7E3AF2 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              textTransform: "none",
              boxShadow: "0 6px 16px rgba(138,56,245,0.18)",
              "&:hover": { opacity: 0.95 },
            }}
          >
            ▶︎ End Session
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }} />
    </Dialog>
  );
};

// DetailRow component
const DetailRow = ({ label, value }) => (
  <Box sx={{ 
    display: "flex", 
    justifyContent: "space-between", 
    py: 1,
    alignItems: "center"
  }}>
    <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>{label}</Typography>
    <Box sx={{ ml: 2, textAlign: "right" }}>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{value}</Typography>
      ) : (
        value
      )}
    </Box>
  </Box>
);

export default InProgressBookingDialog;