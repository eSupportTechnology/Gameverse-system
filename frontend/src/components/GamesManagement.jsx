import React, { useState } from 'react'
import { 
  Box,
  Typography,
  Button,
} from '@mui/material'
import AddNewGame from './AddNewGame';

const GamesManagement = () => {
  const [openAddGame, setOpenAddGame] = useState(false);

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

    </Box>
  )
}

export default GamesManagement
