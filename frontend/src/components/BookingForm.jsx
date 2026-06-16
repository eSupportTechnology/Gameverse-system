import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerIcon from "@mui/icons-material/Timer";
import DownloadIcon from "@mui/icons-material/Download";
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
  Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

import AddNFCUserDialog from "./AddNFCUserDialog";
import CreateSuccessDialog from "./CreateSuccessDialog";
import UpdateSuccessDialog from "./UpdateSuccess";
import { API_BASE_URL } from "../apiConfig";
import dayjs from "dayjs";
import jsPDF from "jspdf";

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
  const [rewards, setRewards] = useState({});
  const [selectedRewards, setSelectedRewards] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
const [createdBookings, setCreatedBookings] = useState([]);
const [playersData, setPlayersData] = useState([
  { nfcCardNumber: "", customerName: "", phoneNumber: "" },
]);
const [activeNfcPlayerIdx, setActiveNfcPlayerIdx] = useState(0);
const activeNfcIdxRef = useRef(0);
const allowMultiRef = useRef(false);
  const rewardConfig = {
    "1 hour free PlayStation (VR not included)": {
      duration: "1h",
      stations: [
        "PS5 Station 1",
        "PS5 Station 2",
        "PS5 Station 3",
        "PS5 Station 4",
        "PS5 Station 5",
      ],
    },
    "1 hour free Racing Simulator (VR not included)": {
      duration: "1h",
      stations: [
        "Racing Simulator 1",
        "Racing Simulator 2",
        "Racing Simulator 3",
        "Racing Simulator 4",
      ],
    },
    "30 min free Racing Simulator (VR not included)": {
      duration: "30m",
      stations: [
        "Racing Simulator 1",
        "Racing Simulator 2",
        "Racing Simulator 3",
        "Racing Simulator 4",
      ],
    },
    "1 hour free Billiards (Supreme zones) (Free coffee/drinks not included)": {
      duration: "1h",
      stations: ["Supreme Billiard 1", "Supreme Billiard 2"],
    },
    "1 hour free Billiards (Premium zones)": {
      duration: "1h",
      stations: [
        "Premium Billiard 1",
        "Premium Billiard 2",
        "Premium Billiard 3",
      ],
    },
  };
  const fetchRewards = async (cardNo) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/booking-rewards/${cardNo}`,
      );
      if (res.data.success) {
        setRewards(res.data.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch rewards");
    }
  };
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

  useEffect(() => {
    const count = Number(formData.numberOfPlayers) || 1;
    setPlayersData((prev) =>
      Array.from({ length: count }, (_, i) =>
        prev[i] || { nfcCardNumber: "", customerName: "", phoneNumber: "" },
      ),
    );
  }, [formData.numberOfPlayers]);

  const handleOpenNfcDialog = () => {
    setNfcDialogOpen(true);
  };

  // Close NFC dialog
  const handleCloseNfcDialog = () => {
    setNfcDialogOpen(false);
  };

  const handleCreateNFCUser = (nfcData) => {
    if (allowMultiRef.current) {
      const idx = activeNfcIdxRef.current;
      setPlayersData((prev) =>
        prev.map((p, i) =>
          i === idx
            ? {
                nfcCardNumber: nfcData.nfcCardNumber,
                customerName: nfcData.fullName,
                phoneNumber: nfcData.phoneNo.replace(/\s/g, ""),
              }
            : p,
        ),
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        nfcCardNumber: nfcData.nfcCardNumber,
        customerName: nfcData.fullName,
        phoneNumber: nfcData.phoneNo.replace(/\s/g, ""),
      }));
    }
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
    resetPlayersData();
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

  const resetPlayersData = () => {
    setPlayersData([{ nfcCardNumber: "", customerName: "", phoneNumber: "" }]);
    setActiveNfcPlayerIdx(0);
    activeNfcIdxRef.current = 0;
  };

  const handleSuccessOk = () => {
    setcreateSuccess(false);
    resetPlayersData();
    setFormData({
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
    setSelectedRewards({});
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
    return time
      .replace(/\s?(AM|PM)$/i, "")
      .replace(".", ":")
      .trim();
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

    if (allowMultiplePlayers) {
      for (let i = 0; i < playersData.length; i++) {
        const p = playersData[i];
        if (!p.customerName.trim())
          return alert(`Player ${i + 1}: Customer name is required`);
        if (!p.phoneNumber.trim())
          return alert(`Player ${i + 1}: Phone number is required`);
        if (!/^\d+$/.test(p.phoneNumber))
          return alert(`Player ${i + 1}: Phone number must contain only numbers`);
        if (p.phoneNumber.length < 9)
          return alert(`Player ${i + 1}: Phone number must be at least 9 digits`);
      }
    } else {
      if (!formData.customerName.trim())
        return alert("Customer name is required");
      if (!formData.phoneNumber.trim()) return alert("Phone number is required");
      if (!/^\d+$/.test(formData.phoneNumber))
        return alert("Phone number must contain only numbers");
      if (formData.phoneNumber.length < 9)
        return alert("Phone number must be at least 9 digits long");
    }

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
      const token = localStorage.getItem("aToken");
      const stationData = stations.find((s) => s.name === formData.station);
      const perPersonAmount = stationData
        ? calculateAmount(stationData, finalDuration, formData.vrPlay, 1)
        : 0;

      if (allowMultiplePlayers && !existingBooking) {
        // Create one booking per player sequentially
        const newBookings = [];
        for (const player of playersData) {
          const res = await axios.post(
            `${API_BASE_URL}/api/bookings`,
            {
              nfc_card_number: player.nfcCardNumber || null,
              customer_name: player.customerName,
              phone_number: player.phoneNumber,
              station: formData.station,
              booking_date: formData.bookingDate,
              vr_play: formData.vrPlay,
              start_time: formData.startTime,
              duration: finalDuration,
              number_of_players: finalPlayers,
              amount: perPersonAmount,
              used_reward:
                Object.keys(selectedRewards).length > 0 ? selectedRewards : null,
            },
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
              },
            },
          );
          newBookings.push(res.data?.data);
        }
        setCreatedBookings(newBookings);
        setShowReceipt(true);
        setcreateSuccess(true);

        // Use rewards against first player's booking
        const firstBookingId = newBookings[0]?.id;
        for (let type in selectedRewards) {
          await axios.post(`${API_BASE_URL}/api/booking-use-reward`, {
            card_no: playersData[0].nfcCardNumber,
            type,
            booking_id: firstBookingId,
          });
        }
      } else {
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
          used_reward:
            Object.keys(selectedRewards).length > 0 ? selectedRewards : null,
        };

        let bookingResponse;
        if (existingBooking) {
          bookingResponse = await axios.put(
            `${API_BASE_URL}/api/bookings/${existingBooking.id}`,
            payload,
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
              },
            },
          );
          setUpdateSuccess(true);
        } else {
          bookingResponse = await axios.post(
            `${API_BASE_URL}/api/bookings`,
            payload,
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
              },
            },
          );
          const newBooking = bookingResponse.data?.data;
          setCreatedBookings([newBooking]);
          setShowReceipt(true);
          setcreateSuccess(true);
        }

        const bookingId = bookingResponse.data?.data?.id;
        for (let type in selectedRewards) {
          await axios.post(`${API_BASE_URL}/api/booking-use-reward`, {
            card_no: formData.nfcCardNumber,
            type,
            booking_id: bookingId,
          });
        }
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

  allowMultiRef.current = allowMultiplePlayers;

  const showVRPlay =
    selectedStation?.pricing?.some((p) => p.vrPrice && p.vrPrice > 0) || false;

  const calculateAmount = (station, selectedDuration, vrPlay, numberOfPlayers = 1) => {
    if (!station || !selectedDuration || !station.pricing?.length) return 0;

    const durationMinutes = parseDurationToMinutes(selectedDuration);

    const pricingSorted = [...station.pricing].sort(
      (a, b) => a.duration - b.duration,
    );

    let remaining = durationMinutes;
    let total = 0;

    while (remaining > 0) {
      const priceEntry = [...pricingSorted]
        .reverse()
        .find((p) => p.duration <= remaining);

      if (!priceEntry) break;

      const times = Math.floor(remaining / priceEntry.duration);
      const priceToUse =
        vrPlay === "yes" ? priceEntry.vrPrice || 0 : priceEntry.price || 0;

      total += priceToUse * times;

      remaining -= priceEntry.duration * times;
    }

    if (station.type === "PlayStation") {
      total *= numberOfPlayers;
    }

    return total;
  };

  useEffect(() => {
    if (Object.keys(selectedRewards).length > 0) {
      setFormData((prev) => ({ ...prev, amount: 0 }));
      return;
    }

    if (!formData.station || !formData.duration) return;

    const stationData = stations.find((s) => s.name === formData.station);
    if (!stationData) return;

    const finalAmount = calculateAmount(
      stationData,
      formData.duration,
      formData.vrPlay,
      formData.numberOfPlayers,
    );

    setFormData((prev) => ({ ...prev, amount: finalAmount }));
  }, [
    formData.station,
    formData.duration,
    formData.vrPlay,
    formData.numberOfPlayers,
    stations,
    selectedRewards,
  ]);

  const isSlotOverlapping = (slotTime) => {
    if (!formData.station || !formData.bookingDate) return false;

    const stationData = stations.find((s) => s.name === formData.station);
    if (!stationData) return false;

    const allBookings = Array.isArray(bookings) ? bookings : [];

    // Convert slotTime to minutes
    const slotStart = parse12HourTimeToMinutes(slotTime);

    if (stationData.type === "PlayStation") {
      // Filter bookings for same station and date
      const slotBookings = allBookings.filter(
        (b) =>
          b.station?.trim() === formData.station?.trim() &&
          normalizeDate(b.booking_date) === normalizeDate(formData.bookingDate),
      );

      for (let booking of slotBookings) {
        const bookingStart = parse12HourTimeToMinutes(booking.start_time);
        const bookingEnd =
          bookingStart + parseDurationToMinutes(booking.duration);
        const capacity = booking.number_of_players || 1;

        // Count how many bookings exist in this time slot
        const overlappingBookings = slotBookings.filter((b2) => {
          const b2Start = parse12HourTimeToMinutes(b2.start_time);
          const b2End = b2Start + parseDurationToMinutes(b2.duration);
          return slotStart >= b2Start && slotStart < b2End;
        });

        // Disable if fully booked
        if (overlappingBookings.length >= capacity) return true;
      }

      return false;
    } else {
      // Pool / Simulator → block all slots overlapping with any booking
      return allBookings.some((b) => {
        if (b.station?.trim() !== formData.station?.trim()) return false;
        if (
          normalizeDate(b.booking_date) !== normalizeDate(formData.bookingDate)
        )
          return false;

        const bookingStart = parse12HourTimeToMinutes(b.start_time);
        const bookingEnd = bookingStart + parseDurationToMinutes(b.duration);

        return slotStart >= bookingStart && slotStart < bookingEnd;
      });
    }
  };

  const todayStr = dayjs().format("YYYY-MM-DD");

  const isPastTime = (timeValue) => {
    if (formData.bookingDate !== todayStr) return false;
    const [h12str, mStr] = timeValue.split(":");
    const h12 = parseInt(h12str, 10);
    const m = parseInt(mStr, 10);
    const h24 = h12 === 12 ? 12 : h12 + 12;
    const slotMinutes = h24 * 60 + m;
    const now = dayjs();
    return slotMinutes < now.hour() * 60 + now.minute();
  };

  // Start time ≥ 11 PM → limit duration to max 2 hours
  const isLateStartTime = (() => {
    if (!formData.startTime) return false;
    const [h12str] = formData.startTime.split(":");
    const h12 = parseInt(h12str, 10);
    const h24 = h12 === 12 ? 12 : h12 + 12;
    return h24 >= 23;
  })();

  const lateDurations = ["30m", "1h", "1h 30m", "2h"];

  useEffect(() => {
    if (isLateStartTime && formData.duration && !lateDurations.includes(formData.duration)) {
      handleInputChange("duration", "");
    }
  }, [formData.startTime]);

  const generateTimeSlots = () => {
    const slots = [];
    const start = 12 * 60;
    const end = 23 * 60 + 30;
    const interval = 30;

    for (let minutes = start; minutes <= end; minutes += interval) {
      const h24 = Math.floor(minutes / 60);
      const m = minutes % 60;

      let h12 = h24 > 12 ? h24 - 12 : h24;
      if (h12 === 0) h12 = 12;

      const label = `${h12.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}`;
      const value = label;

      slots.push({ label, value });
    }

    return slots;
  };
  const wsRef = useRef(null);

  const fetchUserByCardUID = async (cardUID) => {
    const idx = activeNfcIdxRef.current;
    const isMulti = allowMultiRef.current;
    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.get(
        `${API_BASE_URL}/api/nfc-users/by-card/${cardUID}`,
        { headers: { Authorization: token ? `Bearer ${token}` : "" } },
      );

      if (res.data.success && res.data.data) {
        const user = res.data.data;
        if (isMulti) {
          setPlayersData((prev) =>
            prev.map((p, i) =>
              i === idx
                ? { nfcCardNumber: cardUID, customerName: user.full_name, phoneNumber: user.phone_no }
                : p,
            ),
          );
        } else {
          setFormData((prev) => ({
            ...prev,
            customerName: user.full_name,
            phoneNumber: user.phone_no,
            nfcCardNumber: cardUID,
          }));
        }
        await fetchRewards(cardUID);
      } else {
        if (isMulti) {
          setPlayersData((prev) =>
            prev.map((p, i) => (i === idx ? { ...p, nfcCardNumber: cardUID } : p)),
          );
        } else {
          setFormData((prev) => ({ ...prev, nfcCardNumber: cardUID }));
        }
        await fetchRewards(cardUID);
      }
    } catch (err) {
      console.error("Failed to fetch NFC user:", err);
      if (isMulti) {
        setPlayersData((prev) =>
          prev.map((p, i) => (i === idx ? { ...p, nfcCardNumber: cardUID } : p)),
        );
      } else {
        setFormData((prev) => ({ ...prev, nfcCardNumber: cardUID }));
      }
      await fetchRewards(cardUID);
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:6789");
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected (Parent)");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.action === "card_detected") {
        const cardUID = msg.uid.replace(/\s/g, ":");

        fetchUserByCardUID(cardUID);
      }

      if (msg.action === "write_result") {
        if (msg.success) {
          toast.success("Data written to card successfully!");
          fetchUserByCardUID(msg.userId);
        } else {
          toast.error("Failed to write to card");
        }
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []);
  const activeReward = Object.values(selectedRewards)[0];
  const allowedStations = activeReward
    ? rewardConfig[activeReward]?.stations || []
    : null;

    const downloadReceipt = (bookings) => {
      const bookingList = Array.isArray(bookings) ? bookings : [bookings];
      const first = bookingList[0];
      const totalPlayers = bookingList.length;
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = 210;
      const margin = 25;
      const contentW = pageW - margin * 2;
      const totalAmount = bookingList.reduce((sum, b) => sum + Number(b.amount || 0), 0);

      bookingList.forEach((booking, pageIdx) => {
        if (pageIdx > 0) doc.addPage();
        const perPersonAmount = Number(booking.amount || 0);

        // ── Dark page background ──
        doc.setFillColor(8, 14, 26);
        doc.rect(0, 0, pageW, 297, "F");

        // ── Cyan top accent bar ──
        doc.setFillColor(12, 215, 255);
        doc.rect(0, 0, pageW, 2.5, "F");

        // ── Header block ──
        doc.setFillColor(13, 23, 45);
        doc.rect(0, 2.5, pageW, 52, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.setTextColor(12, 215, 255);
        doc.text("GAMEVERSE", pageW / 2, 20, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("GAMING LOUNGE", pageW / 2, 27, { align: "center" });

        doc.setDrawColor(30, 50, 80);
        doc.setLineWidth(0.3);
        doc.line(margin + 20, 31, pageW - margin - 20, 31);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(229, 231, 235);
        doc.text("BOOKING RECEIPT", pageW / 2, 39, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        const refText = totalPlayers > 1
          ? `Ref: #${String(booking.id || "").padStart(6, "0")}  •  Player ${pageIdx + 1} of ${totalPlayers}`
          : `Ref: #${String(booking.id || "").padStart(6, "0")}`;
        doc.text(refText, pageW / 2, 47, { align: "center" });

        doc.setDrawColor(12, 215, 255);
        doc.setLineWidth(0.4);
        doc.line(0, 54.5, pageW, 54.5);

        // ── Detail rows ──
        const rows = [
          ["Customer Name", booking.customer_name || "-"],
          ["Phone Number",  booking.phone_number  || "-"],
          ["Station",       booking.station        || "-"],
          ["Date",          booking.booking_date ? dayjs(booking.booking_date).format("DD/MM/YYYY") : "-"],
          ["Start Time",    booking.start_time    || "-"],
          ["Duration",      booking.duration      || "-"],
          ["VR Play",       booking.vr_play       || "No"],
        ];

        let y = 68;
        rows.forEach(([label, value], idx) => {
          if (idx % 2 === 0) {
            doc.setFillColor(16, 26, 46);
            doc.rect(margin, y - 5.5, contentW, 11, "F");
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(100, 116, 139);
          doc.text(label, margin + 4, y);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(229, 231, 235);
          doc.text(String(value), pageW - margin - 4, y, { align: "right" });
          y += 13;
        });

        // ── Dashed divider ──
        y += 4;
        doc.setDrawColor(30, 60, 100);
        doc.setLineWidth(0.3);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(margin, y, pageW - margin, y);
        doc.setLineDashPattern([], 0);

        // ── Amount section ──
        y += 12;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("AMOUNT PER PERSON", pageW / 2, y, { align: "center" });

        y += 5;
        const boxW = 90;
        const boxX = (pageW - boxW) / 2;
        doc.setFillColor(10, 22, 42);
        doc.setDrawColor(12, 215, 255);
        doc.setLineWidth(0.6);
        doc.roundedRect(boxX, y, boxW, 20, 3, 3, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(12, 215, 255);
        doc.text(
          perPersonAmount === 0 ? "FREE" : `LKR ${perPersonAmount.toFixed(2)}`,
          pageW / 2, y + 13.5, { align: "center" }
        );

        if (totalPlayers > 1) {
          y += 27;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(
            `Total for ${totalPlayers} players: LKR ${totalAmount.toFixed(2)}`,
            pageW / 2, y, { align: "center" }
          );
        }

        // ── Footer ──
        doc.setDrawColor(20, 35, 60);
        doc.setLineWidth(0.3);
        doc.line(margin, 272, pageW - margin, 272);

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(55, 65, 81);
        doc.text("Thank you for choosing Gameverse Gaming Lounge!", pageW / 2, 279, { align: "center" });
        doc.text("We hope to see you again soon.", pageW / 2, 285, { align: "center" });

        doc.setFillColor(12, 215, 255);
        doc.rect(0, 294.5, pageW, 2.5, "F");
      });

      doc.save(`Receipt_${first.station || "booking"}_${first.id || ""}.pdf`);
      setShowReceipt(false);
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

          {/* Per-player fields (PlayStation only) */}
          {allowMultiplePlayers ? (
            <Box mt={1}>
              {playersData.map((player, idx) => (
                <Box
                  key={idx}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "#18212F",
                    borderRadius: 2,
                    border: idx === activeNfcPlayerIdx
                      ? "1px solid #0CD7FF"
                      : "1px solid #374151",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography sx={{ color: "#0CD7FF", fontWeight: 700, fontSize: 13 }}>
                      Player {idx + 1}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setActiveNfcPlayerIdx(idx);
                        activeNfcIdxRef.current = idx;
                      }}
                      sx={{
                        fontSize: 11,
                        textTransform: "none",
                        color: idx === activeNfcPlayerIdx ? "#0CD7FF" : "#6B7280",
                        minWidth: 0,
                        px: 1,
                      }}
                    >
                      {idx === activeNfcPlayerIdx ? "● NFC Active" : "Set NFC"}
                    </Button>
                  </Box>

                  {/* NFC */}
                  <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="NFC Card Number (optional)"
                      value={player.nfcCardNumber}
                      onChange={(e) =>
                        setPlayersData((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, nfcCardNumber: e.target.value } : p,
                          ),
                        )
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "#1F2937",
                          borderRadius: "6px",
                          "& input::placeholder": { color: "#9CA3AF", fontSize: "13px" },
                          color: "white",
                        },
                      }}
                    />
                    <Box
                      sx={{
                        width: 38, height: 38,
                        backgroundColor: "#1F2937",
                        borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#374151" },
                      }}
                      onClick={() => {
                        setActiveNfcPlayerIdx(idx);
                        activeNfcIdxRef.current = idx;
                        setNfcDialogOpen(true);
                      }}
                    >
                      <AddIcon sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                  </Box>

                  {/* Name & Phone */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Customer Name"
                      value={player.customerName}
                      onChange={(e) =>
                        setPlayersData((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, customerName: e.target.value } : p,
                          ),
                        )
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "#1F2937",
                          borderRadius: "6px",
                          "& input::placeholder": { color: "#9CA3AF", fontSize: "13px" },
                          color: "white",
                        },
                      }}
                    />
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Phone Number"
                      value={player.phoneNumber}
                      inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 15 }}
                      onChange={(e) =>
                        setPlayersData((prev) =>
                          prev.map((p, i) =>
                            i === idx
                              ? { ...p, phoneNumber: e.target.value.replace(/\D/g, "") }
                              : p,
                          ),
                        )
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "#1F2937",
                          borderRadius: "6px",
                          "& input::placeholder": { color: "#9CA3AF", fontSize: "13px" },
                          color: "white",
                        },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
          <>{/* NFC Card Number — single player */}
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
          </>
          )}

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

                {(() => {
                  const stationNameOrder = [
                    "PS5 Station 1", "PS5 Station 2", "PS5 Station 3", "PS5 Station 4", "PS5 Station 5",
                    "Racing Simulator 1", "Racing Simulator 2", "Racing Simulator 3", "Racing Simulator 4",
                    "Supreme Billiard 1", "Supreme Billiard 2",
                    "Premium Billiard 1", "Premium Billiard 2", "Premium Billiard 3",
                    "PS5+VR", "8 Ball Pool (Supreme)", "8 Ball Pool (Premium)", "CRS+VR (PS V R2)", "Car Racing Simulator",
                  ];
                  return [...stations]
                    .filter((station) =>
                      allowedStations ? allowedStations.includes(station.name) : true,
                    )
                    .sort((a, b) => {
                      const ai = stationNameOrder.indexOf(a.name);
                      const bi = stationNameOrder.indexOf(b.name);
                      return (ai === -1 ? stationNameOrder.length : ai) - (bi === -1 ? stationNameOrder.length : bi);
                    })
                    .map((station) => (
                      <MenuItem key={station.id} value={station.name}>
                        {station.name}
                      </MenuItem>
                    ));
                })()}
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
                inputProps={{ min: todayStr }}
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
                  <MenuItem
                    key={i}
                    value={t.value}
                    disabled={isSlotOverlapping(t.value) || isPastTime(t.value)}
                  >
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
                disabled={
                  !!getSlotDurationFromExistingBookings() ||
                  Object.keys(selectedRewards).length > 0
                }
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
                <MenuItem value="2h 30m" disabled={isLateStartTime}>2 hour 30 min</MenuItem>
                <MenuItem value="3h" disabled={isLateStartTime}>3 hour</MenuItem>
                <MenuItem value="3h 30m" disabled={isLateStartTime}>3 hour 30 min</MenuItem>
                <MenuItem value="4h" disabled={isLateStartTime}>4 hour</MenuItem>
              </Select>
            </Box>
          </Box>
          {allowMultiplePlayers && (
            <Box mt={2}>
              <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
                Number of Players
              </Typography>

              <Select
                size="small"
                fullWidth
                value={
                  isFirstBookingInSlot()
                    ? formData.numberOfPlayers
                    : slotCapacity || 1
                }
                disabled={!isFirstBookingInSlot()}
                onChange={(e) => {
                  if (!isFirstBookingInSlot()) return;
                  setFormData((prev) => ({
                    ...prev,
                    numberOfPlayers: e.target.value,
                  }));
                }}
                sx={{
                  backgroundColor: "#1F2937",
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6B7280" },
                  "& .MuiSelect-icon": { color: "#fff" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#1F2937",
                      color: "white",
                      "& .MuiMenuItem-root:hover": { backgroundColor: "#374151" },
                    },
                  },
                }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>

              {!isFirstBookingInSlot() && (
                <Typography variant="caption" color="#9CA3AF"></Typography>
              )}
            </Box>
          )}
          {Object.entries(rewards).some(([_, r]) => r.count > 0) && (
            <Box mt={3}>
              <Typography sx={{ color: "#00E5FF", mb: 2 }}>
                Available Rewards
              </Typography>

              {Object.entries(rewards)
                .filter(([_, data]) => data.count > 0)
                .map(([type, data]) => (
                  <Box
                    key={type}
                    sx={{ mb: 2, p: 2, background: "#1F2937", borderRadius: 2 }}
                  >
                    <Typography sx={{ color: "white", fontWeight: "bold" }}>
                      {type} (x{data.count})
                    </Typography>

                    {data.rewards.map((reward, idx) => (
                      <Box
                        key={idx}
                        onClick={() => {
                          const config = rewardConfig[reward];

                          setSelectedRewards((prev) => ({
                            ...prev,
                            [type]: reward,
                          }));

                          if (config) {
                            setFormData((prev) => ({
                              ...prev,
                              duration: config.duration,
                              station: config.stations[0], // auto pick first station
                              amount: 0, // FREE
                            }));
                          }
                        }}
                        sx={{
                          mt: 1,
                          p: 1,
                          borderRadius: 1,
                          cursor: "pointer",
                          background:
                            selectedRewards[type] === reward
                              ? "#0CD7FF"
                              : "#111827",
                          color:
                            selectedRewards[type] === reward
                              ? "black"
                              : "white",
                        }}
                      >
                        {reward}
                      </Box>
                    ))}
                  </Box>
                ))}
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
              {allowMultiplePlayers && Number(formData.numberOfPlayers) > 1
                ? "Per Person"
                : "Amount"}
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" color="cyan">
                {Object.keys(selectedRewards).length > 0
                  ? "FREE"
                  : allowMultiplePlayers && Number(formData.numberOfPlayers) > 1
                  ? `LKR ${
                      (() => {
                        const sd = stations.find((s) => s.name === formData.station);
                        return sd
                          ? calculateAmount(sd, formData.duration, formData.vrPlay, 1).toFixed(2)
                          : "0.00";
                      })()
                    }`
                  : `LKR ${formData.amount}`}
              </Typography>
              {allowMultiplePlayers && Number(formData.numberOfPlayers) > 1 && Object.keys(selectedRewards).length === 0 && (
                <Typography sx={{ color: "#6B7280", fontSize: 12 }}>
                  Total: LKR {formData.amount}
                </Typography>
              )}
            </Box>
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
      {showReceipt && createdBookings.length > 0 && (
        <Dialog
          open={showReceipt}
          onClose={() => setShowReceipt(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: "20px",
              background: "#080E1A",
              color: "white",
              overflow: "hidden",
              border: "1px solid rgba(12,215,255,0.15)",
              boxShadow: "0 0 40px rgba(12,215,255,0.08)",
              maxHeight: "90vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(#0CD7FF, #8A38F5)",
                borderRadius: "4px",
              },
            },
          }}
        >
          {(() => {
            const first = createdBookings[0];
            const totalPlayers = createdBookings.length;
            const perPerson = Number(first?.amount || 0);
            const total = createdBookings.reduce((s, b) => s + Number(b.amount || 0), 0);
            const sessionRows = [
              { icon: <SportsEsportsIcon sx={{ fontSize: 15 }} />, label: "Station", value: first?.station || "-" },
              { icon: <CalendarTodayIcon sx={{ fontSize: 15 }} />, label: "Date", value: first?.booking_date ? dayjs(first.booking_date).format("DD/MM/YYYY") : "-" },
              { icon: <AccessTimeIcon sx={{ fontSize: 15 }} />, label: "Start Time", value: first?.start_time || "-" },
              { icon: <TimerIcon sx={{ fontSize: 15 }} />, label: "Duration", value: first?.duration || "-" },
              { icon: <SportsEsportsIcon sx={{ fontSize: 15 }} />, label: "VR Play", value: first?.vr_play || "No" },
            ];
            return (
              <Box>
                {/* Header */}
                <Box sx={{ background: "linear-gradient(135deg, #0CD7FF22 0%, #8A38F522 100%)", borderBottom: "1px solid rgba(12,215,255,0.2)", px: 3, pt: 3, pb: 2.5, textAlign: "center" }}>
                  <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #0CD7FF, #8A38F5)", mb: 1.5 }}>
                    <CheckCircleIcon sx={{ color: "#fff", fontSize: 30 }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 18, background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 0.5 }}>
                    Booking Confirmed!
                  </Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.4 }}>GAMEVERSE GAMING LOUNGE</Typography>
                  {totalPlayers > 1 && (
                    <Typography sx={{ color: "#0CD7FF", fontSize: 12, mt: 0.5, fontWeight: 600 }}>
                      {totalPlayers} Players
                    </Typography>
                  )}
                </Box>

                {/* Tear-line */}
                <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, ml: -1.2 }} />
                  <Box sx={{ flex: 1, borderTop: "2px dashed rgba(255,255,255,0.08)", mx: 1 }} />
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, mr: -1.2 }} />
                </Box>

                {/* Players list */}
                <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                  {createdBookings.map((b, i) => (
                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 15, color: "#4B5563" }} />
                        <Typography sx={{ color: "#6B7280", fontSize: 13 }}>Player {i + 1}</Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ color: "#E5E7EB", fontSize: 13, fontWeight: 500 }}>{b.customer_name || "-"}</Typography>
                        <Typography sx={{ color: "#6B7280", fontSize: 11 }}>{b.phone_number || "-"}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Session details */}
                <Box sx={{ px: 3, pt: 1, pb: 1 }}>
                  {sessionRows.map(({ icon, label, value }) => (
                    <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#4B5563" }}>
                        {icon}
                        <Typography sx={{ color: "#6B7280", fontSize: 13 }}>{label}</Typography>
                      </Box>
                      <Typography sx={{ color: "#E5E7EB", fontSize: 13, fontWeight: 500 }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Tear-line */}
                <Box sx={{ display: "flex", alignItems: "center", px: 1, mt: 1 }}>
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, ml: -1.2 }} />
                  <Box sx={{ flex: 1, borderTop: "2px dashed rgba(255,255,255,0.08)", mx: 1 }} />
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, mr: -1.2 }} />
                </Box>

                {/* Amount */}
                <Box sx={{ px: 3, pt: 2, pb: 1, textAlign: "center" }}>
                  <Typography sx={{ color: "#6B7280", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", mb: 0.5 }}>
                    Amount Per Person
                  </Typography>
                  <Box sx={{ display: "inline-block", background: "linear-gradient(135deg, rgba(12,215,255,0.12), rgba(138,56,245,0.12))", border: "1px solid rgba(12,215,255,0.25)", borderRadius: "12px", px: 4, py: 1.2, mt: 0.5 }}>
                    <Typography sx={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1 }}>
                      {perPerson === 0 ? "FREE" : `LKR ${perPerson.toFixed(2)}`}
                    </Typography>
                  </Box>
                  {totalPlayers > 1 && (
                    <Typography sx={{ color: "#4B5563", fontSize: 11, mt: 0.8 }}>
                      Total for {totalPlayers} players: LKR {total.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                {/* Download + Close */}
                <Box sx={{ px: 3, pb: 3, pt: 1.5 }}>
                  <Button fullWidth startIcon={<DownloadIcon />} onClick={() => downloadReceipt(createdBookings)}
                    sx={{ background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 14, borderRadius: "10px", py: 1.2, "&:hover": { opacity: 0.88 } }}>
                    Download Receipt{totalPlayers > 1 ? ` (${totalPlayers} copies)` : ""}
                  </Button>
                  <Button fullWidth onClick={() => setShowReceipt(false)}
                    sx={{ mt: 1.5, color: "#4B5563", textTransform: "none", fontSize: 13, "&:hover": { color: "#9CA3AF", background: "transparent" } }}>
                    Close
                  </Button>
                </Box>
              </Box>
            );
          })()}
        </Dialog>
      )}
    </>
  );
};

export default BookingForm;
