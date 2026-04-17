import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import upload from "../assets/upload.png";
import CancelPopup from "./CancelPopup";

// Import your default images
import { API_BASE_URL } from "../apiConfig";
import arcadeImage from "../assets/arcade_machine.png";
import archeryImage from "../assets/archery_gaming.png";
import carromImage from "../assets/carom_gaming.png";
import poolImage from "../assets/pool_gaming.jpg";

const paymentMethods = ["Coin", "Arrow", "Per Hour"];
const defaultGameImages = {
  "Arcade Machine": arcadeImage,
  "Archery Gaming": archeryImage,
  "Carrom Gaming": carromImage,
  "Pool Gaming": poolImage,
};
const AddGameDialog = ({
  open,
  handleClose,
  mode = "add",
  initialData = {},
  onSubmit,
}) => {
  const [createSuccess, setCreateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [teamGame, setTeamGame] = useState(null); // rename to match backend
  const [location, setLocation] = useState("");
  const [method, setMethod] = useState("Coin");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [autoThumbnail, setAutoThumbnail] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setTitle(initialData.title ?? "");
        setTeamGame(initialData.team_game ?? null); // sync with backend
        setLocation(initialData.location ?? "");
        setPrice(initialData.price ?? "");

        if (typeof initialData.method === "object") {
          setMethod(initialData.method.type);
        } else {
          setMethod(initialData.method || "Coin");
        }
      } else {
        setTitle("");
        setTeamGame(null);
        setLocation("");
        setMethod("Coin");
        setPrice("");
      }
    }
  }, [open, mode, initialData]);

  useEffect(() => {
    if (title && defaultGameImages[title] && !thumbnail && !file) {
      setAutoThumbnail(defaultGameImages[title]);
    } else {
      setAutoThumbnail(null);
    }
  }, [title, thumbnail, file]);

  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setThumbnail(URL.createObjectURL(selectedFile));
      setAutoThumbnail(null);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleConfirmCancel = () => {
    setCancelOpen(false);
    handleClose(false);
  };

  const getCurrentThumbnail = () => {
    if (thumbnail) return thumbnail;
    if (autoThumbnail) return autoThumbnail;
    return initialData?.thumbnail_url || null;
  };

  const urlToFile = async (url, filename, mimeType) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
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

    if (!trimmedTitle || !trimmedLocation || !price || teamGame === null) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateMethodForGame(trimmedTitle, trimmedMethod)) return;

    const formData = new FormData();

    // ✅ Basic fields
    formData.append("title", trimmedTitle);
    formData.append("location", trimmedLocation);
    formData.append("method", trimmedMethod);
    formData.append("price", Number(price));

    // ✅ FIXED boolean issue
    formData.append("team_game", teamGame ? 1 : 0);
    // ✅ Description
    formData.append("description", desc ? desc.trim() : "");

    // ✅ Thumbnail (file OR default image)
    if (file instanceof File) {
      formData.append("thumbnail", file);
    }

    // ✅ For update (Laravel PUT fix)
    if (mode === "edit") {
      formData.append("_method", "PUT");
    }

    const token = localStorage.getItem("aToken");
    try {
      const url =
        mode === "edit"
          ? `${API_BASE_URL}/api/games/${initialData.id}`
          : `${API_BASE_URL}/api/games`;

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCreateSuccess(true);

      if (onSubmit) onSubmit(response.data);
    } catch (err) {
      console.log(err.response?.data); // 👈 debug
      toast.error(err.response?.data?.message || "Failed to save game.");
    }
  };

  const clearThumbnail = () => {
    setThumbnail(null);
    setFile(null);
    setAutoThumbnail(null);
  };
  const currentThumbnail = getCurrentThumbnail();

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
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
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
          <p
            style={{
              marginTop: 15,
              marginBottom: 6,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Description
          </p>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enter Short Description"
            variant="outlined"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                color: "white",
                border: "0.5px solid #374151",
                "& .MuiInputBase-input": { fontSize: "14px" },
              },
            }}
          />
          <p
            style={{
              marginTop: 15,
              marginBottom: 6,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Thumbnail
          </p>
          <Box
            sx={{
              backgroundColor: "#171C2D",
              borderRadius: "8px",
              height: 150,
              border: "0.5px solid #374151",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#aaa",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />

            {currentThumbnail ? (
              <>
                <img
                  src={currentThumbnail}
                  alt="Thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearThumbnail();
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    minWidth: "auto",
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                  }}
                >
                  ×
                </Button>
              </>
            ) : (
              <>
                <img
                  src={upload}
                  style={{ width: 30, marginBottom: 6 }}
                  alt="Upload"
                />
                Upload thumbnail
              </>
            )}
          </Box>

          <Box sx={{ mt: 1 }}>
            <p
              style={{
                fontSize: "12px",
                color: "#9CA3AF",
                marginBottom: "4px",
              }}
            >
              Available games with default images:
            </p>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {Object.keys(defaultGameImages).map((gameName) => (
                <Box
                  key={gameName}
                  sx={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    backgroundColor: title === gameName ? "#0CD7FF" : "#374151",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: title === gameName ? "black" : "white",
                  }}
                  onClick={() => {
                    if (!title) setTitle(gameName);
                  }}
                >
                  {gameName}
                </Box>
              ))}
            </Box>
          </Box>
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

export default AddGameDialog;
