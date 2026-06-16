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

const getMethodType = (method) => {
  if (!method) return "";
  if (typeof method === "object") return (method.type || "").toLowerCase();
  return method.toLowerCase();
};

const GameCard = ({ game: initialGame, onPlay, onUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [game, setGame] = useState(initialGame || {}); // default empty object

  useEffect(() => {
    if (initialGame) setGame(initialGame);
  }, [initialGame]);

  // Prevent undefined access
  if (!game || !game.title) return null;

  const methodType = getMethodType(game.method);
  const isArrow = methodType === "arrow";
  const isPerMinute = methodType === "per minute";

  const rawPkgs = game.packages;
  const gamePackages = Array.isArray(rawPkgs)
    ? rawPkgs
    : rawPkgs && typeof rawPkgs === "object"
      ? Object.values(rawPkgs)
      : [];

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
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
      }}
    >
      <CardContent sx={{ px: 2, py: 1.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
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

        {/* Grows to fill space, keeps Play button at bottom */}
        <Box sx={{ flexGrow: 1 }}>
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

          {/* Method + Price / Arrow Packages / Minute Packages */}
          {isArrow && gamePackages.length > 0 ? (
            <Box mt={0.8}>
              <Typography fontSize={12} color="#9CA3AF" mb={0.5}>
                Arrow Packages
              </Typography>
              {gamePackages.map((pkg, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ backgroundColor: "#1a1f30", borderRadius: "6px", px: 1.5, py: 0.5, mb: 0.5, border: "1px solid #2a2f45" }}
                >
                  <Typography fontSize={12} color="#0CD7FF" fontWeight={500}>{pkg.arrows} Arrows</Typography>
                  <Typography fontSize={12} color="#fff" fontWeight={600}>Rs. {Number(pkg.price).toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          ) : isPerMinute && gamePackages.length > 0 ? (
            <Box mt={0.8}>
              <Typography fontSize={12} color="#9CA3AF" mb={0.5}>
                Minute Packages
              </Typography>
              {gamePackages.map((pkg, i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ backgroundColor: "#1a1f30", borderRadius: "6px", px: 1.5, py: 0.5, mb: 0.5, border: "1px solid #2a2f45" }}
                >
                  <Typography fontSize={12} color="#0CD7FF" fontWeight={500}>{pkg.minutes} Minutes</Typography>
                  <Typography fontSize={12} color="#fff" fontWeight={600}>Rs. {Number(pkg.price).toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.8}>
              <Typography fontSize={13} color="#0CD7FF" fontWeight={600}>
                {(() => {
                  const method = game.method;
                  if (typeof method === "string") return method;
                  if (method?.type === "Per Hour") return "Per Hour";
                  if (method?.type === "Per Minute") return "Per Minute";
                  if (method?.type === "Coin") return "Per Coin";
                  if (method?.type === "Arrow") return "Per Arrow";
                  return "Price";
                })()}
              </Typography>
              <Typography fontSize={13} color="#0CD7FF" fontWeight={600}>
                LKR {game.price || 0}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Play Button — always at bottom */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 1.5,
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
