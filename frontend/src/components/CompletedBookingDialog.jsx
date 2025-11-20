// components/CompletedBookingDialog.jsx
import React, { useState } from 'react';
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

const CompletedBookingDialog = ({ open, onClose, onCollectPayment }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);

  // Sample completed booking data for each player
  const players = [
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
        status: "completed"
      }
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
        extended_time: "15.00",
        online_deposit: "200",
        total_amount: "500",
        balance_amount: "300",
        loyalty_points: 120,
        status: "completed"
      }
    },
    {
      id: 3,
      name: "Player 03",
      online: false,
      booking: {
        id: "345678",
        customer_name: "Saman Silva",
        phone: "+94 712345678",
        station: "PS5 Station 3",
        start_time: "15:00",
        end_time: "17:00",
        duration: "2h 0m",
        extended_time: "00.00",
        online_deposit: "150",
        total_amount: "450",
        balance_amount: "300",
        loyalty_points: 180,
        status: "completed"
      }
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
        extended_time: "30.00",
        online_deposit: "100",
        total_amount: "300",
        balance_amount: "200",
        loyalty_points: 90,
        status: "completed"
      }
    }
  ];

  const activeBooking = players[activeIndex]?.booking;

  const handleCollectPayment = () => {
    // Close the current dialog
    if (onClose) onClose();
    
    // Open payment success popup after a short delay
    setTimeout(() => {
      setPaymentSuccessOpen(true);
    }, 300);

    // Call the original onCollectPayment if provided
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
            bgcolor: "##111827", 
            borderRadius: "12px", 
            color: "#fff",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            border: "1px solid #374151"
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, pt: 3, pb: 1 }}>
          <DialogTitle sx={{ 
            color: "#FFFFFF", 
            fontSize: 20, 
            fontWeight: "bold",
            p: 0
          }}>
            Booking Details
          </DialogTitle>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: "#FFFFFF",
              '&:hover': { bgcolor: "#374151" }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 0, pb: 3, px: 3 }}>
          {/* Player Tabs - EXACT SAME as InProgressBookingDialog */}
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
                  bgcolor: activeIndex === i ? "#00B8D4" : "#1E2535",
                  transition: "0.25s",
                  "&:hover": { bgcolor: "#00B8D4" },
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

          {/* Status & Customer Info */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            mb: 3,
            p: 2,
            bgcolor: '#18212F',
            borderRadius: '8px',
            border: '1px solid #374151'
          }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                bgcolor: "#FD00B5", 
                color: "#fff",
                px: 2,
                py: 0.5,
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                mb: 2
              }}>
                Completed
              </Box>
              <Box>
                <Typography fontSize={14} fontWeight="bold" color="#FFFFFF" mb={0.5}>
                  Name : {activeBooking.customer_name}
                </Typography>
                <Typography fontSize={12} color="#9CA3AF" mb={0.5}>ID : {activeBooking.id}</Typography>
                <Typography fontSize={12} color="#9CA3AF">PN : {activeBooking.phone}</Typography>
              </Box>
            </Box>

            {/* Booking ID & Loyalty Points */}
            <Box textAlign="right" sx={{ flex: 0.4 }}>
              <Typography fontSize={12} color="#FFFFFF" mb={1}>
                Booking #{activeBooking.id}
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <StarIcon sx={{ color: '#C2048F', fontSize: 16 }} />
                  <Typography fontWeight="bold" color="#C2048F" fontSize={14}>
                    {activeBooking.loyalty_points} pts
                  </Typography>
                </Box>
              </Box>
              <Typography fontSize={10} color="#9CA3AF" mt={0.5}>Loyalty Points</Typography>
            </Box>
          </Box>

          {/* Session Details & Payment Info - SIDE BY SIDE */}
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            mb: 3 
          }}>
            {/* Session Details - Left Side */}
            <Box sx={{ 
              flex: 1,
              bgcolor: "#18212F", 
              p: 2, 
              borderRadius: "8px",
              border: "1px solid #374151"
            }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SportsEsportsIcon sx={{ color: "#0CD7FF", fontSize: 18 }} />
                <Typography fontSize={15} fontWeight={600} color="#FFFFFF">
                  Session Details
                </Typography>
              </Box>
              
              <DetailRow label="Station:" value={activeBooking.station} />
              <DetailRow label="Time:" value={`${activeBooking.start_time} - ${activeBooking.end_time}`} />
              <DetailRow label="Duration:" value={activeBooking.duration} />
              <DetailRow label="Extended Time:" value={activeBooking.extended_time} />
            </Box>

            {/* Payment Info - Right Side */}
            <Box sx={{ 
              flex: 1,
              bgcolor: "#18212F", 
              p: 2, 
              borderRadius: "8px",
              border: "1px solid #374151"
            }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CreditCardIcon sx={{ color: "#8A38F5", fontSize: 18 }} />
                <Typography fontSize={15} fontWeight={600} color="#FFFFFF">
                  Payment Info
                </Typography>
              </Box>
              
              <DetailRow label="Online Deposit" value={`LKR ${activeBooking.online_deposit}`} />
              <Box sx={{ my: 1.5, borderTop: "1px solid #374151" }} />
              <DetailRow label="Total amounts:" value={`LKR ${activeBooking.total_amount}`} highlight />
              <DetailRow label="Balance amounts:" value={`LKR ${activeBooking.balance_amount}`} highlight />
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
              boxShadow: '0 4px 12px rgba(138, 56, 245, 0.3)',
              '&:hover': {
                background: "linear-gradient(90deg, #7A28E5 0%, #00C7EF 100%)",
                boxShadow: '0 6px 16px rgba(138, 56, 245, 0.4)',
              }
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