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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import PaymentIcon from "@mui/icons-material/Payment";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// Import popups
import EndSessionPopup from "../components/Endsession";
import UpdateSuccessDialog from "../components/UpdateSuccess";
import endSessionIcon from "../assets/q.png";

// --- mock players with dummy data for all players ---
const initialPlayers = [
  {
    id: 1,
    name: "Player 01",
    online: true,
    booking: {
      id: "123456",
      customer_name: "Nithin Kumar",
      phone: "+94 725656963",
      station: "PS5 Station 1 + VR",
      start_time: "12:00",
      end_time: "12:30",
      duration: "2h 0m",
      extended_time: 0,
      online_deposit: "000",
      total_amount: "400",
      balance_amount: "000",
      loyalty_points: 150,
      status: "inprogress",
    },
  },
  {
    id: 2,
    name: "Player 02",
    online: true,
    booking: {
      id: "789012",
      customer_name: "Kamal Perera",
      phone: "+94 774589632",
      station: "PS5 Station 2",
      start_time: "13:00",
      end_time: "14:30",
      duration: "1h 30m",
      extended_time: 15,
      online_deposit: "200",
      total_amount: "500",
      balance_amount: "300",
      loyalty_points: 120,
      status: "inprogress",
    },
  },
  {
    id: 3,
    name: "Player 03",
    online: false,
    booking: {
      id: "345678",
      customer_name: "Saman Silva",
      phone: "+94 712345678",
      station: "PS5 Station 3 + VR",
      start_time: "15:00",
      end_time: "17:00",
      duration: "2h 0m",
      extended_time: 0,
      online_deposit: "150",
      total_amount: "450",
      balance_amount: "300",
      loyalty_points: 180,
      status: "inprogress",
    },
  },
  {
    id: 4,
    name: "Player 04",
    online: false,
    booking: {
      id: "901234",
      customer_name: "Nimal Fernando",
      phone: "+94 776543219",
      station: "PS5 Station 4",
      start_time: "18:00",
      end_time: "19:00",
      duration: "1h 0m",
      extended_time: 30,
      online_deposit: "100",
      total_amount: "300",
      balance_amount: "200",
      loyalty_points: 90,
      status: "inprogress",
    },
  },
];

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
  const [players, setPlayers] = useState(initialPlayers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);

  // Get active booking from players state
  const activeBooking = players[activeIndex]?.booking;

  // sync when active changes
  useEffect(() => {
    if (activeBooking) {
      setCustomMinutes(activeBooking.extended_time || 0);
    }
  }, [activeIndex, activeBooking]);

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
    if (!activeBooking) return;
    
    setPlayers((prev) => {
      const updated = [...prev];
      const b = { ...updated[activeIndex].booking };
      b.extended_time = Number(customMinutes);
      b.end_time = addMinutesToTime(b.end_time, Number(customMinutes));
      updated[activeIndex] = { ...updated[activeIndex], booking: b };
      return updated;
    });

    // Show update success popup
    setUpdateSuccessOpen(true);
  };

  const handleEndSessionClick = () => {
    setEndSessionOpen(true);
  };

  const handleEndSessionConfirmed = () => {
    setEndSessionOpen(false);
    if (typeof onEndSession === "function") {
      onEndSession(players[activeIndex]);
    }
    if (onClose) onClose();
  };

  const handleUpdateSuccessClose = () => {
    setUpdateSuccessOpen(false);
  };

  // Determine the label text based on the current minutes
  const getTimeLabel = () => {
    return "min";
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
          {/* Player Tabs */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            {players.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => setActiveIndex(i)}
                sx={{
                  flex: 1,
                  cursor: "pointer",
                  py: 1.2,
                  borderRadius: "8px",
                  textAlign: "center",
                  position: "relative",
                  bgcolor: activeIndex === i ? "#00B8D4" : "#1E2535",
                  transition: "0.25s",
                  "&:hover": { bgcolor: "#263145" },
                }}
              >
                {p.online && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -3,
                      right: -3,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#00FF00",
                      boxShadow: "0 0 10px 3px rgba(0,255,0,0.6)",
                    }}
                  />
                )}
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: activeIndex === i ? "bold" : "normal",
                    fontSize: "0.875rem",
                  }}
                >
                  {p.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Booking Card */}
          <Box sx={{ bgcolor: "#0E1A24", p: 2, borderRadius: 2, mb: 3, border: "1px solid #152833" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#8B5CF6" }} />
                <Typography
                  sx={{
                    bgcolor: "#8B5CF6",
                    color: "#fff",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "14px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Inprogress
                </Typography>
              </Box>

              <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>Booking #{activeBooking.id}</Typography>
            </Box>

            <Box sx={{ mt: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{`Name : ${activeBooking.customer_name}`}</Typography>
              <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>{`ID : ${activeBooking.id}`}</Typography>
              <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>{`PN : ${activeBooking.phone}`}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
              <Box sx={{ textAlign: "right", mr: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                  <StarBorderIcon sx={{ color: "#FD00B5", fontSize: 18 }} />
                  <Typography sx={{ color: "#FD00B5", fontWeight: 700, fontSize: 14 }}>{activeBooking.loyalty_points} pts</Typography>
                </Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>Loyalty Points</Typography>
              </Box>
            </Box>
          </Box>

          {/* Session + Payment Panels - Two separate boxes with spacing */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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

              <DetailRow label="Station:" value={activeBooking.station} />
              <DetailRow label="Time:" value={`${activeBooking.start_time} - ${activeBooking.end_time}`} />
              <DetailRow label="Duration:" value={activeBooking.duration} />
              <DetailRow label="Extended Time:" value={minutesToHHMMDisplay(activeBooking.extended_time || 0)} />
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

              <DetailRow label="Online Deposit" value={`LKR ${activeBooking.online_deposit}`} />
              <DetailRow 
                label="Total amounts:" 
                value={<span style={{ color: "#0CD7FF", fontWeight: 700 }}>{`LKR ${activeBooking.total_amount}`}</span>} 
              />
              <DetailRow 
                label="Balance amounts:" 
                value={<span style={{ color: "#0CD7FF", fontWeight: 700 }}>{`LKR ${activeBooking.balance_amount}`}</span>} 
              />
            </Box>
          </Box>

          {/* Time Controls */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2, 
            mb: 3,
            bgcolor: "#0E1A24",
            p: 2,
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
                    color: "#9CA3AF",
                    padding: "12px 8px",
                    paddingTop: "20px",
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
                    color: "#9CA3AF", 
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
                  color: "#9CA3AF",
                  pointerEvents: "none",
                  fontWeight: 500
                }}
              >
                {getTimeLabel()}
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

            <Box sx={{ flex: 1 }} />

            <Button
              onClick={handleUpdateTime}
              sx={{
                minWidth: 200,
                height: 44,
                borderRadius: 2,
                background: "linear-gradient(90deg, #00A3FF 0%, #A044FF 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                textTransform: "none",
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
              onClick={handleEndSessionClick}
              sx={{
                width: 220,
                height: 48,
                borderRadius: 3,
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

      {/* End Session Popup */}
      <EndSessionPopup
        open={endSessionOpen}
        onClose={() => setEndSessionOpen(false)}
        onConfirm={handleEndSessionConfirmed}
        icon={endSessionIcon}
      />

      {/* Update Success Popup */}
      <UpdateSuccessDialog
        open={updateSuccessOpen}
        onClose={handleUpdateSuccessClose}
      />
    </>
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