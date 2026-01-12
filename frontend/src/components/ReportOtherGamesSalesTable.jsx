import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const ReportOtherGamesSalesTable = ({ date }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [date]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aToken");

      const res = await axios.get(`${API_BASE_URL}/api/games`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiData = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      const filteredGames = apiData.filter((game) => {
        const gameDate = new Date(game.created_at).toISOString().split("T")[0];
        return gameDate === date;
      });

      setGames(filteredGames);
    } catch (error) {
      console.error("Failed to fetch games", error);
      setGames([]);
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
          <Box sx={tableHeaderStyle}>Time</Box>
          <Box sx={tableHeaderStyle}>Playing Method</Box>
          <Box sx={tableHeaderStyle}>Quantity</Box>
          <Box sx={tableHeaderStyle}>Revenue</Box>
        </Box>

        {/* Table Rows */}
        {games.map((game) => (
          <Box
            key={game.id}
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
            <Box sx={tableRowStyle}>
              {new Date(game.created_at).toTimeString().slice(0, 5)}
            </Box>
            <Box sx={tableRowStyle}>{game.method}</Box>
            <Box sx={tableRowStyle}>{game.quantity}</Box>
            <Box sx={tableRowStyle}>{game.price}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReportOtherGamesSalesTable;
