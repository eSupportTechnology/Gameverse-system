import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { toast } from "react-toastify";
import AddNewGame from "./AddNewGame";
import GameCard from "./GameCard.jsx";
import CheckoutGame from "./CheckoutGame.jsx";
import { API_BASE_URL } from "../apiConfig.js";
import { AppContext } from "../context/AppContext";
import jsPDF from "jspdf";
import dayjs from "dayjs";


const GamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Games");
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [editGame, setEditGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { globalSearch } = useContext(AppContext);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const token = localStorage.getItem("aToken");

  // Fetch all games (for admin)
  const fetchGames = useCallback(async () => {
    console.log(" Fetch.........");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/games`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];
      setGames(data);
      console.log("FetchGames successful. Number of items:", data.length);
    } catch (error) {
      console.error("Error fetching games:", error);
      toast.error("Failed to fetch games.");
      setGames([]);
    }
  }, [token]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const categories = [{ label: "All Games" }];

  // Filter with search
  const filteredGames = games.filter((game) => {
  const title = game.title?.toLowerCase() || "";

  const matchLocal =
    !searchTerm || title.includes(searchTerm.toLowerCase());

  const matchGlobal =
    !globalSearch || title.includes(globalSearch.toLowerCase());

  return matchLocal && matchGlobal;
});


  const handleSaveGame = () => {
    setEditGame(null);
    setOpenAddGame(false);
    fetchGames();
  };

  const handleEditGame = (game) => {
    setEditGame(game);
    setOpenAddGame(true);
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/games/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Game deleted successfully!");
      fetchGames();
    } catch (err) {
      console.error("Error deleting game:", err);
      toast.error(err.response?.data?.message || "Failed to delete game.");
    }
  };

  const handlePlayUpdate = (gameId, updatedMethod) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, method: updatedMethod } : g))
    );
  };

    const downloadReceipt = (game) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Game Session Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Game: ${game.title}`, 20, 35);
    doc.text(`Game ID: ${game.id}`, 20, 45);
    doc.text(`Date: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 55);

    doc.setFontSize(14);
    doc.text(
      `Amount Paid: LKR ${Number(game.amount || 0).toFixed(2)}`,
      20,
      70
    );

    doc.save(`Game_Receipt_${game.id}.pdf`);
  };
  return (
    <Box sx={{ p: 2, bgcolor: "#1E1E1E", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" fontSize={24}>
            Other Games Management
          </Typography>
          <Typography variant="body2" color="#fff" fontSize={13}>
            Monitor and control gaming stations
          </Typography>
        </Box>

        <Box mt={{ xs: 2, md: 0 }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              borderRadius: "6px",
              px: 6,
              py: 1,
              textTransform: "none",
              fontWeight: "600",
              "&:hover": {
                background: "linear-gradient(to right, #0bbfe0, #732ed1)",
              },
            }}
            onClick={() => {
              setOpenAddGame(true);
              setEditGame(null);
            }}
          >
            + New Game
          </Button>

          <AddNewGame
            open={openAddGame}
            handleClose={() => setOpenAddGame(false)}
            onSubmit={handleSaveGame}
            initialData={editGame}
            mode={editGame ? "edit" : "add"}
          />
        </Box>
      </Box>

      {/* Filter + Search Bar */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        px={1.5}
        py={1.5}
        borderRadius="10px"
        bgcolor="#0E111B"
        mb={2}
      >
        {/* Category */}
        <ToggleButtonGroup
          value={activeCategory}
          exclusive
          onChange={(e, newCategory) =>
            newCategory && setActiveCategory(newCategory)
          }
          sx={{
            gap: 1,
            flexWrap: "wrap",
            "& .MuiToggleButton-root": {
              bgcolor: "#0CD7FF",
              color: "#9CA3AF",
              border: "none",
              padding: "6px 27px",
              textTransform: "none",
              fontWeight: "600",
              fontSize: 12,
              minWidth: 90,
              height: 40,
              "&.Mui-selected": {
                bgcolor: "#1aa6bc58",
                border: "1px solid #0CD7FF",
                color: "#0CD7FF",
              },
            },
          }}
        >
          {categories.map((cat) => (
            <ToggleButton key={cat.label} value={cat.label}>
              {cat.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search games..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", md: 400 },
            mt: { xs: 2, md: 0 },
            bgcolor: "#544f5b1f",
            input: { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#33B2F780" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0CD7FF",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Games Display with fixed 4-card grid */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#0E111B",
          borderRadius: "10px",
          p: 2,
        }}
      >
        {filteredGames.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
              justifyContent: "center",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={() => setSelectedGame(game)}
                onEdit={() => handleEditGame(game)}
                onDelete={() => handleDeleteGame(game.id)}
              />
            ))}
          </Box>
        ) : (
          <Typography color="gray" textAlign="center" mt={4}>
            No games found.
          </Typography>
        )}

        {selectedGame && (
          <CheckoutGame
            game={selectedGame}
            handleClose={() => setSelectedGame(null)}
            onPlayUpdate={(gameId, updatedMethod) => {
              handlePlayUpdate(gameId, updatedMethod);
            }}
            onPaymentSuccess={(receipt) => {
              setReceiptData(receipt);
              setShowReceipt(true);
            }}
            />
        )}
        <Dialog
          open={showReceipt}
          onClose={() => setShowReceipt(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              background: "#0F172A",
              color: "white",
              p: 2,
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 600,
              fontSize: 20,
              textAlign: "center",
              color: "#E5E7EB",
            }}
          >
            Game Receipt
          </DialogTitle>

          <DialogContent>
            {receiptData && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {[
                  ["Game Title", receiptData.title || "-"],
                  ["Game ID", receiptData.id || "-"],
                  ["Date", dayjs().format("DD/MM/YYYY HH:mm")],
                ].map(([label, value]) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.4,
                    }}
                  >
                    <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ color: "#fff", fontSize: 14 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                    Payment
                  </Typography>
                  <Typography sx={{ color: "#22C55E", fontWeight: 600 }}>
                    LKR {Number(receiptData.amount || 0).toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  onClick={() => downloadReceipt(receiptData)}
                  sx={{
                    mt: 3,
                    backgroundColor: "transparent",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 999,
                    py: 1.2,
                    border: "1px solid rgba(255,255,255,0.7)",
                    "&:hover": {
                      backgroundColor: "#16A34A",
                      border: "1px solid #16A34A",
                    },
                  }}
                >
                  Download Receipt
                </Button>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              onClick={() => setShowReceipt(false)}
              sx={{
                px: 5,
                borderRadius: "8px",
                textTransform: "none",
                background: "#1F2937",
                color: "white",
                "&:hover": { background: "#374151" },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default GamesManagement;
