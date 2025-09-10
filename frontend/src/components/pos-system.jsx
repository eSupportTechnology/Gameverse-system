import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Modal,
  MenuItem,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";

const initialProducts = [
  { id: 1, price: 800, name: "Chicken Burger", category: "Snacks", stock: 15 },
  { id: 2, price: 200, name: "Energy Drink", category: "Drinks", stock: 24, fav: true },
  { id: 3, price: 500, name: "Hot Dog", category: "Snacks", stock: 10 },
  { id: 4, price: 250, name: "Popcorn (Salted)", category: "Snacks", stock: 12, fav: true },
  { id: 5, price: 400, name: "Popcorn (Salted)", category: "Dessert", stock: 6 },
  { id: 6, price: 200, name: "Vanilla Cup", category: "Ice-Cream", stock: 30, fav: true },
  { id: 7, price: 500, name: "Chicken Nuggets (6pcs)", category: "Snacks", stock: 34 },
  { id: 8, price: 350, name: "Brownie", category: "Dessert", stock: 16 },
  { id: 9, price: 200, name: "Chocolate Cup", category: "Ice-Cream", stock: 24, fav: true },
];

const initialCategories = ["All", "Drinks", "Snacks", "Dessert", "Ice-Cream"];

const textFieldSx = {
  bgcolor: "#1e293b",
  borderRadius: 1,
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#6366f1" },
    "&.Mui-focused fieldset": { borderColor: "#6366f1" },
  },
  "& .MuiSvgIcon-root": { color: "white" },
};

