import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";

// Mock players data for completed bookings
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
      end_time: "12:30",
      duration: "2h 0m",
      extended_time: "00.00",
      online_deposit: "000",
      total_amount: "400",
      balance_amount: "000",
      loyalty_points: 150,
      status: "completed",
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
      station: "PS5 Station 2",
      start_time: "14:00",
      end_time: "15:30",
      duration: "1h 30m",
      extended_time: "00.15",
      online_deposit: "200",
      total_amount: "500",
      balance_amount: "300",
      loyalty_points: 120,
      status: "completed",
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
      station: "PS5 Station 3",
      start_time: "16:30",
      end_time: "18:30",
      duration: "2h 0m",
      extended_time: "00.10",
      online_deposit: "100",
      total_amount: "400",
      balance_amount: "100",
      loyalty_points: 180,
      status: "completed",
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
      end_time: "20:30",
      duration: "2h 30m",
      extended_time: "00.20",
      online_deposit: "300",
      total_amount: "700",
      balance_amount: "400",
      loyalty_points: 200,
      status: "completed",
    },
  },
];

const CompletedBookingDialog = ({ open, onClose, onCollectPayment }) => {
  const [activePlayer, setActivePlayer] = useState(0);
  const player = mockPlayers[activePlayer];
  const booking = player.booking;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0B1220",
          color: "#fff",
          borderRadius: "16px",
          border: "1px solid #1F2937",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          pb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
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

      <DialogContent sx={{ p: 3, pt: 0 }}>
        {/* Player Tabs */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
          {mockPlayers.map((p, i) => (
            <Box
              key={p.id}
              onClick={() => setActivePlayer(i)}
              sx={{
                flex: 1,
                cursor: "pointer",
                py: 1.2,
                borderRadius: "8px",
                textAlign: "center",
                position: "relative",
                bgcolor: activePlayer === i ? "#00B8D4" : "#1E2535",
                transition: "0.25s",
                "&:hover": { bgcolor: "#263145" },
              }}
            >
              {p.online && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#00FF00",
                    boxShadow: "0 0 8px 2px rgba(0,255,0,0.6)",
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
            bgcolor: "#151C2C",
            borderRadius: "12px",
            p: 2.5,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  bgcolor: "#FD00B533",
                  color: "#FD00B5",
                  borderRadius: "20px",
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                Completed
              </Box>
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

            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  color: "#FD00B5",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  gap: 0.5,
                }}
              >
                <StarIcon sx={{ fontSize: 16, color: "#FD00B5" }} />
                {booking.loyalty_points} pts
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: "#9CA3AF",
                }}
              >
                Loyalty Points
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ fontWeight: "bold", mb: 0.5 }}>
            Name : {booking.customer_name}
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mb: 0.5 }}>
            ID : {booking.id}
          </Typography>
          <Typography sx={{ color: "#9CA3AF" }}>
            PN : {booking.phone}
          </Typography>
        </Box>

        {/* Session + Payment Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          {/* Session Details */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#151C2C",
              borderRadius: "12px",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>
              🎮 Session Details
            </Typography>
            <DetailRow label="Station" value={booking.station} />
            <DetailRow
              label="Time"
              value={`${booking.start_time} - ${booking.end_time}`}
            />
            <DetailRow label="Duration" value={booking.duration} />
            <DetailRow
              label="Extended Time"
              value={booking.extended_time}
            />
          </Box>

          {/* Payment Info */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#151C2C",
              borderRadius: "12px",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>
              💳 Payment Info
            </Typography>
            <DetailRow
              label="Online Deposit"
              value={`LKR ${booking.online_deposit}`}
            />
            <DetailRow
              label="Total amounts:"
              value={`LKR ${booking.total_amount}`}
              highlight
            />
            <DetailRow
              label="Balance amounts:"
              value={`LKR ${booking.balance_amount}`}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: "#1F2937", mb: 2 }} />

        {/* Collect Payment Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={onCollectPayment}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            py: 1.5,
            fontSize: "1rem",
            background:
              "linear-gradient(90deg, #00C6FF 0%, #8B00FF 100%)",
            "&:hover": {
              background:
                "linear-gradient(90deg, #00B0E0 0%, #7800E0 100%)",
            },
          }}
        >
          Collect Payment
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// DetailRow component for table rows
const DetailRow = ({ label, value, highlight }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 1,
    }}
  >
    <Typography sx={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
      {label}:
    </Typography>
    <Typography
      sx={{
        color: highlight ? "#00C6FF" : "#fff",
        fontSize: "0.875rem",
        fontWeight: highlight ? "bold" : "normal",
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default CompletedBookingDialog;
