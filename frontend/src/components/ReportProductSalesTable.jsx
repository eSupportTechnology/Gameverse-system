import React from "react";
import { Box, Typography } from "@mui/material";

const ReportProductSalesTable = () => {
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

  const productSales = [
    { name: "Orange Juice", category: "Drink", qty: 45, revenue: "LKR 600" },
    { name: "Donut", category: "Snack", qty: 60, revenue: "LKR 1450" },
    { name: "Fruit Salad", category: "Desert", qty: 50, revenue: "LKR 850" },
    {
      name: "Vanila Ice-Cream",
      category: "Ice-Cream",
      qty: 85,
      revenue: "LKR 400",
    },
    { name: "Orange Juice", category: "Drink", qty: 45, revenue: "LKR 600" },
    { name: "Donut", category: "Snack", qty: 60, revenue: "LKR 1450" },
    { name: "Fruit Salad", category: "Desert", qty: 50, revenue: "LKR 850" },
    {
      name: "Vanila Ice-Cream",
      category: "Ice-Cream",
      qty: 85,
      revenue: "LKR 400",
    },
    { name: "Orange Juice", category: "Drink", qty: 45, revenue: "LKR 600" },
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
            gridTemplateColumns: "2fr 2fr 1fr 1fr",
            borderBottom: "1px solid #1F2937",

            // Column borders
            "& > div": {
              borderRight: "1px solid #1F2937",
              "&:last-child": { borderRight: "none" },
            },
          }}
        >
          <Box sx={tableHeaderStyle}>Item Name</Box>
          <Box sx={tableHeaderStyle}>Category</Box>
          <Box sx={tableHeaderStyle}>Quantity</Box>
          <Box sx={tableHeaderStyle}>Revenue</Box>
        </Box>

        {/* Table Rows */}
        {productSales.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 2fr 1fr 1fr",
              borderBottom: "1px solid #1F2937",

              "&:hover": { backgroundColor: "#1a2433" },

              // Column borders inside rows
              "& > div": {
                borderRight: "1px solid #1F2937",
                "&:last-child": { borderRight: "none" },
              },
            }}
          >
            <Box sx={tableRowStyle}>{item.name}</Box>
            <Box sx={tableRowStyle}>{item.category}</Box>
            <Box sx={tableRowStyle}>{item.qty}</Box>
            <Box sx={tableRowStyle}>{item.revenue}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportProductSalesTable;
