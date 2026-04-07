import React from "react";
import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddNFCUserDialog from "./AddNFCUserDialog"; // make sure path is correct
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export default function RightSection({
  setCart,
  setProducts,
  scanIcon,
  addIcon,
  openAddNFCUserDialog,
  handleOpenAddNFCUserDialog,
  handleCloseAddNFCUserDialog,
  nfcFormData,
  setNfcFormData,
  cart,
  totalPrice,
  products,
  removeFromCart,
  addToCart,
  handleDeleteCart,
  handleCheckoutOpenWithValidation,
  handleCreateNFCUser,
  scannedCardNumber,
  setScannedCardNumber,
  rewards,
  selectedRewards,
  setSelectedRewards,
  aToken,
}) {
  const rewardConfig = {
    "1 Free Coffee": { itemName: "Coffee", quantity: 1 },
    "1 Free Mojito": { itemName: "Mojito", quantity: 1 },
    "1 Free Brownie with Ice Cream": { itemName: "Brownie", quantity: 1 },
  };
  const handleRewardClick = async (rewardType, rewardName) => {
    const config = rewardConfig[rewardName];
    if (!config) return;

    const freeItem = products.find(
      (p) => p.item_name.toLowerCase() === config.itemName.toLowerCase(),
    );
    if (!freeItem) return toast.error("Item not found in POS");
    if (freeItem.stock < config.quantity)
      return toast.error("Reward item is out of stock");

    try {
      // Add to backend cart with token
      await axios.post(
        `${API_BASE_URL}/api/cart/add`,
        {
          pos_item_id: freeItem.id,
          qty: config.quantity,
          is_reward: true,
          reward_price: 0,
        },
        {
          headers: { Authorization: `Bearer ${aToken}` }, // <-- important
        },
      );

      // Update frontend cart immediately
      const existingInCart = cart.find((c) => c.id === freeItem.id);
      if (existingInCart) {
        setCart((prev) =>
          prev.map((c) =>
            c.id === freeItem.id
              ? { ...c, qty: c.qty + config.quantity, price: 0 }
              : c,
          ),
        );
      } else {
        setCart((prev) => [
          ...prev,
          {
            id: freeItem.id,
            name: freeItem.item_name,
            qty: config.quantity,
            price: 0,
          },
        ]);
      }

      // Decrease stock locally
      setProducts((prev) =>
        prev.map((p) =>
          p.id === freeItem.id ? { ...p, stock: p.stock - config.quantity } : p,
        ),
      );

      // Track selected reward
      setSelectedRewards((prev) => ({ ...prev, [rewardType]: rewardName }));

      toast.success(`Reward "${rewardName}" added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add reward to cart");
    }
  };
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": { background: "#0E111B" },
        "&::-webkit-scrollbar-thumb": {
          background: "#3B4556",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#4A5568",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#0E111B",
          p: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          overflowY: "auto",
        }}
      >
        {/* NFC Section */}
        <Typography fontWeight="bold">NFC Card Number</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#1E293B",
            borderRadius: 1.5,
            height: "34px",
            p: 1,
          }}
        >
          <TextField
            placeholder="Enter NFC Card Number"
            variant="standard"
            value={scannedCardNumber}
            onChange={(e) => setScannedCardNumber(e.target.value)}
            InputProps={{ disableUnderline: true }}
            sx={{ flex: 1, input: { color: "#fff" } }}
          />

          <IconButton>
            <img src={scanIcon} alt="scan" />
          </IconButton>

          <IconButton onClick={handleOpenAddNFCUserDialog}>
            <img src={addIcon} width={25} height={25} alt="Add NFC User" />
          </IconButton>

          <AddNFCUserDialog
            open={openAddNFCUserDialog}
            onClose={handleCloseAddNFCUserDialog}
            onCreate={handleCreateNFCUser}
            formData={nfcFormData}
            setFormData={setNfcFormData}
          />
        </Box>
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
                      onClick={() => handleRewardClick(type, reward)}
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
                          selectedRewards[type] === reward ? "black" : "white",
                      }}
                    >
                      {reward}
                    </Box>
                  ))}
                </Box>
              ))}
          </Box>
        )}
        {/* Cart Section */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            minHeight: 200,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography fontWeight={600} fontSize={16}>
              Cart Items
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography fontSize={16} fontWeight={600}>
                Total:
              </Typography>
              <Typography fontSize={16} fontWeight={600} color="#10B981">
                {totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {cart.length === 0 ? (
            <Typography color="gray" fontSize={14}>
              Cart is empty
            </Typography>
          ) : (
            cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  bgcolor: "#1E293B",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="#9CA3AF" fontSize={12}>
                    LKR{item.price}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "#334155", color: "white" }}
                    onClick={() => removeFromCart(item)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{item.qty}</Typography>
                  <IconButton
                    size="small"
                    disabled={
                      products.find((p) => p.id === item.id)?.stock <= 0
                    }
                    sx={{ bgcolor: "#334155", color: "white" }}
                    onClick={() => addToCart(item)}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "#42262F", borderRadius: "8px", p: 1 }}
                    onClick={() => handleDeleteCart(item)}
                  >
                    <img
                      src="/images/delete.png"
                      alt="delete"
                      style={{ width: 20, height: 20 }}
                    />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Button
          fullWidth
          sx={{
            background: "linear-gradient(to right, #06b6d4, #9333ea)",
            color: "white",
            borderRadius: 2,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
            mt: 2,
          }}
          onClick={handleCheckoutOpenWithValidation}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
}
