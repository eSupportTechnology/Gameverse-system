import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import gameicon from '../assets/gameicon.png'
import CancelPopup from './CancelPopup';

const AddNewGame = ({ open, handleClose }) => {

  const [createSuccess, setcreateSuccess] = useState(false);
  const [cancelOpen, setcancelOpen] = useState(false);


  const handleCancelOpen = () => setcancelOpen(true);
  const handleCancelClose = () => setcancelOpen(false);

  // handle New game
  const handlNewGame = () => {
    console.log("Booking updated successfully!");
    setcreateSuccess(true)

  };

  const handleConfirm = () => {
    console.log("Booking cancelled!");
    setcancelOpen(false);
    handleClose(false)
  };


  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: "12px", backgroundColor: "#111827", color: "white", py: 2, border: '1px solid #374151', },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold", }}>
            Add New Game
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>

          {/* Game name */}
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            {/* Label */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Game Name
            </Typography>

            {/* Input */}
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter game name"
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Location */}
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            {/* Label */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Location
            </Typography>

            {/* Input */}
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Zone A,Zone B,...etc"
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box display="flex" justifyContent="flex-start" width="50%">
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Pricing Method
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
            {/* pricing method */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "#9CA3AF" }}
              >
                Playing Method
              </Typography>

              {/* Input */}
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Coin"
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      fontSize: "14px",
                    },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            {/* price */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "#9CA3AF" }}
              >
                Price
              </Typography>

              {/* Input */}
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="LKR  100"
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      fontSize: "14px",
                    },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        {/* cancel & create button */}
        <DialogActions sx={{ px: 3 }}>
          <Button  onClick={handleCancelOpen} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', backgroundColor: "#1F2937", width: '50%', py: 0.5, textTransform: 'capitalize', "&:hover": { bgcolor: "#374151" }, }}>
            Cancel
          </Button>
          <Button
            onClick={handlNewGame}
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
            Create
          </Button>
          {/* create Success Popup */}
          <Dialog
            open={createSuccess}
            PaperProps={{
              sx: {
                bgcolor: "#0A192F",
                borderRadius: "16px",
                py: 2,
                px: 8,
                textAlign: "center",
                color: "white",
                border: '1px solid #3B4859'
              },
            }}
          >
            <DialogContent>
              <Box sx={{ mb: 1, }}>
                <img src={gameicon} alt="" width={80} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: 24,
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Create Successful !
              </Typography>
              <Button
                onClick={() => setcreateSuccess(false)}
                sx={{
                  px: 8,
                  fontSize: 14,
                  textTransform: 'capitalize',
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0CD7FF 0%, #8A38F5 73%)",
                  },
                }}
              >
                Ok
              </Button>
            </DialogContent>
          </Dialog>
        </DialogActions>

        {/* cances box */}
        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirm}
        />
      </Dialog>

    </div>
  )
}

export default AddNewGame
