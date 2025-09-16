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

export default function AddStationDialog({
  open,
  onClose,
  onCreate,
  formData,
  setFormData,
  isEditing,
}) {
  const [openCancelPopup, setOpenCancelPopup] = useState(false);

  const handleOpenCancelPopup = () => setOpenCancelPopup(true);
  const handleCloseCancelPopup = () => setOpenCancelPopup(false);

  const handleConfirmCancel = () => {
    setOpenCancelPopup(false);
    onClose(); // actually close the AddStation dialog
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e) => {
    const val = e.target.value;
    const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

    if (timePattern.test(val)) {
      const [hours, minutes] = val.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      setFormData((prev) => ({ ...prev, time: `${totalMinutes} minutes` }));
    } else {
      setFormData((prev) => ({ ...prev, time: val }));
    }
  };

  const handleSubmit = () => {
    const timePattern = /^([0-9]+) minutes$/;
    if (!timePattern.test(formData.time)) {
      alert("Please enter valid time in HH:MM format (e.g., 00:30)");
      return;
    }

    onCreate(formData);
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
            <MenuItem value="PS5 Station 1" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096", py: 1 }}>PS5 Station 1</MenuItem>
            <MenuItem value="PS5 Station 2" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096", py: 1 }}>PS5 Station 2</MenuItem>
            <MenuItem value="PS5+VR" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096", py: 1 }}>PS5+VR</MenuItem>
            <MenuItem value="8 Ball Pool (Supreme)" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096", py: 1 }}>8 Ball Pool (Supreme)</MenuItem>
            <MenuItem value="8 Ball Pool (Premium)" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096", py: 1 }}>8 Ball Pool (Premium)</MenuItem>
            <MenuItem value="CRS+VR (PS V R2)" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096", py: 1 }}>CRS+VR (PS V R2)</MenuItem>
            <MenuItem value="Car Racing Simulator" sx={{ background: "#171C2D", border: "1px solid #c9c0c096", py: 1 }}>Car Racing Simulator</MenuItem>
          </TextField>

          {/* Station Type */}
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>Station Type</Typography>
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
            <MenuItem value="PlayStation" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096" }}>PlayStation</MenuItem>
            <MenuItem value="Pool" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096" }}>Pool</MenuItem>
            <MenuItem value="Simulator" sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096" }}>Simulator</MenuItem>
          </TextField>

          {/* Location, Price, Time */}
          <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>Location</Typography>
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
              <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>Price</Typography>
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
              <Typography variant="subtitle2" sx={{ color: "#f3f4f5ff", mb: 0.5 }}>Time (HH:MM)</Typography>
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

        <DialogActions sx={{ px: 3, pb: 2, display: "flex", justifyContent: "space-between" }}>
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

        {/* Cancel Confirmation Popup */}
        <CancelPopup
          open={openCancelPopup}
          handleCancelClose={handleCloseCancelPopup}
          handleConfirm={handleConfirmCancel}
        />
      </Dialog>
    </>
  );
}
