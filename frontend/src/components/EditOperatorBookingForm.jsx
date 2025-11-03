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
import sucessicon from "../assets/sucessicon.png";

const EditBookingForm = ({ open, handleClose, booking, onBookingUpdated }) => {
  const [updateSuccess, setupdateSuccess] = useState(false);

  // Helper function to normalize time format for dropdown
  const normalizeTimeForDropdown = (timeString) => {
    if (!timeString) return '';

    // Handle various time formats
    if (timeString.includes('.')) {
      // Convert "1.00" to "01:00"
      const [hours, minutes] = timeString.split('.');
      const paddedHours = hours.padStart(2, '0');
      return `${paddedHours}:${minutes}`;
    }

    if (timeString.includes(":")) {
      // Already in correct format, just ensure padding
      const [hours, minutes] = timeString.split(':');
      const paddedHours = hours.padStart(2, '0');
      return `${paddedHours}:${minutes}`;
    }

    return timeString;
  };

  // Form state initialized with booking data
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    station: '',
    bookingDate: '',
    startTime: '',
    duration: '',
    extendedTime: '',
    amount: 400
  });

  // Update form data when booking changes
  React.useEffect(() => {
    if (booking && open) {
      console.log("EditBookingFrom: Setting form data with booking:", booking);
      console.log("Available booking properties:", Object.keys(booking));
      console.log("booking.booking_date:", booking.booking_date);
      console.log("booking.date:", booking.date);
      // Format the date properly for input[type="date"]
      let formattedDate = "";
      console.log("Raw booking date:", booking.booking_date);
      console.log("Raw booking date type:", typeof booking.booking_date);

      if (booking.booking_date) {
        // Handle ISO date format from API
        const dateObj = new Date(booking.booking_date);
        console.log("Parsed date object:", dateObj);
        console.log("Is valid date:", !isNaN(dateObj.getTime()));

        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split("T")[0];
          console.log("Formatted date for input:", formattedDate);
        }
      } else if (booking.date) {
        // If date is in different format, try to parse it
        const dateObj = new Date(booking.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split("T")[0];
        }
      }

      console.log("Final formatted date:", formattedDate);

      const newFormData = {
        customerName: booking.customer_name || booking.user || '',
        phoneNumber: booking.phone_number || booking.phone || '',
        station: booking.station || '',
        bookingDate: formattedDate,
        startTime: normalizeTimeForDropdown(booking.start_time || booking.time || ''),
        duration: booking.duration || '',
        extendedTime: booking.extended_time || '',
        amount: booking.amount || booking.price || 400
      };

      console.log("EditBookingForm: Setting form data:", newFormData);
      setFormData(newFormData);
    }
  }, [booking, open]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    // Phone number validation - allow only numbers
    if (field === "phoneNumber") {
      // Remove any non-digit characters
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

  // handle edit
  const handleUpdateBooking = async () => {
    if (!booking || !booking.id) {
      console.log("No booking ID available for update");
      return;
    }

    // Basic validation
    if (!formData.customerName.trim()) {
      alert("Customer name is required");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      alert("Phone number is required");
      return;
    }

    // Validate phone number (only digits and minimum length)
    if (!/^\d+$/.test(formData.phoneNumber)) {
      alert("Phone number must contain only numbers");
      return;
    }

    if (formData.phoneNumber.length < 9) {
      alert("Phone number must be at least 9 digits long");
      return;
    }

    if (!formData.station) {
      alert("Station is required");
      return;
    }

    try {
       const payload = {
        customer_name: formData.customerName,
        phone_number: formData.phoneNumber,
        station: formData.station,
        date: formData.bookingDate,
        start_time: formData.startTime,
        duration: formData.duration,
        extended_time: formData.extendedTime,
        amount: formData.amount
      };

      console.log("Sending update payload:", payload);

      const response = await fetch(
        `http://127.0.0.1:8000/api/operator-bookings/${booking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("aToken")
              ? `Bearer ${localStorage.getItem("aToken")}`
              : "",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Booking updated successfully!", data);
        setupdateSuccess(true);
        if (onBookingUpdated) {
          onBookingUpdated();
        }
      } else {
        console.error("Update failed:", data);
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          alert(`Validation failed:\n${errorMessages}`);
        } else {
          alert(data.message || "Failed to update booking");
        }
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Check console.");
    }
  };

  return (
    <div>
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
            py: 1,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
          }}
        >
          <DialogTitle
            sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}
          >
            Edit New Booking
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
          >
            {/* name */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Customer Name
              </Typography>

              {/* Input */}
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
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

            {/* phone number */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Phone Number
              </Typography>

              {/* Input */}
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Enter Phone number (numbers only)"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 15, // Limit phone number length
                }}
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

            {/* station */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Station
              </Typography>

              {/* Input */}
              <Select
                displayEmpty
                value={formData.station}
                onChange={(e) => handleInputChange("station", e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 500,
                  "& .MuiSelect-displayEmpty": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    padding: "8px 14px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1F2937",
                      color: "white",
                      border: "1px solid #374151",
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        fontSize: 12,
                        borderBottom: "1px solid #374151",
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      fontStyle: "normal",
                    }}
                  >
                    Select station
                  </em>
                </MenuItem>
                <MenuItem value="station1">Station 1</MenuItem>
                <MenuItem value="station2">Station 2</MenuItem>
              </Select>
            </Box>

            {/* date */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Date
              </Typography>

              {/* Input */}
              <TextField
                type="date"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.bookingDate || ""}
                onChange={(e) =>
                  handleInputChange("bookingDate", e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    color: "white",
                    fontWeight: 500,
                    "&::-webkit-calendar-picker-indicator": {
                      filter: "invert(1)",
                    },
                    "& input": {
                      color: "white",
                      fontSize: 14,
                    },
                    "& input:before": {
                      color: "#9CA3AF",
                    },
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1F2937",
                      color: "white",
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* start time */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Start Time
              </Typography>

              {/* Input */}
              <Select
                displayEmpty
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 500,
                  "& .MuiSelect-displayEmpty": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    padding: "8px 14px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1F2937",
                      color: "white",
                      border: "1px solid #374151",
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        fontSize: 12,
                        borderBottom: "1px solid #374151",
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      fontStyle: "normal",
                    }}
                  >
                    Select time
                  </em>
                </MenuItem>
                <MenuItem value="12:00">12:00</MenuItem>
                <MenuItem value="12:30">12:30</MenuItem>
                <MenuItem value="01:00">01:00</MenuItem>
                <MenuItem value="01:30">01:30</MenuItem>
                <MenuItem value="02:00">02:00</MenuItem>
                <MenuItem value="02:30">02:30</MenuItem>
                <MenuItem value="03:00">03:00</MenuItem>
                <MenuItem value="03:30">03:30</MenuItem>
                <MenuItem value="04:00">04:00</MenuItem>
                <MenuItem value="04:30">04:30</MenuItem>
                <MenuItem value="05:00">05:00</MenuItem>
                <MenuItem value="05:30">05:30</MenuItem>
              </Select>
            </Box>

            {/* Duration */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Duration
              </Typography>

              {/* Input */}
              <Select
                displayEmpty
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 500,
                  "& .MuiSelect-displayEmpty": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    padding: "8px 14px",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1F2937",
                      color: "white",
                      border: "1px solid #374151",
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        fontSize: 12,
                        borderBottom: "1px solid #374151",
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      fontStyle: "normal",
                    }}
                  >
                    Select duration
                  </em>
                </MenuItem>
                <MenuItem value="30m">30 min</MenuItem>
                <MenuItem value="1h 30m">1 hour 30min </MenuItem>
                <MenuItem value="2h">2 hour</MenuItem>
                <MenuItem value="2h 30m">2 hour 30min</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Extended time */}
          <Box display="flex" mt={1} flexDirection="column" gap={1}>
            {/* Label */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Extend Time
            </Typography>
            {/* Input */}
            <TextField
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter extend time"
              value={formData.extendedTime}
              onChange={(e) =>
                handleInputChange("extendedTime", e.target.value)
              }
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

          {/* payment method */}
          <Box display="flex" mt={1} flexDirection="column" gap={1}>
            {/* Label */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Booking Free
            </Typography>

            {/* Input */}
            <Select
              displayEmpty
              value={formData.paymentMethod || ""}
              onChange={
                (e) => handleInputChange("paymentMethod", e.target.value) // <-- update formData
              }
              fullWidth
              sx={{
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                fontWeight: 500,
                "& .MuiSelect-displayEmpty": {
                  color: "#9CA3AF",
                  fontSize: "14px",
                },
                "& .MuiSelect-select": {
                  padding: "8px 14px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1F2937",
                    color: "white",
                    border: "1px solid #374151",
                    "& .MuiMenuItem-root": {
                      backgroundColor: "#1F2937",
                      fontSize: 12,
                      borderBottom: "1px solid #374151",
                      "&:hover": {
                        backgroundColor: "#374151",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <em
                  style={{
                    fontSize: 14,
                    color: "#9CA3AF",
                    fontStyle: "normal",
                  }}
                >
                  Select payment method
                </em>
              </MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="online">Online transfer</MenuItem>
            </Select>
          </Box>
          {/* amount section */}
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
              LKR {formData.amount || 400}
            </Typography>
          </Box>
        </DialogContent>

        {/* cancel & create button */}
        <DialogActions sx={{ px: 2 }}>
          <Button
            onClick={handleClose}
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
            onClick={handleUpdateBooking}
            variant="contained"
            sx={{
              width: "50%",
              py: 1,
              textTransform: "capitalize",
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
            }}
          >
            Update Booking
          </Button>
          {/* edit Success Popup */}
          <Dialog
            open={updateSuccess}
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
              <Box sx={{ mb: 1 }}>
                <img src={sucessicon} alt="" width={80} />
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
                Update Successful !
              </Typography>
              <Button
                onClick={() => {
                  setupdateSuccess(false);
                  handleClose();
                }}
                sx={{
                  px: 8,
                  fontSize: 14,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #0CD7FF 0%, #8A38F5 73%)",
                  },
                }}
              >
                Ok
              </Button>
            </DialogContent>
          </Dialog>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditBookingForm;
