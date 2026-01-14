import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const ReportNFCcustomersTable = ({ date }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchNFCUsers();
  }, [date]);

  const fetchNFCUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("aToken");

      const res = await axios.get(`${API_BASE_URL}/api/nfc-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      // filter by selected date
      const filteredData = date
        ? apiData.filter((item) => {
            if (!item.created_at) return false;

            const itemDate = new Date(item.created_at)
              .toISOString()
              .split("T")[0];

            return itemDate === date;
          })
        : apiData;

      setCustomers(filteredData);
    } catch (error) {
      console.error("Failed to fetch NFC users", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

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
        {loading && (
          <Typography sx={{ p: 2, textAlign: "center", color: "#9ca3af" }}>
            Loading customers...
          </Typography>
        )}

        {!loading && customers.length === 0 && (
          <Typography sx={{ p: 2, textAlign: "center", color: "#9ca3af" }}>
            No customers found
          </Typography>
        )}

        {/* Table Rows */}
        {customers.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              borderBottom: "1px solid #1F2937",

              "&:hover": { backgroundColor: "#1a2433" },
              "& > div": {
                borderRight: "1px solid #1F2937",
                "&:last-child": { borderRight: "none" },
              },
            }}
          >
            <Box sx={tableRowStyle}>{item.full_name}</Box>
            <Box sx={tableRowStyle}>{item.phone_no}</Box>
            <Box sx={tableRowStyle}>{item.card_no}</Box>
            <Box sx={tableRowStyle}>{item.status}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportNFCcustomersTable;
