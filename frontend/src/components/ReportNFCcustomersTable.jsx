import React from "react";
import { Box, Typography } from "@mui/material";

const ReportNFCcustomersTable = () => {
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

  const NFCcustomers = [
    {
      name: "Danuka Perera",
      contact: "0705568923",
      carNo: "GV0111",
      status: "Active",
    },
    {
      name: "Vishwa Pradeep",
      contact: "0253692548",
      carNo: "GV0102",
      status: "Active",
    },
    {
      name: "Mayumi Lakshika",
      contact: "0782536598",
      carNo: "GV0112",
      status: "Active",
    },
    {
      name: "Udara Devinda",
      contact: "0774586936",
      carNo: "GV0104",
      status: "Active",
    },
    {
      name: "Danuka Perera",
      contact: "0705568923",
      carNo: "GV0119",
      status: "Inactive",
    },
    {
      name: "Vishwa Pradeep",
      contact: "0253692548",
      carNo: "GV0118",
      status: "Active",
    },
    {
      name: "Mayumi Lakshika",
      contact: "0782536598",
      carNo: "GV0185",
      status: "Inactive",
    },
    {
      name: "Udara Devinda",
      contact: "0774586936",
      carNo: "GV0117",
      status: "Active",
    },
    {
      name: "Danuka Perera",
      contact: "0705568923",
      carNo: "GV0114",
      status: "Inactive",
    },
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
          <Box sx={tableHeaderStyle}>Customer Name</Box>
          <Box sx={tableHeaderStyle}>Contact Number</Box>
          <Box sx={tableHeaderStyle}>Car Number</Box>
          <Box sx={tableHeaderStyle}>Status</Box>
        </Box>

        {/* Table Rows */}
        {NFCcustomers.map((item, i) => (
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
            <Box sx={tableRowStyle}>{item.name}</Box>
            <Box sx={tableRowStyle}>{item.contact}</Box>
            <Box sx={tableRowStyle}>{item.carNo}</Box>
            <Box sx={tableRowStyle}>{item.status}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportNFCcustomersTable;
