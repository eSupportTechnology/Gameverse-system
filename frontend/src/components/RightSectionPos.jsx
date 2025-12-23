import React from "react";
import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddNFCUserDialog from "./AddNFCUserDialog"; // make sure path is correct

export default function RightSection({
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
}) {
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
