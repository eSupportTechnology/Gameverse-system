import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import AddNFCUserDialog from "./AddNFCUserDialog";
import CreateSuccessDialog from "./CreateSuccessDialog";
import UpdateSuccessDialog from "./UpdateSuccess";
import { API_BASE_URL } from "../apiConfig";

const BookingForm = ({
  open,
  handleClose,
  onBookingCreated,
  stations,
  bookings,
  existingBooking = null,
}) => {
  const [createSuccess, setcreateSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nfcDialogOpen, setNfcDialogOpen] = useState(false);
  const normalizeDate = (date) => {
  if (!date) return "";
  return date.split("T")[0].trim();
};


  const [nfcFormData, setNfcFormData] = useState({
    nfcCardNumber: "",
    fullName: "",
    phoneNo: "",
    nicNumber: "",
    activeUser: true,
  });

  const [formData, setFormData] = useState({
    nfcCardNumber: "",
    customerName: "",
    phoneNumber: "",
    station: "",
    bookingDate: "",
    vrPlay: "",
    startTime: "",
    duration: "",
    numberOfPlayers: 1,
    amount: 0,
  });
  useEffect(() => {
    if (existingBooking) {
      setFormData({
        nfcCardNumber: existingBooking.nfc_card_number || "",
        customerName: existingBooking.customer_name || "",
        phoneNumber: existingBooking.phone_number || "",
        station: existingBooking.station || "",
        bookingDate: existingBooking.booking_date?.split("T")[0] || "",
        vrPlay: existingBooking.vr_play || "",
        startTime: existingBooking.start_time || "",
        duration: existingBooking.duration || "",
        numberOfPlayers: existingBooking.number_of_players || 1,
        amount: existingBooking.amount || 0,
      });
    }
  }, [existingBooking]);

  const handleOpenNfcDialog = () => {
    setNfcDialogOpen(true);
  };

  // Close NFC dialog
  const handleCloseNfcDialog = () => {
    setNfcDialogOpen(false);
  };

  // Handle NFC user creation - auto-fill booking form
  const handleCreateNFCUser = (nfcData) => {
    setFormData((prev) => ({
      ...prev,
      nfcCardNumber: nfcData.nfcCardNumber,
      customerName: nfcData.fullName,
      phoneNumber: nfcData.phoneNo.replace(/\s/g, ""),
    }));

    setNfcDialogOpen(false);
  };

  const handleInputChange = (field, value) => {
    if (field === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
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
      vrPlay: "",
      startTime: "",
      duration: "",
      amount: 0,
    });
  };

  const handleSuccessOk = () => {
    setcreateSuccess(false);
    handleClose();
  };

  const handleUpdateOk = () => {
    setUpdateSuccess(false);
    handleClose();
  };

  const parse12HourTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    let [hour, min] = timeStr.split(":").map(Number);
    // Assuming all times are PM except 12 (like your earlier example)
    if (hour !== 12) hour += 12;
    return hour * 60 + min;
  };

  const parseDurationToMinutes = (duration) => {
    if (!duration) return 0;
    let mins = 0;
    const hourMatch = duration.match(/(\d+)h/);
    const minMatch = duration.match(/(\d+)m/);
    if (hourMatch) mins += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) mins += parseInt(minMatch[1], 10);
    return mins;
  };

  const isTimeOverlap = (start1, duration1, start2, duration2) => {
    const s1 = parse12HourTimeToMinutes(start1);
    const e1 = s1 + parseDurationToMinutes(duration1);
    const s2 = parse12HourTimeToMinutes(start2);
    const e2 = s2 + parseDurationToMinutes(duration2);
    return s1 < e2 && s2 < e1;
  };
  const isSameStartTime = (t1, t2) => {
    return t1?.trim() === t2?.trim();
  };
    // Get bookings for the selected slot
  const getSlotBookings = () => {
    const formStation = formData.station?.trim();
    const formTime = normalizeTime(formData.startTime);
    const formDate = normalizeDate(formData.bookingDate);

    if (!formStation || !formTime || !formDate) return [];

    return (Array.isArray(bookings) ? bookings : []).filter((b) => {
      if (existingBooking && b.id === existingBooking.id) return false;

      return (
        b.station?.trim() === formStation &&
        normalizeTime(b.start_time) === formTime &&
        normalizeDate(b.booking_date) === formDate
      );
    });
  };



  // Capacity of the slot (defined by the 1st booking)
  const getSlotCapacity = () => {
    const slotBookings = getSlotBookings();
    if (slotBookings.length === 0) return null;

    return slotBookings[0].number_of_players || null;
  };
  const isFirstBookingInSlot = () => {
    const slotBookings = getSlotBookings();
    return slotBookings.length === 0;
  };

  const normalizeTime = (time) => {
    if (!time) return "";
    return time.replace(/\s?(AM|PM)$/i, "").replace(".", ":").trim();
  };


  const validateSlot = () => {
  const stationData = stations.find((s) => s.name === formData.station);
  if (!stationData) return { valid: true };

  const isPlayStation = stationData.type === "PlayStation";
  if (!isPlayStation) return { valid: true };

  const slotBookings = getSlotBookings();

  // 1st booking
    if (slotBookings.length === 0) {
      if (formData.numberOfPlayers > stationData.maxPlayers) {
        return {
          valid: false,
          message: `Maximum ${stationData.maxPlayers} players allowed`,
        };
      }
      return { valid: true };
    }

    // subsequent bookings
    const capacity = slotBookings[0].number_of_players;

    if (slotBookings.length >= capacity) {
      return {
        valid: false,
        message: "This slot is fully booked",
      };
    }

    return { valid: true };
  };
