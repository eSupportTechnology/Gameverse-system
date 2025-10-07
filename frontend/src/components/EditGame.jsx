import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import sucessicon from '../assets/sucessicon.png'
import CancelPopup from './CancelPopup';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditGame = ({ open, handleClose, game, onUpdate }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [cancelOpen, setcancelOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    playing_method: '',
    price: '',
    quantity: '',
    players: '',
    category: 'Arcade Machine',
    status: 'Active'
  });

  // Load game data when component opens
  useEffect(() => {
    if (game && open) {
      setFormData({
        title: game.title || '',
        location: game.location || '',
        playing_method: game.playing_method || '',
        price: game.price ? game.price.toString() : '',
        quantity: game.quantity ? game.quantity.toString() : '',
        players: game.players ? game.players.toString() : '',
        category: game.category || 'Arcade Machine',
        status: game.status || 'Active'
      });
    }
  }, [game, open]);

  const handleCancelOpen = () => setcancelOpen(true);
  const handleCancelClose = () => setcancelOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle edit game - Connect to backend API
  const handlEditGame = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.location || !formData.playing_method || !formData.price || !formData.category) {
        toast.error("Please fill all required fields");
        return;
      }

      const token = localStorage.getItem("aToken");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (!game.id) {
        toast.error("Game ID not found");
        return;
      }

      const payload = {
        title: formData.title,
        location: formData.location,
        playing_method: formData.playing_method,
        price: parseFloat(formData.price),
        quantity: formData.category !== 'Carrom' ? (formData.quantity ? parseInt(formData.quantity) : 1) : null,
        players: formData.category === 'Carrom' ? (formData.players ? parseInt(formData.players) : 4) : null,
        category: formData.category,
        status: formData.status || 'Active'
      };

      const res = await axios({
        method: 'put',
        url: `http://127.0.0.1:8000/api/games/${game.id}`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Game updated successfully!");
      setUpdateSuccess(true);
      
      // Call onUpdate callback if provided
      if (onUpdate) {
        onUpdate(res.data.data);
      }

    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update game. Make sure you are logged in."
      );
    }
  };

  const handleConfirm = () => {
    console.log("Game edit cancelled!");
    setcancelOpen(false);
    handleClose(false);
  };


  return (
    <div>
      <Dialog
        open={open}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: "12px", backgroundColor: "#111827", color: "white", py: 2, border: '1px solid #374151', },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, overflowX: 'hidden' }}>
          <DialogTitle sx={{
            color: "#FFFFFF",
            fontSize: { xs: 16, sm: 16, md: 18 },
            fontWeight: "bold",
            flex: 1,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}>
            Edit {game?.title || 'Game'} Details
          </DialogTitle>

          <IconButton onClick={handleClose} sx={{ color: "#FFFFFF" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent dividers sx={{ py: 0, pb: 2 }}>

          {/* Game name */}
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            {/* Label */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Game Name
            </Typography>

            {/* Input */}
            <TextField
              name="title"
              value={formData.title}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter game name"
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Location */}
          <Box display="flex" flexDirection="column" gap={1} mb={1}>
            {/* Label */}
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Location
            </Typography>

            {/* Input */}
            <TextField
              name="location"
              value={formData.location}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Zone A,Zone B,...etc"
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: "14px",
                  },
                  color: "white",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Game Category */}
          <Box display="flex" flexDirection="column" gap={1} mb={2}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Game Category
            </Typography>
            <TextField
              name="category"
              value={formData.category}
              onChange={handleChange}
              select
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                sx: {
                  backgroundColor: "#1F2937",
                  borderRadius: "6px",
                  border: '1px solid #374151',
                  color: "white",
                  fontWeight: 500,
                },
              }}
            >
              <MenuItem value="Arcade Machine">Arcade Machine</MenuItem>
              <MenuItem value="Archery">Archery</MenuItem>
              <MenuItem value="Carrom">Carrom</MenuItem>
            </TextField>
          </Box>

          <Box display="flex" justifyContent="flex-start" width="50%">
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, fontSize: 14, color: "#FFFFFF" }}
            >
              Pricing Method
            </Typography>
          </Box>

          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
            {/* pricing method */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "#9CA3AF" }}
              >
                Playing Method
              </Typography>

              {/* Input */}
              <TextField
                name="playing_method"
                value={formData.playing_method}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                size="small"
                placeholder={formData.category === 'Arcade Machine' ? 'Coin' : formData.category === 'Archery' ? 'Arrows' : 'Per hour'}
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      fontSize: "14px",
                    },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            {/* price */}
            <Box display="flex" flexDirection="column" gap={1}>
              {/* Label */}
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "#9CA3AF" }}
              >
                Price
              </Typography>

              {/* Input */}
              <TextField
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="100"
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      fontSize: "14px",
                    },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Quantity/Players field based on category */}
          {formData.category !== 'Carrom' ? (
            <Box display="flex" flexDirection="column" gap={1} mt={2}>
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "#9CA3AF" }}
              >
                Quantity
              </Typography>
              <TextField
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="1"
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      fontSize: "14px",
                    },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={1} mt={2}>
              <Typography
                variant="body2"
                sx={{ fontSize: 12, color: "#9CA3AF" }}
              >
                Number of Players
              </Typography>
              <TextField
                name="players"
                value={formData.players}
                onChange={handleChange}
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="4"
                InputProps={{
                  sx: {
                    backgroundColor: "#1F2937",
                    borderRadius: "6px",
                    border: '1px solid #374151',
                    "& input::placeholder": {
                      color: "#9CA3AF",
                      fontSize: "14px",
                    },
                    color: "white",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>

        {/* cancel & create button */}
        <DialogActions sx={{ px: 3 }}>
          <Button onClick={handleCancelOpen} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', backgroundColor: "#1F2937", width: '50%', py: 0.5, textTransform: 'capitalize', "&:hover": { bgcolor: "#374151" }, }}>
            Cancel
          </Button>
          <Button
            onClick={handlEditGame}
            variant="contained"
            sx={{
              fontSize: 16,
              fontWeight: 'bold',
              width: '50%',
              py: 0.5,
              textTransform: 'capitalize',
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}
          >
            Update
          </Button>
          {/* create Success Popup */}
          <Dialog
            open={updateSuccess}
            PaperProps={{
              sx: {
                bgcolor: "#0A192F",
                borderRadius: "16px",
                py: 2,
                px: 8,
                textAlign: "center",
                color: "white",
                border: '1px solid #3B4859'
              },
            }}
          >
            <DialogContent>
              <Box sx={{ mb: 1, }}>
                <img src={sucessicon} alt="" width={80} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: 24,
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Update Successful !
              </Typography>
              <Button
                onClick={() => setUpdateSuccess(false)}
                sx={{
                  px: 8,
                  fontSize: 14,
                  textTransform: 'capitalize',
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0CD7FF 0%, #8A38F5 73%)",
                  },
                }}
              >
                Ok
              </Button>
            </DialogContent>
          </Dialog>
        </DialogActions>

        {/* cances box */}
        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirm}
        />
      </Dialog>

    </div>
  )
}

export default EditGame
