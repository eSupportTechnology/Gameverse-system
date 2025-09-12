import React from 'react'
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


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
  return (
    <div>
      <Dialog
        open={Boolean(game)}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { bgcolor: "#0E111B", borderRadius: "12px", color: "#fff", px: 1, pb: 1 },
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
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontSize={14} color="#FFFFFF">
              {priceLabels[game.category] || "Price:"}
            </Typography>
            <Typography fontSize={14} color="#FFFFFF">
              LKR {game.price}
            </Typography>
          </Box>

          {/* Arrow/coins/hour */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontSize={14} color="#FFFFFF">
              {game.playing_method}:
            </Typography>
            <Typography fontSize={13} color="#9CA3AF" sx={{ border: '1px solid #374151', py: 0.2, px: 2 }}>
              {game.quntity} {methodLabels[game.category] || "Price:"}
            </Typography>
          </Box>

          {/* Show only for Carrom */}
          {game.category === "Carrom" && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography fontSize={14} color="#FFFFFF">
                Players:
              </Typography>
              <Typography
                fontSize={13}
                color="#9CA3AF"
                sx={{ border: "1px solid #374151", py: 0.2, px: 2 }}
              >
                {game.players}
              </Typography>
            </Box>
          )}


          {/* Full amount */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontSize={14} color="#FFFFFF">
              Full Amount:
            </Typography>
            <Typography fontSize={14} color="#FFFFFF">
              LKR {game.full_amount}
            </Typography>
          </Box>

          {/* Discount price */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontSize={14} color="#FFFFFF">
              Discount Price:
            </Typography>
            <Typography fontSize={12} color="#9CA3AF" sx={{ border: '1px solid #374151', py: 0.2, px: 2 }}>
              LKR {game.discount_price}
            </Typography>
          </Box>
          <hr style={{ border: "none", borderTop: "1px solid #374151" }} />

          {/* Balnce payement */}
          <Box display="flex" justifyContent="space-between" mb={1}>
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

      </Dialog>

    </div>
  )
}

export default CheckoutGame
