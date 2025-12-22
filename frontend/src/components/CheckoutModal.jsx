import React from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CheckoutModal = ({
  open,
  onClose,
  customerName,
  customerId,
  subtotal,
  total,
  onPayNow,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "#111827",
          color: "white",
          p: 3,
          borderRadius: 3,
          width: 380,
          mx: "auto",
          mt: "6%",
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Checkout
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Customer Info */}
        <Box display="flex" alignItems="center" gap={2} mt={3}>
          <Box
            sx={{
              bgcolor: "#334155",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            {customerName?.[0]?.toUpperCase()}
          </Box>
          <Box>
            <Typography fontWeight="500">
              {customerName || "Alex Chen"}
            </Typography>
            <Typography variant="body2" color="gray">
              {customerId || "GV001234"}
            </Typography>
          </Box>
        </Box>

        {/* Totals */}
        <Box mt={3}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Total:</Typography>
            <Typography fontWeight="400">
              LKR {Number(subtotal).toFixed(2)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Discount</Typography>
            {/* <Typography>LKR {Number(discount).toFixed(2)}</Typography> */}
            <Typography color="#94A3B8">.................</Typography>
          </Box>
          <Box borderBottom="1px solid #334155" my={2} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <Typography fontWeight="600">Balance:</Typography>
            <Typography fontWeight="400" sx={{ color: "#38BDF8" }}>
              LKR {Number(total).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Pay Button */}
        <Box mt={4}>
          <Button
            fullWidth
            sx={{
              py: 1,
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(90deg, #05DFFF, #BC0BFF)",
              color: "white",
              textTransform: "none",
              fontSize: 16,
              "&:hover": { opacity: 0.95 },
            }}
            onClick={onPayNow}
          >
            Pay Now
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CheckoutModal;
