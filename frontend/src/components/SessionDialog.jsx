import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

// Popups
import axios from "axios";
import arrowIcon from "../assets/end.png";
import endSessionIcon from "../assets/q.png";
import EndSessionPopup from "../components/Endsession";
import UpdateSuccessDialog from "../components/UpdateSuccess";
import { calculateEndTime } from "./BookingDialog";

// --- helpers ---
const pad2 = (n) => String(n).padStart(2, "0");

export const minutesToHHMMDisplay = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${pad2(h)}:${pad2(m)}`;
};
export const formatAmount = (amount) => {
  const num = Math.round(amount);
  return String(num).padStart(3, "0");
};

// --- DetailRow ---
const DetailRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      py: 1,
      alignItems: "center",
    }}
  >
    <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 500 }}>
      {label}
    </Typography>
    <Box sx={{ ml: 2, textAlign: "right" }}>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  </Box>
);

// --- SessionDialog Component ---
const SessionDialog = ({ open, onClose, onEndSession, bookings = [] }) => {
  const [players, setPlayers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);

  useEffect(() => {
    const safeBookings = Array.isArray(bookings) ? bookings : [];

    const defaultStation =
      safeBookings.find((b) => b && b.station)?.station || "N/A";

    const playerSlots = [0, 1, 2, 3].map((index) => {
      const booking = safeBookings[index] || null;
      return {
        id: index + 1,
        name: `Player ${pad2(index + 1)}`,
        online: !!booking,
        booking: booking
          ? {
              ...booking,
              duration: booking.duration || "0h 0m",
              extended_time: booking.extended_time || 0,
            }
          : {
              id: null,
              customer_name: null,
              phone: null,
              station: defaultStation,
              duration: "0h 0m",
              start_time: "00:00",
              extended_time: 0,
              status: "upcoming",
              total_amount: 0,
              balance_amount: 0,
              online_deposit: 0,
              loyalty_points: 0,
              vr_play: null,
            },
      };
    });

    setPlayers(playerSlots);
    setActiveIndex(0);
  }, [bookings]);

  const activeBooking = players[activeIndex]?.booking || {
    station: players[0]?.booking.station || "N/A",
    duration: "0h 0m",
    extended_time: 0,
    start_time: "00:00",
    customer_name: null,
    phone: null,
    total_amount: 0,
    balance_amount: 0,
    online_deposit: 0,
    loyalty_points: null,
    status: "upcoming",
    vr_play: null,
  };

  useEffect(() => {
    if (activeBooking) {
      setCustomMinutes(activeBooking.extended_time || 0);
    } else {
      setCustomMinutes(0);
    }
  }, [activeIndex, activeBooking]);

  const adjustBy = (delta) => {
    setCustomMinutes((prev) => Math.max(0, prev + delta));
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    const num = val === "" ? 0 : parseInt(val, 10);
    if (num <= 480) setCustomMinutes(num);
  };

  const handleUpdateTime = async () => {
    if (!activeBooking) return;

    try {
      const updatedExtendedTime = Number(customMinutes);

      const slotBookings = players
        .map((p) => p.booking)
        .filter(
          (b) =>
            b &&
            b.station === activeBooking.station &&
            b.start_time === activeBooking.start_time &&
            b.booking_date === activeBooking.booking_date
        );

      const updatePromises = slotBookings.map((b) =>
        axios.put(`http://127.0.0.1:8000/api/bookings/${b.id}`, {
          extended_time: String(updatedExtendedTime),
        })
      );

      const responses = await Promise.all(updatePromises);

      const allSuccess = responses.every((res) => res.data.success);

      if (allSuccess) {
        setPlayers((prev) =>
          prev.map((p) => {
            if (!p.booking) return p;
            const match = slotBookings.find((b) => b.id === p.booking.id);
            if (match) {
              return {
                ...p,
                booking: { ...p.booking, extended_time: updatedExtendedTime },
              };
            }
            return p;
          })
        );
        setUpdateSuccessOpen(true);
      } else {
        console.error("Some updates failed:", responses);
      }
    } catch (error) {
      console.error(
        "Error updating slot bookings:",
        error.response?.data || error
      );
    }
  };

  const handleEndSessionClick = () => setEndSessionOpen(true);

  const handleEndSessionConfirmed = async () => {
    if (!activeBooking) return;

    const now = new Date();
    const pad2 = (n) => String(n).padStart(2, "0");
    const endTime = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${activeBooking.id}`,
        {
          status: "completed",
          end_time: endTime, // store the current time
        }
      );

      if (response.data.success) {
        setPlayers((prev) => {
          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            booking: {
              ...updated[activeIndex].booking,
              status: "completed",
              end_time: endTime,
            },
          };
          return updated;
        });

        setEndSessionOpen(false);
        if (typeof onEndSession === "function") {
          onEndSession(players[activeIndex]);
        }
        if (onClose) onClose();
      } else {
        console.error("Failed to end session:", response.data);
      }
    } catch (error) {
      console.error("Error ending session:", error.response?.data || error);
    }
  };

  const handleUpdateSuccessClose = () => setUpdateSuccessOpen(false);

  const getTimeLabel = () => "Min";

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
            borderRadius: "10px",
            border: "1px solid #22303f",
            overflow: "hidden",
          },
        }}
      >
        {/* Header */}
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

        <DialogContent sx={{ p: 3 }}>
          {/* Player Tabs */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            {players.map((p, i) =>
              p ? (
                <Box
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  sx={{
                    flex: 1,
                    cursor: "pointer",
                    py: 1.2,
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid #2c5d88dc",
                    position: "relative",
                    bgcolor: activeIndex === i ? "#00B8D4" : "#1E2535",
                    transition: "0.25s",
                  }}
                >
                  {p.booking && p.booking.id && (
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
              ) : null
            )}
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
            {/* TOP ROW: status + booking id + loyalty points */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* LEFT SIDE → Status + Name/ID/PN */}
              <Box sx={{ flex: 1 }}>
                {/* STATUS */}
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
                      bgcolor: "#8B5CF6",
                    }}
                  />
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

                {/* NAME / ID / PN */}
                <Typography
                  sx={{ fontWeight: 700, fontSize: 15, color: "#fff" }}
                >
                  Name: {activeBooking.customer_name}
                </Typography>
                <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>
                  ID: {activeBooking.id}
                </Typography>
                <Typography sx={{ color: "#9CA3AF", mt: 0.5, fontSize: 14 }}>
                  PN: {activeBooking.phone}
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign: "right",
                  minWidth: 120,
                }}
              >
                {/* Booking ID */}
                <Typography
                  sx={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 500,
                    mb: 2,
                  }}
                >
                  Booking #{activeBooking.id}
                </Typography>

                {/* Loyalty Points */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center", // center the points under the star
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
                      {activeBooking.loyalty_points} pts
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mt: 0.5 }}>
                  Loyalty Points
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Session + Payment Panels */}
          {activeBooking && (
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
                    activeBooking.vr_play === "yes"
                      ? `${activeBooking.station} + VR`
                      : activeBooking.station
                  }
                />
                <DetailRow
                  label="Time"
                  value={`${activeBooking.start_time} - ${calculateEndTime(
                    activeBooking.start_time,
                    activeBooking.duration
                  )}`}
                />
                <DetailRow label="Duration" value={activeBooking.duration} />
                <DetailRow
                  label="Extended Time"
                  value={minutesToHHMMDisplay(activeBooking.extended_time)}
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
                  value={`LKR ${formatAmount(activeBooking.online_deposit)}`}
                />
                <Box sx={{ my: 1.5, borderTop: "1px solid #374151" }} />
                <DetailRow
                  label="Total amounts"
                  value={
                    <span style={{ color: "#0CD7FF", fontWeight: 700 }}>
                      {`LKR ${formatAmount(activeBooking.total_amount)}`}
                    </span>
                  }
                />
                <DetailRow
                  label="Balance amounts"
                  value={
                    <span style={{ color: "#0CD7FF", fontWeight: 700 }}>
                      {`LKR ${formatAmount(activeBooking.balance_amount)}`}
                    </span>
                  }
                />
              </Box>
            </Box>
          )}

          {/* Time Controls */}
          {activeBooking && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
                bgcolor: "transparent",
                p: 2,
                borderRadius: 2,
                border: "1px solid #152833",
              }}
            >
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
                      color: "#000000",
                      padding: "12px 12px 12px 8px",
                    },
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#374151",
                      borderRadius: 1.5,
                      border: "1px solid #22303f",
                      "& fieldset": { border: "none" },
                    },
                    "& .MuiInputBase-input": {
                      color: "#0000",
                    },
                  }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: 35,
                    transform: "translateY(-50%)",
                    fontSize: "14px",
                    color: "black",
                    pointerEvents: "none",
                    fontWeight: 500,
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
                  minWidth: 250,
                  height: 44,
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, #00A3FF 0%, #A044FF 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "14px",
                  textTransform: "none",
                  "&:hover": { opacity: 0.95 },
                }}
              >
                Update Time
              </Button>
            </Box>
          )}

          {/* End Session button */}
          {activeBooking && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleEndSessionClick}
                sx={{
                  width: 220,
                  height: 48,
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #FD00B5 0%, #7E3AF2 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 16px rgba(138,56,245,0.18)",
                  "&:hover": { opacity: 0.95 },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  component="img"
                  src={arrowIcon}
                  alt="End Session"
                  sx={{
                    width: 30,
                    height: 30,
                    filter: "brightness(0) invert(1)",
                  }}
                />
                End Session
              </Button>
            </Box>
          )}
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

export default SessionDialog;
