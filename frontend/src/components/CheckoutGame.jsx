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
import PaymentSuccess from "../assets/PaymentSuccess.png";
import CancelPopup from "./CancelPopup";
import axios from "axios";
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

  // Form states(editable fields)
  const [units, setUnits] = useState("0");
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

  // Calculate dynamic amounts
  const unitsNumber = Number(units) || 0;
  const playersNumber = Number(players) || 1;
  const fullAmount = game.team_game
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

      if (!units || Number(units) <= 0) {
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
          amount: balance,
          date: new Date(),
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
          {/* Unit Price */}
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              {game.team_game
                ? "1 Hour Price (per person):"
                : game.method === "Arrow"
                  ? "1 Arrow Price:"
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
                (selectedMethod === "Arrow" && selectedRewards["5 Free Arrows"])
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
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  "&[type=number]": { MozAppearance: "textfield" },
                },
                "& .MuiInputBase-root:before, & .MuiInputBase-root:after": {
                  display: "none",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#9CA3AF", // gray text
                  color: "#9CA3AF",
                },
                "& .Mui-disabled": {
                  backgroundColor: "#111827", // soft dark gray background
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
                : game.method === "Arrow"
                  ? "Arrows:"
                  : game.method === "Coin"
                    ? "Coins:"
                    : "Unit Price:"}
            </Typography>
            <TextField
              type="number"
              value={units}
              disabled={
                (selectedMethod === "Coin" &&
                  selectedRewards["5 Free Coins"]) ||
                (selectedMethod === "Arrow" && selectedRewards["5 Free Arrows"])
              }
              onChange={(e) => setUnits(e.target.value)}
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
                  fontSize: 14,
                  padding: "4px 0",
                  lineHeight: 1.2,
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#9CA3AF", // gray text
                  color: "#9CA3AF",
                },
                "& .Mui-disabled": {
                  backgroundColor: "#111827", // soft dark gray background
                  borderRadius: "6px",
                },
              }}
            />
          </Box>

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
          <Box display="flex" justifyContent="space-between" mb={1.5}>
            <Typography fontSize={14} color="#FFFFFF">
              Full Amount:
            </Typography>
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

        {/* Payment Success */}
        <Dialog
          open={paymentSuccess}
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
              <img src={PaymentSuccess} alt="" width={80} />
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
              Payment Successful!
            </Typography>
            <Button
              onClick={handleConfirm}
              sx={{
                px: 8,
                fontSize: 14,
                borderRadius: "8px",
                background:
                  "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
                color: "white",
              }}
            >
              Ok
            </Button>
          </DialogContent>
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
