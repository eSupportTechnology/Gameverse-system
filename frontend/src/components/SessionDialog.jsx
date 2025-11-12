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
  Grid,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import PaymentIcon from "@mui/icons-material/Payment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderIcon from "@mui/icons-material/StarBorder";

// --- mock players (you can replace with props/API) ---
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
      extended_time: 0, // minutes
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
      customer_name: "Aravind Silva",
      phone: "+94 714589632",
      station: "PS5 Station 2 + VR",
      start_time: "14:00",
      end_time: "15:30",
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
      customer_name: "Ravindu Perera",
      phone: "+94 765432198",
      station: "PS5 Station 3 + VR",
      start_time: "16:30",
      end_time: "18:30",
      duration: "2h 0m",
      extended_time: 10,
      online_deposit: "100",
      total_amount: "400",
      balance_amount: "100",
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
      customer_name: "Sahan Wijesinghe",
      phone: "+94 778956321",
      station: "PS5 Station 4 + VR",
      start_time: "18:00",
      end_time: "20:30",
      duration: "2h 30m",
      extended_time: 20,
      online_deposit: "300",
      total_amount: "700",
      balance_amount: "400",
      loyalty_points: 200,
      status: "inprogress",
    },
  },
];

// --- helpers ---
const pad2 = (n) => String(n).padStart(2, "0");

// Add minutes to an HH:MM time string
const addMinutesToTime = (timeStr, minsToAdd) => {
  // timeStr e.g. "12:30"
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

// parse start/end, return minutes difference (duration in minutes)
const timeDiffMinutes = (start, end) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let s = sh * 60 + sm;
  let e = eh * 60 + em;
  // if end < start assume day wrap
  if (e < s) e += 24 * 60;
  return e - s;
};

