import React from "react";
import { Dialog, DialogContent, Box, Typography, Button } from "@mui/material";

const EndSessionPopup = ({ open, onClose, onConfirm, icon }) => {
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
          width: 420,
          textAlign: "center",
          border: "1px solid #3B4859",
        },
      }}
    >
      <DialogContent>

        {/* ICON */}
        <Box sx={{ mb: 2, mt: 1 }}>
          <img src={icon} alt="warning" width={80} />
        </Box>

        {/* TEXT */}
        <Typography
          sx={{
            background: "linear-gradient(90deg,#00C6FF,#FF00CC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 24,
            fontWeight: 600,
            mb: 2,
          }}
        >
          Are you want to end the session?
        </Typography>

        {/* BUTTONS */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
          <Button
            onClick={onConfirm}
            sx={{
              px: 5,
              py: 1.2,
              borderRadius: "10px",
              background: "linear-gradient(90deg, #00C6FF 0%, #7D2CFF 100%)",
              color: "#fff",
              fontWeight: 600,
              textTransform: "capitalize",
              "&:hover": {
                background: "linear-gradient(90deg,#009EE0,#6A1CFF)",
              },
            }}
          >
            Yes
          </Button>

          <Button
            onClick={onClose}
            sx={{
              px: 5,
              py: 1.2,
              borderRadius: "10px",
              background: "linear-gradient(90deg, #2C2F3A, #1B1D25)",
              color: "#fff",
              fontWeight: 600,
              textTransform: "capitalize",
              "&:hover": { opacity: 0.8 },
            }}
          >
            No
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EndSessionPopup;
