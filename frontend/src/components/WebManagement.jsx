import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import AddGameDialog from './AddGameDialog';


const categories = [
  { label: 'Booking Games' },
  { label: 'Other Games' },
  { label: 'Event & Tournaments' }
]

const WebManagement = () => {
  const [activeCategory, setActiveCategory] = useState('Booking Games');
  const [openAddGame, setOpenAddGame] = useState(false);
  return (
    <div>
      <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
            <Typography variant="h5" fontWeight="bold" fontSize={24}>Website Management </Typography>
            <Typography variant="body2" color="gray" fontSize={16}>Manage Website</Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row" }}
          justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2}>

          {/* Category */}
          <ToggleButtonGroup
            value={activeCategory}
            exclusive
            onChange={(e, newCategory) => newCategory && setActiveCategory(newCategory)}
            sx={{
              gap: 1,
              flexWrap: 'wrap',
              '& .MuiToggleButton-root': {
                bgcolor: '#1F2937',
                color: '#9CA3AF',
                border: 'none',
                padding: '8px 27px',
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
              <ToggleButton key={cat.label} value={cat.label}>
                {cat.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box>
            {activeCategory === "Other Games" && (
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                  borderRadius: "6px",
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "600",
                  "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
                }}
               onClick={() => setOpenAddGame(true)}
              >
                + Add Games
              </Button>
            )}

            {activeCategory === "Event & Tournaments" && (
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                  borderRadius: "6px",
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: "600",
                  "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
                }}
                // onClick={() => setOpenDialog(true)}
              >
                + Add Event & Tournaments
              </Button>
            )}
            {/* add fotm this to  */}
            <AddGameDialog
            open={openAddGame}
            onClose={()=>setOpenAddGame(false)}
            />
          </Box>

        </Box>

      </Box>

    </div>
  )
}

export default WebManagement
