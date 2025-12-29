import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaymentSuccess from '../assets/PaymentSuccess.png';
import CancelPopup from './CancelPopup';
import axios from 'axios';

const methodUnitPrice = {
  Coin: 100,
  Arrow: 150,
  "Per Hour": 75,
};

const CheckoutGame = ({ game, handleClose, onPlayUpdate }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");

  // Form states(editable fields)
  const [units, setUnits] = useState("0");
  const [players, setPlayers] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [unitPrice, setUnitPrice] = useState(game.price);

  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);
  const handleConfirm = () => {
    setCancelOpen(false);
    handleClose();
  };

  if (!game) return null;

  // Calculate dynamic amounts
  const unitsNumber = Number(units) || 0;
  const playersNumber = Number(players) || 1;
  const fullAmount = game.team_game
    ? unitPrice * unitsNumber * playersNumber
    : unitPrice * unitsNumber;
  const discountNumber = Number(discount) || 0;
  const balance = fullAmount - discountNumber;

  const token = localStorage.getItem('aToken');

  // Handle method and payment
  const handlePay = async (gameId) => {
  try {
    let payload = {};

    
    if (selectedMethod === "Per Hour") {
      payload = {
        type: "Per Hour",
        hours: unitsNumber,
        players: playersNumber,
      };
    }

    
    if (selectedMethod === "Coin") {
      payload = {
        type: "Coin",
        coins: unitsNumber,
      };
    }

    if (selectedMethod === "Arrow") {
      payload = {
        type: "Arrow",
        arrows: unitsNumber,
      };
    }

    // Update method
    const res = await axios.post(
      `http://127.0.0.1:8000/api/games/${gameId}/play`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update balance
    await axios.post(
      `http://127.0.0.1:8000/api/games/${gameId}/balance`,
      { balance },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    //  Update UI
    onPlayUpdate?.(gameId, res.data.method);

    setPaymentSuccess(true);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  if (game?.method?.type) {
    setSelectedMethod(game.method.type);
  } else if (typeof game.method === "string") {
    setSelectedMethod(game.method);
  }
}, [game]);


  return (
    <div>
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
            maxWidth: "90vw"
          }
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>Checkout</DialogTitle>
          <IconButton onClick={handleClose} sx={{ color: "#374151" }}><CloseIcon /></IconButton>
        </Box>

        <DialogContent sx={{ py: 1 }}>
          {/* Unit Price */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              {game.team_game
                ? "1 Hour Price (per person):"
                : game.method === "Arrow"
                  ? "1 Arrow Price:"
                  : game.method === "Coin"
                    ? "1 Coin Price:"
                    : "Unit Price:"}
            </Typography>
            <TextField
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <span style={{ color: "#FFFFFF", fontSize: 14, marginRight: 1 }}>LKR</span>
                ),
                disableUnderline: true,
              }}
              variant="standard"
              sx={{
                width: `${(unitPrice?.toString().length || 1) * 9 + 26}px`,
                maxWidth: 100,
                backgroundColor: "#0E111B",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "flex-center",
                "& .MuiInputBase-root": {
                  padding: "0 !important",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 0,
                },
                "& input": {
                  color: "#FFFFFF",
                  textAlign: "right",
                  fontSize: 14,
                  padding: "4px 0",
                  lineHeight: 1.2,
                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "&[type=number]": { MozAppearance: "textfield" },
                },
                "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
                  display: "none",
                },
              }}
            />
          </Box>

          {/* Units */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              {game.team_game
                ? "Hours:"
                : game.method === "Arrow"
                  ? "Arrows:"
                  : game.method === "Coin"
                    ? "Coins:"
                    : "Unit Price:"}
            </Typography>
            <TextField
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              sx={{
                width: 70,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& .MuiInputBase-input": {
                  color: "#9CA3AF", textAlign: "center", fontSize: 14,
                  padding: "4px 0", lineHeight: 1.2,
                },
              }}
            />
          </Box>

          {game.team_game && (
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography fontSize={14} color="#FFFFFF">Players:</Typography>
              <TextField
                type="number"
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
                inputProps={{ min: 1 }}
                sx={{
                  width: 70,
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "& input[type=number]": { MozAppearance: "textfield" },
                  "& .MuiInputBase-input": {
                    color: "#9CA3AF",
                    textAlign: "center",
                    fontSize: 13,
                    padding: "4px 0",
                    lineHeight: 1.2,
                  },
                }}
              />
            </Box>
          )}

          {/* Full Amount */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">Full Amount:</Typography>
            <Typography fontSize={14} color="#FFFFFF">LKR {fullAmount}</Typography>
          </Box>

          {/* Discount */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">Discount:</Typography>
            <TextField
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <span style={{ color: "#9CA3AF", fontSize: 12 }}>LKR</span>
                ),
              }}
              sx={{
                width: 80,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& .MuiInputBase-input": {
                  color: "#9CA3AF",
                  textAlign: "center",
                  fontSize: 13,
                  padding: "4px 0",
                  lineHeight: 1.2,
                },
              }}
            />
          </Box>

          <hr style={{ border: "none", borderTop: "1px solid #374151" }} />

          {/* Balance */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={16} fontWeight='bold' color="#FFFFFF">Balance:</Typography>
            <Typography fontSize={16} fontWeight='bold' color="#0CD7FF">LKR {balance}</Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button onClick={handleCancelOpen} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', backgroundColor: "#1F2937", width: '50%', py: 0.5 }}>Cancel</Button>
          <Button onClick={() => handlePay(game.id)} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', py: 0.5, background: "linear-gradient(to right, #0CD7FF, #8A38F5)" }}>Pay Now</Button>
        </DialogActions>

        {/* Payment Success */}
        <Dialog open={paymentSuccess} PaperProps={{ sx: { bgcolor: "#0A192F", borderRadius: "16px", py: 2, px: 8, textAlign: "center", color: "white", border: '1px solid #3B4859' } }}>
          <DialogContent>
            <Box sx={{ mb: 1 }}><img src={PaymentSuccess} alt="" width={80} /></Box>
            <Typography variant="h6" sx={{ background: "linear-gradient(90deg, #00C6FF, #FF00CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 24, fontWeight: 600, mb: 1 }}>
              Payment Successful!
            </Typography>
            <Button onClick={handleConfirm} sx={{ px: 8, fontSize: 14, borderRadius: "8px", background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)", color: "white" }}>
              Ok
            </Button>
          </DialogContent>
        </Dialog>

        <CancelPopup open={cancelOpen} handleCancelClose={handleCancelClose} handleConfirm={handleConfirm} />
      </Dialog>
    </div>
  );
};

export default CheckoutGame;
