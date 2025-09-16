import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

export default function DeleteSuccessDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#070F1E",
          color: "white",
          width: "400px",
          padding:"20px",
          borderRadius: "12px",
           border: "2px solid #0aaffb59",
          //boxShadow: "0px 0px 30px rgba(0, 17, 255, 0.39)", // glow shadow
          textAlign: "center",
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "600" , background: "linear-gradient(to right, #0aaefbff, #ed06deff)", // gradient colors
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent", fontSize:"24px" }}>
        <img
          src="/images/delete1.png"  // your success icon
          alt="success"
          width="80"
          height={80}
          style={{ marginBottom: 8 }}
        />
        <br />
        Delete Successfull !
      </DialogTitle>
      <DialogContent>
        
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          sx={{
            background: "linear-gradient(to right, #0a152bd0, #8a38f557)",
            color: "#fff",
            width:"150px",
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
