import React from "react";
import { Box, Typography } from "@mui/material";

const ReportOtherGamesSalesTable = () => {
  const tableHeaderStyle = {
    backgroundColor: "#0E4450",
    color: "#fff",
    fontWeight: 600,
    fontSize: "14px",
    padding: "14px 18px",
    borderBottom: "1px solid #1f2937",
  };

  const tableRowStyle = {
    padding: "14px 18px",
    color: "#d1d5db",
    fontSize: "14px",
    borderBottom: "1px solid #1f2937",
  };

  const otherGamesSales = [
    { time: "10.00 AM", playingMethod: "Coin", qty: 10, revenue: "LKR 600" },
    { time: "10.30 AM", playingMethod: "Coin", qty: 2, revenue: "LKR 1450" },
    { time: "10.40 AM", playingMethod: "Coin", qty: 5, revenue: "LKR 850" },
    { time: "11.10 AM", playingMethod: "Coin", qty: 4, revenue: "LKR 400" },
    { time: "12.30 PM", playingMethod: "Coin", qty: 1, revenue: "LKR 600" },
    { time: "12.50 PM", playingMethod: "Coin", qty: 3, revenue: "LKR 1450" },
    { time: "01.00 PM", playingMethod: "Coin", qty: 6, revenue: "LKR 850" },
    { time: "05.20 PM", playingMethod: "Coin", qty: 2, revenue: "LKR 400" },
    { time: "07.15 PM", playingMethod: "Coin", qty: 4, revenue: "LKR 600" },
  ];

  return (
    <Box
      sx={{
        mt: 3,
        backgroundColor: "#0A0F1A",
        p: 3,
        borderRadius: "12px",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#111827",
          borderRadius: "10px",
          overflow: "hidden",
          maxHeight: "450px",
          overflowY: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {/* Table Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            borderBottom: "1px solid #1F2937",

            // Column borders
            "& > div": {
              borderRight: "1px solid #1F2937",
              "&:last-child": { borderRight: "none" },
            },
          }}
        >
          <Box sx={tableHeaderStyle}>Time</Box>
          <Box sx={tableHeaderStyle}>Playing Method</Box>
          <Box sx={tableHeaderStyle}>Quantity</Box>
          <Box sx={tableHeaderStyle}>Revenue</Box>
        </Box>

        {/* Table Rows */}
        {otherGamesSales.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              borderBottom: "1px solid #1F2937",

              "&:hover": { backgroundColor: "#1a2433" },

              // Column borders inside rows
              "& > div": {
                borderRight: "1px solid #1F2937",
                "&:last-child": { borderRight: "none" },
              },
            }}
          >
            <Box sx={tableRowStyle}>{item.time}</Box>
            <Box sx={tableRowStyle}>{item.playingMethod}</Box>
            <Box sx={tableRowStyle}>{item.qty}</Box>
            <Box sx={tableRowStyle}>{item.revenue}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportOtherGamesSalesTable;
