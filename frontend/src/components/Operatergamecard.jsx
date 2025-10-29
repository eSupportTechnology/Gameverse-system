import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNewGameOperator from './OperaterNewAddgame';
import { toast } from 'react-toastify';
import axios from 'axios';

const methodValue = { Coin: 100, Arrow: 150, "Per Hour": 75 };

const OperatorGameCard = ({ game, onUpdate }) => {
  const [editOpen, setEditOpen] = useState(false);

  // Calculate number of units (coins/arrows/hours)
  const quantity = Math.floor(game.price / (methodValue[game.method] || 1));

  // DELETE game handler
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("oToken");
      await axios.delete(`http://127.0.0.1:8000/api/operator/games/${game.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Game deleted successfully!");
      if (onUpdate) onUpdate(); // refresh game list
    } catch (error) {
      toast.error("Failed to delete game.");
      console.error(error);
    }
  };

  return (
    <Card sx={{
      bgcolor: "#171C2D",
      borderRadius: "5px",
      pb: 2,
      boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      height: 135,
      transition: "0.3s",
      "&:hover": { transform: "translateY(-3px)" }
    }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={500} fontSize={16} color="#fff">
            {game.title}
          </Typography>

          <Box>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => setEditOpen(true)}>
                <EditIcon sx={{ fontSize: 16, color: "gray" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon sx={{ fontSize: 16, color: "red" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Location */}
        <Box display="flex" justifyContent="flex-start" mb={1}>
          <Typography fontWeight={200} fontSize={12} color="#fff">
            Location: <span style={{ fontWeight: 700 }}>{game.location}</span>
          </Typography>
        </Box>

        {/* Method and Price */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontSize={12} color="#FFFFFF">
            {quantity} {game.method}{quantity > 1 ? "s" : ""}
          </Typography>
          <Typography fontSize={12} color="#0CD7FF">
            LKR {game.price}
          </Typography>
        </Box>

        {/* Manage Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "rgba(12, 215, 255, 0.2)",
            color: "#fff",
            borderRadius: "5px",
            py: 0.2,
            textTransform: "none",
            "&:hover": { bgcolor: "#1F2937" }
          }}
          onClick={() => setEditOpen(true)}
        >
          Manage
        </Button>

        {/* Edit Modal */}
        <AddNewGameOperator
          open={editOpen}
          handleClose={() => setEditOpen(false)}
          mode="edit"
          initialData={game}
          onSubmit={onUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default OperatorGameCard;
