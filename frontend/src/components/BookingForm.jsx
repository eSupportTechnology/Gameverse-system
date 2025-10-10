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

const BookingForm = ({ open, handleClose }) => {
  const [createSuccess, setcreateSuccess] = useState(false);

  // form states
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [station, setStation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(400);

  // handle create booking
  const handleUpdateBooking = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/bookings", {
        customer_name: customerName,
        phone_number: phoneNumber,
        station,
        date,
        start_time: startTime,
        duration,
        payment_method: paymentMethod,
        amount,
      });

      console.log("Booking created:", response.data);
      setcreateSuccess(true);

      // clear fields
      setCustomerName("");
      setPhoneNumber("");
      setStation("");
      setDate("");
      setStartTime("");
      setDuration("");
      setPaymentMethod("");
      setAmount(400);
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error);
      alert("Failed to create booking");
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
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
                Customer Name
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
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
                placeholder="Enter Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
                Station
              </Typography>
              <Select
                displayEmpty
                fullWidth
                value={station}
                onChange={(e) => setStation(e.target.value)}
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
              >
                <MenuItem value="">
                  <em style={{ fontSize: 14, color: "#9CA3AF" }}>Select station</em>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    color: "white",
                    fontWeight: 500,
                    "&::-webkit-calendar-picker-indicator": { filter: "invert(1)" },
                    "& input": { color: "white", fontSize: 14 },
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
                fullWidth
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
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
              >
                <MenuItem value=""><em style={{ fontSize: 14, color: "#9CA3AF" }}>Select Time</em></MenuItem>
                <MenuItem value="12.00">12.00</MenuItem>
                <MenuItem value="1.00">01.00</MenuItem>
                <MenuItem value="1.30">01.30</MenuItem>
                <MenuItem value="2.00">02.00</MenuItem>
              </Select>
            </Box>

            {/* Duration */}
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
                Duration
              </Typography>
              <Select
                displayEmpty
                fullWidth
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
              >
                <MenuItem value=""><em style={{ fontSize: 14, color: "#9CA3AF" }}>Select duration</em></MenuItem>
                <MenuItem value="30m">30 min</MenuItem>
                <MenuItem value="1h 30m">1 hour 30min</MenuItem>
                <MenuItem value="2h">2 hour</MenuItem>
                <MenuItem value="2h 30m">2 hour 30min</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Payment Method */}
          <Box display="flex" mt={1} flexDirection="column" gap={1}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}>
              Payment Method
            </Typography>
            <Select
              displayEmpty
              fullWidth
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                fontWeight: 500,
              }}
            >
              <MenuItem value=""><em style={{ fontSize: 14, color: "#9CA3AF" }}>Select payment method</em></MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="online">Online transfer</MenuItem>
            </Select>
          </Box>

          {/* Amount Section */}
          <Box mt={3} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" color="cyan">Amount</Typography>
            <Typography variant="h6" color="cyan">LKR {amount}</Typography>
          </Box>
        </DialogContent>

        {/* cancel & create button */}
        <DialogActions sx={{ px: 2 }}>
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "#1F2937", width: "50%", py: 1 }}>
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
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
            }}
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>

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
              <Box sx={{ mb: 1 }}>
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
                  mb: 1,
                }}
              >
                Create Successful !
              </Typography>
              <Button
                onClick={() => setcreateSuccess(false)}
                sx={{
                  px: 8,
                  fontSize: 14,
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4), rgba(138, 56, 245, 0.4))",
                  color: "white",
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

export default BookingForm;