// --- component ---
const InProgressBookingDialog = ({ open, onClose, onEndSession }) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [activeIndex, setActiveIndex] = useState(0);
  // customMinutes is the value user edits (in minutes)
  const [customMinutes, setCustomMinutes] = useState(
    players[0].booking.extended_time || 15
  );

  // sync when active changes
  useEffect(() => {
    const booking = players[activeIndex].booking;
    setCustomMinutes(booking.extended_time || 0);
  }, [activeIndex, players]);

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
    setPlayers((prev) => {
      const updated = [...prev];
      const b = { ...updated[activeIndex].booking };
      // commit extended_time
      b.extended_time = Number(customMinutes);
      // recompute end_time by adding extended minutes to original end_time
      // (If you want to base on start_time+duration, change accordingly)
      b.end_time = addMinutesToTime(b.end_time, Number(customMinutes));
      updated[activeIndex] = { ...updated[activeIndex], booking: b };
      return updated;
    });
  };

  // compute display Extended Time (shows the customMinutes while editing; otherwise from booking)
  const displayedExtended = customMinutes;

  // Get active booking from players state (reflects committed values)
  const activeBooking = players[activeIndex].booking;

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
        {/* Player Tabs */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {players.map((p, idx) => {
            const active = idx === activeIndex;
            return (
              <Box
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                sx={{
                  flex: 1,
                  py: 1,
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                  bgcolor: active ? "linear-gradient(90deg, #0CD7FF 0%, #00B8D4 100%)" : "#15202a",
                  color: active ? "#012028" : "#E6EEF6",
                  fontWeight: active ? 700 : 500,
                  border: active ? "none" : "1px solid #263244",
                  transition: "0.15s",
                }}
              >
                {/* small green dot (online) */}
                {p.online && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 8,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#00E24A",
                      boxShadow: "0 0 6px 2px rgba(0,226,74,0.25)",
                    }}
                  />
                )}
                <Typography sx={{ fontSize: 13 }}>{p.name}</Typography>
              </Box>
            );
          })}
        </Box>

        {/* Booking Card */}
        <Box sx={{ bgcolor: "#0E1A24", p: 2, borderRadius: 2, mb: 3 }}>
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
                }}
                size="small"
              />
            </Box>

            <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>Booking #{activeBooking.id}</Typography>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{`Name : ${activeBooking.customer_name}`}</Typography>
            <Typography sx={{ color: "#9CA3AF", mt: 0.5 }}>{`ID : ${activeBooking.id}`}</Typography>
            <Typography sx={{ color: "#9CA3AF", mt: 0.5 }}>{`PN : ${activeBooking.phone}`}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 1 }}>
            <Box sx={{ textAlign: "right", mr: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                <StarBorderIcon sx={{ color: "#FD00B5", fontSize: 18 }} />
                <Typography sx={{ color: "#FD00B5", fontWeight: 700 }}>{activeBooking.loyalty_points} pts</Typography>
              </Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>Loyalty Points</Typography>
            </Box>
          </Box>
        </Box>

        {/* Session + Payment Panels */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "#0E1A24", p: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <VideogameAssetIcon sx={{ color: "#0CD7FF" }} />
                <Typography sx={{ fontWeight: 700 }}>Session Details</Typography>
              </Box>

              <DetailRow label="Station" value={activeBooking.station} />
              <DetailRow label="Time" value={`${activeBooking.start_time} - ${activeBooking.end_time}`} />
              <DetailRow label="Duration" value={activeBooking.duration} />
              <DetailRow label="Extended Time" value={minutesToHHMMDisplay(displayedExtended)} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: "#0E1A24", p: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PaymentIcon sx={{ color: "#8B5CF6" }} />
                <Typography sx={{ fontWeight: 700 }}>Payment Info</Typography>
              </Box>

              <DetailRow label="Online Deposit" value={`LKR ${activeBooking.online_deposit}`} />
              <DetailRow label="Total amounts:" value={<span style={{ color: "#0CD7FF", fontWeight: 700 }}>{`LKR ${activeBooking.total_amount}`}</span>} />
              <DetailRow label="Balance amounts:" value={<span style={{ color: "#0CD7FF", fontWeight: 700 }}>{`LKR ${activeBooking.balance_amount}`}</span>} />
            </Box>
          </Grid>
        </Grid>

        {/* Controls row (- 15 / 15 min / + 15) and Update button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Button
            onClick={() => adjustBy(-15)}
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "#15202a",
              color: "#fff",
              border: "1px solid #22303f",
              "&:hover": { bgcolor: "#121a21" },
            }}
          >
            −
          </Button>

          <TextField
            value={customMinutes}
            onChange={handleCustomChange}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*", style: { textAlign: "center", fontWeight: 700 } }}
            sx={{
              width: 140,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#15202a",
                borderRadius: 1.5,
                border: "1px solid #22303f",
                "& fieldset": { border: "none" },
              },
              "& .MuiInputBase-input": { color: "#9CA3AF", padding: "12px 8px" },
            }}
          />

          <Button
            onClick={() => adjustBy(15)}
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "#15202a",
              color: "#fff",
              border: "1px solid #22303f",
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
              textTransform: "none",
              "&:hover": {
                opacity: 0.95,
              },
            }}
          >
            Update Time
          </Button>
        </Box>

        {/* large End Session button centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            onClick={() => {
              // You can call API or callback here
              if (typeof onEndSession === "function") onEndSession(players[activeIndex]);
            }}
            sx={{
              width: 220,
              height: 48,
              borderRadius: 3,
              background: "linear-gradient(90deg, #FD00B5 0%, #7E3AF2 100%)",
              color: "#fff",
              fontWeight: 700,
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

// small presentational components
const DetailRow = ({ label, value }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.6, borderBottom: "1px solid #152833" }}>
    <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>{label}:</Typography>
    <Box sx={{ ml: 2, textAlign: "right" }}>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography sx={{ color: "#fff", fontSize: 13 }}>{value}</Typography>
      ) : (
        value
      )}
    </Box>
  </Box>
);

export default InProgressBookingDialog;
