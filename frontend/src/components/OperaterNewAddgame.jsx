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
  IconButton,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelPopup from './CancelPopup';
import gameicon from '../assets/gameicon.png';
import axios from 'axios';
import { toast } from 'react-toastify';

const paymentMethods = ["Coin", "Arrow", "Per Hour"];

const AddNewGameOperator = ({ open, handleClose, mode = "add", initialData = {}, onSubmit }) => {
  const [createSuccess, setCreateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [method, setMethod] = useState("Coin");
  const [price, setPrice] = useState("");

  const validateMethodForGame = (gameTitle, chosenMethod) => {
    const lowerTitle = gameTitle.toLowerCase();

    if (lowerTitle.includes("archery machine") && chosenMethod !== "Coin") {
      toast.warning("⚠️ Archery Machine should use 'Coin' method only.");
      return false;
    }
    if (lowerTitle.includes("archery") && !lowerTitle.includes("machine") && chosenMethod !== "Arrow") {
      toast.warning("⚠️ Archery should use 'Arrow' method only.");
      return false;
    }
    if (lowerTitle.includes("carrom") && chosenMethod !== "Per Hour") {
      toast.warning("⚠️ Carrom should use 'Per Hour' method only.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title ?? "");
        setLocation(initialData.location ?? "");
        setMethod(initialData.method ?? "Coin");
        setPrice(initialData.price ?? "");
      } else {
        setTitle("");
        setLocation("");
        setMethod("Coin");
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
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedMethod = method.trim();

    if (!trimmedTitle || !trimmedLocation || !price) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateMethodForGame(trimmedTitle, trimmedMethod)) {
      return;
    }

    const gameData = {
      title: trimmedTitle,
      location: trimmedLocation,
      method: trimmedMethod,
      price: Number(price),
    };

    try {
      const token = localStorage.getItem("oToken");
      const url =
        mode === "edit"
          ? `http://127.0.0.1:8000/api/operator/games/${initialData.id}`
          : "http://127.0.0.1:8000/api/operator/games";

      await axios({
        method: mode === "edit" ? "put" : "post",
        url,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        data: gameData,
      });

      toast.success(`Game ${mode === "edit" ? "updated" : "created"} successfully!`);

      setCreateSuccess(true);

      setTimeout(() => {
        setCreateSuccess(false);
        handleClose();
      }, 1500);

      if (onSubmit) onSubmit();

    } catch (err) {
      console.error('Validation errors:', err.response?.data);
      toast.error(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Failed to save game."
      );
    }
  };

  return (
    <>
      {/* Main Dialog */}
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
            border: '1px solid #374151'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>
            {mode === "edit" ? "Edit Game" : "Add New Game"}
          </DialogTitle>
          <IconButton onClick={handleCancelOpen} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form */}
        <DialogContent dividers sx={{ py: 0, pb: 2 }}>
          {/* Game Name */}
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>Game Name</Typography>
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
                  color: "white"
                }
              }}
            />
          </Box>

          {/* Location */}
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>Location</Typography>
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
                  color: "white"
                }
              }}
            />
          </Box>

          {/* Pricing Method */}
          <Typography variant="body2" sx={{ fontSize: 12, color: "#9CA3AF", mb: 0.5 }}>Pricing Method</Typography>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
            <TextField
              select
              fullWidth
              size="small"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                validateMethodForGame(title, e.target.value);
              }}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  color: "white"
                }
              }}
            >
              {paymentMethods.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>

            <TextField
              variant="outlined"
              fullWidth
              size="small"
              type="number"
              placeholder="Enter total price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  color: "white"
                }
              }}
            />
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ px: 3 }}>
          <Button onClick={handleCancelOpen} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', backgroundColor: "#1F2937", width: '50%', py: 0.5 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', py: 0.5, background: "linear-gradient(to right, #0CD7FF, #8A38F5)" }}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogActions>

        <CancelPopup open={cancelOpen} handleCancelClose={handleCancelClose} handleConfirm={handleConfirmCancel} />
      </Dialog>

      {/* Success Popup */}
      <Dialog open={createSuccess} PaperProps={{
        sx: {
          bgcolor: "#0A192F",
          borderRadius: "16px",
          py: 2,
          px: 8,
          textAlign: "center",
          color: "white",
          border: '1px solid #3B4859'
        }
      }}>
        <DialogContent>
          <Box sx={{ mb: 1 }}><img src={gameicon} alt="" width={80} /></Box>
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
            px: 8, fontSize: 14, borderRadius: "8px",
            background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
            color: "white"
          }}>
            Ok
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewGameOperator;
