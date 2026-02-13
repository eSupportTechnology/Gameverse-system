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
  FormControlLabel,
  Checkbox, 
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
  if (!formData.price_30 || !formData.price_60) {
    toast.error("Enter both 30 min and 1 hour prices");
    return;
  }

  const priceArray = [];
  const timeArray = [];

  if (formData.selectedTimes?.includes("30")) {
    priceArray.push(Number(formData.price_30));
    timeArray.push("30");
  }
  if (formData.selectedTimes?.includes("60")) {
    priceArray.push(Number(formData.price_60));
    timeArray.push("60");
  }

  let vrPriceArray = null;
  let vrTimeArray = null;

  if (formData.selectedVRTimes?.length) {
    vrPriceArray = [];
    vrTimeArray = [];
    if (formData.selectedVRTimes.includes("30")) {
      vrPriceArray.push(Number(formData.vrPrice_30));
      vrTimeArray.push("30");
    }
    if (formData.selectedVRTimes.includes("60")) {
      vrPriceArray.push(Number(formData.vrPrice_60));
      vrTimeArray.push("60");
    }
  }

  const payload = {
    ...formData,
    price: priceArray,
    time: timeArray,
    vrPrice: vrPriceArray,
    vrTime: vrTimeArray,
  };

  setPendingPayload({ payload, isEditing: isEditing });
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
{/* Time & Price Section */}
<Box sx={{ mb: 2 }}>
  <Typography sx={{ color: "#94a3b8", mb: 0.5, fontSize: "0.8rem" }}>
    Time & Price
  </Typography>

  <TextField
    select
    margin="dense"
    fullWidth
    size="small"
    value={formData.selectedTimes || []}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, selectedTimes: e.target.value }))
    }
    SelectProps={{
      multiple: true,
      renderValue: (selected) =>
        selected.map((t) => (t === "30" ? "30 Min" : "1 Hour")).join(", "),
      MenuProps: {
        PaperProps: {
          sx: {
            backgroundColor: "#1e293b",
            color: "white",
            maxHeight: 300,
            "& .MuiMenuItem-root": {
              backgroundColor: "#1e293b",
              borderBottom: "1px solid #334155",
              "&:hover": { backgroundColor: "#334155" },
              "&.Mui-selected": {
                backgroundColor: "#334155",
                "&:hover": { backgroundColor: "#475569" },
              },
            },
          },
        },
      },
    }}
    sx={{
      backgroundColor: "#1e293b4b",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        color: "white",
        "& fieldset": { borderColor: "#334155" },
        "&:hover fieldset": { borderColor: "#ffffff71" },
        "& .MuiSelect-icon": { color: "white" },
      },
      "& .MuiSelect-select:empty": { color: "#94a3b8" },
    }}
  >
    <MenuItem value="30">
      <Checkbox checked={formData.selectedTimes?.includes("30") || false} />
      30 Min
    </MenuItem>
    <MenuItem value="60">
      <Checkbox checked={formData.selectedTimes?.includes("60") || false} />
      1 Hour
    </MenuItem>
  </TextField>

  {/* Dynamic Price Inputs */}
  <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
    {formData.selectedTimes?.includes("30") && (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography sx={{ width: "100px", color: "#f3f4f5" }}>30 Min</Typography>
        <TextField
          name="price_30"
          type="number"
          value={formData.price_30 || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, price_30: e.target.value }))
          }
          placeholder="LKR 600"
          fullWidth
          size="small"
          sx={{
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#ffffff71" },
            },
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputBase-input::placeholder": { color: "#94a3b8", opacity: 1 },
          }}
        />
      </Box>
    )}

    {formData.selectedTimes?.includes("60") && (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography sx={{ width: "100px", color: "#f3f4f5" }}>1 Hour</Typography>
        <TextField
          name="price_60"
          type="number"
          value={formData.price_60 || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, price_60: e.target.value }))
          }
          placeholder="LKR 1000"
          fullWidth
          size="small"
          sx={{
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#ffffff71" },
            },
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputBase-input::placeholder": { color: "#94a3b8", opacity: 1 },
          }}
        />
      </Box>
    )}
  </Box>
</Box>


            {/* VR Pricing */}
       {/* VR Pricing Section */}
<Box sx={{ mb: 2 }}>
  <Typography sx={{ color: "#94a3b8", mb: 0.5, fontSize: "0.8rem" }}>
    VR Time & Price
  </Typography>

  <TextField
    select
    margin="dense"
    fullWidth
    size="small"
    value={formData.selectedVRTimes || []}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, selectedVRTimes: e.target.value }))
    }
    SelectProps={{
      multiple: true,
      renderValue: (selected) =>
        selected.map((t) => (t === "30" ? "30 Min" : "1 Hour")).join(", "),
      MenuProps: {
        PaperProps: {
          sx: {
            backgroundColor: "#1e293b",
            color: "white",
            maxHeight: 300,
            "& .MuiMenuItem-root": {
              backgroundColor: "#1e293b",
              borderBottom: "1px solid #334155",
              "&:hover": { backgroundColor: "#334155" },
              "&.Mui-selected": {
                backgroundColor: "#334155",
                "&:hover": { backgroundColor: "#475569" },
              },
            },
          },
        },
      },
    }}
    sx={{
      backgroundColor: "#1e293b4b",
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        color: "white",
        "& fieldset": { borderColor: "#334155" },
        "&:hover fieldset": { borderColor: "#ffffff71" },
        "& .MuiSelect-icon": { color: "white" },
      },
      "& .MuiSelect-select:empty": { color: "#94a3b8" },
    }}
  >
    <MenuItem value="30">
      <Checkbox checked={formData.selectedVRTimes?.includes("30") || false} />
      30 Min
    </MenuItem>
    <MenuItem value="60">
      <Checkbox checked={formData.selectedVRTimes?.includes("60") || false} />
      1 Hour
    </MenuItem>
  </TextField>

  {/* Dynamic VR Price Inputs */}
  <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
    {formData.selectedVRTimes?.includes("30") && (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography sx={{ width: "100px", color: "#f3f4f5" }}>30 Min</Typography>
        <TextField
          name="vrPrice_30"
          type="number"
          value={formData.vrPrice_30 || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, vrPrice_30: e.target.value }))
          }
          placeholder="LKR 600"
          fullWidth
          size="small"
          sx={{
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#ffffff71" },
            },
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputBase-input::placeholder": { color: "#94a3b8", opacity: 1 },
          }}
        />
      </Box>
    )}

    {formData.selectedVRTimes?.includes("60") && (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography sx={{ width: "100px", color: "#f3f4f5" }}>1 Hour</Typography>
        <TextField
          name="vrPrice_60"
          type="number"
          value={formData.vrPrice_60 || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, vrPrice_60: e.target.value }))
          }
          placeholder="LKR 1000"
          fullWidth
          size="small"
          sx={{
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "&:hover fieldset": { borderColor: "#ffffff71" },
            },
            "& .MuiInputBase-input": { color: "white" },
            "& .MuiInputBase-input::placeholder": { color: "#94a3b8", opacity: 1 },
          }}
        />
      </Box>
    )}
  </Box>
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
