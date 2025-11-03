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
import gameicon from "../assets/gameicon.png";
import axios from "axios";

const OperatorBookingForm = ({ open, handleClose, onBookingCreated }) => {
  const [createSuccess, setcreateSuccess] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // form states
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    station: "",
    bookingDate: "",
    startTime: "",
    duration: "",
    amount: 400,
    paymentMethod: "",
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    } else if (field === "bookingDate") {
      // Ensure proper yyyy-MM-dd format for date input
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        bookingDate: formattedDate,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setCancelConfirm(true);
  };

  // Handle cancel confirmation
  const handleConfirmCancel = () => {
    setCancelConfirm(false);
    handleClose();
    // Reset form
    setFormData({
      customerName: "",
      phoneNumber: "",
      station: "",
      bookingDate: "",
      startTime: "",
      duration: "",
      amount: 400,
    });
  };

  // Handle success dialog OK button
  const handleSuccessOk = () => {
    setcreateSuccess(false);
    handleClose(); // Close the main form
  };

  // handle create booking
  const handleCreateBooking = async () => {
    // Validate required fields
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

    if (
      !formData.station ||
      !formData.bookingDate ||
      !formData.startTime ||
      !formData.duration
    ) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Submitting booking data:", formData);
    setLoading(true);

    try {
      const payload = {
        customer_name: formData.customerName,
        phone_number: formData.phoneNumber,
        station: formData.station,
        date: formData.bookingDate,
        start_time: formData.startTime,
        duration: formData.duration,
        amount: Number(formData.amount),
      };

      const token = localStorage.getItem("aToken"); // optional if auth is used

      const response = await axios.post(
        "http://127.0.0.1:8000/api/operator-bookings", // Laravel API endpoint
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Booking created successfully!", response.data);
        setcreateSuccess(true);

        // Notify parent component to refresh bookings list
        if (onBookingCreated) {
          onBookingCreated();
        }

        // Reset form
        setFormData({
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
      // Stop the loading state
      setLoading(false);

      // If Laravel returns validation errors (422)
      if (error.response?.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
        alert(JSON.stringify(error.response.data.errors, null, 2)); // Show field-specific messages
      }
      // For other backend or network errors
      else if (error.response) {
        console.error("Error creating booking:", error.response.data);
        alert(
          error.response.data.message ||
            "Failed to create booking. Please try again."
        );
      }
      // For unexpected issues (e.g., network down)
      else {
        console.error("Unexpected error:", error);
        alert(
          "Something went wrong. Please check your internet connection or console."
        );
      }
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
            py: 2,
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
            Create New Booking
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            mt={1}
          >
            {/* Customer Name */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Customer Name
              </Typography>

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

            {/* Phone Number */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Phone Number
              </Typography>

              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Enter Phone number"
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

            {/* Station */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Station
              </Typography>

              <Select
                displayEmpty
                fullWidth
                value={formData.station}
                onChange={(e) => handleInputChange("station", e.target.value)}
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
                        borderBottom: "1px solid #374151",
                        fontSize: 12,
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

            {/* Date */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Date
              </Typography>

              <TextField
                type="date"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.bookingDate}
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
                    "& input": { color: "white", fontSize: 14 },
                  },
                }}
                // MenuProps={{
                //   PaperProps: {
                //     sx: {
                //       backgroundColor: "#1F2937",
                //       color: "white",
                //       "& .MuiMenuItem-root": {
                //         backgroundColor: "#1F2937",
                //         "&:hover": {
                //           backgroundColor: "#374151",
                //         },
                //       },
                //     },
                //   },
                // }}
              />
            </Box>

            {/* Start Time */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Start Time
              </Typography>

              <Select
                displayEmpty
                fullWidth
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 500,
                  "& .MuiSelect-displayEmpty": {
                    color: "#9CA3AF",
                    fontSize: 12,
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
                    Select Time
                  </em>
                </MenuItem>
                <MenuItem value="12.00">12.00</MenuItem>
                <MenuItem value="01.00">01.00</MenuItem>
                <MenuItem value="01.30">01.30</MenuItem>
                <MenuItem value="02.00">02.00</MenuItem>
              </Select>
            </Box>

            {/* Duration */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
              >
                Duration
              </Typography>

              <Select
                displayEmpty
                fullWidth
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
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
                        borderBottom: "1px solid #374151",
                        fontSize: 12,
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
                <MenuItem value="1h 30m">1 hour 30min</MenuItem>
                <MenuItem value="2h">2 hour</MenuItem>
                <MenuItem value="2h 30m">2 hour 30min</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Payment Method */}
          <Box display="flex" mt={1} flexDirection="column" gap={1}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Booking Free
            </Typography>

            <Select
              displayEmpty
              fullWidth
              defaultValue=""
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
              <MenuItem value="card">Online transfer</MenuItem>
            </Select>
          </Box>

          {/* Amount Section */}
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

        {/* cancel & create button */}
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
            variant="contained"
            disabled={loading}
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

          {/* Cancel Confirmation Dialog */}
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
                border: "1px solid #3B4859",
              },
            }}
          >
            <DialogContent>
              <Box sx={{ mb: 1, display: "flex", justifyContent: "center" }}>
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
                  mb: 3,
                }}
              >
                Are you want to cancel this?
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  onClick={handleConfirmCancel}
                  sx={{
                    px: 6,
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
                  Yes
                </Button>
                <Button
                  onClick={() => setCancelConfirm(false)}
                  sx={{
                    px: 6,
                    fontSize: 14,
                    textTransform: "capitalize",
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
                      <linearGradient
                        id="gradient"
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                      >
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
                Create Successful !
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

export default OperatorBookingForm;
