import React from "react";
import { Button, Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import cancelicon from '../assets/cancelicon.png'

export default function CancelPopup({ open, handleCancelClose, handleConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={handleCancelClose}
      PaperProps={{
        sx: {
          bgcolor: "#0A192F",
          borderRadius: "16px",
          py: 2,
          px: 4,
          textAlign: "center",
          color: "white",
        },
      }}
    >
      <DialogContent>
        <Box sx={{ mb: 2, }}>
          <img src={cancelicon} alt="" width={80} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          Are you sure to cancel this?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={handleConfirm}
          sx={{
            px: 4,
            fontSize:12,
            textTransform:'capitalize',
            borderRadius: "8px",
            background: "linear-gradient(90deg, #0CD7FF, #8A38F5)",
            color: "white",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Yes
        </Button>

        <Button
          onClick={handleCancelClose}
          sx={{
            px: 4,
            fontSize:12,
            textTransform:'capitalize',
            borderRadius: "8px",
            background: "linear-gradient(90deg, #0CD7FF, #8A38F5)",
            color: "white",
            "&:hover": { opacity: 0.9 },
          }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}
