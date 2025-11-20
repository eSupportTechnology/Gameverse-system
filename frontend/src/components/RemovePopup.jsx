import React from "react";
import { Button, Dialog, DialogActions, DialogContent, Typography, Box } from "@mui/material";
import cancelicon from '../assets/cancelicon.png'


const RemovePopup = ({ open, handleRemoveClose,message, removeConfirm }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleRemoveClose}
        PaperProps={{
          sx: {
            bgcolor: "#0A192F",
            borderRadius: "16px",
            border: '1px solid #3B4859',
            py: 2,
            px: 2,
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
            {message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={removeConfirm}
            sx={{
              px: 4,
              fontSize: 12,
              textTransform: 'capitalize',
              borderRadius: "8px",
              background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(93, 113, 249, 0.4) 47%, rgba(138, 56, 245, 0.4) 73%)",
              color: "white",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Yes
          </Button>

          <Button
            onClick={handleRemoveClose}
            sx={{
              px: 4,
              fontSize: 12,
              textTransform: 'capitalize',
              borderRadius: "8px",
              background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(93, 113, 249, 0.4) 47%, rgba(138, 56, 245, 0.4) 73%)",
              color: "white",
              "&:hover": { opacity: 0.9 },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default RemovePopup