const slotCapacity = getSlotCapacity();
const slotBookingsCount = getSlotBookings().length;

  // Auto-set slot duration if already exists
  useEffect(() => {
    const slotDuration = getSlotDurationFromExistingBookings();
    if (slotDuration) {
      setFormData((prev) => ({ ...prev, duration: slotDuration }));
    }
  }, [formData.station, formData.startTime, formData.bookingDate, bookings]);

  const getSlotDurationFromExistingBookings = () => {
    const formStation = formData.station?.trim();
    const formTime = normalizeTime(formData.startTime);
    const formDate = formData.bookingDate?.trim();

    const allBookings = Array.isArray(bookings) ? bookings : [];

    const matchedBookings = allBookings.filter((b) => {
      const bookingStation = b.station?.trim();
     const bookingTime = normalizeTime(b.start_time);
     const bookingDate = normalizeDate(b.booking_date);

      if (existingBooking && b.id === existingBooking.id) return false;

      return (
        bookingStation === formStation &&
        bookingTime === formTime &&
        bookingDate === formDate
      );
    });

    if (matchedBookings.length === 0) return null;

    // First booking determines slot duration
    return matchedBookings[0].duration;
  };

  const handleCreateBooking = async () => {
    const slotDuration = getSlotDurationFromExistingBookings();
    const finalDuration = slotDuration || formData.duration;
    const finalPlayers = slotCapacity ?? formData.numberOfPlayers;


    if (!formData.customerName.trim())
      return alert("Customer name is required");
    if (!formData.phoneNumber.trim()) return alert("Phone number is required");
    if (!/^\d+$/.test(formData.phoneNumber))
      return alert("Phone number must contain only numbers");
    if (formData.phoneNumber.length < 9)
      return alert("Phone number must be at least 9 digits long");
    if (
      !formData.station ||
      !formData.bookingDate ||
      !formData.startTime ||
      !formData.duration
    )
      return alert("Please fill in all required fields");
    const result = validateSlot();

    if (!result.valid) {
      alert(result.message);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nfc_card_number: formData.nfcCardNumber || null,
        customer_name: formData.customerName,
        phone_number: formData.phoneNumber,
        station: formData.station,
        booking_date: formData.bookingDate,
        vr_play: formData.vrPlay,
        start_time: formData.startTime,
        duration: finalDuration,
        number_of_players: finalPlayers,
        amount: formData.amount,
      };

      const token = localStorage.getItem("aToken");

      if (existingBooking) {
        // Update booking
        await axios.put(
          `${API_BASE_URL}/api/bookings/${existingBooking.id}`,
          payload,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          },
        );
        setUpdateSuccess(true); // show update dialog
      } else {
        // Create new booking
        await axios.post(`${API_BASE_URL}/api/bookings`, payload, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });
        setcreateSuccess(true); // show create dialog
        setFormData({
          nfcCardNumber: "",
          customerName: "",
          phoneNumber: "",
          station: "",
          bookingDate: "",
          vrPlay: "",
          startTime: "",
          duration: "",
          amount: 0,
        });
      }

      onBookingCreated && onBookingCreated();
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(error.response?.data?.message || "Failed to submit booking");
    } finally {
      setLoading(false);
    }
  };

  const selectedStation = stations.find(
    (station) => station.name === formData.station,
  );
  const allowMultiplePlayers =
    selectedStation && !["Pool", "Simulator"].includes(selectedStation.type);

  const showVRPlay = selectedStation?.vrPrice && selectedStation?.vrTime;

  useEffect(() => {
    if (!formData.station || !formData.duration) return;

    const stationData = stations.find((s) => s.name === formData.station);
    if (!stationData) return;

    const basePrice = Number(stationData.price) || 0;
    const baseMinutes = Number(stationData.time) || 60;

    const durationMinutes = parseDurationToMinutes(formData.duration);
    const normalAmount = (basePrice / baseMinutes) * durationMinutes;

    const vrPrice =
      formData.vrPlay === "yes" ? Number(stationData.vrPrice || 0) : 0;
    const finalAmount = normalAmount + vrPrice;
    setFormData((prev) => ({ ...prev, amount: Math.round(finalAmount) }));
  }, [formData.station, formData.duration, formData.vrPlay, stations]);

  const generateTimeSlots = () => {
    const selected = stations.find((s) => s.name === formData.station);

    const isPool = selected?.type === "Pool";
    const interval = isPool ? 30 : 15;

    let slots = [];

    let start = 12 * 60;
    let end = 19 * 60 + 45;

    for (let minutes = start; minutes <= end; minutes += interval) {
      const h24 = Math.floor(minutes / 60);
      const m = minutes % 60;

      const h12 = h24 > 12 ? h24 - 12 : h24;

      const label = `${h12.toString().padStart(2, "0")}.${m
        .toString()
        .padStart(2, "0")}`;

      const value = `${h12.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;

      slots.push({ label, value });
    }

    return slots;
  };

  return (
    <>
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
            {existingBooking ? "Edit Booking" : "Create New Booking"}
          </DialogTitle>
          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>
          {/* NFC Card Number */}
          <Box display="flex" flexDirection="column" gap={1} mt={1}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              NFC Card Number
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Enter NFC Card Number"
                value={formData.nfcCardNumber}
                onChange={(e) =>
                  handleInputChange("nfcCardNumber", e.target.value)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box
                        component="img"
                        src="/images/nfc.png"
                        alt="NFC"
                        sx={{ width: 22, height: 22, cursor: "pointer" }}
                        onClick={() => console.log("NFC icon clicked")}
                      />
                    </InputAdornment>
                  ),
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

              <Box
                sx={{
                  width: 38,
                  height: 38,
                  backgroundColor: "#1F2937",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#374151" },
                }}
                onClick={handleOpenNfcDialog}
              >
                <AddIcon sx={{ color: "white", fontSize: 22 }} />
              </Box>
            </Box>
          </Box>

          {/* Customer Name & Phone Number */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            mt={2}
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

            {/* Phone */}
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
                  maxLength: 15,
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
          </Box>

          {/* Station & Date */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            mt={2}
          >
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

                {stations.map((station) => (
                  <MenuItem key={station.id} value={station.name}>
                    {station.name}
                  </MenuItem>
                ))}
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
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    color: "white",
                    "&::-webkit-calendar-picker-indicator": {
                      filter: "invert(1)",
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* VR Play */}
          {showVRPlay && (
            <Box mt={2}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF", mb: 1 }}
              >
                VR Play
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                {/* YES */}
                <Box
                  onClick={() => handleInputChange("vrPlay", "yes")}
                  sx={{
                    flex: 1,
                    height: 40,
                    borderRadius: "12px",
                    backgroundColor: "#1F2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    cursor: "pointer",
                    transition: "0.2s",
                    border: "1px solid #253041",
                  }}
                >
                  <Typography sx={{ color: "#9CA3AF", fontSize: 15 }}>
                    Yes
                  </Typography>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid #9CA3AF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {formData.vrPlay === "yes" && (
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: "#9CA3AF",
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* NO */}
                <Box
                  onClick={() => handleInputChange("vrPlay", "no")}
                  sx={{
                    flex: 1,
                    height: 40,
                    borderRadius: "12px",
                    backgroundColor: "#1F2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    cursor: "pointer",
                    transition: "0.2s",
                    border: "1px solid #253041",
                  }}
                >
                  <Typography sx={{ color: "#9CA3AF", fontSize: 15 }}>
                    No
                  </Typography>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid #9CA3AF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {formData.vrPlay === "no" && (
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: "#9CA3AF",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* Start Time & Duration */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2}
            mt={2}
          >
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
                {generateTimeSlots().map((t, i) => (
                  <MenuItem key={i} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
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
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                fullWidth
                disabled={!!getSlotDurationFromExistingBookings()} // Disable if duration exists
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
                <MenuItem value="1h">1 hour</MenuItem>
                <MenuItem value="1h 30m">1 hour 30 min</MenuItem>
                <MenuItem value="2h">2 hour</MenuItem>
                <MenuItem value="2h 30m">2 hour 30 min</MenuItem>
                <MenuItem value="3h">3 hour</MenuItem>
                <MenuItem value="3h 30m">3 hour 30 min</MenuItem>
                <MenuItem value="4h">4 hour</MenuItem>
              </Select>
            </Box>
          </Box>
          {allowMultiplePlayers && (
          <Box mt={2}>
            <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
              Number of Players
            </Typography>

            <TextField
              type="number"
              size="small"
              fullWidth
              value={isFirstBookingInSlot() ? formData.numberOfPlayers : slotCapacity || 1}
              disabled={!isFirstBookingInSlot()}
              onChange={(e) => {
                if (!isFirstBookingInSlot()) return;

                let value = e.target.value;
                if (value === "") {
                  setFormData((prev) => ({ ...prev, numberOfPlayers: value }));
                  return;
                }

                if (/^[0-9\b]+$/.test(value)) {
                  value = Number(value);
                  // Cap at 4
                  if (value > 4) value = 4;
                  setFormData((prev) => ({ ...prev, numberOfPlayers: value }));
                }
              }}
              onBlur={() => {
                if (!isFirstBookingInSlot()) return;
                let value = Number(formData.numberOfPlayers);
                if (isNaN(value) || value < 1) value = 1;
                else if (value > 4) value = 4;
                setFormData((prev) => ({ ...prev, numberOfPlayers: value }));
              }}
              InputProps={{
                sx: { backgroundColor: "#1F2937", color: "white" },
                inputProps: { min: 1, max: 4 },
              }}
            />


            {!isFirstBookingInSlot() && (
              <Typography variant="caption" color="#9CA3AF">
              </Typography>
            )}
          </Box>
        )}


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
              LKR {formData.amount}
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
            {loading
              ? existingBooking
                ? "Updating..."
                : "Creating..."
              : existingBooking
                ? "Update Booking"
                : "Create Booking"}
          </Button>
        </DialogActions>

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
                  "&:hover": { background: "#374151" },
                }}
              >
                No
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        {/* SUCCESS DIALOG */}
        <CreateSuccessDialog open={createSuccess} onClose={handleSuccessOk} />
        <UpdateSuccessDialog open={updateSuccess} onClose={handleUpdateOk} />
      </Dialog>

      {/* Add NFC User Dialog */}
      <AddNFCUserDialog
        open={nfcDialogOpen}
        onClose={handleCloseNfcDialog}
        onCreate={handleCreateNFCUser}
        formData={nfcFormData}
        setFormData={setNfcFormData}
      />
    </>
  );
};

export default BookingForm;
