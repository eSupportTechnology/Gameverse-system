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
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CancelPopup from "./CancelPopup";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../apiConfig";

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
  const [showVRPricing, setShowVRPricing] = useState(true);

  const handleOpenCancelPopup = () => setOpenCancelPopup(true);
  const handleCloseCancelPopup = () => setOpenCancelPopup(false);

  const handleConfirmCancel = () => {
    setOpenCancelPopup(false);
    onClose();
  };

  // Direct close without popup for close icon
  const handleDirectClose = () => {
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (e, type = "normal") => {
    const val = e.target.value;
    if (type === "vr") {
      setFormData((prev) => ({ ...prev, vrTime: val }));
    } else {
      setFormData((prev) => ({ ...prev, time: val }));
    }
  };

  const handlePriceChange = (e, type = "normal") => {
    const val = e.target.value;
    if (type === "vr") {
      setFormData((prev) => ({ ...prev, vrPrice: val }));
    } else {
      setFormData((prev) => ({ ...prev, price: val }));
    }
  };

  // Toggle VR pricing visibility
  const toggleVRPricing = () => {
    if (showVRPricing) {
      // Clear VR fields when hiding
      setFormData((prev) => ({
        ...prev,
        vrTime: "",
        vrPrice: "",
      }));
    }
    setShowVRPricing(!showVRPricing);
  };

  const handleSubmit = async () => {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

    if (formData.time && !timePattern.test(formData.time)) {
      alert("Please enter valid time in HH:MM format (e.g., 00:30)");
      return;
    }

    if (formData.vrTime && !timePattern.test(formData.vrTime)) {
      alert("Please enter valid VR time in HH:MM format (e.g., 00:30)");
      return;
    }

    let totalMinutes = 0;
    if (formData.time && timePattern.test(formData.time)) {
      const [hours, minutes] = formData.time.split(":").map(Number);
      totalMinutes = hours * 60 + minutes;
    }

    let vrTotalMinutes = 0;
    if (formData.vrTime && timePattern.test(formData.vrTime)) {
      const [vrHours, vrMinutes] = formData.vrTime.split(":").map(Number);
      vrTotalMinutes = vrHours * 60 + vrMinutes;
    }

    const payload = {
      ...formData,
      time: formData.time ? totalMinutes : null,
      vrTime: formData.vrTime ? vrTotalMinutes : null,
      vrPrice: formData.vrPrice || null,
    };

    setPendingPayload({ payload, isEditing });
    setCreateSuccess(true);
  };

  const handleSuccessOk = async () => {
    if (!pendingPayload) return;

    const { payload, isEditing: editing } = pendingPayload;

    try {
      const token = localStorage.getItem("aToken");
      const url = editing
        ? `${API_BASE_URL}/api/stations/${formData.id}`
        : `${API_BASE_URL}/api/stations`;

      const method = editing ? "put" : "post";

      const res = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(`Station ${editing ? "updated" : "created"} successfully!`);

      if (editing) {
        onCreate(res.data.data || res.data, true);
      } else {
        onCreate(res.data.data || res.data, false);
      }

      setFormData({
        name: "",
        type: "",
        location: "",
        price: "",
        vrPrice: "",
        time: "",
        vrTime: "",
        status: "Available",
        bookings: 0,
      });

      setCreateSuccess(false);
      setPendingPayload(null);
      setShowVRPricing(true);
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save station. Make sure you are logged in.",
      );
      setCreateSuccess(false);
      setPendingPayload(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDirectClose} // Direct close without popup
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
            py: 1.5,
          }}
        >
          {isEditing ? "Edit Station" : "Add New Station"}
          <CloseIcon
            onClick={handleDirectClose} // Direct close without popup
            sx={{ color: "#94a3b8", cursor: "pointer" }}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
          {/* Station Name */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#94a3b8", mb: 0.5, fontSize: "0.8rem" }}
            >
              Station name
            </Typography>
            <TextField
              select
              margin="dense"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              displayEmpty
              size="small"
              sx={{
                backgroundColor: "#1e293b4b",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  color: "white",
                  "& fieldset": { borderColor: "#334155" },
                  "&:hover fieldset": { borderColor: "#ffffff71" },
                  "& .MuiSelect-icon": { color: "#fff" },
                },
                "& .MuiSelect-select:empty": { color: "#94a3b8" },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1e293b",
                      color: "white",
                      maxHeight: 300,
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1e293b",
                        borderBottom: "1px solid #334155",
                        "&:hover": {
                          backgroundColor: "#334155",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#334155",
                          "&:hover": {
                            backgroundColor: "#475569",
                          },
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: "#94a3b8", fontStyle: "normal" }}>
                  Select Station
                </em>
              </MenuItem>
              {/* PS5 Stations */}
              <MenuItem value="PS5 Station 1">PS5 Station 1</MenuItem>
              <MenuItem value="PS5 Station 2">PS5 Station 2</MenuItem>
              <MenuItem value="PS5 Station 3">PS5 Station 3</MenuItem>
              <MenuItem value="PS5 Station 4">PS5 Station 4</MenuItem>
              <MenuItem value="PS5 Station 5">PS5 Station 5</MenuItem>

              {/* Racing Simulators */}
              <MenuItem value="Racing Simulator 1">Racing Simulator 1</MenuItem>
              <MenuItem value="Racing Simulator 2">Racing Simulator 2</MenuItem>
              <MenuItem value="Racing Simulator 3">Racing Simulator 3</MenuItem>
              <MenuItem value="Racing Simulator 4">Racing Simulator 4</MenuItem>

              {/* Supreme Billiards */}
              <MenuItem value="Supreme Billiard 1">Supreme Billiard 1</MenuItem>
              <MenuItem value="Supreme Billiard 2">Supreme Billiard 2</MenuItem>

              {/* Premium Billiards */}
              <MenuItem value="Premium Billiard 1">Premium Billiard 1</MenuItem>
              <MenuItem value="Premium Billiard 2">Premium Billiard 2</MenuItem>
              <MenuItem value="Premium Billiard 3">Premium Billiard 3</MenuItem>

              {/* Additional options from original code */}
              <MenuItem value="PS5+VR">PS5+VR</MenuItem>
              <MenuItem value="8 Ball Pool (Supreme)">
                8 Ball Pool (Supreme)
              </MenuItem>
              <MenuItem value="8 Ball Pool (Premium)">
                8 Ball Pool (Premium)
              </MenuItem>
              <MenuItem value="CRS+VR (PS V R2)">CRS+VR (PS V R2)</MenuItem>
              <MenuItem value="Car Racing Simulator">
                Car Racing Simulator
              </MenuItem>
            </TextField>
          </Box>

          {/* Category - Updated to be like Station Name */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#94a3b8", mb: 0.5, fontSize: "0.8rem" }}
            >
              Category
            </Typography>
            <TextField
              select
              margin="dense"
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              fullWidth
              displayEmpty
              size="small"
              sx={{
                backgroundColor: "#1e293b4b",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  color: "white",
                  "& fieldset": { borderColor: "#334155" },
                  "&:hover fieldset": { borderColor: "#ffffff71" },
                  "& .MuiSelect-icon": { color: "#fff" },
                },
                "& .MuiSelect-select:empty": { color: "#94a3b8" },
              }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1e293b",
                      color: "white",
                      maxHeight: 300,
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1e293b",
                        borderBottom: "1px solid #334155",
                        "&:hover": {
                          backgroundColor: "#334155",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#334155",
                          "&:hover": {
                            backgroundColor: "#475569",
                          },
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                <em style={{ color: "#94a3b8", fontStyle: "normal" }}>
                  Select Category
                </em>
              </MenuItem>
              <MenuItem value="PlayStation">PlayStation</MenuItem>
              <MenuItem value="Pool">Pool</MenuItem>
              <MenuItem value="Simulator">Simulator</MenuItem>
            </TextField>
          </Box>

          {/* Location - Fixed placeholder visibility */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#94a3b8", mb: 0.5, fontSize: "0.8rem" }}
            >
              Location
            </Typography>
            <TextField
              margin="dense"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              size="small"
              placeholder="Zone A, Zone B, ...etc"
              sx={{
                backgroundColor: "#1e293b4b",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  color: "white",
                  "& fieldset": { borderColor: "#334155" },
                  "&:hover fieldset": { borderColor: "#ffffff71" },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#94a3b8",
                  opacity: 1,
                },
              }}
              inputProps={{
                style: { color: "white" },
              }}
            />
          </Box>

          {/* Pricing Details (Normal) */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#94a3b8", fontSize: "0.8rem" }}
            >
              Pricing Details (Normal)
            </Typography>
          </Box>

          <Box display="flex" gap={1.5} mb={2.5}>
            {/* Time */}
            <Box flex={1}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#f3f4f5ff", mb: 0.5, fontSize: "0.8rem" }}
              >
                Time
              </Typography>
              <TextField
                select
                margin="dense"
                name="time"
                value={formData.time || ""}
                onChange={handleTimeChange}
                fullWidth
                displayEmpty
                size="small"
                sx={{
                  backgroundColor: "#1e293b4b",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#1e293b4b",
                    color: "white",
                    "& fieldset": { borderColor: "#809fcd4e" },
                    "&:hover fieldset": { borderColor: "#ffffff71" },
                    "& .MuiSelect-icon": { color: "#fff" },
                  },
                  "& .MuiSelect-select:empty": { color: "#94a3b8" },
                }}
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        backgroundColor: "#1e293b",
                        color: "white",
                        maxHeight: 300,
                        "& .MuiMenuItem-root": {
                          backgroundColor: "#1e293b",
                          borderBottom: "1px solid #334155",
                          "&:hover": {
                            backgroundColor: "#334155",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#334155",
                            "&:hover": {
                              backgroundColor: "#475569",
                            },
                          },
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em style={{ color: "#94a3b8", fontStyle: "normal" }}>
                    30 Min
                  </em>
                </MenuItem>
                <MenuItem value="00:30">30 Min</MenuItem>
                <MenuItem value="01:00">1 Hour</MenuItem>
              </TextField>
            </Box>

            {/* Price - Fixed placeholder visibility */}
            <Box flex={1}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#f3f4f5ff", mb: 0.5, fontSize: "0.8rem" }}
              >
                Price
              </Typography>
              <TextField
                margin="dense"
                name="price"
                type="number"
                value={formData.price}
                onChange={handlePriceChange}
                fullWidth
                size="small"
                placeholder="LKR 000"
                sx={{
                  backgroundColor: "#1e293b4b",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    color: "white",
                    "& fieldset": { borderColor: "#334155" },
                    "&:hover fieldset": { borderColor: "#ffffff71" },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#94a3b8",
                    opacity: 1,
                  },
                }}
                inputProps={{
                  style: { color: "white" },
                }}
              />
            </Box>
          </Box>

          {/* VR Pricing Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "#94a3b8", fontSize: "0.8rem" }}
            >
              Pricing Details (+VR)
            </Typography>
            <IconButton
              onClick={toggleVRPricing}
              sx={{
                backgroundColor: "#ffffff71",
                borderRadius: "50%",
                width: 20,
                height: 20,
                "&:hover": {
                  backgroundColor: "#4B5563",
                },
              }}
            >
              {/* Toggle between PLUS and MINUS icons */}
              {showVRPricing ? (
                <RemoveIcon sx={{ color: "#1e293b", fontSize: 18 }} />
              ) : (
                <AddIcon sx={{ color: "#1e293b", fontSize: 18 }} />
              )}
            </IconButton>
          </Box>

          {/* Show VR Pricing fields only when visible */}
          {showVRPricing && (
            <Box display="flex" gap={1.5} mb={1}>
              {/* VR Time */}
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#f3f4f5ff", mb: 0.5, fontSize: "0.8rem" }}
                >
                  Time
                </Typography>
                <TextField
                  select
                  margin="dense"
                  name="vrTime"
                  value={formData.vrTime || ""}
                  onChange={(e) => handleTimeChange(e, "vr")}
                  fullWidth
                  displayEmpty
                  size="small"
                  sx={{
                    backgroundColor: "#1e293b4b",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "#1e293b4b",
                      color: "white",
                      "& fieldset": { borderColor: "#809fcd4e" },
                      "&:hover fieldset": { borderColor: "#ffffff71" },
                      "& .MuiSelect-icon": { color: "#fff" },
                    },
                    "& .MuiSelect-select:empty": { color: "#94a3b8" },
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#1e293b",
                          color: "white",
                          maxHeight: 300,
                          "& .MuiMenuItem-root": {
                            backgroundColor: "#1e293b",
                            borderBottom: "1px solid #334155",
                            "&:hover": {
                              backgroundColor: "#334155",
                            },
                            "&.Mui-selected": {
                              backgroundColor: "#334155",
                              "&:hover": {
                                backgroundColor: "#475569",
                              },
                            },
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em style={{ color: "#94a3b8", fontStyle: "normal" }}>
                      30 Min
                    </em>
                  </MenuItem>
                  <MenuItem value="00:30">30 Min</MenuItem>
                  <MenuItem value="01:00">1 Hour</MenuItem>
                </TextField>
              </Box>

              {/* VR Price - Fixed placeholder visibility */}
              <Box flex={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#f3f4f5ff", mb: 0.5, fontSize: "0.8rem" }}
                >
                  Price
                </Typography>
                <TextField
                  margin="dense"
                  name="vrPrice"
                  type="number"
                  value={formData.vrPrice}
                  onChange={(e) => handlePriceChange(e, "vr")}
                  fullWidth
                  size="small"
                  placeholder="LKR 000"
                  sx={{
                    backgroundColor: "#1e293b4b",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: "white",
                      "& fieldset": { borderColor: "#334155" },
                      "&:hover fieldset": { borderColor: "#ffffff71" },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#94a3b8",
                      opacity: 1,
                    },
                  }}
                  inputProps={{
                    style: { color: "white" },
                  }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleOpenCancelPopup}
            sx={{
              background: "#1e293b",
              color: "white",
              px: 3,
              py: 0.8,
              borderRadius: "8px",
              border: "0.3px solid #809fcd4e",
              fontWeight: 500,
              fontSize: "16px",
              width: "48%",
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
              py: 0.8,
              borderRadius: "8px",
              fontSize: "16px",
              border: "0.3px solid #809fcd4e",
              width: "48%",
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
            {pendingPayload?.isEditing
              ? "Update Successful !"
              : "Create Successful !"}
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
}
