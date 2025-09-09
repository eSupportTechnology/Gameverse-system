import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

const products = [
  { id: 1, price: 800, name: "Chicken Burger", category: "Foods", stock: 15 },
  { id: 2, price: 200, name: "Energy Drink", category: "Beverages", stock: 24, fav: true },
  { id: 3, price: 500, name: "Hot Dog", category: "Foods", stock: 10 },
  { id: 4, price: 250, name: "Popcorn (Salted)", category: "Snacks", stock: 12, fav: true },
  { id: 5, price: 400, name: "Popcorn (Salted)", category: "Dessert", stock: 6 },
  { id: 6, price: 200, name: "Vanilla Cup", category: "Ice-Cream", stock: 30, fav: true },
  { id: 7, price: 500, name: "Chicken Nuggets (6pcs)", category: "Snacks", stock: 34 },
  { id: 8, price: 350, name: "Brownie", category: "Dessert", stock: 16 },
  { id: 9, price: 200, name: "Chocolate Cup", category: "Ice-Cream", stock: 24, fav: true },
];

const PosSystem = () => {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "black",
        color: "white",
        p: 2,
        height: "100%",
        gap: 2,
      }}
    >
      {/* Left Section (Products) */}
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Title */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            POS System
          </Typography>
          <Typography variant="body2" color="gray">
            Point of Sale and Product Management
          </Typography>
        </Box>

        {/* Add New Item Button */}
        <Button
            sx={{
              background: "linear-gradient(to right, #06b6d4, #9333ea)",
              color: "white",
              borderRadius: 2,
              width: "213px",
              height: "50px",
              fontWeight: "bold",
              textTransform: "none",
            }}
        >
           + Add New Item
        </Button>
      </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {["All", "Drinks", "Snack", "Desert", "Ice-Cream"].map((cat, i) => (
              <Button
                key={i}
                variant="contained"
                sx={{
                  bgcolor: i === 0 ? "#0B3C49" : "#1F2937",
                  color: "white",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#374151" },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>
          
        </Box>

        {/* Products Grid */}
        <Grid container spacing={2}>
          {products.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  bgcolor: "#171E2A",
                  borderRadius: 2,
                  position: "relative",
                  height: "132px",
                  width: "230px",
                  border: 2,
                  borderColor: "#374151",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "#0CD7FF", fontWeight: "bold", fontSize: 14 }}>
                    LKR{item.price}
                  </Typography>
                  <Typography variant="subtitle1" color="white" fontWeight="semi-bold" fontSize={12}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="#9CA3AF" fontSize={10}>
                    {item.category}
                  </Typography>
                  <Typography variant="body2" color="white" fontWeight="semi-bold" sx={{ mt: 1 }} fontSize={12}>
                    Stock: {item.stock}
                  </Typography>

                  {/* Add to Cart */}
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      bgcolor: "#8A38F5",
                      color: "white",
                      "&:hover": { bgcolor: "#0284c7" },
                    }}
                  >
                    <AddIcon />
                  </IconButton>

                  {/* Favorite */}
                  {item.fav && (
                    <StarIcon
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "#ec4899",
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right Section (Customer + Cart) */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Customer Box */}
        <Box sx={{ bgcolor: "#1E293B", p: 2, borderRadius: 2 }}>
          <Button
            fullWidth
            sx={{
              bgcolor: "#334155",
              color: "#9CA3AF",
              mb: 1,
              textTransform: "none",
            }}
          >
            Read NFC Card
          </Button>
          <Button
            fullWidth
            sx={{
              background: "linear-gradient(to right,  #400935ff, #5717a4ff)",
              color: "white",
              textTransform: "none",
              width: "330px",
              height: "35px"
            }}
          >
            Walk in customer
          </Button>
        </Box>

        {/* Cart Box */}
        <Box sx={{ bgcolor: "#1E293B", p: 2, borderRadius: 2, flex: 1, overflowY: "auto" }}>
          <Typography fontWeight="bold" mb={2}>
            Cart
          </Typography>
          {[1, 2, 3, 4, 5].map((_, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box>
                <Typography fontWeight="bold">Energy Drink</Typography>
                <Typography variant="body2" color="gray">
                  LKR200
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small" sx={{ bgcolor: "#334155", color: "white" }}>
                  <RemoveIcon />
                </IconButton>
                <Typography>01</Typography>
                <IconButton size="small" sx={{ bgcolor: "#334155", color: "white" }}>
                  <AddIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: "#f87171" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Checkout Button */}
        <Button
          fullWidth
          sx={{
            background: "linear-gradient(to right, #06b6d4, #9333ea)",
            color: "white",
            borderRadius: 2,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default PosSystem;
