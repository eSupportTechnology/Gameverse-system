import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import axios from 'axios';
import AddNewGame from './AddNewGame';
import GameCard from './GameCard.jsx';
import CheckoutGame from './CheckoutGame.jsx';

const categories = ["All Games", "Arcade Machine", "Archery", "Carrom"];

const GamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Games");
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [editGame, setEditGame] = useState(null);

  const token = localStorage.getItem("aToken"); // get token if required

  // Fetch all games from backend
  const fetchGames = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/games', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Filtered games by category
  const filteredGames =
    activeCategory === "All Games"
      ? games
      : games.filter((g) => g.category === activeCategory);

  // Handle adding/updating game
  const handleSaveGame = async (gameData) => {
    try {
      if (editGame) {
        // Update existing game
        const response = await axios.put(
          `http://127.0.0.1:8000/api/games/${editGame.id}`,
          gameData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGames(games.map(g => g.id === editGame.id ? response.data : g));
        setEditGame(null);
      } else {
        // Add new game
        const response = await axios.post(
          'http://127.0.0.1:8000/api/games',
          gameData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGames([response.data, ...games]);
      }
      setOpenAddGame(false);
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  // Open edit modal
  const handleEditGame = (game) => {
    setEditGame(game);
    setOpenAddGame(true);
  };

  return (
    <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0 }}>

      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }}
        alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
        mb={2}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography variant="h5" fontWeight="bold" fontSize={24}>
            Other Games Management
          </Typography>
          <Typography variant="body2" color="gray" fontSize={16}>
            Monitor and control gaming stations
          </Typography>
        </Box>

        <Box display="flex" mt={{ xs: 2, sm: 2, md: 0 }} width={{ xs: "100%", md: "auto" }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              borderRadius: "6px",
              px: 6,
              py: 1,
              textTransform: "none",
              fontWeight: "600",
              "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}
            onClick={() => { setOpenAddGame(true); setEditGame(null); }}
          >
            + New Game
          </Button>

          {/* Add/Edit Game Modal */}
          <AddNewGame
            open={openAddGame}
            handleClose={() => setOpenAddGame(false)}
            onSubmit={handleSaveGame}  // corrected prop name
            initialData={editGame}      // corrected prop name
            mode={editGame ? "edit" : "add"} 
          />
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", md: "center" }} mb={2}
      >
        <ToggleButtonGroup
          value={activeCategory}
          exclusive
          onChange={(e, newCategory) => newCategory && setActiveCategory(newCategory)}
          sx={{
            borderRadius: "12px",
            gap: 1,
            flexWrap: "wrap",
            "& .MuiToggleButton-root": {
              flex: 1,
              minWidth: 100,
              width: '100%',
              bgcolor: "#374151",
              color: "#9CA3AF",
              border: "none",
              borderRadius: "6px",
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
          {categories.map(cat => (
            <ToggleButton key={cat} value={cat} sx={{ px: 2, py: 1 }}>
              {cat}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Games Grid */}
      <Box sx={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: { xs:'center', md:'flex-start' }, gap: 2, p: 2 }}>
          {filteredGames.map((game) => (
            <Box key={game.id} sx={{ flex: "1 1 250px", maxWidth: 280 }}>
              <GameCard 
                game={game} 
                onPlay={() => setSelectedGame(game)} 
                onEdit={() => handleEditGame(game)}  
              />
            </Box>
          ))}
        </Box>

        {/* Checkout Box (kept as-is) */}
        {selectedGame && (
          <CheckoutGame game={selectedGame} handleClose={() => setSelectedGame(null)} />
        )}
      </Box>

    </Box>
  );
}

export default GamesManagement;
