import React, { useState, useEffect, useCallback, useContext } from "react";
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
import AddNewGame from "./AddNewGame";
import GameCard from "./GameCard.jsx";
import CheckoutGame from "./CheckoutGame.jsx";
import { API_BASE_URL } from "../apiConfig.js";
import { AppContext } from "../context/AppContext";


const GamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Games");
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [editGame, setEditGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { globalSearch } = useContext(AppContext);
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
            onPlayUpdate={handlePlayUpdate}
          />
        )}
      </Box>
    </Box>
  );
};

export default GamesManagement;
