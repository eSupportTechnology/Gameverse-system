import React, { useContext, useState } from 'react'
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
import { AdminContext } from '../context/AdminContext';
import axios from 'axios'

const AdminBookinFrom = ({ open, handleClose }) => {

  const { aToken } = useContext(AdminContext)
  const [createSuccess, setcreateSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    station: '',
    date: '',
    start_time: '',
    duration: '',
    fees: '',
    amount: 400,
  });

  // handle edit
  const handleUpdateBooking = async () => {
    const token = aToken;
    console.table(formData)
    try {
      const response = await axios.post('http://localhost:8000/api/add-booking', formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        console.log(response.data);
        setcreateSuccess(true);
        // Clear the form after success
        setFormData({
          customer_name: '',
          phone: '',
          station: '',
          date: '',
          start_time: '',
          duration: '',
          fees: '',
          amount: 400, 
        });
      }

    } catch (error) {
      console.error(error.response?.data || error.message);
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold", }}>
            Create New Booking
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>
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
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                defaultValue=""
                fullWidth
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
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
                      border: '1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        borderBottom: '1px solid #374151',
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
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              {/* <Select
                displayEmpty
                defaultValue=""
                fullWidth
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
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
                      border: '1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        fontSize: 12,
                        borderBottom: '1px solid #374151',
                        "&:hover": {
                          backgroundColor: "#374151",
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>12.00</em>
                </MenuItem>
                <MenuItem value="12.00">12.00</MenuItem>
                <MenuItem value="1.00">01.00</MenuItem>
                <MenuItem value="12.00">01.30</MenuItem>
                <MenuItem value="1.00">02.00</MenuItem>
              </Select> */}
              <Select
                displayEmpty
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                fullWidth
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: 500,
                  "& .MuiSelect-displayEmpty": { color: "#9CA3AF", fontSize: 12 },
                  "& .MuiSelect-select": { padding: "8px 14px" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1F2937",
                      color: "white",
                      border: '1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        fontSize: 12,
                        borderBottom: '1px solid #374151',
                        "&:hover": { backgroundColor: "#374151" },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <em style={{ fontSize: 14, color: "#9CA3AF", fontStyle: "normal" }}>Select time</em>
                </MenuItem>
                <MenuItem value="12:00:00">12:00 PM</MenuItem>
                <MenuItem value="13:00:00">01:00 PM</MenuItem>
                <MenuItem value="13:30:00">01:30 PM</MenuItem>
                <MenuItem value="14:00:00">02:00 PM</MenuItem>
                <MenuItem value="14:30:00">02:30 PM</MenuItem>
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
                defaultValue=""
                fullWidth
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                      border: '1px solid #374151',
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
                        borderBottom: '1px solid #374151',
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
              value={formData.fees}
              onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
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
                    border: '1px solid #374151',
                    "& .MuiMenuItem-root": {
                      backgroundColor: "#1F2937",
                      fontSize: 12,
                      borderBottom: '1px solid #374151',
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
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "#1F2937", width: '50%', py: 1, textTransform: 'capitalize', "&:hover": { bgcolor: "#374151" }, }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateBooking}
            variant="contained"
            sx={{
              width: '50%',
              py: 1,
              textTransform: 'capitalize',
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}
          >
            Create Booking
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

export default AdminBookinFrom
