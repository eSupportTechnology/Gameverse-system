import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CancelPopup from "./CancelPopup";
import axios from "axios";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { API_BASE_URL } from "../apiConfig";
import AddNFCUserDialog from "./AddNFCUserDialog";
import AddIcon from "@mui/icons-material/Add";

const methodUnitPrice = {
  Coin: 100,
  Arrow: 150,
  "Per Hour": 75,
};

const CheckoutGame = ({ game, handleClose, onPlayUpdate, onPaymentSuccess }) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [nfcDialogOpen, setNfcDialogOpen] = useState(false);
  const [receiptTemp, setReceiptTemp] = useState(null);
  const [selectedPackageIdx, setSelectedPackageIdx] = useState(null);

  // Form states(editable fields)
  const [units, setUnits] = useState(game.team_game ? "1" : "0");
  const [players, setPlayers] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [unitPrice, setUnitPrice] = useState(game.price);
  const [formData, setFormData] = useState({
    nfcCardNumber: "",
    customerName: "",
    phoneNumber: "",
  });
  const [selectedRewards, setSelectedRewards] = useState({});
  const [rewards, setRewards] = useState({});

  const fetchRewards = async (cardNo) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/game-rewards/${cardNo}`);

      if (res.data.success) {
        setRewards(res.data.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch rewards");
    }
  };

  const getRewardByMethod = () => {
    if (!rewards) return null;

    if (selectedMethod === "Coin") return rewards.Arcade;
    if (selectedMethod === "Arrow") return rewards.Archery;

    return null;
  };
  const rewardData = getRewardByMethod();
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleCreateNFCUser = (nfcData) => {
    setFormData((prev) => ({
      ...prev,
      nfcCardNumber: nfcData.nfcCardNumber,
      customerName: nfcData.fullName,
      phoneNumber: nfcData.phoneNo.replace(/\s/g, ""),
    }));
    setNfcDialogOpen(false);
  };
  const handleCancelOpen = () => setCancelOpen(true);
  const handleCancelClose = () => setCancelOpen(false);
  const handleConfirm = () => {
    setPaymentSuccess(false);
    handleClose();
    if (receiptTemp) {
      onPaymentSuccess?.(receiptTemp);
    }
  };

  if (!game) return null;

  // Normalize to array — API may return a JSON object {"0":{...},"1":{...}} instead of [{...},{...}]
  const rawPkgs = game.packages;
  const packagesList = Array.isArray(rawPkgs)
    ? rawPkgs
    : rawPkgs && typeof rawPkgs === "object"
      ? Object.values(rawPkgs)
      : [];

  const isArrowWithPackages =
    selectedMethod === "Arrow" && packagesList.length > 0;
  const isMinuteWithPackages =
    selectedMethod === "Per Minute" && packagesList.length > 0;
  const isPackageMethod = isArrowWithPackages || isMinuteWithPackages;

  const handleSelectPackage = (idx) => {
    setSelectedPackageIdx(idx);
    if (isArrowWithPackages) setUnits(packagesList[idx].arrows);
    if (isMinuteWithPackages) setUnits(packagesList[idx].minutes);
  };

  // Calculate dynamic amounts
  const unitsNumber = Number(units) || 0;
  const playersNumber = Number(players) || 1;
  const selectedPkgPrice =
    (isArrowWithPackages || isMinuteWithPackages) && selectedPackageIdx !== null
      ? Number(packagesList[selectedPackageIdx].price)
      : null;

  const perPersonAmount =
    selectedPkgPrice !== null
      ? selectedPkgPrice
      : unitPrice * unitsNumber;

  const fullAmount =
    selectedPkgPrice !== null
      ? game.team_game
        ? selectedPkgPrice * playersNumber
        : selectedPkgPrice
      : game.team_game
        ? unitPrice * unitsNumber * playersNumber
        : unitPrice * unitsNumber;
  const discountNumber = Number(discount) || 0;

  const isFreeReward =
    (selectedMethod === "Coin" && selectedRewards["5 Free Coins"]) ||
    (selectedMethod === "Arrow" && selectedRewards["5 Free Arrows"]);

  const balance = isFreeReward ? 0 : fullAmount - discountNumber;
  const token = localStorage.getItem("aToken");

  const handlePay = async (gameId) => {
    try {
      // ======================
      // 1. VALIDATION
      // ======================
      if (!selectedMethod) {
        alert("Payment method not selected");
        return;
      }

      if (isPackageMethod && selectedPackageIdx === null) {
        alert("Please select a package");
        return;
      }

      if (!isPackageMethod && (!units || Number(units) <= 0)) {
        alert("Please enter valid units");
        return;
      }

      // ======================
      // 2. BUILD METHOD PAYLOAD
      // ======================
      let methodPayload = null;

      const unitValue = Number(units || 0);
      const playerValue = Number(players || 1);

      if (selectedMethod === "Per Hour") {
        methodPayload = {
          type: "Per Hour",
          hours: unitValue,
          players: playerValue,
        };
      }

      if (selectedMethod === "Coin") {
        methodPayload = {
          type: "Coin",
          coins: unitValue,
        };
      }

      if (selectedMethod === "Arrow") {
        methodPayload = {
          type: "Arrow",
          arrows: unitValue,
        };
      }

      if (selectedMethod === "Per Minute") {
        methodPayload = {
          type: "Per Minute",
          minutes: unitValue,
        };
      }

      if (!methodPayload) {
        alert("Invalid payment method");
        return;
      }

      // ======================
      // 3. BUILD REQUEST PAYLOAD
      // ======================
      const payload = {
        method: methodPayload,
        balance: Number(balance || 0),
        discount: Number(discount || 0),

        nfc_card_number: formData.nfcCardNumber || null,
        customer_name: formData.customerName || "",
        phone_number: formData.phoneNumber || "",
        used_reward:
          Object.keys(selectedRewards).length > 0 ? selectedRewards : null,
      };

      console.log("PAYLOAD SENT:", payload);

      // ======================
      // 4. API CALL
      // ======================
      const res = await axios.post(
        `${API_BASE_URL}/api/games/${gameId}/checkout`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const useSelectedRewards = async (gameId) => {
        const entries = Object.entries(selectedRewards);
        const checkoutId = res.data.data.id;

        for (const [rewardName, isSelected] of entries) {
          if (!isSelected) continue;

          await axios.post(`${API_BASE_URL}/api/game-use-reward`, {
            card_no: formData.nfcCardNumber,
            type: rewardName.includes("Coin")
              ? "Arcade Reward"
              : "Archery Reward",
            game_checkout_id: checkoutId,
          });
        }
      };
      console.log("SUCCESS RESPONSE:", res.data);

      // ======================
      // 5. UPDATE UI
      // ======================
      if (res.data?.success) {
        onPlayUpdate(gameId, res.data.data?.method);
        await useSelectedRewards(gameId);
        const receipt = {
          id: res.data.data.id,
          title: game.title,
          customerName: formData.customerName,
          phoneNumber: formData.phoneNumber,
          nfcCardNumber: formData.nfcCardNumber,
          method: selectedMethod,
          units: Number(units),
          players: game.team_game ? playersNumber : null,
          teamGame: game.team_game || false,
          unitPrice: Number(unitPrice),
          perPersonAmount,
          packageLabel:
            isPackageMethod && selectedPackageIdx !== null
              ? isArrowWithPackages
                ? `${packagesList[selectedPackageIdx].arrows} Arrows`
                : `${packagesList[selectedPackageIdx].minutes} Minutes`
              : null,
          fullAmount,
          discount: discountNumber,
          balance,
          date: new Date().toISOString(),
        };
        setReceiptTemp(receipt);
        setPaymentSuccess(true);
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error("API ERROR FULL:", error);

      console.error(
        "SERVER RESPONSE:",
        error.response?.data || "No response from server",
      );

      alert(
        error.response?.data?.message ||
          "Payment failed. Check console for details.",
      );
    }
  };

  useEffect(() => {
    if (game?.method) {
      setSelectedMethod(
        typeof game.method === "string" ? game.method : game.method.type,
      );
    }
  }, [game]);

  const handleOpenNfcDialog = () => {
    setNfcDialogOpen(true);
  };

  // Close NFC dialog
  const handleCloseNfcDialog = () => {
    setNfcDialogOpen(false);
  };
  const wsRef = useRef(null);

  const fetchUserByCardUID = async (cardUID) => {
    try {
      const token = localStorage.getItem("aToken");

      const res = await axios.get(
        `${API_BASE_URL}/api/nfc-users/by-card/${cardUID}`,
        { headers: { Authorization: token ? `Bearer ${token}` : "" } },
      );

      if (res.data.success && res.data.data) {
        const user = res.data.data;
        setFormData((prev) => ({
          ...prev,
          customerName: user.full_name,
          phoneNumber: user.phone_no,
          nfcCardNumber: cardUID,
        }));
        await fetchRewards(cardUID);
      } else {
        setFormData((prev) => ({
          ...prev,
          nfcCardNumber: cardUID,
        }));
        await fetchRewards(cardUID);
      }
    } catch (err) {
      console.error("Failed to fetch NFC user:", err);
      setFormData((prev) => ({
        ...prev,
        nfcCardNumber: cardUID,
      }));
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

  useEffect(() => {
    if (!rewardData) return;

    const isSelected = Object.values(selectedRewards).some(Boolean);
    if (!isSelected) return;

    // Coin → Arcade reward
    if (selectedMethod === "Coin" && selectedRewards["5 Free Coins"]) {
      setUnits(5);
      setUnitPrice(0);
    }

    // Arrow → Archery reward
    if (selectedMethod === "Arrow" && selectedRewards["5 Free Arrows"]) {
      setUnits(5);
      setUnitPrice(0);
    }
  }, [selectedRewards, selectedMethod, rewardData]);

  const downloadGameReceipt = () => {
    if (!receiptTemp) return;
    const r = receiptTemp;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 25;
    const contentW = pageW - margin * 2;

    doc.setFillColor(8, 14, 26);
    doc.rect(0, 0, pageW, 297, "F");
    doc.setFillColor(12, 215, 255);
    doc.rect(0, 0, pageW, 2.5, "F");
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
    doc.text("PAYMENT RECEIPT", pageW / 2, 39, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Ref: #${String(r.id || "").padStart(6, "0")}`, pageW / 2, 47, { align: "center" });
    doc.setDrawColor(12, 215, 255);
    doc.setLineWidth(0.4);
    doc.line(0, 54.5, pageW, 54.5);

    const rows = [
      ["Customer Name", r.customerName || "-"],
      ["Phone Number", r.phoneNumber || "-"],
      ["NFC Card", r.nfcCardNumber || "-"],
      ["Game", r.title || "-"],
      ["Method", r.method || "-"],
      [r.packageLabel ? "Package" : "Units", r.packageLabel || String(r.units)],
      ...(r.teamGame ? [
        ["Players", String(r.players)],
        ["Per Person", `LKR ${Number(r.perPersonAmount).toFixed(2)}`],
      ] : []),
      ["Date", r.date ? dayjs(r.date).format("DD/MM/YYYY") : "-"],
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

    y += 4;
    doc.setDrawColor(30, 60, 100);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(margin, y, pageW - margin, y);
    doc.setLineDashPattern([], 0);

    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("PAYMENT SUMMARY", pageW / 2, y, { align: "center" });

    y += 8;
    doc.setFillColor(16, 26, 46);
    doc.rect(margin, y - 5.5, contentW, 11, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Full Amount", margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(229, 231, 235);
    doc.text(`LKR ${Number(r.fullAmount || 0).toFixed(2)}`, pageW - margin - 4, y, { align: "right" });
    y += 13;

    const disc = Number(r.discount || 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Discount", margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(disc > 0 ? 253 : 229, disc > 0 ? 196 : 231, disc > 0 ? 0 : 235);
    doc.text(`LKR ${disc.toFixed(2)}`, pageW - margin - 4, y, { align: "right" });
    y += 8;

    const boxW = 100;
    const boxX = (pageW - boxW) / 2;
    doc.setFillColor(10, 22, 42);
    doc.setDrawColor(12, 215, 255);
    doc.setLineWidth(0.6);
    doc.roundedRect(boxX, y, boxW, 24, 3, 3, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL PAID", pageW / 2, y + 8, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(12, 215, 255);
    const bal = Number(r.balance || 0);
    doc.text(bal === 0 ? "FREE" : `LKR ${bal.toFixed(2)}`, pageW / 2, y + 19, { align: "center" });

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

    doc.save(`GameReceipt_${r.title || "game"}_${r.id || ""}.pdf`);
  };

  return (
    <div>
      <Dialog
        open={Boolean(game)}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#0E111B",
            borderRadius: "16px",
            color: "#fff",
            px: { xs: 3, sm: 4 }, // responsive horizontal padding
            pb: { xs: 3, sm: 4 },
            width: "100%",
            maxWidth: 500, // increases width for bigger screens
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 0,
          }}
        >
          <DialogTitle
            sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}
          >
            Checkout
          </DialogTitle>
          <IconButton onClick={handleClose} sx={{ color: "#374151" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ py: 1 }}>
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
          {/* Package selection OR Unit Price + Units */}
          {isPackageMethod ? (
            <Box mb={1.5}>
              <Typography fontSize={13} color="#9CA3AF" mb={1}>
                Select Package
              </Typography>
              {packagesList.map((pkg, i) => (
                <Box
                  key={i}
                  onClick={() => handleSelectPackage(i)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    mb: 0.8,
                    borderRadius: "8px",
                    cursor: "pointer",
                    border:
                      selectedPackageIdx === i
                        ? "1px solid #0CD7FF"
                        : "1px solid #2a2f45",
                    backgroundColor:
                      selectedPackageIdx === i ? "#0CD7FF1A" : "#1a1f30",
                    transition: "all 0.15s",
                  }}
                >
                  <Typography fontSize={13} color="#0CD7FF" fontWeight={500}>
                    {isArrowWithPackages ? `${pkg.arrows} Arrows` : `${pkg.minutes} Minutes`}
                  </Typography>
                  <Typography fontSize={13} color="#fff" fontWeight={600}>
                    Rs. {Number(pkg.price).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <>
              {/* Unit Price */}
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography fontSize={14} color="#FFFFFF">
                  {game.team_game
                    ? "1 Hour Price (per person):"
                    : game.method === "Coin"
                      ? "1 Coin Price:"
                      : "Unit Price:"}
                </Typography>
                <TextField
                  type="number"
                  value={unitPrice}
                  disabled={
                    (selectedMethod === "Coin" &&
                      selectedRewards["5 Free Coins"]) ||
                    (selectedMethod === "Arrow" &&
                      selectedRewards["5 Free Arrows"])
                  }
                  onChange={(e) => setUnitPrice(e.target.value)}
                  inputProps={{ min: 0 }}
                  InputProps={{
                    startAdornment: (
                      <span
                        style={{ color: "#FFFFFF", fontSize: 14, marginRight: 1 }}
                      >
                        LKR
                      </span>
                    ),
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{
                    width: `${(unitPrice?.toString().length || 1) * 9 + 26}px`,
                    maxWidth: 100,
                    backgroundColor: "#0E111B",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "flex-center",
                    "& .MuiInputBase-root": {
                      padding: "0 !important",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 0,
                    },
                    "& input": {
                      color: "#FFFFFF",
                      textAlign: "right",
                      fontSize: 14,
                      padding: "4px 0",
                      lineHeight: 1.2,
                      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                        { WebkitAppearance: "none", margin: 0 },
                      "&[type=number]": { MozAppearance: "textfield" },
                    },
                    "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
                      display: "none",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#9CA3AF",
                      color: "#9CA3AF",
                    },
                    "& .Mui-disabled": {
                      backgroundColor: "#111827",
                      borderRadius: "6px",
                    },
                  }}
                />
              </Box>

              {/* Units */}
              <Box display="flex" justifyContent="space-between" mb={1.5}>
                <Typography fontSize={14} color="#FFFFFF">
                  {game.team_game
                    ? "Hours:"
                    : game.method === "Coin"
                      ? "Coins:"
                      : "Units:"}
                </Typography>
                <TextField
                  type="number"
                  value={units}
                  disabled={
                    (selectedMethod === "Coin" &&
                      selectedRewards["5 Free Coins"]) ||
                    (selectedMethod === "Arrow" &&
                      selectedRewards["5 Free Arrows"])
                  }
                  onChange={(e) => setUnits(e.target.value)}
                  sx={{
                    width: 70,
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      { WebkitAppearance: "none", margin: 0 },
                    "& input[type=number]": { MozAppearance: "textfield" },
                    "& .MuiInputBase-input": {
                      color: "#9CA3AF",
                      textAlign: "center",
                      fontSize: 14,
                      padding: "4px 0",
                      lineHeight: 1.2,
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#9CA3AF",
                      color: "#9CA3AF",
                    },
                    "& .Mui-disabled": {
                      backgroundColor: "#111827",
                      borderRadius: "6px",
                    },
                  }}
                />
              </Box>
            </>
          )}

          {game.team_game && (
            <Box display="flex" justifyContent="space-between" mb={1.5}>
              <Typography fontSize={14} color="#FFFFFF">
                Players:
              </Typography>
              <TextField
                type="number"
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
                inputProps={{ min: 1 }}
                sx={{
                  width: 70,
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "& input[type=number]": { MozAppearance: "textfield" },
                  "& .MuiInputBase-input": {
                    color: "#9CA3AF",
                    textAlign: "center",
                    fontSize: 13,
                    padding: "4px 0",
                    lineHeight: 1.2,
                  },
                }}
              />
            </Box>
          )}

          {/* Full Amount */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Box>
              <Typography fontSize={14} color="#FFFFFF">
                Full Amount:
              </Typography>
              {game.team_game && isPackageMethod && selectedPackageIdx !== null && (
                <Typography fontSize={11} color="#9CA3AF">
                  LKR {selectedPkgPrice} × {playersNumber} players
                </Typography>
              )}
              {game.team_game && !isPackageMethod && unitsNumber > 0 && (
                <Typography fontSize={11} color="#9CA3AF">
                  LKR {unitPrice} × {unitsNumber}h × {playersNumber} players
                </Typography>
              )}
            </Box>
            <Typography fontSize={14} color="#FFFFFF">
              LKR {fullAmount}
            </Typography>
          </Box>

          {/* Discount */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Discount:
            </Typography>
            <TextField
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              inputProps={{ min: 0 }}
              InputProps={{
                startAdornment: (
                  <span style={{ color: "#9CA3AF", fontSize: 12 }}>LKR</span>
                ),
              }}
              sx={{
                width: 80,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                "& input[type=number]": { MozAppearance: "textfield" },
                "& .MuiInputBase-input": {
                  color: "#9CA3AF",
                  textAlign: "center",
                  fontSize: 13,
                  padding: "4px 0",
                  lineHeight: 1.2,
                },
              }}
            />
          </Box>

          <hr style={{ border: "none", borderTop: "1px solid #374151" }} />

          {/* Balance */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={16} fontWeight="bold" color="#FFFFFF">
              Balance:
            </Typography>
            <Typography fontSize={16} fontWeight="bold" color="#0CD7FF">
              LKR {balance}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button
            onClick={handleCancelOpen}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              backgroundColor: "#1F2937",
              width: "50%",
              py: 0.5,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handlePay(game.id)}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: "bold",
              width: "50%",
              py: 0.5,
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
        {rewardData?.count > 0 && (
          <Box mt={2} p={2} sx={{ background: "#1F2937", borderRadius: 2 }}>
            <Typography fontSize={14} color="#fff">
              🎁 Available Reward({rewardData.count})
            </Typography>

            {rewardData.rewards?.map((r, idx) => {
              const isSelected = selectedRewards[r];

              return (
                <Box
                  key={idx}
                  onClick={() =>
                    setSelectedRewards((prev) => ({
                      ...prev,
                      [r]: !prev[r],
                    }))
                  }
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: 1,
                    cursor: "pointer",
                    background: isSelected ? "#0CD7FF33" : "#111827",
                    border: isSelected
                      ? "1px solid #0CD7FF"
                      : "1px solid #374151",
                  }}
                >
                  <Typography fontSize={13} color="#fff">
                    {r}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
        <AddNFCUserDialog
          open={nfcDialogOpen}
          onClose={handleCloseNfcDialog}
          onCreate={handleCreateNFCUser}
          formData={formData}
          setFormData={setFormData}
        />

        {/* Payment Confirmed Receipt Modal */}
        <Dialog
          open={paymentSuccess}
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
              "&::-webkit-scrollbar-thumb": { background: "linear-gradient(#0CD7FF, #8A38F5)", borderRadius: "4px" },
            },
          }}
        >
          <Box>
            {/* Header */}
            <Box sx={{ background: "linear-gradient(135deg, #0CD7FF22 0%, #8A38F522 100%)", borderBottom: "1px solid rgba(12,215,255,0.2)", px: 3, pt: 3, pb: 2.5, textAlign: "center" }}>
              <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #0CD7FF, #8A38F5)", mb: 1.5 }}>
                <CheckCircleIcon sx={{ color: "#fff", fontSize: 30 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 18, background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 0.5 }}>
                Payment Confirmed!
              </Typography>
              <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.4 }}>GAMEVERSE GAMING LOUNGE</Typography>
              <Typography sx={{ color: "#4B5563", fontSize: 11, mt: 0.3 }}>
                Ref: #{String(receiptTemp?.id || "").padStart(6, "0")}
              </Typography>
            </Box>

            {/* Tear-line */}
            <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, ml: -1.2 }} />
              <Box sx={{ flex: 1, borderTop: "2px dashed rgba(255,255,255,0.08)", mx: 1 }} />
              <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, mr: -1.2 }} />
            </Box>

            {/* Customer info */}
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              {[
                { icon: <PersonIcon sx={{ fontSize: 15, color: "#4B5563" }} />, label: "Customer", value: receiptTemp?.customerName || "-" },
                { icon: <PhoneIcon sx={{ fontSize: 15, color: "#4B5563" }} />, label: "Phone", value: receiptTemp?.phoneNumber || "-" },
              ].map(({ icon, label, value }) => (
                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {icon}
                    <Typography sx={{ color: "#6B7280", fontSize: 13 }}>{label}</Typography>
                  </Box>
                  <Typography sx={{ color: "#E5E7EB", fontSize: 13, fontWeight: 500 }}>{value}</Typography>
                </Box>
              ))}
            </Box>

            {/* Game details */}
            <Box sx={{ px: 3, pt: 0, pb: 1 }}>
              {[
                { icon: <SportsEsportsIcon sx={{ fontSize: 15, color: "#4B5563" }} />, label: "Game", value: receiptTemp?.title || "-" },
                { icon: null, label: "Method", value: receiptTemp?.method || "-" },
                { icon: null, label: receiptTemp?.packageLabel ? "Package" : "Units", value: receiptTemp?.packageLabel || String(receiptTemp?.units ?? "") },
                ...(receiptTemp?.teamGame ? [{ icon: null, label: "Players", value: receiptTemp.players }] : []),
                ...(receiptTemp?.teamGame ? [{ icon: null, label: "Per Person", value: `LKR ${Number(receiptTemp.perPersonAmount).toFixed(2)}` }] : []),
              ].map(({ icon, label, value }) => (
                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                Total Paid
              </Typography>
              <Box sx={{ display: "inline-block", background: "linear-gradient(135deg, rgba(12,215,255,0.12), rgba(138,56,245,0.12))", border: "1px solid rgba(12,215,255,0.25)", borderRadius: "12px", px: 4, py: 1.2, mt: 0.5 }}>
                <Typography sx={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1 }}>
                  {(receiptTemp?.balance ?? 0) === 0 ? "FREE" : `LKR ${Number(receiptTemp?.balance || 0).toFixed(2)}`}
                </Typography>
              </Box>
              {receiptTemp?.discount > 0 && (
                <Typography sx={{ color: "#4B5563", fontSize: 11, mt: 0.8 }}>
                  Discount applied: LKR {Number(receiptTemp.discount).toFixed(2)}
                </Typography>
              )}
            </Box>

            {/* Buttons */}
            <Box sx={{ px: 3, pb: 3, pt: 1.5 }}>
              <Button fullWidth startIcon={<DownloadIcon />} onClick={downloadGameReceipt}
                sx={{ background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 14, borderRadius: "10px", py: 1.2, "&:hover": { opacity: 0.88 } }}>
                Download Receipt
              </Button>
              <Button fullWidth onClick={handleConfirm}
                sx={{ mt: 1.5, color: "#4B5563", textTransform: "none", fontSize: 13, "&:hover": { color: "#9CA3AF", background: "transparent" } }}>
                Close
              </Button>
            </Box>
          </Box>
        </Dialog>

        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirm}
        />
      </Dialog>
    </div>
  );
};

export default CheckoutGame;
