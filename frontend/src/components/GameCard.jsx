import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddNewGame from './AddNewGame';

const methodLabels = {
  "Arcade Machine": "Coin",
  Archery: "Arrows:",
  Carrom: "Per hour:",
};

const GameCard = ({ game, onPlay, onUpdate }) => {
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
            <Typography variant="h6" fontWeight={500} fontSize={16} color="#fff">
              {game.title}
            </Typography>
            <EditIcon
              onClick={() => setEditOpen(true)}
              sx={{ fontSize: 16, color: "gray", cursor: "pointer" }}
            />
          </Box>

          {/* Location */}
          <Box display="flex" justifyContent="flex-start" mb={1}>
            <Typography fontWeight={200} fontSize={12} color="#fff">
              Location: <span style={{ fontWeight: 700 }}>{game.location}</span>
            </Typography>
          </Box>

          {/* Coin and Price */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontSize={12} color="#FFFFFF">
              {game.coin} {methodLabels[game.category] || "Coins"}
            </Typography>
            <Typography fontSize={12} color="#0CD7FF">
              {game.price ? `LKR ${game.price}` : "N/A"}
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
            onClick={() => onPlay(game)}
          >
            Play
          </Button>

          {/* Edit dialog */}
          <AddNewGame
            open={editOpen}
            handleClose={() => setEditOpen(false)}
            mode="edit"
            initialData={game}
            onSubmit={(updatedGame) => {
              setEditOpen(false);
              if (onUpdate) onUpdate(updatedGame);
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default GameCard;
