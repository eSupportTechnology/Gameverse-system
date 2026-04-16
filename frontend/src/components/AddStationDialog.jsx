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
  const [pricingList, setPricingList] = useState([
    { duration: 30, price: "", vrPrice: "" },
  ]);
  const addDurationRow = () => {
    setPricingList([...pricingList, { duration: 60, price: "", vrPrice: "" }]);
  };
  const removeDurationRow = (index) => {
    const updated = pricingList.filter((_, i) => i !== index);
    setPricingList(updated);
  };
  const handleDurationChange = (index, value) => {
    if (pricingList.some((p, i) => p.duration === value && i !== index)) {
      alert("This duration already exists.");
      return;
    }

    const updated = [...pricingList];
    updated[index].duration = value;
    setPricingList(updated);
  };

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
    if (!formData.name || !formData.type || !formData.location) {
      toast.error("Name, Category, and Location are required.");
      return;
    }

    for (let i = 0; i < pricingList.length; i++) {
      const item = pricingList[i];
      if (!item.price) {
        toast.error(`Please enter price for duration ${item.duration} min`);
        return;
      }
      if (showVRPricing && item.vrPrice === "") {
        item.vrPrice = null;
      }
    }

    const payload = {
      name: formData.name,
      type: formData.type,
      location: formData.location,
      status: formData.status || "Available",
      bookings: formData.bookings || 0,
      pricing: pricingList.map((item) => ({
        duration: item.duration,
        price: parseFloat(item.price),
        vrPrice: item.vrPrice !== "" ? parseFloat(item.vrPrice) : null,
      })),
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
        status: "Available",
        bookings: 0,
      });
      setPricingList([{ duration: 30, price: "", vrPrice: "" }]);
      setShowVRPricing(true);
      setCreateSuccess(false);
      setPendingPayload(null);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save station. Make sure all required fields are filled.",
      );
      setCreateSuccess(false);
      setPendingPayload(null);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDirectClose}
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
            onClick={handleDirectClose}
            sx={{ color: "#94a3b8", cursor: "pointer" }}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Pricing Details
            </Typography>

            {pricingList.map((item, index) => (
              <Box
                key={index}
                display="flex"
                gap={1.5}
                mb={2}
                alignItems="center"
              >
                {/* Duration */}
                <TextField
                  select
                  size="small"
                  value={item.duration}
                  onChange={(e) =>
                    handleDurationChange(index, parseInt(e.target.value))
                  }
                  sx={{
                    flex: 1,
                    backgroundColor: "#1e293b4b",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      color: "white",
                      "& fieldset": { borderColor: "#334155" },
                      "&:hover fieldset": { borderColor: "#ffffff71" },
                      "& .MuiSelect-icon": { color: "#fff" },
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#1e293b",
                          color: "white",
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value={30}>30 Min</MenuItem>
                  <MenuItem value={60}>1 Hour</MenuItem>
                </TextField>

                {/* Normal Price */}
                <TextField
                  type="number"
                  size="small"
                  placeholder="Normal Price"
                  value={item.price}
                  onChange={(e) => {
                    const updated = [...pricingList];
                    updated[index].price = e.target.value;
                    setPricingList(updated);
                  }}
                  sx={{
                    flex: 1,
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

                {/* VR Price */}
                <TextField
                  type="number"
                  size="small"
                  placeholder="VR Price"
                  value={item.vrPrice}
                  onChange={(e) => {
                    const updated = [...pricingList];
                    updated[index].vrPrice = e.target.value;
                    setPricingList(updated);
                  }}
                  sx={{
                    flex: 1,
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

                {pricingList.length > 1 && (
                  <IconButton onClick={() => removeDurationRow(index)}>
                    <RemoveIcon sx={{ color: "red" }} />
                  </IconButton>
                )}
              </Box>
            ))}

            <Button
              onClick={addDurationRow}
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                color: "#0CD7FF",
              }}
            >
              Add Duration
            </Button>
          </Box>
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
