import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelPopup from "./CancelPopup";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddStationDialog({
  open,
  onClose,
  onCreate,
  formData,
  setFormData,
  isEditing,
}) {
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const handleOpenCancelPopup = () => setOpenCancelPopup(true);
  const handleCloseCancelPopup = () => setOpenCancelPopup(false);

  const handleConfirmCancel = () => {
    setOpenCancelPopup(false);
    onClose(); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // here neeed to type as like placeholder "HH:MM"
  const handleTimeChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, time: val })); // keep raw "HH:MM"
  };

  const handleSubmit = async () => {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

    if (!timePattern.test(formData.time)) {
      alert("Please enter valid time in HH:MM format (e.g., 00:30)");
      return;
    }

    // convert to integer minutes for backend
    const [hours, minutes] = formData.time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    const payload = { ...formData, time: totalMinutes };

    // Store the payload and show success dialog
    setPendingPayload({ payload, isEditing });
    setCreateSuccess(true);
  };

  // Handle success dialog OK button - actually create the station
  const handleSuccessOk = async () => {
    if (!pendingPayload) return;

    const { payload, isEditing: editing } = pendingPayload;

    try {
      const token = localStorage.getItem("aToken"); // get token dynamically
      const url = editing
        ? `http://127.0.0.1:8000/api/stations/${formData.id}` // update endpoint
        : "http://127.0.0.1:8000/api/stations";

      const method = editing ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: payload, // send integer here ✅
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(`Station ${editing ? "updated" : "created"} successfully!`);

      // Pass the station data properly to parent
      if (editing) {
        onCreate(res.data.data || res.data, true); // true = updated
      } else {
        onCreate(res.data.data || res.data, false); // false = created
      }

      setFormData({
        name: "",
        type: "",
        location: "",
        price: "",
        status: "Available",
        bookings: 0,
        time: "",
      });
      
      setCreateSuccess(false);
      setPendingPayload(null);
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Failed to save station. Make sure you are logged in."
      );
      setCreateSuccess(false);
      setPendingPayload(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#111827",
            color: "#fff",
            borderRadius: "16px",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isEditing ? "Edit Station" : "Add New Station"}
          <IconButton onClick={handleOpenCancelPopup} sx={{ color: "#94a3b8" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Station Name */}
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
            Station Name
          </Typography>
          <TextField
            select
            margin="dense"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            fullWidth
            displayEmpty
            sx={{
              mb: 2,
              py: 0,
              backgroundColor: "#1e293b4b",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#1e293b4b",
                color: "white",
                "& fieldset": { borderColor: "#809fcd4e" },
                "&:hover fieldset": { borderColor: "#ffffff71" },
                "& .MuiSelect-icon": { color: "#fff" },
              },
              "& .MuiSelect-select:empty": { color: "#94a3b8" },
            }}
          >
            <MenuItem value="PS5 Station 1">PS5 Station 1</MenuItem>
            <MenuItem value="PS5 Station 2">PS5 Station 2</MenuItem>
            <MenuItem value="PS5+VR">PS5+VR</MenuItem>
            <MenuItem value="8 Ball Pool (Supreme)">8 Ball Pool (Supreme)</MenuItem>
            <MenuItem value="8 Ball Pool (Premium)">8 Ball Pool (Premium)</MenuItem>
            <MenuItem value="CRS+VR (PS V R2)">CRS+VR (PS V R2)</MenuItem>
            <MenuItem value="Car Racing Simulator">Car Racing Simulator</MenuItem>
          </TextField>

          {/* Station Type */}
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
            Station Type
          </Typography>
          <TextField
            select
            margin="dense"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
            fullWidth
            displayEmpty
            sx={{
              mb: 2,
              backgroundColor: "#1e293b4b",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#1e293b4b",
                color: "white",
                "& fieldset": { borderColor: "#809fcd4e" },
                "&:hover fieldset": { borderColor: "#ffffff71", background: "#172336ff" },
                "& .MuiSelect-icon": { color: "#fff" },
              },
              "& .MuiSelect-select:empty": { color: "#94a3b8" },
            }}
          >
            <MenuItem value="PlayStation">PlayStation</MenuItem>
            <MenuItem value="Pool">Pool</MenuItem>
            <MenuItem value="Simulator">Simulator</MenuItem>
          </TextField>

          {/* Location, Price, Time */}
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
            Location
          </Typography>
          <TextField
            margin="dense"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            placeholder="Zone A, Zone B, etc."
            sx={{
              mb: 2,
              backgroundColor: "#1e293b4b",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                color: "white",
                "& fieldset": { borderColor: "#334155" },
              },
            }}
          />

          <Box display="flex" gap={2} mt={1}>
            {/* Price */}
            <Box flex={1}>
              <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
                Price
              </Typography>
              <TextField
                margin="dense"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                placeholder="0000"
                InputProps={{
                  startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                }}
                sx={{
                  backgroundColor: "#1e293b4b",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    color: "white",
                    "& fieldset": { borderColor: "#334155" },
                  },
                }}
              />
            </Box>

            {/* Time */}
            <Box flex={1}>
              <Typography variant="subtitle2" sx={{ color: "#f3f4f5ff", mb: 0.5 }}>
                Time (HH:MM)
              </Typography>
              <TextField
                margin="dense"
                name="time"
                value={formData.time || ""}
                onChange={handleTimeChange}
                fullWidth
                placeholder="00:30"
                sx={{
                  backgroundColor: "#1e293b4b",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    color: "#fff",
                    "& fieldset": { borderColor: "#fff" },
                    "&:hover fieldset": { borderColor: "#fff" },
                  },
                  "& input": { color: "#fff" },
                }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ px: 3, pb: 2, display: "flex", justifyContent: "space-between" }}
        >
          <Button
            onClick={handleOpenCancelPopup}
            sx={{
              background: "#1e293b",
              color: "white",
              px: 3,
              py: 1,
              borderRadius: "8px",
              border: "0.3px solid #809fcd4e",
              fontWeight: 500,
              fontSize: "20px",
              width: "270px",
              "&:hover": { background: "#334155" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              background: "linear-gradient(90deg,#33B2F7,#CF36E1)",
              color: "#fff",
              px: 3,
              py: 1,
              borderRadius: "8px",
              fontSize: "20px",
              border: "0.3px solid #809fcd4e",
              width: "270px",
              fontWeight: "600",
              "&:hover": { opacity: 0.9 },
            }}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>

        <CancelPopup
          open={openCancelPopup}
          handleCancelClose={handleCloseCancelPopup}
          handleConfirm={handleConfirmCancel}
        />
      </Dialog>

      {/* Success Popup */}
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
            border: '1px solid #3B4859'
          },
        }}
      >
        <DialogContent>
          <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid',
              borderColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(#0A192F, #0A192F) padding-box, linear-gradient(90deg, #00C6FF, #FF00CC) border-box',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13l4 4L19 7" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient" x1="5" y1="12" x2="19" y2="12">
                    <stop offset="0%" stopColor="#00C6FF"/>
                    <stop offset="100%" stopColor="#FF00CC"/>
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
              mb: 1
            }}
          >
            {pendingPayload?.isEditing ? "Update Successful !" : "Create Successful !"}
          </Typography>
          <Button
            onClick={handleSuccessOk}
            sx={{
              px: 8,
              fontSize: 14,
              textTransform: 'capitalize',
              borderRadius: "8px",
              background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
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
}
