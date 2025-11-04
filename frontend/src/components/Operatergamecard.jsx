import React, { useState } from "react";
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
import AddNewGameOperator from "./OperaterNewAddgame";
import axios from "axios";
import { toast } from "react-toastify";

const methodValue = { Coin: 100, Arrow: 150, "Per Hour": 75 };

const OperatorGameCard = ({ game, onPlay, onUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);

  const quantity = Math.floor(game.price / (methodValue[game.method] || 1));

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("oToken");
      await axios.delete(`http://127.0.0.1:8000/api/operator/games/${game.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Game deleted successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to delete game.");
    }
  };

  return (
    <Card
      sx={{
        bgcolor: "#171C2D",
        borderRadius: 0,
        boxShadow: "0px 0px 4px rgba(0,0,0,0.4)",
        width: 260,
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

        {/* Divider line under heading */}
        <Divider sx={{ backgroundColor: "#2E3350", my: 1 }} />

        {/* Team Game */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.4}>
          <Typography fontSize={13} color="#FFFFFF">
            Team Game
          </Typography>
          <Typography fontSize={13} color="#FFFFFF" fontWeight={500}>
            {game.is_team_game ? "Yes" : "No"}
          </Typography>
        </Box>

        {/* Location */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.4}>
          <Typography fontSize={13} color="#FFFFFF">
            Location
          </Typography>
          <Typography fontSize={13} color="#FFFFFF" fontWeight={500}>
            {game.location}
          </Typography>
        </Box>

        {/* Method + Price */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography fontSize={13} color="#FFFFFF">
            {game.method === "Per Hour"
              ? "1 Hour"
              : `${quantity} ${game.method}${quantity > 1 ? "s" : ""}`}
          </Typography>
          <Typography fontSize={13} color="#0CD7FF" fontWeight={600}>
            LKR {game.price}
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

        {/* Edit Game Popup */}
        <AddNewGameOperator
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          mode="edit"
          initialData={game}
          onSubmit={() => {
            if (onUpdate) onUpdate();
            setEditOpen(false);
          }}
        />
      </CardContent>
    </Card>
  );
};

export default OperatorGameCard;
