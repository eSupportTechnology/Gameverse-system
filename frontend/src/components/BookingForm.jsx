import React from 'react'
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
} from "@mui/material";

const BookingForm = ({ open, handleClose }) => {
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
        <DialogTitle sx={{ color: '#FFFFF', fontSize: 18, fontWeight: 'bold' }}>Create New Booking</DialogTitle>

        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
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
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
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
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
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
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
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
                <MenuItem value="1h">1 Hour</MenuItem>
                <MenuItem value="2h">2 Hours</MenuItem>
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
                      "& .MuiMenuItem-root": {
                        backgroundColor: "#1F2937",
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
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: "#1F2937", width: '50%', py: 1,textTransform:'capitalize' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              width: '50%',
              py: 1,
              textTransform:'capitalize',
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}
          >
            Create Booking
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BookingForm
