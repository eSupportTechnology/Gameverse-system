
import React, { useState, useEffect } from 'react';
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
import gameicon from '../assets/gameicon.png'
import CancelPopup from './CancelPopup';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddNewGame = ({ open, handleClose, onCreate }) => {
const paymentMethods = ["Coin", "Arrow", "Per Hour"];

  const [createSuccess, setcreateSuccess] = useState(false);
  const [cancelOpen, setcancelOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    playing_method: '',
    price: '',
    quantity: '',
    players: '',
    category: 'Arcade Machine'
  });

  const handleCancelOpen = () => setcancelOpen(true);
  const handleCancelClose = () => setcancelOpen(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [method, setMethod] = useState("Coin");
  const [price, setPrice] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // handle New game - Connect to backend API
  const handlNewGame = async () => {
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

      const payload = {
        title: formData.title,
        location: formData.location,
        playing_method: formData.playing_method,
        price: parseFloat(formData.price),
        quantity: formData.category !== 'Carrom' ? (formData.quantity ? parseInt(formData.quantity) : 1) : null,
        players: formData.category === 'Carrom' ? (formData.players ? parseInt(formData.players) : 4) : null,
        category: formData.category,
        status: 'Active'
      };

      const res = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/api/games',
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Game created successfully!");
      setcreateSuccess(true);
      
      // Call onCreate callback if provided
      if (onCreate) {
        onCreate(res.data.data);
      }

      // Reset form
      setFormData({
        title: '',
        location: '',
        playing_method: '',
        price: '',
        quantity: '',
        players: '',
        category: 'Arcade Machine'
      });

    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create game. Make sure you are logged in."
      );
    }
  };

  const handleConfirm = () => {
    console.log("Game creation cancelled!");
    setcancelOpen(false);
    handleClose(false);
    // Reset form on cancel
    setFormData({
      title: '',
      location: '',
      playing_method: '',
      price: '',
      quantity: '',
      players: '',
      category: 'Arcade Machine'
    });
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1 }}>
          <DialogTitle sx={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold", }}>
            Add New Game
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

          {/* Pricing Method */}
          <Typography variant="body2" sx={{ fontSize: 12, color: "#9CA3AF", mb: 0.5 }}>Pricing Method</Typography>
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }} gap={2} mt={1}>
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
                select
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Select playing method"
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
                {paymentMethods.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
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
          <Button  onClick={handleCancelOpen} variant="contained" sx={{ fontSize: 16, fontWeight: 'bold', backgroundColor: "#1F2937", width: '50%', py: 0.5, textTransform: 'capitalize', "&:hover": { bgcolor: "#374151" }, }}>
            Cancel
          </Button>
          <Button
            onClick={handlNewGame}
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
            Create
          </Button>
          {/* create Success Popup */}
          <Dialog
            open={createSuccess}
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
                <img src={gameicon} alt="" width={80} />
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
                Create Successful !
              </Typography>
              <Button
                onClick={() => setcreateSuccess(false)}
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

        <Dialog
          open={createSuccess}
          PaperProps={{
            sx: {
              bgcolor: "#0A192F",
              borderRadius: "16px",
              py: 2,
              px: 8,
              textAlign: "center",
              color: "white",
              border: '1px solid #3B4859'
            }
          }}
        >
          <DialogContent>
            <Box sx={{ mb: 1 }}><img src={gameicon} alt="" width={80} /></Box>
            <Typography variant="h6"
              sx={{ background: "linear-gradient(90deg, #00C6FF, #FF00CC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 24, fontWeight: 600, mb: 1 }}>
              {mode === "edit" ? "Update Successful!" : "Create Successful!"}
            </Typography>
            <Button onClick={() => { setCreateSuccess(false); handleClose(); }}
              sx={{ px: 8, fontSize: 14, borderRadius: "8px", background: "linear-gradient(90deg, rgba(12, 215, 255, 0.4) 0%, rgba(138, 56, 245, 0.4) 73%)", color: "white" }}>
              Ok
            </Button>
          </DialogContent>
        </Dialog>

        <CancelPopup
          open={cancelOpen}
          handleCancelClose={handleCancelClose}
          handleConfirm={handleConfirm}
        />
      </Dialog>

    </div>
  )
}

export default AddNewGame
