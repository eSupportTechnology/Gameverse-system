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
import { API_BASE_URL } from "../apiConfig";

const paymentMethods = ["Coin", "Arrow", "Per Minute", "Per Hour"];

const AddNewGame = ({
  open,
  handleClose,
  mode = "add",
  initialData = {},
  onSubmit,
}) => {
  const [createSuccess, setCreateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [teamGame, setTeamGame] = useState(null);
  const [location, setLocation] = useState("");
  const [method, setMethod] = useState("Coin");
  const [price, setPrice] = useState("");
  const [arrowPackages, setArrowPackages] = useState([{ arrows: "", price: "" }]);
  const [minutePackages, setMinutePackages] = useState([{ minutes: "", price: "" }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title ?? "");
        setTeamGame(initialData.team_game ?? null);
        setLocation(initialData.location ?? "");
        setPrice(initialData.price ?? "");

        if (typeof initialData.method === "object") {
          setMethod(initialData.method.type);
        } else {
          setMethod(initialData.method || "Coin");
        }

        const rawPkgs = initialData.packages;
        const pkgs = Array.isArray(rawPkgs) ? rawPkgs : rawPkgs && typeof rawPkgs === "object" ? Object.values(rawPkgs) : [];

        const methodType = typeof initialData.method === "object" ? initialData.method.type : initialData.method;

        if (methodType === "Arrow") {
          if (pkgs.length > 0) {
            setArrowPackages(pkgs.map(p => ({ arrows: p.arrows, price: p.price })));
          } else {
            setArrowPackages([{ arrows: "", price: "" }]);
          }
        } else if (methodType === "Per Minute") {
          if (pkgs.length > 0) {
            setMinutePackages(pkgs.map(p => ({ minutes: p.minutes, price: p.price })));
          } else {
            setMinutePackages([{ minutes: "", price: "" }]);
          }
        }
      } else {
        setTitle("");
        setTeamGame(null);
        setLocation("");
        setMethod("Coin");
        setPrice("");
        setArrowPackages([{ arrows: "", price: "" }]);
        setMinutePackages([{ minutes: "", price: "" }]);
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
    if (
      lowerTitle.includes("archery") &&
      !lowerTitle.includes("machine") &&
      chosenMethod !== "Arrow"
    ) {
      toast.warning("⚠️ Archery should use 'Arrow' method only.");
      return false;
    }
    if (lowerTitle.includes("carrom") && chosenMethod !== "Per Hour") {
      toast.warning("⚠️ Carrom should use 'Per Hour' method only.");
      return false;
    }
    return true;
  };

  // Handle success dialog OK button
  const handleSuccessOk = () => {
    setCreateSuccess(false);
    handleClose(); // Close the main form
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedLocation = location.trim();
    const trimmedMethod = method.trim();

    if (!trimmedTitle || !trimmedLocation || teamGame === null) {
      toast.error("All fields are required!");
      return;
    }

    const isPackageMethod = trimmedMethod === "Arrow" || trimmedMethod === "Per Minute";

    if (!isPackageMethod && !price) {
      toast.error("Price is required!");
      return;
    }

    if (trimmedMethod === "Arrow") {
      const validPkgs = arrowPackages.filter(p => p.arrows && p.price);
      if (validPkgs.length === 0) {
        toast.error("Add at least one arrow package.");
        return;
      }
    }

    if (trimmedMethod === "Per Minute") {
      const validPkgs = minutePackages.filter(p => p.minutes && p.price);
      if (validPkgs.length === 0) {
        toast.error("Add at least one minute package.");
        return;
      }
    }

    if (!validateMethodForGame(trimmedTitle, trimmedMethod)) return;

    const validArrowPackages = arrowPackages.filter(p => p.arrows && p.price);
    const validMinutePackages = minutePackages.filter(p => p.minutes && p.price);

    const gameData = {
      title: trimmedTitle,
      team_game: teamGame,
      location: trimmedLocation,
      method: trimmedMethod,
      price: isPackageMethod ? 0 : Number(price),
      packages: trimmedMethod === "Arrow"
        ? validArrowPackages.map(p => ({ arrows: Number(p.arrows), price: Number(p.price) }))
        : trimmedMethod === "Per Minute"
          ? validMinutePackages.map(p => ({ minutes: Number(p.minutes), price: Number(p.price) }))
          : null,
    };
    const token = localStorage.getItem("aToken");

    try {
      const url =
        mode === "edit"
          ? `${API_BASE_URL}/api/games/${initialData.id}`
          : `${API_BASE_URL}/api/games`;

      const response = await axios({
        method: mode === "edit" ? "put" : "post",
        url,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: gameData,
      });

      setCreateSuccess(true);

      // setTimeout(() => {
      //   setCreateSuccess(false);
      //   handleClose();
      // }, 1500);

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
          }}
        >
          <DialogTitle
            sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}
          >
            {mode === "edit" ? "Edit Game" : "Add New Game"}
          </DialogTitle>
          <IconButton
            onClick={() => handleClose(false)}
            sx={{ color: "#FFFFFF" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>
          {/* Game Name */}
          <Box mb={1}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
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
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF", mb: 0.5 }}
            >
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
                  backgroundColor:
                    teamGame === true
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    color:
                      teamGame === true ? "#ffffff" : "rgba(255,255,255,0.6)",
                    fontSize: 14,
                  }}
                >
                  Yes
                </Typography>
                {teamGame === true && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  />
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
                  backgroundColor:
                    teamGame === false
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    color:
                      teamGame === false ? "#ffffff" : "rgba(255,255,255,0.6)",
                    fontSize: 14,
                  }}
                >
                  No
                </Typography>
                {teamGame === false && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Location */}
          <Box mb={1}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
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
                  border: "1px solid #374151",
                  color: "white",
                },
              }}
            />
          </Box>

          {/* Method + Price */}
          <Typography
            variant="body2"
            sx={{ fontSize: 12, color: "#9CA3AF", mb: 0.5 }}
          >
            Pricing Method
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={(method === "Arrow" || method === "Per Minute") ? "1fr" : { xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            mt={1}
          >
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
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>

            {method !== "Arrow" && method !== "Per Minute" && (
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
            )}
          </Box>

          {/* Arrow Packages */}
          {method === "Arrow" && (
            <Box mt={1.5}>
              <Typography variant="body2" sx={{ fontSize: 13, color: "#9CA3AF", mb: 1 }}>
                Arrow Packages
              </Typography>
              {arrowPackages.map((pkg, i) => (
                <Box key={i} display="flex" gap={1} mb={1} alignItems="center">
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Arrows"
                    value={pkg.arrows}
                    onChange={(e) => {
                      const updated = [...arrowPackages];
                      updated[i] = { ...updated[i], arrows: e.target.value };
                      setArrowPackages(updated);
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: "#1F2937",
                        borderRadius: "6px",
                        border: "1px solid #374151",
                        color: "white",
                        fontSize: 13,
                      },
                    }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Price (Rs.)"
                    value={pkg.price}
                    onChange={(e) => {
                      const updated = [...arrowPackages];
                      updated[i] = { ...updated[i], price: e.target.value };
                      setArrowPackages(updated);
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: "#1F2937",
                        borderRadius: "6px",
                        border: "1px solid #374151",
                        color: "white",
                        fontSize: 13,
                      },
                    }}
                    sx={{ flex: 1 }}
                  />
                  {arrowPackages.length > 1 && (
                    <Box
                      onClick={() => setArrowPackages(arrowPackages.filter((_, idx) => idx !== i))}
                      sx={{ cursor: "pointer", color: "#EF4444", fontWeight: "bold", fontSize: 18, lineHeight: 1, px: 0.5 }}
                    >
                      ×
                    </Box>
                  )}
                </Box>
              ))}
              <Box
                onClick={() => setArrowPackages([...arrowPackages, { arrows: "", price: "" }])}
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#0CD7FF", fontSize: 13, mt: 0.5 }}
              >
                + Add Package
              </Box>
            </Box>
          )}

          {/* Per Minute Packages */}
          {method === "Per Minute" && (
            <Box mt={1.5}>
              <Typography variant="body2" sx={{ fontSize: 13, color: "#9CA3AF", mb: 1 }}>
                Minute Packages
              </Typography>
              {minutePackages.map((pkg, i) => (
                <Box key={i} display="flex" gap={1} mb={1} alignItems="center">
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Minutes"
                    value={pkg.minutes}
                    onChange={(e) => {
                      const updated = [...minutePackages];
                      updated[i] = { ...updated[i], minutes: e.target.value };
                      setMinutePackages(updated);
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: "#1F2937",
                        borderRadius: "6px",
                        border: "1px solid #374151",
                        color: "white",
                        fontSize: 13,
                      },
                    }}
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="Price (Rs.)"
                    value={pkg.price}
                    onChange={(e) => {
                      const updated = [...minutePackages];
                      updated[i] = { ...updated[i], price: e.target.value };
                      setMinutePackages(updated);
                    }}
                    InputProps={{
                      sx: {
                        backgroundColor: "#1F2937",
                        borderRadius: "6px",
                        border: "1px solid #374151",
                        color: "white",
                        fontSize: 13,
                      },
                    }}
                    sx={{ flex: 1 }}
                  />
                  {minutePackages.length > 1 && (
                    <Box
                      onClick={() => setMinutePackages(minutePackages.filter((_, idx) => idx !== i))}
                      sx={{ cursor: "pointer", color: "#EF4444", fontWeight: "bold", fontSize: 18, lineHeight: 1, px: 0.5 }}
                    >
                      ×
                    </Box>
                  )}
                </Box>
              ))}
              <Box
                onClick={() => setMinutePackages([...minutePackages, { minutes: "", price: "" }])}
                sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#0CD7FF", fontSize: 13, mt: 0.5 }}
              >
                + Add Package
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3 }}>
          <Button
            onClick={handleCancelOpen}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              backgroundColor: "#1F2937",
              width: "50%",
              py: 0.5,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              width: "50%",
              py: 0.5,
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
            }}
          >
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogActions>

        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirmCancel}
        />
      </Dialog>

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
            border: "1px solid #3B4859",
          },
        }}
      >
        <DialogContent>
          <Box sx={{ mb: 1, display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid",
                borderColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(#0A192F, #0A192F) padding-box, linear-gradient(90deg, #00C6FF, #FF00CC) border-box",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 13l4 4L19 7"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="5" y1="12" x2="19" y2="12">
                    <stop offset="0%" stopColor="#00C6FF" />
                    <stop offset="100%" stopColor="#FF00CC" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
          </Box>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: 24,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {mode === "edit" ? "Update Successful!" : "Create Successful!"}
          </Typography>
          <Button
            onClick={handleSuccessOk}
            sx={{
              px: 8,
              fontSize: 14,
              textTransform: "capitalize",
              borderRadius: "8px",
              background:
                "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
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
    </>
  );
};

export default AddNewGame;
