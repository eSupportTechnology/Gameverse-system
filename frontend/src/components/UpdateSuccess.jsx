import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function UpdateSuccessDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#070F1E",
          color: "white",
          width: "350px",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0px 0px 30px rgba(0, 17, 255, 0.39)", // glow shadow
          textAlign: "center",
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "600",
          background: "linear-gradient(to right, #0aaefbff, #ed06deff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <img
          src="/images/successu.png" // ✅ your update success icon
          alt="success"
          width="40"
          style={{ marginBottom: 8 }}
        />
        <br />
        Update Successfull !
      </DialogTitle>

      <DialogContent />

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          sx={{
            background: "linear-gradient(to right, #0a152bd0, #8a38f557)",
            color: "#fff",
            width: "100px",
            textTransform: "none",
            px: 3,
            "&:hover": { opacity: 0.9 },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
