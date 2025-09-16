import React, { useState } from 'react'
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditGame from './EditGame';


const methodLabels = {
  "Arcade Machine": "Coin",
  Archery: "Arrows:",
  Carrom: "Per hour:",
};

const GameCard = ({ game, onPlay }) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div>

      <Card
        sx={{
          bgcolor: "#171C2D",
          borderRadius: "5px",
          pb: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          height: 135
        }}
      >
        <CardContent>
          {/* Title */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" fontWeight={500} fontSize={16} color="#fff">{game.title}</Typography>
            <EditIcon
              onClick={() => setEditOpen(true)}
              sx={{ fontSize: 16, color: "gray", cursor: "pointer" }} />
          </Box>

          {/* Location */}
          <Box display="flex" justifyContent="flex-start" mb={1}>
            <Typography fontWeight={200} fontSize={12} color="#fff">
              Location: <span style={{ fontWeight: 700 }}>{game.location}</span>
            </Typography>
          </Box>

          {/* Price */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontSize={12} color="#FFFFFF">
              {game.quntity} {methodLabels[game.category] || "Price:"}
            </Typography>
            <Typography fontSize={12} color="#0CD7FF">
              LKR {game.price}
            </Typography>
          </Box>

          {/* Action Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "rgba(138, 56, 245, 0.2)",
              color: "#fff",
              borderRadius: "5px",
              py: 0.2,
              textTransform: "none",
              "&:hover": { bgcolor: "#1F2937" },
            }}
            onClick={onPlay}
          >
            Play
          </Button>
          {/* bokking details */}
          {/* <BookingDetails
            open={open}
            handleClose={handleClose}
            booking={selectedBooking}
          /> */}

          {/* Edit game from */}
          <EditGame open={editOpen} handleClose={() => setEditOpen(false)} />

        </CardContent>
      </Card>

    </div>
  )
}

export default GameCard
