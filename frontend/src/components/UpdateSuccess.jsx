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
          width: "400px",
          padding: "20px",
          border: "2px solid #0aaffb59",
          borderRadius: "12px",
         // boxShadow: "0px 0px 30px rgba(0, 17, 255, 0.39)", // glow shadow
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
           fontSize: "24px",
          WebkitTextFillColor: "transparent",
        }}
      >
        <img
          src="/images/successu.png" // ✅ your update success icon
          alt="success"
          width="80"
          height={80}
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
            background: "linear-gradient(to right, #135b70d0, #8a38f557)",
            color: "#fff",
            width: "150px",
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
