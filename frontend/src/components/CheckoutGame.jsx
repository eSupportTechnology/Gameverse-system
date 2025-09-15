import React, { useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PaymentSuccess from '../assets/PaymentSuccess.png'


const priceLabels = {
  "Arcade Machine": "Coin Price:",
  Archery: "Arrow Price:",
  Carrom: "Hour Price (per person):",
};

const methodLabels = {
  "Arcade Machine": "Coin",
  Archery: "Arrows",
  Carrom: "hours:",
};

const CheckoutGame = ({ game, handleClose }) => {

  const [paymentSuccess, setPaymentSuccess] = useState(false);
   
    // handle payment
    const handlpay = () => {
      console.log("payament successfully!");
      setPaymentSuccess(true)
  
    };

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
            px: 1,
            pb: 1,
            width: "360px",
            maxWidth: "90vw",
          },
        }}
      >
        {/*Header  */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0, }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold", }}>
            Checkout
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#374151", mr: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 0 }}>
          {/* Arrow/coins/hour price */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              {priceLabels[game.category] || "Price:"}
            </Typography>
            <Typography fontSize={14} color="#FFFFFF">
              LKR {game.price}
            </Typography>
          </Box>

          {/* Arrow/coins/hour */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              {game.playing_method}:
            </Typography>
            <Typography fontSize={13} color="#9CA3AF"
              sx={{
                border: '1px solid #374151',
                py: 0.2,
                px: 2,
                minWidth: "50px",
                textAlign: "center",
                display: "inline-block",
              }}
            >
              {game.quntity} {methodLabels[game.category] || "Price:"}
            </Typography>
          </Box>

          {/* Show only for Carrom */}
          {game.category === "Carrom" && (
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography fontSize={14} color="#FFFFFF">
                Players:
              </Typography>
              <Typography
                fontSize={13}
                color="#9CA3AF"
                sx={{
                  border: '1px solid #374151',
                  py: 0.2,
                  px: 2,
                  minWidth: "50px",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                {game.players}
              </Typography>
            </Box>
          )}


          {/* Full amount */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Full Amount:
            </Typography>
            <Typography fontSize={14} color="#FFFFFF">
              LKR {game.full_amount}
            </Typography>
          </Box>

          {/* Discount price */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Discount Price:
            </Typography>
            <Typography fontSize={12} color="#9CA3AF"
              sx={{
                border: '1px solid #374151',
                py: 0.2,
                px: 2,
                minWidth: "50px",
                textAlign: "center",
                display: "inline-block",
              }}>
              LKR {game.discount_price}
            </Typography>
          </Box>
          <hr style={{ border: "none", borderTop: "1px solid #374151" }} />

          {/* Balnce payement */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={16} fontWeight='bold' color="#FFFFFF">
              Balance payment:
            </Typography>
            <Typography fontSize={16} fontWeight='bold' color="#0CD7FF">
              LKR {game.full_amount}
            </Typography>
          </Box>


        </DialogContent>
        <DialogActions sx={{ px: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', backgroundColor: "#1F2937", width: '50%', py: 0.5, textTransform: 'capitalize', "&:hover": { bgcolor: "#374151" }, }}>
            Cancel
          </Button>
          <Button
            onClick={handlpay}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: 'bold',
              width: '50%',
              py: 0.5,
              textTransform: 'capitalize',
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}
          >
            Pay Now
          </Button>

        </DialogActions>
        {/* create Success Popup */}
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
              border: '1px solid #3B4859'
            },
          }}
        >
          <DialogContent>
            <Box sx={{ mb: 1, }}>
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
                mb: 1
              }}
            >
             Payment Successful !
            </Typography>
            <Button
              onClick={() => setPaymentSuccess(false)}
              sx={{
                px: 8,
                fontSize: 14,
                textTransform: 'capitalize',
                borderRadius: "8px",
                background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(90deg, #0CD7FF 0%, #8A38F5 73%)",
                },
              }}
            >
              Ok
            </Button>
          </DialogContent>
        </Dialog>

      </Dialog>

    </div>
  )
}

export default CheckoutGame
