import React, { useEffect, useState } from "react";
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
import UpdateSuccessDialog from "./UpdateSuccess";
import CancelPopup from "./CancelPopup";
import RemovePopup from "./RemovePopup";

const AddGameDialog = ({ open, onClose, onSubmit, initialData }) => { 

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [thumbUpdateSuccess, setThumbUpdateSuccess] = useState(false);
   const [openUpdateSuccess, setOpenUpdateSucess] = useState(false);
   const [cancelOpen, setCancelOpen] = useState(false)
   

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDesc(initialData.desc);
      setThumbnail(initialData.image);
    } else {
      setTitle("");
      setDesc("");
      setThumbnail(null);
    }
  }, [initialData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
    setThumbUpdateSuccess(true);
    
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      desc,
      image: thumbnail,
    });
    setOpenUpdateSucess(true)
    onClose();
    
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
      {/* HEADER */}
      {/* <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "700",
          fontSize: "18px",
        }}
      >
        Add Games
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle> */}

      {/* FORM BODY */}
      <DialogContent sx={{
        /* Scrollbar styling */
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#4B5563",
          borderRadius: "10px",
        },

      }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "700",
          fontSize: "18px",
          py: 0,
        }}>
         {initialData ? "Edit Game" : "Add Game"}
          <IconButton onClick={onClose} sx={{ color: "#9CA3AF" }}>
            <CloseIcon />
          </IconButton>

        </Box>

        {/* Game Name */}
        <p style={{ marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Game Name</p>
        <TextField
          fullWidth
          placeholder="Enter Game Name"
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


        {/* Description */}
        <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Description</p>
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

              "& .MuiInputBase-input": {
                fontSize: "14px",
              },
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
              Upload thumbnail
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
            "&:hover": {
              background: "linear-gradient(to right, #8A38F5, #0CD7FF)",
            },
          }}
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>

      {/* Thumbnail update success */}
      <ThumbnailUpdate
      open={thumbUpdateSuccess}
      onClose={()=>setThumbUpdateSuccess(false)}
      />

      {/* update success */}
      <UpdateSuccessDialog
       open={openUpdateSuccess}
      onClose={()=>setOpenUpdateSucess(false)}
      />

      {/* cancel dialog */}
      <CancelPopup
      open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleConfirm}
      />


    </>
  );
};

export default AddGameDialog;
