import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function DeleteConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#070F1E",
          color: "white",
          width: "400px",
          borderRadius: "12px",
           border: "2px solid #0aaffb59",
          //boxShadow: "0px 0px 30px rgba(0, 17, 255, 0.39)", // 🔥 glow shadow
          textAlign: "center",
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "600",fontSize: "24px",}}>
        <img
          src="/images/q.png" // 🔹 your delete icon PNG
          alt="delete"
          width="80"
          height={80}
          style={{ marginBottom: 8 }}
        />
        <br />
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this user?</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          sx={{ color: "#9CA3AF", textTransform: "none", background: "linear-gradient(to right, #8a38f557, #0a152bd0)", }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
               background: "linear-gradient(to right, #0a152bd0, #8a38f557)",
            color: "#fff",
            textTransform: "none",
           // width: "150px",
            px: 3,
            "&:hover": { opacity: 0.9 },
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
