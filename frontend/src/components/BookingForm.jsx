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
  Select,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const BookingForm = ({ open, handleClose, onBookingCreated }) => {
  const [createSuccess, setcreateSuccess] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nfcCardNumber: "",
    customerName: "",
    phoneNumber: "",
    station: "",
    bookingDate: "",
    startTime: "",
    duration: "",
    amount: 400,
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleCancelClick = () => setCancelConfirm(true);

  const handleConfirmCancel = () => {
    setCancelConfirm(false);
    handleClose();
    setFormData({
      nfcCardNumber: "",
      customerName: "",
      phoneNumber: "",
      station: "",
      bookingDate: "",
      startTime: "",
      duration: "",
      amount: 400,
    });
  };

  const handleSuccessOk = () => {
    setcreateSuccess(false);
    handleClose();
  };

  const handleCreateBooking = async () => {
    if (!formData.customerName.trim()) return alert("Customer name is required");
    if (!formData.phoneNumber.trim()) return alert("Phone number is required");
    if (!/^\d+$/.test(formData.phoneNumber))
      return alert("Phone number must contain only numbers");
    if (formData.phoneNumber.length < 9)
      return alert("Phone number must be at least 9 digits long");
    if (!formData.station || !formData.bookingDate || !formData.startTime || !formData.duration)
      return alert("Please fill in all required fields");

    setLoading(true);
    try {
      const payload = {
        nfc_card_number: formData.nfcCardNumber || null,
        customer_name: formData.customerName,
        phone_number: formData.phoneNumber,
        station: formData.station,
        booking_date: formData.bookingDate,
        start_time: formData.startTime,
        duration: formData.duration,
        amount: formData.amount,
      };

      const token = localStorage.getItem("aToken");
      const response = await axios.post("http://127.0.0.1:8000/api/bookings", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setcreateSuccess(true);
        onBookingCreated && onBookingCreated();
        setFormData({
          nfcCardNumber: "",
          customerName: "",
          phoneNumber: "",
          station: "",
          bookingDate: "",
          startTime: "",
          duration: "",
          amount: 400,
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#111827",
          color: "white",
          py: 2,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
        <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>
          Create New Booking
        </DialogTitle>
        <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ py: 0, pb: 2 }}>
        {/* NFC CARD NUMBER FIELD */}
        <Box display="flex" flexDirection="column" gap={1} mt={1}>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
            NFC Card Number
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter NFC Card Number"
              value={formData.nfcCardNumber}
              onChange={(e) => handleInputChange("nfcCardNumber", e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
            <IconButton
              sx={{
                backgroundColor: "#1F2937",
                color: "#0CD7FF",
                "&:hover": { backgroundColor: "#374151" },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>

        {/* GRID FIELDS */}
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={2}>
          {/* Customer Name */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Customer Name
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Phone Number */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Phone Number
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter Phone number (numbers only)"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 15 }}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  "& input::placeholder": { color: "#9CA3AF", fontSize: "14px" },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Station */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Station
            </Typography>
            <Select
              displayEmpty
              value={formData.station}
              onChange={(e) => handleInputChange("station", e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                "& .MuiSelect-select": { padding: "8px 14px" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1F2937",
                    color: "white",
                    border: "1px solid #374151",
                    "& .MuiMenuItem-root": {
                      backgroundColor: "#1F2937",
                      borderBottom: "1px solid #374151",
                      fontSize: 12,
                      "&:hover": { backgroundColor: "#374151" },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>
                  Select station
                </em>
              </MenuItem>
              <MenuItem value="station1">Station 1</MenuItem>
              <MenuItem value="station2">Station 2</MenuItem>
            </Select>
          </Box>

          {/* Date */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Date
            </Typography>
            <TextField
              type="date"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.bookingDate}
              onChange={(e) => handleInputChange("bookingDate", e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  "&::-webkit-calendar-picker-indicator": { filter: "invert(1)" },
                },
              }}
            />
          </Box>

          {/* Start Time */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Start Time
            </Typography>
            <Select
              displayEmpty
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                "& .MuiSelect-select": { padding: "8px 14px" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1F2937",
                    color: "white",
                    border: "1px solid #374151",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>
                  Select time
                </em>
              </MenuItem>
              <MenuItem value="12:00">12:00</MenuItem>
              <MenuItem value="01:00">01:00</MenuItem>
              <MenuItem value="01:30">01:30</MenuItem>
              <MenuItem value="02:00">02:00</MenuItem>
            </Select>
          </Box>

          {/* Duration */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Duration
            </Typography>
            <Select
              displayEmpty
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              fullWidth
              sx={{
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                "& .MuiSelect-select": { padding: "8px 14px" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1F2937",
                    color: "white",
                    border: "1px solid #374151",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>
                  Select duration
                </em>
              </MenuItem>
              <MenuItem value="30m">30 min</MenuItem>
              <MenuItem value="1h 30m">1 hour 30 min</MenuItem>
              <MenuItem value="2h">2 hour</MenuItem>
              <MenuItem value="2h 30m">2 hour 30 min</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Booking Fee */}
        <Box display="flex" mt={2} flexDirection="column" gap={1}>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
            Booking Fee
          </Typography>
          <Select
            displayEmpty
            defaultValue=""
            fullWidth
            sx={{
              backgroundColor: "#1F2937",
              borderRadius: "6px",
              color: "white",
              "& .MuiSelect-select": { padding: "8px 14px" },
            }}
          >
            <MenuItem value="">
              <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>
                Select payment method
              </em>
            </MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="card">Card</MenuItem>
            <MenuItem value="transfer">Online Transfer</MenuItem>
          </Select>
        </Box>

        {/* Amount */}
        <Box
          mt={3}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="cyan">
            Amount
          </Typography>
          <Typography variant="h6" color="cyan">
            LKR 400
          </Typography>
        </Box>
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ px: 2 }}>
        <Button
          onClick={handleCancelClick}
          variant="contained"
          sx={{
            backgroundColor: "#1F2937",
            width: "50%",
            py: 1,
            textTransform: "capitalize",
            "&:hover": { bgcolor: "#374151" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateBooking}
          disabled={loading}
          variant="contained"
          sx={{
            width: "50%",
            py: 1,
            textTransform: "capitalize",
            background: loading
              ? "#374151"
              : "linear-gradient(to right, #0CD7FF, #8A38F5)",
            "&:hover": {
              background: loading
                ? "#374151"
                : "linear-gradient(to right, #0bbfe0, #732ed1)",
            },
          }}
        >
          {loading ? "Creating..." : "Create Booking"}
        </Button>
      </DialogActions>
          <Dialog
  open={cancelConfirm}
  PaperProps={{
    sx: {
      bgcolor: "#0A192F",
      borderRadius: "16px",
      py: 2,
      px: 4,
      textAlign: "center",
      color: "white",
      border: '1px solid #3B4859'
    },
  }}
>
  <DialogContent>
    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
      <img src="/images/cancel.png" alt="Cancel" width={80} />
    </Box>
    <Typography
      variant="h6"
      sx={{
        background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: 20,
        fontWeight: 600,
        mb: 3
      }}
    >
      Are you want to cancel this?
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Button
        onClick={handleConfirmCancel}
        sx={{
          px: 6,
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
        Yes
      </Button>
      <Button
        onClick={() => setCancelConfirm(false)}
        sx={{
          px: 6,
          fontSize: 14,
          textTransform: 'capitalize',
          borderRadius: "8px",
          background: "#1F2937",
          color: "white",
          "&:hover": {
            background: "#374151",
          },
        }}
      >
        No
      </Button>
    </Box>
  </DialogContent>
</Dialog>
          
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
      Create Successful !
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
      {/* Cancel and Success Dialogs */}
      {/* ✅ Keep your existing cancel and success popups same as your version */}
    </Dialog>
  );
};

export default BookingForm;
