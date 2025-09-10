
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
          value={formData.name || ""}
          onChange={handleChange}
          fullWidth
          displayEmpty
          sx={{
            mb: 2,
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#809fcd4e" },
              "&:hover fieldset": { borderColor: "#ffffff71" },
              "& .MuiSelect-icon": { color: "#fff" },
            },
            "& .MuiSelect-select:empty": { color: "#94a3b8" },
          }}
        >
          <MenuItem disabled value="">
            Select Station
          </MenuItem>
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
              color: "white",
              "& fieldset": { borderColor: "#809fcd4e" },
              "&:hover fieldset": { borderColor: "#ffffff71" },
              "& .MuiSelect-icon": { color: "#fff" },
            },
            "& .MuiSelect-select:empty": { color: "#94a3b8" },
          }}
        >
          <MenuItem disabled value="">
            Select Type
          </MenuItem>
          <MenuItem value="PlayStation">PlayStation</MenuItem>
          <MenuItem value="Pool">Pool</MenuItem>
          <MenuItem value="Car Racing">Car Racing</MenuItem>
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
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "& input": { backgroundColor: "#1e293b4b", color: "white" },
            },
          }}
        />

        {/* Price Section */}
        <Typography
          variant="h6"
          sx={{ color: "#fff", fontWeight: 600, mt: 2, mb: 1 }}
        >
          Price
        </Typography>

        {/* Price + Time row */}
        <Box display="flex" gap={2}>
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
                startAdornment: (
                  <InputAdornment position="start">LKR</InputAdornment>
                ),
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
              Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                ampm
                value={formData.time ? dayjs(formData.time, "hh:mm A") : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setFormData((prev) => ({
                      ...prev,
                      time: newValue.format("hh:mm A"),
                    }));
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                    placeholder: "hh:mm AM/PM",
                    sx: {
                      backgroundColor: "#1e293b4b",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        borderColor: "#ffffff50",
                        "& fieldset": { borderColor: "#fff" },
                        "&:hover fieldset": { borderColor: "#fff" },
                      },
                      "& input": {
                        color: formData.time ? "#fff" : "grey",
                        "::placeholder": { color: "grey" },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
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
