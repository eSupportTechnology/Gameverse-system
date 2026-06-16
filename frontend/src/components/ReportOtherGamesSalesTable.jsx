import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const formatMethod = (method) => {
  if (!method) return "-";
  const type = method.type || "";
  if (type === "Coin") return `Coin × ${method.coins ?? 0}`;
  if (type === "Arrow") return `Arrow × ${method.arrows ?? 0}`;
  if (type === "Per Hour") {
    const hrs = method.hours ?? 0;
    const players = method.players;
    return players ? `${hrs}h × ${players} players` : `${hrs}h`;
  }
  if (type === "Per Minute") return `${method.minutes ?? 0} min`;
  return type;
};

const ReportOtherGamesSalesTable = ({ date }) => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCheckouts();
  }, [date]);

  const fetchCheckouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aToken");
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/game-checkouts?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCheckouts(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch game checkouts", err);
      setCheckouts([]);
    } finally {
      setLoading(false);
    }
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
            gridTemplateColumns: "0.5fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr",
            borderBottom: "1px solid #1F2937",
            "& > div": { borderRight: "1px solid #1F2937", "&:last-child": { borderRight: "none" } },
          }}
        >
          {["#", "Customer", "Phone", "Game", "Method", "Discount", "Balance Paid"].map((h) => (
            <Box key={h} sx={tableHeaderStyle}>{h}</Box>
          ))}
        </Box>

        {loading && (
          <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>Loading game sales...</Box>
        )}
        {!loading && checkouts.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>No game sales found</Box>
        )}

        {checkouts.map((row, idx) => (
          <Box
            key={row.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "0.5fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr 1fr",
              borderBottom: "1px solid #1F2937",
              "&:hover": { backgroundColor: "#1a2433" },
              "& > div": { borderRight: "1px solid #1F2937", "&:last-child": { borderRight: "none" } },
            }}
          >
            <Box sx={tableRowStyle}>{idx + 1}</Box>
            <Box sx={tableRowStyle}>{row.customer_name || "-"}</Box>
            <Box sx={tableRowStyle}>{row.phone_number || "-"}</Box>
            <Box sx={tableRowStyle}>{row.game_title || "-"}</Box>
            <Box sx={tableRowStyle}>{formatMethod(row.method)}</Box>
            <Box sx={tableRowStyle}>
              {Number(row.discount || 0) > 0
                ? `LKR ${Number(row.discount).toFixed(2)}`
                : "-"}
            </Box>
            <Box sx={{ ...tableRowStyle, color: "#0CD7FF", fontWeight: 600 }}>
              LKR {Number(row.balance || 0).toFixed(2)}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportOtherGamesSalesTable;
