import React, { useState } from 'react'
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
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import gameicon from '../assets/gameicon.png'
import axios from 'axios';

const BookingForm = ({ open, handleClose, onBookingCreated }) => {

  const [createSuccess, setcreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    station: '',
    bookingDate: '',
    startTime: '',
    duration: '',
    amount: 400
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

// ---------- CONNECT TO BACKEND USING AXIOS ----------
  const handleCreateBooking = async () => {
    // Validate required fields
    if (!formData.customerName || !formData.phoneNumber || !formData.station || 
        !formData.bookingDate || !formData.startTime || !formData.duration) {
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
        booking_date: formData.bookingDate,
        start_time: formData.startTime,
        duration: formData.duration,
        amount: formData.amount
      };

      const token = localStorage.getItem("aToken"); // optional if auth is used

      const response = await axios.post(
        "http://127.0.0.1:8000/api/bookings", // Laravel API endpoint
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
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
          customerName: '',
          phoneNumber: '',
          station: '',
          bookingDate: '',
          startTime: '',
          duration: '',
          amount: 400
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error);
      alert(
        error.response?.data?.message || "Failed to create booking. Check console."
      );
    } finally {
      setLoading(false);
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
          sx: { borderRadius: "12px", backgroundColor: "#111827", color: "white", py: 2, },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1}}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold", }}>
            Create New Booking
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers  sx={{py:0, pb:2}}>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
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
                onChange={(e) => handleInputChange('customerName', e.target.value)}
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
                placeholder="Enter Phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
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
                onChange={(e) => handleInputChange('station', e.target.value)}
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
                      border:'1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        borderBottom:'1px solid #374151',
                        fontSize:12,
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>Select station</em>
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
                value={formData.bookingDate}
                onChange={(e) => handleInputChange('bookingDate', e.target.value)}
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
                      fontSize: 14
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
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 500,
                  "& .MuiSelect-displayEmpty": {
                    color: "#9CA3AF",
                    fontSize:12,
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
                      border:'1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        fontSize:12,
                        borderBottom:'1px solid #374151',
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>Select time</em>
                </MenuItem>
                <MenuItem value="12:00">12:00</MenuItem>
                <MenuItem value="01:00">01:00</MenuItem>
                <MenuItem value="01:30">01:30</MenuItem>
                <MenuItem value="02:00">02:00</MenuItem>
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
                onChange={(e) => handleInputChange('duration', e.target.value)}
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
                      border:'1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        borderBottom:'1px solid #374151',
                        fontSize:12,
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>Select duration</em>
                </MenuItem>
                <MenuItem value="30m">30 min</MenuItem>
                <MenuItem value="1h 30m">1 hour 30min </MenuItem>
                <MenuItem value="2h">2 hour</MenuItem>
                <MenuItem value="2h 30m">2 hour 30min</MenuItem>
              </Select>
            </Box>
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
              defaultValue=""
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
                    border:'1px solid #374151',
                    "& .MuiMenuItem-root": {
                      backgroundColor: "#1F2937",
                      fontSize:12,                      
                      borderBottom:'1px solid #374151',
                      "&:hover": {
                        backgroundColor: "#374151",
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>Select payment method</em>
              </MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="card">Online transfer</MenuItem>
            </Select>
          </Box>
          {/* amount section */}
          <Box mt={3} sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
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
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "#1F2937", width: '50%', py: 1, textTransform: 'capitalize',"&:hover": { bgcolor: "#374151" }, }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateBooking}
            disabled={loading}
            variant="contained"
            sx={{
              width: '50%',
              py: 1,
              textTransform: 'capitalize',
              background: loading ? "#374151" : "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": { background: loading ? "#374151" : "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
          {/* create Success Popup */}
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
              <Box sx={{ mb: 1, }}>
                <img src={gameicon} alt="" width={80} />
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
                onClick={() => setcreateSuccess(false)}
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
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BookingForm
