import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function CreateSuccessDialog({ open, onClose }) {
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
          boxShadow: "0px 0px 30px rgba(8, 0, 255, 0.39)", // green glow
          textAlign: "center",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "600",
          background: "linear-gradient(to right, #1963f6d0, #e428edff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <img
          src="/images/create.png" // ✅ your success icon for create
          alt="success"
          width="40"
          style={{ marginBottom: 8 }}
        />
        <br />
        Create Successful!
      </DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          sx={{
             background: "linear-gradient(to right, #0a152bd0, #8a38f557)",
            color: "#fff",
            width: "100px",
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
