import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

import successicon from "../assets/success.png";
import PaymentSuccessPopup from "../components/paymentsuccess";
import { calculateEndTime } from "./BookingDialog";
import { formatAmount, minutesToHHMMDisplay } from "./SessionDialog";

const CompletedBookingDialog = ({
  open,
  onClose,
  onCollectPayment,
  bookings,
}) => {
  const [activePlayer, setActivePlayer] = useState(0);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
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
      status: b?.status || "Completed",
      id: b?.id || null,
    };
  });
  const booking = playerSlots[activePlayer];

  const handleCollectPayment = () => {
    if (onClose) onClose();

    setTimeout(() => {
      setPaymentSuccessOpen(true);
    }, 300);

    if (onCollectPayment) {
      onCollectPayment(booking);
    }
  };

  const handlePaymentSuccessClose = () => {
    setPaymentSuccessOpen(false);
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

            {/* Status & Customer Info */}
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
                        bgcolor: "#FD00B5",
                      }}
                    />
                    <Typography
                      sx={{
                        bgcolor: "#FD00B5",
                        color: "#fff",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "14px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Completed
                    </Typography>
                  </Box>

                  {/* NAME / ID / PN */}
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
                    Booking #{booking.id}
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

            {/* Collect Payment Button */}
            <Button
              fullWidth
              onClick={handleCollectPayment}
              sx={{
                background: "linear-gradient(90deg, #8A38F5 0%, #0CD7FF 100%)",
                fontSize: 16,
                color: "#fff",
                py: 1.5,
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(138, 56, 245, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #7A28E5 0%, #00C7EF 100%)",
                  boxShadow: "0 6px 16px rgba(138, 56, 245, 0.4)",
                },
              }}
            >
              Collect Payment
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Payment Success Popup */}
      <PaymentSuccessPopup
        open={paymentSuccessOpen}
        onClose={handlePaymentSuccessClose}
        icon={successicon}
      />
    </>
  );
};

// Reusable detail row component
const DetailRow = ({ label, value, highlight = false }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
    <Typography
      fontSize={13}
      color={highlight ? "#0CD7FF" : "#9CA3AF"}
      fontWeight={highlight ? 600 : 400}
    >
      {label}
    </Typography>
    <Typography
      fontSize={13}
      color={highlight ? "#0CD7FF" : "#FFFFFF"}
      fontWeight={highlight ? 600 : 400}
    >
      {value}
    </Typography>
  </Box>
);

export default CompletedBookingDialog;
