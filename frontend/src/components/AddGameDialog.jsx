import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import upload from '../assets/upload.png';
import UpdateSuccessDialog from "./UpdateSuccess";
import CancelPopup from "./CancelPopup";
import axios from "axios";
import { toast } from "react-toastify";

// Import your default images
import arcadeImage from '../assets/arcade_machine.png';
import archeryImage from '../assets/archery_gaming.png';
import carromImage from '../assets/carom_gaming.png';
import poolImage from '../assets/pool_gaming.jpg';

// Map game names to their default images
const defaultGameImages = {
  "Arcade Machine": arcadeImage,
  "Archery Gaming": archeryImage,
  "Carrom Gaming": carromImage,
  "Pool Gaming": poolImage,
};

const AddGameDialog = ({ open, onClose, initialData, onRefresh }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [file, setFile] = useState(null);
  const [autoThumbnail, setAutoThumbnail] = useState(null);
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDesc(initialData.desc || "");
        setThumbnail(initialData.thumbnail_url || null);
        setFile(null);
        setAutoThumbnail(null);
      } else {
        setTitle("");
        setDesc("");
        setThumbnail(null);
        setFile(null);
        setAutoThumbnail(null);
      }
    }
  }, [open, initialData]);

  // Auto-detect thumbnail when title changes
  useEffect(() => {
    if (title && defaultGameImages[title] && !thumbnail && !file) {
      setAutoThumbnail(defaultGameImages[title]);
    } else {
      setAutoThumbnail(null);
    }
  }, [title, thumbnail, file]);

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
    onClose();
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

  const handleSubmit = async () => {
    // Frontend validation
    if (!title.trim()) {
      toast.error("Game name is required!");
      return;
    }

    const token = localStorage.getItem("aToken");
    if (!token) {
      toast.error("Unauthorized! Please login.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      
      // Always append title and description
      formData.append("title", title.trim());
      formData.append("desc", desc.trim());

      // Handle thumbnail - only append if we have one
      if (file) {
        formData.append("thumbnail", file);
      } else if (autoThumbnail && defaultGameImages[title] && !initialData?.id) {
        // Only use default image for NEW games, not when editing existing ones
        const imageFile = await urlToFile(
          defaultGameImages[title],
          `${title.toLowerCase().replace(/\s+/g, '-')}.png`,
          'image/png'
        );
        formData.append("thumbnail", imageFile);
      }
      // If editing existing game and no new thumbnail provided, backend keeps existing thumbnail

      // Determine URL - both create and update use POST now
      const url = initialData?.id 
        ? `http://127.0.0.1:8000/api/portal_games/${initialData.id}`
        : "http://127.0.0.1:8000/api/portal_games";

      console.log("Sending request to:", url);
      console.log("Is edit mode:", !!initialData?.id);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response received:", response.data);

      // Handle response
      if (response.data.success) {
        // Success case
        toast.success(response.data.message || (initialData?.id ? "Game updated successfully!" : "Game added successfully!"));
        
        if (onRefresh) {
          onRefresh();
        }
        
        onClose(); // Close dialog immediately on success
      } else {
        // Backend returned success: false
        toast.error(response.data.message || "Failed to save game");
      }

    } catch (error) {
      console.error("Error details:", error);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 422 && data.errors) {
          // Validation errors
          const firstError = Object.values(data.errors)[0][0];
          toast.error(firstError);
        } else if (data.message) {
          toast.error(data.message);
        } else {
          toast.error(`Error ${status}: Failed to save game`);
        }
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection.");
      } else {
        // Other errors
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
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
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "#111827",
            color: "white",
            borderRadius: "12px",
            border: "0.5px solid #374151",
            p: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "700",
            fontSize: "18px",
            py: 1,
          }}
        >
          {initialData ? "Edit Game" : "Add Game"}
          <IconButton onClick={onClose} sx={{ color: "#9CA3AF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          <p style={{ marginBottom: 6, fontSize: "14px", fontWeight: 500 }}>Game Name</p>
          <TextField
            fullWidth
            placeholder="Enter Game Name"
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
            InputProps={{
              sx: {
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                color: "white",
                border: "0.5px solid #374151",
                "& .MuiInputBase-input": { 
                  padding: "12px 14px", 
                  fontSize: "14px" 
                },
              },
            }}
          />

          <p style={{ marginTop: 15, marginBottom: 6, fontSize: "14px", fontWeight: 500 }}>Description</p>
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

          <p style={{ marginTop: 15, marginBottom: 6, fontSize: "14px", fontWeight: 500 }}>Thumbnail</p>
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
                    objectFit: "cover" 
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
                <img src={upload} style={{ width: 30, marginBottom: 6 }} alt="Upload" />
                Upload thumbnail
              </>
            )}
          </Box>

          <Box sx={{ mt: 1 }}>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "4px" }}>
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
                  onClick={() => setTitle(gameName)}
                >
                  {gameName}
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button
            onClick={() => setCancelOpen(true)}
            disabled={saving}
            sx={{
              flex: 1,
              borderRadius: "8px",
              backgroundColor: "#1A1D2A",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={saving}
            variant="contained"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              flex: 1,
              textTransform: "none",
              borderRadius: "8px",
              background: saving ? "#6B7280" : "linear-gradient(to right, #0CD7FF, #8A38F5)",
            }}
          >
            {saving ? "Saving..." : (initialData ? "Update" : "Add")}
          </Button>
        </DialogActions>
      </Dialog>

      <CancelPopup 
        open={cancelOpen} 
        handleCancelClose={() => setCancelOpen(false)} 
        handleConfirm={handleConfirmCancel} 
      />
    </>
  );
};

export default AddGameDialog;