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
import ThumbnailUpdate from "./ThumbnailUpdate";
import UpdateSuccessDialog from "./UpdateSuccess";
import CancelPopup from "./CancelPopup";

const AddEventDialog = ({ open, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  // actual file to submit
  const [thumbnailFile, setThumbnailFile] = useState(null); 
  const [thumbnailPreview, setThumbnailPreview] = useState(null); 

  const [successMessage, setSuccessMessage] = useState("");
  const [thumbUpdateSuccess, setThumbUpdateSuccess] = useState(false);
  const [openUpdateSuccess, setOpenUpdateSucess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Load initial data when editing
useEffect(() => {
  if (open) {
    if (initialData) {
      setTitle(initialData.name || "");
      setDate(initialData.date || "");
      setThumbnailPreview(initialData.image || null);
      setThumbnailFile(null);
    } else {
      // Reset all fields for creating a new event
      setTitle("");
      setDate("");
      setThumbnailPreview(null);
      setThumbnailFile(null);
    }
  }
}, [open, initialData]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // for submit
      setThumbnailFile(file); 
      // for preview
      setThumbnailPreview(URL.createObjectURL(file)); 
      setSuccessMessage("Thumbnail Added Successfully!");
      setThumbUpdateSuccess(true);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      id: initialData?.id,
      name: title,
      date,
      thumbnail: thumbnailFile,
    });

    setOpenUpdateSucess(true);
    onClose();
  };

  const handleConfirm = () => {
    setCancelOpen(false);
    onClose();
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
        {/* FORM BODY */}
        <DialogContent>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "700",
            fontSize: "18px",
            py: 0,
          }}>
            {initialData ? "Edit Event & Tournaments" : "Add Event & Tournaments"}
            <IconButton onClick={onClose} sx={{ color: "#9CA3AF" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Event Name */}
          <p style={{ marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Event Name</p>
          <TextField
            fullWidth
            placeholder="Enter Event Name"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                color: "white",
                border: "0.5px solid #374151",
                "& .MuiInputBase-input": {
                  padding: "12px 14px",
                  fontSize: "14px",
                },
              },
            }}
          />

          {/* Date */}
          <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>
            Date
          </p>
          <TextField
            fullWidth
            placeholder="mm/dd/yyyy"
            variant="outlined"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: false,
              sx: { color: "#9CA3AF" }
            }}
            InputProps={{
              sx: {
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                color: "white",
                border: "0.5px solid #374151",
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                  padding: "12px 14px",
                },
                "& input::-webkit-datetime-edit": { color: "#9CA3AF" },
              },
              inputProps: {
                min: new Date().toISOString().split("T")[0], // set min date to today
              },
            }}
          />

          {/* Thumbnail Upload */}
          <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Thumbnail</p>
          <Box
            sx={{
              backgroundColor: "#171C2D",
              borderRadius: "8px",
              height: 150,
              border: "0.5px solid #374151",
              display: "flex",
              flexDirection: 'column',
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
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <>
                <img src={upload} style={{ width: 30, marginBottom: 6 }} />
                Upload thumbnail
              </>
            )}
          </Box>
        </DialogContent>

        {/* ACTION BUTTONS */}
        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button
            onClick={() => setCancelOpen(true)}
            sx={{
              flex: 1,
              borderRadius: "8px",
              backgroundColor: "#1A1D2A",
              color: "white",
              fontSize: '14px',
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": { backgroundColor: "#3B4859" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              fontSize: '14px',
              fontWeight: "bold",
              flex: 1,
              textTransform: "none",
              borderRadius: "8px",
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": { background: "linear-gradient(to right, #8A38F5, #0CD7FF)" },
            }}
          >
            {initialData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thumbnail added */}
      <ThumbnailUpdate
        open={thumbUpdateSuccess}
        onClose={() => setThumbUpdateSuccess(false)}
        message={successMessage}
      />

      {/* update Success */}
      <UpdateSuccessDialog
        open={openUpdateSuccess}
        onClose={() => setOpenUpdateSucess(false)}
      />

      {/* Cancel popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default AddEventDialog;
