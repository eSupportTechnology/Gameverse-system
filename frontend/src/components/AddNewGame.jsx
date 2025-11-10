import React, { useState, useEffect } from "react";
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
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelPopup from "./CancelPopup";
import gameicon from "../assets/gameicon.png";
import axios from "axios";
import { toast } from "react-toastify";

const paymentMethods = ["Coin", "Arrow", "Per Hour"];

const AddNewGame = ({ open, handleClose, mode = "add", initialData = {}, onSubmit }) => {
  const [createSuccess, setCreateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [teamGame, setTeamGame] = useState(null); // rename to match backend
  const [location, setLocation] = useState("");
  const [method, setMethod] = useState("Coin");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title ?? "");
        setTeamGame(initialData.team_game ?? null); // sync with backend
        setLocation(initialData.location ?? "");
        setMethod(initialData.method ?? "Coin");
        setPrice(initialData.price ?? "");
      } else {
        setTitle("");
        setTeamGame(null);
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

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedMethod = method.trim();

    if (!trimmedTitle || !trimmedLocation || !price || teamGame === null) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateMethodForGame(trimmedTitle, trimmedMethod)) return;

    const gameData = {
      title: trimmedTitle,
      team_game: teamGame, // match backend
      location: trimmedLocation,
      method: trimmedMethod,
      price: Number(price),
    };

    const token = localStorage.getItem("aToken");

    try {
      const url =
        mode === "edit"
          ? `http://127.0.0.1:8000/api/games/${initialData.id}`
          : "http://127.0.0.1:8000/api/games";

      const response = await axios({
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

      if (onSubmit) onSubmit(response.data); // send updated game back
    } catch (err) {
      console.error("Validation errors:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save game.");
    }
  };

  return (
    <>
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
            border: "1px solid #374151",
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
          {/* Game Name */}
          <Box mb={1}>
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
                  border: "1px solid #374151",
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Team Game Toggle */}
          <Box mb={2}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF", mb: 0.5 }}>
              Team Game
            </Typography>
            <Box display="flex" gap={2}>
              <Box
                onClick={() => setTeamGame(true)}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backgroundColor: teamGame === true ? "rgba(255, 255, 255, 0.05)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ color: teamGame === true ? "#ffffff" : "rgba(255,255,255,0.6)", fontSize: 14 }}>
                  Yes
                </Typography>
                {teamGame === true && (
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.8)" }} />
                )}
              </Box>

              <Box
                onClick={() => setTeamGame(false)}
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backgroundColor: teamGame === false ? "rgba(255, 255, 255, 0.05)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <Typography sx={{ color: teamGame === false ? "#ffffff" : "rgba(255,255,255,0.6)", fontSize: 14 }}>
                  No
                </Typography>
                {teamGame === false && (
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.8)" }} />
                )}
              </Box>
            </Box>
          </Box>

          {/* Location */}
          <Box mb={1}>
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
                  border: "1px solid #374151",
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Method + Price */}
          <Typography variant="body2" sx={{ fontSize: 12, color: "#9CA3AF", mb: 0.5 }}>Pricing Method</Typography>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
            <TextField
              select
              fullWidth
              size="small"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: "1px solid #374151",
                  color: "white",
                },
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
                  border: "1px solid #374151",
                  color: "white",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3 }}>
          <Button onClick={handleCancelOpen} variant="contained" sx={{ fontSize: 16, fontWeight: "bold", backgroundColor: "#1F2937", width: "50%", py: 0.5 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ fontSize: 16, fontWeight: "bold", width: "50%", py: 0.5, background: "linear-gradient(to right, #0CD7FF, #8A38F5)" }}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogActions>

        <CancelPopup open={cancelOpen} handleCancelClose={handleCancelClose} handleConfirm={handleConfirmCancel} />
      </Dialog>
    </>
  );
};

export default AddNewGame;
