import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { toast } from "react-toastify";
import AddNewGameOperator from "./OperaterNewAddgame.jsx";
import OperatorGameCard from "./Operatergamecard.jsx";
import CheckoutGame from "./OperaterCheckout.jsx";
import { API_BASE_URL } from "../apiConfig.js";

const OperatorGamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Games");
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [editGame, setEditGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("oToken");

  // ✅ Fetch operator games
  const fetchGames = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/operator/games`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Fix: Handle both array & object responses safely
      const data = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setGames(data);
    } catch (err) {
      console.error("Error fetching operator games:", err);
      toast.error("Failed to fetch your games.");
      setGames([]);
    }
  }, [token]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const categories = [
    { label: "All Games" },
    // { label: 'Arcade Machine' },
    // { label: 'Archery' },
    // { label: 'Carrom' },
  ];

  // ✅ Filter based on category + search
  const filteredGames = games.filter((game) => {
    const matchCategory =
      activeCategory === "All Games" ||
      (activeCategory === "Arcade Machine" && game.method === "Coin") ||
      (activeCategory === "Archery" && game.method === "Arrow") ||
      (activeCategory === "Carrom" && game.method === "Per Hour");
    const matchSearch = game.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
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
      await axios.delete(`${API_BASE_URL}/api/operator/games/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Game deleted successfully!");
      fetchGames();
    } catch (err) {
      console.error("Error deleting game:", err);
      toast.error(err.response?.data?.message || "Failed to delete game.");
    }
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
            Operator Games Management
          </Typography>
          <Typography variant="body2" color="gray" fontSize={16}>
            Manage your own game stations
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

          <AddNewGameOperator
            open={openAddGame}
            handleClose={() => setOpenAddGame(false)}
            onSubmit={handleSaveGame}
            initialData={editGame}
            mode={editGame ? "edit" : "add"}
          />
        </Box>
      </Box>

      {/* ✅ Categories + Search Bar */}
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
        {/* Left: Categories */}
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
              // borderRadius: '6px',
              padding: "6px 27px",
              textTransform: "none",
              fontWeight: "600",
              fontSize: 12,
              "&.Mui-selected": {
                bgcolor: "rgba(12, 215, 255, 0.3)",
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

        {/* Right: Search Bar */}
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

      {/* Games List */}
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
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {filteredGames.map((game) => (
              <OperatorGameCard
                key={game.id}
                game={game}
                onUpdate={fetchGames}
                onEdit={() => handleEditGame(game)}
                onDelete={() => handleDeleteGame(game.id)}
                onPlay={() => setSelectedGame(game)}
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
          />
        )}
      </Box>
    </Box>
  );
};

export default OperatorGamesManagement;
