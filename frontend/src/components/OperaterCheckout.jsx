import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaymentSuccess from "../assets/PaymentSuccess.png";
import CancelPopup from "./CancelPopup";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../apiConfig";

// Define per-method unit prices
const methodUnitPrice = {
  Coin: 100,
  Arrow: 150,
  "Per Hour": 75,
};

const CheckoutGameOperator = ({ game, handleClose, onCheckoutComplete }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);
  const handleConfirm = () => {
    setCancelOpen(false);
    handleClose(false);
  };

  if (!game) return null;

  const unitPrice = methodUnitPrice[game.method] || 0;
  const units = Math.floor(game.price / unitPrice) || 1;
  const fullAmount = unitPrice * units;
  const discount = 0;
  const balance = fullAmount - discount;

  const handlePay = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("oToken");

      // Example API endpoint for operator checkout
      await axios.post(
        `${API_BASE_URL}/api/operator/games/${game.id}/checkout`,
        { amount: balance },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLoading(false);
      setPaymentSuccess(true);
      toast.success("Payment successful!");

      // Refresh parent data if provided
      if (onCheckoutComplete) onCheckoutComplete();
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div>
      {/* Checkout Dialog */}
      <Dialog
        open={Boolean(game)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: "#0E111B",
            borderRadius: "12px",
            color: "#fff",
            px: 2,
            pb: 2,
            width: "360px",
            maxWidth: "90vw",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 0,
          }}
        >
          <DialogTitle
            sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}
          >
            Operator Checkout
          </DialogTitle>
          <IconButton onClick={handleClose} sx={{ color: "#374151" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Details */}
        <DialogContent sx={{ py: 1 }}>
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Game:
            </Typography>
            <Typography fontSize={14} color="#0CD7FF">
              {game.title}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Location:
            </Typography>
            <Typography fontSize={14} color="#9CA3AF">
              {game.location}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Unit Price:
            </Typography>
            <Typography fontSize={14} color="#FFFFFF">
              LKR {unitPrice}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              {game.method}:
            </Typography>
            <Typography
              fontSize={13}
              color="#9CA3AF"
              sx={{
                border: "1px solid #374151",
                py: 0.2,
                px: 2,
                minWidth: 50,
                textAlign: "center",
              }}
            >
              {units}
            </Typography>
          </Box>

          <hr style={{ border: "none", borderTop: "1px solid #374151" }} />

          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={16} fontWeight="bold" color="#FFFFFF">
              Total:
            </Typography>
            <Typography fontSize={16} fontWeight="bold" color="#0CD7FF">
              LKR {balance}
            </Typography>
          </Box>
        </DialogContent>

        {/* Buttons */}
        <DialogActions sx={{ px: 2 }}>
          <Button
            onClick={handleCancelOpen}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              backgroundColor: "#1F2937",
              width: "50%",
              py: 0.5,
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handlePay}
            variant="contained"
            disabled={loading}
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              width: "50%",
              py: 0.5,
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
            }}
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </DialogActions>

        {/* Payment Success Popup */}
        <Dialog
          open={paymentSuccess}
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
              <img src={PaymentSuccess} alt="" width={80} />
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
              Payment Successful!
            </Typography>
            <Button
              onClick={() => {
                setPaymentSuccess(false);
                handleClose();
              }}
              sx={{
                px: 8,
                fontSize: 14,
                borderRadius: "8px",
                background:
                  "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
                color: "white",
              }}
            >
              Ok
            </Button>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation */}
        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirm}
        />
      </Dialog>
    </div>
  );
};

export default CheckoutGameOperator;
