import React, { useState, useEffect } from 'react';
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
import CancelPopup from './CancelPopup';
import gameicon from '../assets/gameicon.png';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddNewGame = ({ open, handleClose, mode = "add", initialData = {}, onSubmit }) => {
  const [createSuccess, setCreateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [coin, setCoin] = useState("");
  const [price, setPrice] = useState("");

  // preload when dialog opens
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title ?? "");
        setLocation(initialData.location ?? "");
        setCoin(initialData.coin ?? "");
        setPrice(initialData.price ?? "");
      } else {
        setTitle("");
        setLocation("");
        setCoin("");
        setPrice("");
      }
    }
  }, [open, mode, initialData]);

  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);

  const handleConfirmCancel = () => {
    setCancelOpen(false);
    handleClose(false);
  };

  const handleSubmit = async () => {
    if (!title || !location || !coin || !price) {
      toast.error("All fields are required!");
      return;
    }

    const gameData = {
      title,
      location,
      coin: Number(coin),
      price: Number(price)
    };

    try {
      const token = localStorage.getItem("aToken");
      const url = mode === "edit"
        ? `http://127.0.0.1:8000/api/games/${initialData.id}`
        : "http://127.0.0.1:8000/api/games";
      const method = mode === "edit" ? "put" : "post";

      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: gameData
      });

      toast.success(`Game ${mode === "edit" ? "updated" : "created"} successfully!`);

      if (onSubmit) onSubmit(response.data);

      setCreateSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save game.");
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            backgroundColor: "#111827",
            color: "white",
            py: 2,
            border: '1px solid #374151',
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>
            {mode === "edit" ? "Edit Game" : "Add New Game"}
          </DialogTitle>
          <IconButton onClick={handleCancelOpen} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Game Name
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter game name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  "& input::placeholder": { color: "#9CA3AF", fontSize: "14px" },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Location
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Zone A, Zone B, etc."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  "& input::placeholder": { color: "#9CA3AF", fontSize: "14px" },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" sx={{ fontSize: 12, color: "#9CA3AF" }}>Coins</Typography>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                placeholder="Enter number of coins"
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": { color: "#9CA3AF", fontSize: "14px" },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" sx={{ fontSize: 12, color: "#9CA3AF" }}>Price</Typography>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                placeholder="LKR 100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": { color: "#9CA3AF", fontSize: "14px" },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3 }}>
          <Button
            onClick={handleCancelOpen}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: 'bold',
              backgroundColor: "#1F2937",
              width: '50%',
              py: 0.5,
              textTransform: 'capitalize',
              "&:hover": { bgcolor: "#374151" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
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
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogActions>

        <Dialog open={createSuccess} PaperProps={{
          sx: {
            bgcolor: "#0A192F",
            borderRadius: "16px",
            py: 2, px: 8,
            textAlign: "center",
            color: "white",
            border: '1px solid #3B4859'
          },
        }}>
          <DialogContent>
            <Box sx={{ mb: 1 }}>
              <img src={gameicon} alt="" width={80} />
            </Box>
            <Typography variant="h6" sx={{
              background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: 24,
              fontWeight: 600,
              mb: 1
            }}>
              {mode === "edit" ? "Update Successful!" : "Create Successful!"}
            </Typography>
            <Button onClick={() => { setCreateSuccess(false); handleClose(); }} sx={{
              px: 8, fontSize: 14, textTransform: 'capitalize',
              borderRadius: "8px",
              background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
              color: "white",
              "&:hover": { background: "linear-gradient(90deg, #0CD7FF 0%, #8A38F5 73%)" },
            }}>
              Ok
            </Button>
          </DialogContent>
        </Dialog>

        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirmCancel}
        />
      </Dialog>
    </div>
  );
};

export default AddNewGame;
