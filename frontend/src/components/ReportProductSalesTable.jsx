import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";
import dayjs from "dayjs";

const ReportProductSalesTable = ({ date }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [date]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aToken");
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/pos-sales?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSales(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch POS sales", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const formatItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";
    return items
      .map((i) => `${i.name || i.item_name || "Item"} ×${i.qty || i.quantity || 1}`)
      .join(", ");
  };

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

  return (
    <Box sx={{ mt: 3, backgroundColor: "#0A0F1A", p: 3, borderRadius: "12px" }}>
      <Box
        sx={{
          backgroundColor: "#111827",
          borderRadius: "10px",
          overflow: "hidden",
          maxHeight: "500px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: "4px" },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "0.5fr 1.5fr 1.5fr 2fr 1fr 1fr 1fr",
            borderBottom: "1px solid #1F2937",
            "& > div": { borderRight: "1px solid #1F2937", "&:last-child": { borderRight: "none" } },
          }}
        >
          {["#", "Customer", "Card No", "Items", "Subtotal", "Discount", "Total"].map((h) => (
            <Box key={h} sx={tableHeaderStyle}>{h}</Box>
          ))}
        </Box>

        {loading && (
          <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>Loading sales...</Box>
        )}
        {!loading && sales.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>No product sales found</Box>
        )}

        {sales.map((sale, idx) => (
          <Box
            key={sale.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "0.5fr 1.5fr 1.5fr 2fr 1fr 1fr 1fr",
              borderBottom: "1px solid #1F2937",
              "&:hover": { backgroundColor: "#1a2433" },
              "& > div": { borderRight: "1px solid #1F2937", "&:last-child": { borderRight: "none" } },
            }}
          >
            <Box sx={tableRowStyle}>{idx + 1}</Box>
            <Box sx={tableRowStyle}>{sale.customer_name || "-"}</Box>
            <Box sx={tableRowStyle}>{sale.customer_id || "-"}</Box>
            <Box sx={{ ...tableRowStyle, fontSize: 12, color: "#9ca3af" }}>
              {formatItems(sale.items)}
            </Box>
            <Box sx={tableRowStyle}>LKR {Number(sale.subtotal || 0).toFixed(2)}</Box>
            <Box sx={tableRowStyle}>
              {Number(sale.discount || 0) > 0
                ? `LKR ${Number(sale.discount).toFixed(2)}`
                : "-"}
            </Box>
            <Box sx={{ ...tableRowStyle, color: "#0CD7FF", fontWeight: 600 }}>
              LKR {Number(sale.total || 0).toFixed(2)}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportProductSalesTable;
