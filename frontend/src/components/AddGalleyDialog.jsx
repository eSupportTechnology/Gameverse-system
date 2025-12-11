import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import upload from '../assets/upload.png';
import ThumbnailUpdate from "./ThumbnailUpdate";
import CancelPopup from "./CancelPopup";

const AddGalleryDialog = ({ open, onClose, onSubmit }) => {
  const [thumbnailFile, setThumbnailFile] = useState(null); // actual file
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // preview URL
  const [photoAddedSuccess, setPhotoAddedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelOpen, setCancelOpen] = useState(false);

  // Handle file selection and create preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Submit image to parent API handler
  const handleSubmit = async () => {
    if (!thumbnailFile) return; // prevent empty submission
    try {
      await onSubmit(thumbnailFile); // pass actual File object
      setSuccessMessage('Photo Added Successfully!');
      setPhotoAddedSuccess(true);
      onClose();
      setThumbnailFile(null);
      setThumbnailPreview(null);
    } catch (err) {
      console.error("Failed to add photo:", err);
    }
  };

  const handleConfirmCancel = () => {
    setCancelOpen(false);
    onClose();
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
            fontSize: 18,
            p: 2,
          }}
        >
          Add Photos
          <IconButton onClick={onClose} sx={{ color: "#9CA3AF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Upload Section */}
        <DialogContent>
          <p style={{ marginTop: 15, marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Photo</p>
          <Box
            sx={{
              backgroundColor: "#171C2D",
              borderRadius: 2,
              height: 208,
              border: "0.5px solid #374151",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#aaa",
              cursor: "pointer",
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
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
            ) : (
              <>
                <img src={upload} style={{ width: 30, marginBottom: 6 }} />
                Upload photo
              </>
            )}
          </Box>
        </DialogContent>

        {/* Action Buttons */}
        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button
            onClick={() => setCancelOpen(true)}
            sx={{
              flex: 1,
              borderRadius: 2,
              backgroundColor: "#1A1D2A",
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": { backgroundColor: "#3B4859" },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              flex: 1,
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": { background: "linear-gradient(to right, #8A38F5, #0CD7FF)" },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Popup */}
      <ThumbnailUpdate
        open={photoAddedSuccess}
        onClose={() => setPhotoAddedSuccess(false)}
        message={successMessage}
      />

      {/* Cancel Confirmation Popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleConfirmCancel}
      />
    </>
  );
};

export default AddGalleryDialog;
