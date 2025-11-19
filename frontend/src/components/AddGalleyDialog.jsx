import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import upload from '../assets/upload.png'
import ThumbnailUpdate from "./ThumbnailUpdate";
import CancelPopup from "./CancelPopup";

const AddGalleyDialog = ({ open, onClose, onSubmit, }) => {

  const [thumbnail, setThumbnail] = useState(null);
  const [photoAddedSuccess, setPhotoAddedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('')
  const [openUpdateSuccess, setOpenUpdateSucess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false)


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }


  };

  const handleSubmit = () => {
    onSubmit({
      image: thumbnail,
    });
    setSuccessMessage('Photo Added Successful !')
    setPhotoAddedSuccess(true);
    onClose();
    setThumbnail(null)

  };

  const handleConfirm = async () => {
    setCancelOpen(false);
    onClose()
  }

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
        <DialogContent sx={{}}>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "700",
            fontSize: "18px",
            py: 0,
          }}>
            Add Photos
            <IconButton onClick={onClose} sx={{ color: "#9CA3AF" }}>
              <CloseIcon />
            </IconButton>

          </Box>

          {/* Thumbnail Upload */}
          <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Photo</p>
          <Box
            sx={{
              backgroundColor: "#171C2D",
              borderRadius: "8px",
              height: 208,
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

            {thumbnail ? (
              <img
                src={thumbnail}
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
                Upload photo
              </>
            )}
          </Box>
        </DialogContent>

        {/* ACTION BUTTONS */}
        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button
            onClick={()=>setCancelOpen(true)}
            sx={{
              flex: 1,
              borderRadius: "8px",
              backgroundColor: "#1A1D2A",
              color: "white",
              fontSize: '14px',
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "#3B4859",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              fontSize: '14px',
              fontWeight: "bold",
              flex: 1,
              textTransform: "none",
              borderRadius: "8px",
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": {
                background: "linear-gradient(to right, #8A38F5, #0CD7FF)",
              },
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* photo add success dialog */}
      <ThumbnailUpdate
        open={photoAddedSuccess}
        onClose={() => setPhotoAddedSuccess(false)}
        message={successMessage}
      />

      {/* cancel popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleConfirm}
      />

    </>
  )
}

export default AddGalleyDialog
