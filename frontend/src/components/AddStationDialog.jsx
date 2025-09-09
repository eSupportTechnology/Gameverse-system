import React from "react";
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

export default function AddStationDialog({
  open,
  onClose,
  onCreate,
  formData,
  setFormData,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0f172a",
          color: "#fff",
          borderRadius: "16px",
          p: 2,
        },
      }}
    >
      {/* Title with Close Button */}
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Add New Station
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        {/* Station Name */}
        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
          Station Name
        </Typography>
        <TextField
          select
          margin="dense"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          placeholder="Select Station"
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#64748b" },
            },
          }}
        >
          <MenuItem value="PS5 Station 1">PS5 Station 1</MenuItem>
          <MenuItem value="PS5 Station 2">PS5 Station 2</MenuItem>
          <MenuItem value="PS5+VR">PS5+VR</MenuItem>
        </TextField>

        {/* Location */}
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
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
            },
          }}
        />

        {/* Price + Time in one row */}
        <Box display="flex" gap={2} mt={1}>
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
                startAdornment: (
                  <InputAdornment position="start">LKR</InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  color: "white",
                  "& fieldset": { borderColor: "#334155" },
                },
              }}
            />
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
              Time
            </Typography>
            <TextField
              margin="dense"
              name="time"
              type="time"
              value={formData.time || "12:00"}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: 300 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  color: "white",
                  "& input::-webkit-calendar-picker-indicator": {
                    display: "none", // hides clock
                  },
                  "& fieldset": { borderColor: "#334155" },
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Footer Buttons */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            background: "#1e293b",
            color: "gray",
            px: 3,
            py: 1,
            borderRadius: "8px",
            fontWeight: 500,
            width: "200px",
            "&:hover": { background: "#334155" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          sx={{
            background: "linear-gradient(90deg,#33B2F7,#CF36E1)",
            color: "#fff",
            px: 3,
            py: 1,
            borderRadius: "8px",
            width: "200px",
            fontWeight: "600",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
