import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddNewGame from './AddNewGame';
import GameCard from './GameCard.jsx';
import CheckoutGame from './CheckoutGame.jsx';
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
      toast.error("Failed to fetch games");
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
    setEditGame(null);
  };

  // Handle game update
  const handleGameUpdated = (updatedGame) => {
    setApiGames(prev => 
      prev.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
    setOpenAddGame(false);
    setEditGame(null);
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


  const handleEditGame = (game) => {
    setEditGame(game);
    setOpenAddGame(true);
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      const token = localStorage.getItem("aToken");
      await axios.delete(`http://127.0.0.1:8000/api/games/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGames();
      toast.success('Game deleted successfully!');
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error(error.response?.data?.message || 'Failed to delete game.');
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: '1E1E1E', color: '#fff', minHeight: '100vh', overflowX: 'hidden', ml: 0 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent={{ xs: 'flex-start', md: 'space-between' }} alignItems={{ xs: 'flex-start', md: 'center' }} mb={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" fontWeight="bold" fontSize={24}>Other Games Management</Typography>
          <Typography variant="body2" color="gray" fontSize={16}>Monitor and control gaming stations</Typography>
        </Box>

        <Box display="flex" mt={{ xs: 2, md: 0 }} width={{ xs: '100%', md: 'auto' }}>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #0CD7FF, #8A38F5)',
              borderRadius: '6px',
              px: 6,
              py: 1,
              textTransform: 'none',
              fontWeight: '600',
              '&:hover': { background: 'linear-gradient(to right, #0bbfe0, #732ed1)' },
            }}
            onClick={() => { setOpenAddGame(true); setEditGame(null); }}
          >
            + New Game
          </Button>

          <AddNewGame
            open={openAddGame}
            handleClose={() => setOpenAddGame(false)}
            onCreate={handleGameCreated}
            onSubmit={editGame ? handleGameUpdated : undefined}
            initialData={editGame}
            mode={editGame ? 'edit' : 'add'}
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
        px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: 'flex-start', md: 'center' }} mb={2}>
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
            <ToggleButton key={cat} value={cat} sx={{ px: 2, py: 1 }}>
              {cat}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px" }}>
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
            const isApiGame = apiGames.some(apiGame => apiGame.id === game.id && apiGame.title === game.title);
            
            return (
              <Box key={`${isApiGame ? 'api' : 'dummy'}-${game.id}`} sx={{ flex: "1 1 250px", maxWidth: 280 }}>
                <GameCard 
                  game={game} 
                  onPlay={() => setSelectedGame(game)} 
                  onEdit={() => handleEditGame(game)}
                  onDelete={isApiGame ? () => handleGameDeleted(game) : () => handleDeleteGame(game.id)}
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