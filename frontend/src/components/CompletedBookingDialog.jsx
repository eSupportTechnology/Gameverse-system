import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import PaymentSuccessPopup from "../components/paymentsuccess";
import successicon from "../assets/success.png";

const CompletedBookingDialog = ({
  open,
  onClose,
  onCollectPayment,
  bookings,
}) => {
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);

  useEffect(() => {
    if (safeBookings.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= safeBookings.length) {
      setActiveIndex(0);
    }
  }, [safeBookings, activeIndex]);

  const activeBooking = safeBookings[activeIndex] || {};

  const handleCollectPayment = () => {
    if (onClose) onClose();

    setTimeout(() => {
      setPaymentSuccessOpen(true);
    }, 300);

    if (onCollectPayment) {
      onCollectPayment(activeBooking);
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
            borderRadius: "12px",
            color: "#fff",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            border: "1px solid #374151",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            pt: 3,
            pb: 1,
          }}
        >
          <DialogTitle
            sx={{
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: "bold",
              p: 0,
            }}
          >
            Booking Details
          </DialogTitle>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#FFFFFF",
              "&:hover": { bgcolor: "#374151" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/*
        <DialogContent sx={{ py: 0, pb: 3, px: 3 }}>
          
          <Box sx={{ display: "flex", gap: 1.5, mb: 3,mt:1.5 }}>
            {players.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => setActiveIndex(i)}
                sx={{
                  flex: 1,
                  cursor: "pointer",
                  border: "1px solid  #2c5d88dc",
                  py: 1.2,
                  borderRadius: "8px",
                  textAlign: "center",
                  position: "relative",
                  bgcolor: activeIndex === i ? "#00B8D4" : "transparent",
                  transition: "0.25s",
                  "&:hover": { bgcolor: "transparent" },
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
*/}
        <DialogContent sx={{ py: 0, pb: 3, px: 3 }}>
          <Box sx={{ display: "flex", gap: 1.5, mb: 3, mt: 1.5 }}>
            {safeBookings.map((p, i) => (
              <Box
                key={p.id}
                onClick={() => setActiveIndex(i)}
                sx={{
                  flex: 1,
                  cursor: "pointer",
                  border: "1px solid #2c5d88dc",
                  py: 1.2,
                  borderRadius: "8px",
                  textAlign: "center",
                  position: "relative",
                  bgcolor: activeIndex === i ? "#00B8D4" : "transparent",
                  transition: "0.25s",
                }}
              >
                {p.is_online === 1 && (
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
                  Player {String(i + 1).padStart(2, "0")}
                </Typography>
              </Box>
            ))}
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
                      {activeBooking.loyalty_points ?? 0} pts
                    </Typography>
                  </Box>
                </Box>

                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mt: 0.5 }}>
                  Loyalty Points
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Session Details & Payment Info - SIDE BY SIDE */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
            }}
          >
            {/* Session Details - Left Side */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#18212F",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #374151",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SportsEsportsIcon sx={{ color: "#0CD7FF", fontSize: 18 }} />
                <Typography fontSize={15} fontWeight={600} color="#FFFFFF">
                  Session Details
                </Typography>
              </Box>

              <DetailRow label="Station:" value={activeBooking.station} />
              <DetailRow
                label="Time:"
                value={`${activeBooking.start_time} - ${activeBooking.end_time}`}
              />
              <DetailRow label="Duration:" value={activeBooking.duration} />
              <DetailRow
                label="Extended Time:"
                value={activeBooking.extended_time}
              />
            </Box>

            {/* Payment Info - Right Side */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#18212F",
                p: 2,
                borderRadius: "8px",
                border: "1px solid #374151",
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CreditCardIcon sx={{ color: "#8A38F5", fontSize: 18 }} />
                <Typography fontSize={15} fontWeight={600} color="#FFFFFF">
                  Payment Info
                </Typography>
              </Box>

              <DetailRow
                label="Online Deposit"
                value={`LKR ${activeBooking.online_deposit}`}
              />
              <Box sx={{ my: 1.5, borderTop: "1px solid #374151" }} />
              <DetailRow
                label="Total amounts:"
                value={`LKR ${activeBooking.total_amount}`}
                highlight
              />
              <DetailRow
                label="Balance amounts:"
                value={`LKR ${activeBooking.balance_amount}`}
                highlight
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
                background: "linear-gradient(90deg, #7A28E5 0%, #00C7EF 100%)",
                boxShadow: "0 6px 16px rgba(138, 56, 245, 0.4)",
              },
            }}
          >
            Collect Payment
          </Button>
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
