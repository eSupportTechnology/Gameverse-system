import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";

const PaymentSuccessPopup = ({ open, onClose, icon }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#0A192F",
          borderRadius: "16px",
          px: 4,
          py: 3,
          width: 400,
          textAlign: "center",
          border: "1px solid #3B4859",
        },
      }}
    >
      <DialogContent>

        {/* ICON */}
        <Box sx={{ mb: 2 }}>
          <img src={icon} alt="success" width={80} />
        </Box>

        {/* TEXT */}
        <Typography
          sx={{
            background: "linear-gradient(90deg,#00C6FF,#FF00CC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 24,
            fontWeight: 600,
            mb: 3,
          }}
        >
          Payment Successful !
        </Typography>

        {/* OK BUTTON */}
        <Button
          onClick={onClose}
          sx={{
            px: 8,
            py: 1.2,
            borderRadius: "10px",
            background: "linear-gradient(90deg, #00C6FF 0%, #7D2CFF 100%)",
            color: "#fff",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(90deg,#009EE0,#6A1CFF)",
            },
          }}
        >
          OK
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessPopup;
