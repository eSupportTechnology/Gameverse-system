import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddNewGame from './OperaterNewAddgame.jsx';
import GameCard from './Operatergamecard.jsx';
import CheckoutGame from './OperaterCheckout.jsx';

const OperatorGamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [editGame, setEditGame] = useState(null);

  const token = localStorage.getItem('aToken');

  // ✅ Fetch only operator's games (from a separate backend route)
  const fetchGames = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/operator/games', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching operator games:', error);
      toast.error('Failed to fetch your games.');
    }
  }, [token]);

  // ✅ Load operator's games on mount
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // ✅ Filter categories
  const categories = [
    { label: 'All Games', keyword: '' },
    { label: 'Arcade Machine', keyword: 'Arcade' },
    { label: 'Archery', keyword: 'Archery' },
    { label: 'Carrom', keyword: 'Carrom' },
  ];

  const filteredGames = games.filter((game) => {
    if (activeCategory === 'All Games') return true;
    if (activeCategory === 'Arcade Machine') return game.method === 'Coin';
    if (activeCategory === 'Archery') return game.method === 'Arrow';
    if (activeCategory === 'Carrom') return game.method === 'Per Hour';
    return true;
  });

  // ✅ Refresh after Add/Edit
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
    if (!window.confirm('Are you sure you want to delete this game?')) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/operator/games/${gameId}`, {
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
    <Box sx={{ p: 2, bgcolor: '#1E1E1E', color: '#fff', minHeight: '100vh', overflowX: 'hidden', ml: 0 }}>
      {/* Header Section */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={2}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="h5" fontWeight="bold" fontSize={24}>
            Operator Games Management
          </Typography>
          <Typography variant="body2" color="gray" fontSize={16}>
            Manage your own game stations
          </Typography>
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
            mode={editGame ? 'edit' : 'add'}
          />
        </Box>
      </Box>

      {/* Category Filter Buttons */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'flex-start', md: 'space-between' }}
        px={1.5}
        py={1.5}
        borderRadius="10px"
        bgcolor="#0E111B"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={2}
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
          {categories.map((cat) => (
            <ToggleButton key={cat.label} value={cat.label} sx={{ px: 2, py: 1 }}>
              {cat.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Games Display Section */}
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0E111B', borderRadius: '10px' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 2,
            p: 2,
          }}
        >
          {filteredGames.map((game) => (
            <Box key={game.id} sx={{ flex: '1 1 250px', maxWidth: 280 }}>
              <GameCard
                game={game}
                onPlay={() => setSelectedGame(game)}
                onEdit={() => handleEditGame(game)}
                onDelete={() => handleDeleteGame(game.id)}
              />
            </Box>
          ))}
        </Box>

        {selectedGame && (
          <CheckoutGame game={selectedGame} handleClose={() => setSelectedGame(null)} />
        )}
      </Box>
    </Box>
  );
};

export default OperatorGamesManagement;
