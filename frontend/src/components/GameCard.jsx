import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddNewGame from "./AddNewGame";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../apiConfig";

const methodValue = { Coin: 100, Arrow: 150, "Per Hour": 75 };

const GameCard = ({ game: initialGame, onPlay, onUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [game, setGame] = useState(initialGame || {}); // default empty object

  useEffect(() => {
    if (initialGame) setGame(initialGame);
  }, [initialGame]);

  // Prevent undefined access
  if (!game || !game.title) return null;

  const quantity = Math.floor(
    (game.price || 0) / (methodValue[game.method] || 1),
  );

  const handlePlayClick = async () => {
    const hours = parseInt(prompt("Enter hours", game.method.hours || 1));
    const players = parseInt(prompt("Enter players", game.method.players || 1));

    if (!hours || !players) return;

    await axios.post(`${API_BASE_URL}/api/games/${game.id}/play`, {
      hours,
      players,
    });

    // toast.success("Play updated successfully");

    // Update local state
    setGame((prev) => ({
      ...prev,
      method: { ...prev.method, hours, players },
    }));
  };

  return (
    <Card
      sx={{
        bgcolor: "#171C2D",
        borderRadius: 0,
        boxShadow: "0px 0px 4px rgba(0,0,0,0.4)",
        width: 280,
        height: 185,
        transition: "0.3s",
      }}
    >
      <CardContent sx={{ px: 2, py: 1.5 }}>
        {/* Title + Edit Icon */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            fontWeight={500}
            fontSize={15}
            color="#FFFFFF"
            noWrap
          >
            {game.title}
          </Typography>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => setEditOpen(true)}>
              <EditIcon sx={{ fontSize: 16, color: "gray" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Divider line */}
        <Divider sx={{ backgroundColor: "#2E3350", my: 1 }} />

        {/* Team Game */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.4}
        >
          <Typography fontSize={13} color="#FFFFFF">
            Team Game
          </Typography>
          <Typography fontSize={13} color="#FFFFFF" fontWeight={500}>
            {game.team_game ? "Yes" : "No"}
          </Typography>
        </Box>

        {/* Location */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.4}
        >
          <Typography fontSize={13} color="#FFFFFF">
            Location
          </Typography>
          <Typography fontSize={13} color="#FFFFFF" fontWeight={500}>
            {game.location || "-"}
          </Typography>
        </Box>

        {/* Method + Price */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Typography fontSize={13} color="#0CD7FF" fontWeight={600}>
            {(() => {
              const method = game.method;

              let label = "Price";

              if (typeof method === "string") {
                label = method;
              } else if (method?.type === "Per Hour") {
                label = "Per Hour";
              } else if (method?.type === "Coin") {
                label = "Per Coin";
              } else if (method?.type === "Arrow") {
                label = "Per Arrow";
              }

              return `${label}`;
            })()}
          </Typography>

          <Typography fontSize={13} color="#0CD7FF" fontWeight={600}>
            LKR {game.price || 0}
          </Typography>
        </Box>

        {/* Play Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#8A38F51F",
            color: "#FFFFFF",
            borderRadius: 0,
            py: 0.5,
            textTransform: "none",
            fontSize: 13,
            "&:hover": {
              bgcolor: "#8A38F540",
            },
          }}
          onClick={() => onPlay && onPlay(game)}
        >
          Play
        </Button>

        {/* Edit Modal */}
        <AddNewGame
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          mode="edit"
          initialData={game}
          onSubmit={(updatedGameData) => {
            if (onUpdate) onUpdate(updatedGameData);
            setEditOpen(false);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default GameCard;