const PosSystem = () => {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState("All");

  const [openAddItem, setOpenAddItem] = useState(false);
  const [openWalkIn, setOpenWalkIn] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);

  const [newCategory, setNewCategory] = useState(""); 
  const [showNewCategory, setShowNewCategory] = useState(false);

  const [newItem, setNewItem] = useState({
    category: "",
    name: "",
    price: "",
    stock: "",
    loyalty: "Yes",
  });

  const [walkInCustomer, setWalkInCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Add to cart
  const addToCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);
    if (exists) {
      setCart(cart.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);
    if (exists.qty === 1) {
      setCart(cart.filter(p => p.id !== product.id));
    } else {
      setCart(cart.map(p => p.id === product.id ? { ...p, qty: p.qty - 1 } : p));
    }
  };

  const handleDeleteCart = (product) => {
    setCart(cart.filter(p => p.id !== product.id));
  };

 // ---------------- Add Item ----------------
  const handleAddItemOpen = () => setOpenAddItem(true);
  const handleAddItemClose = () => {
    setShowNewCategory(false);
    setOpenAddItem(false);
  };

  const handleAddNewItem = () => {
    const id = products.length + 1;
    setProducts([
      ...products,
      { ...newItem, id, price: Number(newItem.price), stock: Number(newItem.stock), fav: false }
    ]);
    setNewItem({ category: "", name: "", price: "", stock: "", loyalty: "Yes" });
    handleAddItemClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewItem({ ...newItem, category: newCategory });
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  // Walk-in modal handlers
  const handleWalkInOpen = () => setOpenWalkIn(true);
  const handleWalkInClose = () => setOpenWalkIn(false);

  // Checkout modal handlers
  const handleCheckoutOpen = () => setOpenCheckout(true);
  const handleCheckoutClose = () => setOpenCheckout(false);

  // Filters
  const filteredProducts = 
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <Box sx={{ display: "flex", bgcolor: "black", color: "white", p: 2, height: "100vh", gap: 2 }}>

      {/* ---------------- Left Section (Products) ---------------- */}
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">POS System</Typography>
            <Typography variant="body2" color="gray">Point of Sale and Product Management</Typography>
          </Box>
          <Button
            sx={{
              background: "linear-gradient(to right, #06b6d4, #9333ea)",
              color: "white",
              borderRadius: 2,
              width: 213,
              height: 50,
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={handleAddItemOpen}
          >
            + Add New Item
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="contained"
              onClick={() => setActiveCategory(cat)}
              sx={{
                bgcolor: activeCategory === cat ? "#0B3C49" : "#1F2937",
                color: "white",
                textTransform: "none",
                "&:hover": { bgcolor: "#374151" },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filteredProducts.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  bgcolor: "#171E2A",
                  borderRadius: 2,
                  position: "relative",
                  height: 132,
                  width: 230,
                  border: 2,
                  borderColor: "#374151",
                }}
              >
                <CardContent>
                  <Typography sx={{ color: "#0CD7FF", fontWeight: "bold", fontSize: 14 }}>LKR{item.price}</Typography>
                  <Typography variant="subtitle1" color="white" fontSize={12}>{item.name}</Typography>
                  <Typography variant="body2" color="#9CA3AF" fontSize={10}>{item.category}</Typography>
                  <Typography variant="body2" color="white" sx={{ mt: 1 }} fontSize={12}>Stock: {item.stock}</Typography>
                  <IconButton 
                      size="small" 
                      sx={{ position: "absolute", bottom: 12, right: 12 }} 
                      onClick={() => addToCart(item)}
                  >
                    <img src="/images/add.png" alt="add" style={{ width: 25, height: 25 }} />
                  </IconButton>
                  {item.fav && (
                    <StarIcon 
                      sx={{ position: "absolute", top: 10, right: 10, color: "#C6379F", width: 15, height: 14 }} 
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ---------------- Right Section ---------------- */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Customer Box */}
        <Box
          sx={{
            bgcolor: "#0E111B",
            p: 2,
            borderRadius: 2,
            width: 388,
            height: 124,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography fontWeight="bold" mb={0.05}>
            Customer
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Button
              sx={{
                bgcolor: "#334155",
                color: "#9CA3AF",
                textTransform: "none",
                width: 350,
                height: 35,
                borderRadius: 1.5,
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
                width: 350,
                height: 35,
                borderRadius: 1.5,
              }}
              onClick={handleWalkInOpen}
            >
              Walk in customer
            </Button>
          </Box>
        </Box>

        {/* Cart Box */}
        <Box
          sx={{
            bgcolor: "#171E2A",
            p: 2,
            borderRadius: 2,
            flex: 1,
            height: 391,
            width: 388,
            overflowY: "auto",
          }}
        >
          <Typography fontWeight={600} mb={2} fontSize={16}>
            Cart
          </Typography>
          {cart.length === 0 ? (
            <Typography color="gray" fontSize={14}>
              Cart is empty
            </Typography>
          ) : (
            cart.map((item) => (
              <Box
                key={item.id}
                sx={{
                  bgcolor: "#1E293B",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,
                  width: 350,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="#9CA3AF" fontSize={12}>
                    LKR{item.price}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "#334155", color: "white" }}
                    onClick={() => removeFromCart(item)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography>{item.qty}</Typography>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "#334155", color: "white" }}
                    onClick={() => addToCart(item)}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ bgcolor: "#42262F", borderRadius: "8px", p: 1 }}
                    onClick={() => handleDeleteCart(item)}
                  >
                    <img src="/images/delete.png" alt="delete" style={{ width: 20, height: 20 }} />
                  </IconButton>
                </Box>
              </Box>
            ))
          )}
        </Box>

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
          onClick={handleCheckoutOpen}
        >
          Checkout
        </Button>
      </Box>

      {/* ---------------- Add Item Modal ---------------- */}
      <Modal open={openAddItem} onClose={handleAddItemClose}>
        <Box
          sx={{
            bgcolor: "#111827",
            color: "white",
            p: 3,
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: "2%",
            outline: "none",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" fontSize={18}>
              Add Item
            </Typography>
            <IconButton onClick={handleAddItemClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            {/* Category Selector */}
          <TextField
              select
              label="Category"
              value={newItem.category}
              onChange={(e) => {
            if (e.target.value === "Other") {
              setShowNewCategory(true);
              setNewItem({ ...newItem, category: "" }); // reset selection for new category
            } else {
                setNewItem({ ...newItem, category: e.target.value });
                setShowNewCategory(false);
            }
            }}
            fullWidth
            sx={textFieldSx}
          >
            {categories.slice(1).map((cat) => (
            <MenuItem key={cat} value={cat}>
               {cat}
            </MenuItem>
          ))}
          <MenuItem
             value="Other"
             onClick={() => setShowNewCategory(true)}
          >
              Other category +
          </MenuItem>
        </TextField>

      {/* Input box for Other Category */}
      {showNewCategory && (
  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
    <TextField
      placeholder="Enter Category"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      fullWidth
      sx={textFieldSx}
    />
    <Button
      variant="contained"
      onClick={() => {
        if (newCategory.trim() && !categories.includes(newCategory)) {
          setCategories([...categories, newCategory]);
          setNewItem({ ...newItem, category: newCategory });
          setNewCategory("");
          setShowNewCategory(false);
        }
      }}
      disabled={!newCategory.trim()}
      sx={{
        background: "linear-gradient(to right, #3b82f6, #9333ea)",
        textTransform: "none",
      }}
    >
      Add
    </Button>
  </Box>
)}


            {/* Name */}
            <TextField
              label="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              variant="outlined"
              sx={textFieldSx}
            />

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              fullWidth
              variant="outlined"
              sx={textFieldSx}
            />

            {/* Stock */}
            <TextField
              label="Stock"
              type="number"
              value={newItem.stock}
              onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
              fullWidth
              variant="outlined"
              sx={textFieldSx}
            />

            {/* Loyalty */}
            <Box>
              <Typography variant="body2" sx={{ color: "gray", mb: 1 }}>
                Loyalty Point
              </Typography>
              <RadioGroup
                row
                value={newItem.loyalty}
                onChange={(e) => setNewItem({ ...newItem, loyalty: e.target.value })}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleAddNewItem}
              sx={{
                background: "linear-gradient(to right, #06b6d4, #9333ea)",
                textTransform: "none",
                mt: 2,
              }}
            >
              Add Item
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ---------------- Walk-in Customer Modal ---------------- */}
      <Modal open={openWalkIn} onClose={handleWalkInClose}>
        <Box sx={{ bgcolor:"#111827", color:"white", p:3, borderRadius:2, width:400, mx:"auto", mt:"10%", outline:"none" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" fontSize={18}>Walk-in Customer</Typography>
            <IconButton onClick={handleWalkInClose} sx={{ color: "white" }}><CloseIcon/></IconButton>
          </Box>

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Customer Name (Optional)"
              value={walkInCustomer.name}
              onChange={(e) => setWalkInCustomer({ ...walkInCustomer, name: e.target.value })}
              fullWidth
              variant="outlined"
              sx={textFieldSx}
            />
            <TextField
              label="Phone Number (Optional)"
              value={walkInCustomer.phone}
              onChange={(e) => setWalkInCustomer({ ...walkInCustomer, phone: e.target.value })}
              fullWidth
              variant="outlined"
              sx={textFieldSx}
            />
            <TextField
              label="Email (Optional)"
              value={walkInCustomer.email}
              onChange={(e) => setWalkInCustomer({ ...walkInCustomer, email: e.target.value })}
              fullWidth
              variant="outlined"
              sx={textFieldSx}
            />
            <Typography variant="body2" color="gray">
              ℹ️ Walk-in customers don't earn loyalty points but can still make purchases
            </Typography>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" sx={{ bgcolor:"#1e293b", "&:hover":{bgcolor:"#334155"}, color:"white", width:"48%" }} onClick={handleWalkInClose}>Cancel</Button>
              <Button variant="contained" sx={{ background:"linear-gradient(to right, #3b82f6, #9333ea)", width:"48%" }}>Continue</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* ---------------- ✅ Checkout Modal ---------------- */}
      <Modal open={openCheckout} onClose={handleCheckoutClose}>
        <Box
          sx={{
            bgcolor: "#111827",
            color: "white",
            p: 3,
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: "10%",
            outline: "none",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              Checkout
            </Typography>
            <IconButton onClick={handleCheckoutClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Customer Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Box
              sx={{
                bgcolor: "#334155",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {walkInCustomer.name ? walkInCustomer.name[0].toUpperCase() : "A"}
            </Box>
            <Box>
              <Typography>{walkInCustomer.name || "Alex Chen"}</Typography>
              <Typography variant="body2" color="gray">
                {walkInCustomer.phone || "GV001234"}
              </Typography>
            </Box>
          </Box>

          {/* Totals */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal:</Typography>
              <Typography>LKR{subtotal}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Discount:</Typography>
              <Typography>LKR{discount}</Typography>
            </Box>
            <Box sx={{ borderBottom: "1px solid #334155", my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <Typography>Total:</Typography>
              <Typography sx={{ color: "#38bdf8" }}>LKR{total}</Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ borderColor: "#334155", color: "white" }}
              onClick={() => setCart([])}
            >
              Clear Cart
            </Button>
            <Button
              fullWidth
              sx={{
                background: "linear-gradient(90deg,#6366f1,#ec4899)",
                color: "white",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Pay Now
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PosSystem;