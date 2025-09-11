import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid
} from '@mui/material'
import AddNewGame from './AddNewGame';
import { games } from "../assets/assets.js";
import GameCard from './GameCard.jsx';

const categories = ["All Games", "Arcade Machine", "Archery", "Carrom"];


const GamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Games");


  const filteredGames =
    activeCategory === "All Games"
      ? games
      : games.filter((g) => g.category === activeCategory);


  return (
    <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0, }}>

      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }}
        alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
        mb={2}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
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
            <AddNewGame open={openAddGame} handleClose={() => setOpenAddGame(false)} />
          </Box>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2}>

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
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "&.Mui-selected": {
                bgcolor: "rgba(12, 215, 255, 0.3)",
                border: "1px solid #0CD7FF",
                color: "#0CD7FF",
                "&:hover": {
                  bgcolor: "rgba(12, 215, 255, 0.3)",
                  border: "1px solid #0CD7FF",
                  color: "#0CD7FF",
                },
              },

            },
          }}
        >
          {categories.map((cat) => (
            <ToggleButton key={cat} value={cat} sx={{ px: 2, py: 1 }}>
              {cat}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px", }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex- start",
            gap: 2,
            p: 2,
          }}
        >
          {filteredGames.map((game) => (
            <Box key={game.id} sx={{ flex: "1 1 250px", maxWidth: 280 }}>
              <GameCard game={game} />
            </Box>
          ))}
        </Box>
      </Box>


    </Box>
  )
}

export default GamesManagement
