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
import { toast } from 'react-toastify';
import { games as dummyGames } from '../assets/assets.js';

const categories = ["All Games", "Arcade Machine", "Archery", "Carrom"];

const GamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [apiGames, setApiGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editGame, setEditGame] = useState(null);

  // Fetch games from API
  const fetchGames = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aToken");
      
      if (!token) {
        console.log("No token found, using dummy data only");
        return;
      }

      const res = await axios.get('http://127.0.0.1:8000/api/games', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        setApiGames(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      // Don't show error toast, just log it and continue with dummy data
    } finally {
      setLoading(false);
    }
  };

  // Load games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Handle new game creation
  const handleGameCreated = (newGame) => {
    setApiGames(prev => [newGame, ...prev]);
    setOpenAddGame(false);
  };

  // Handle game update
  const handleGameUpdated = (updatedGame) => {
    setApiGames(prev => 
      prev.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
  };

  // Handle game deletion
  const handleGameDeleted = async (gameToDelete) => {
    try {
      const token = localStorage.getItem("aToken");
      
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const res = await axios.delete(`http://127.0.0.1:8000/api/games/${gameToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        // Remove the game from the API games list
        setApiGames(prev => prev.filter(game => game.id !== gameToDelete.id));
        toast.success("Game deleted successfully!");
      } else {
        toast.error(res.data.message || "Failed to delete game");
      }
    } catch (err) {
      console.error("Error deleting game:", err);
      toast.error("Failed to delete game");
    }
  };

  // Always show both dummy games and API games together
  const allGames = [...dummyGames, ...apiGames];

  const filteredGames =
    activeCategory === "All Games"
      ? allGames
      : allGames.filter((g) => g.category === activeCategory);

  useEffect(() => {
    fetchGames();
  }, []);

  // Filter buttons and keywords (filter by title only)
  // const categories = [
  //   { label: 'All Games', keyword: '' },
  //   { label: 'Arcade Machine', keyword: 'Arcade' },
  //   { label: 'Archery', keyword: 'Archery' },
  //   { label: 'Carrom', keyword: 'Carrom' },
  // ];

  // Filter games by title containing keyword
  // const filteredGames = games.filter(game => {
  //   const keyword = categories.find(cat => cat.label === activeCategory)?.keyword;
  //   return !keyword || game.title.toLowerCase().includes(keyword.toLowerCase());
  // });

  // Handle adding/updating game
  const handleSaveGame = async (gameData) => {
    try {
      const token = localStorage.getItem("aToken");
      if (editGame) {
        // Update existing game
        const response = await axios.put(
          `http://127.0.0.1:8000/api/games/${editGame.id}`,
          gameData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApiGames(prevGames => prevGames.map(g => g.id === editGame.id ? response.data : g));
        setEditGame(null);
      } else {
        // Add new game
        const response = await axios.post(
          'http://127.0.0.1:8000/api/games',
          gameData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setApiGames(prevGames => [response.data, ...prevGames]); // ✅ Prevent duplicate cards
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
    <Box sx={{ p: 2, bgcolor: '1E1E1E', color: '#fff', minHeight: '100vh', overflowX: 'hidden', ml: 0 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={2}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" fontWeight="bold" fontSize={24}>
            Other Games Management
          </Typography>
          <Typography variant="body2" color="gray" fontSize={16}>
            Monitor and control gaming stations
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          display="flex"
          mt={{ xs: 2, sm: 2, md: 0 }} // spacing when stacked
          width={{ xs: "100%", sm: "100%", md: "auto" }} // take full width in small screens
        >
          <Box>
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
              onClick={() => setOpenAddGame(true)}
            >
              + New Game
            </Button>
            <AddNewGame 
              open={openAddGame} 
              handleClose={() => setOpenAddGame(false)} 
              onCreate={handleGameCreated}
            />
          </Box>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
        px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: 'flex-start', md: 'center' }} mb={2}
      >
        <ToggleButtonGroup
          value={activeCategory}
          exclusive
          onChange={(e, newCategory) => newCategory && setActiveCategory(newCategory)}
          sx={{
            borderRadius: '12px',
            gap: 1,
            flexWrap: 'wrap',
            '& .MuiToggleButton-root': {
              flex: 1,
              minWidth: 100,
              width: '100%',
              bgcolor: '#374151',
              color: '#9CA3AF',
              border: 'none',
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: '600',
              fontSize: 12,
              '&.Mui-selected': {
                bgcolor: 'rgba(12, 215, 255, 0.3)',
                border: '1px solid #0CD7FF',
                color: '#0CD7FF',
              },
            },
          }}
        >
          {categories.map(cat => (
            <ToggleButton key={cat.label} value={cat.label} sx={{ px: 2, py: 1 }}>
              {cat.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px", }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: {xs:'center', sm:'center', md:'flex-start'},
            gap: 2,
            p: 2,
          }}
        >
          {filteredGames.map((game) => {
            // Check if this game is from API (not from dummy games array)
            // API games will have different structure or be found in apiGames array
            const isApiGame = apiGames.some(apiGame => apiGame.id === game.id && apiGame.title === game.title);
            
            return (
              <Box key={`${isApiGame ? 'api' : 'dummy'}-${game.id}`} sx={{ flex: "1 1 250px", maxWidth: 280 }}>
                <GameCard 
                  game={game} 
                  onPlay={() => setSelectedGame(game)} 
                  onUpdate={handleGameUpdated}
                  onDelete={isApiGame ? handleGameDeleted : null}
                  isApiGame={isApiGame}
                />
              </Box>
            );
          })}
        </Box>

        {selectedGame && (
          <CheckoutGame game={selectedGame} handleClose={() => setSelectedGame(null)} />
        )}
      </Box>
    </Box>
  );
};

export default GamesManagement;
