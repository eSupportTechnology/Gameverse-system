import React, { useContext, useEffect, useState } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const initialProducts = [
  // { id: 1, price: 800, name: "Chicken Burger", category: "Snacks", stock: 15 },
  // { id: 2, price: 200, name: "Energy Drink", category: "Drinks", stock: 24, fav: true },
  // { id: 3, price: 500, name: "Hot Dog", category: "Snacks", stock: 10 },
  // { id: 4, price: 250, name: "Popcorn (Salted)", category: "Snacks", stock: 12, fav: true },
  // { id: 5, price: 400, name: "Popcorn (Salted)", category: "Dessert", stock: 6 },
  // { id: 6, price: 200, name: "Vanilla Cup", category: "Ice-Cream", stock: 30, fav: true },
  // { id: 7, price: 500, name: "Chicken Nuggets (6pcs)", category: "Snacks", stock: 34 },
  // { id: 8, price: 350, name: "Brownie", category: "Dessert", stock: 16 },
  // { id: 9, price: 200, name: "Chocolate Cup", category: "Ice-Cream", stock: 24, fav: true },
];

const initialCategories = ["All", "Drinks", "Snacks", "Dessert", "Ice Cream"];

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

  const { aToken } = useContext(AdminContext)

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState("All");

  const [openAddItem, setOpenAddItem] = useState(false);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openWalkIn, setOpenWalkIn] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openPaymentSuccess, setOpenPaymentSuccess] = useState(false);
  const [openNFCPoints, setOpenNFCPoints] = useState(false);

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
    points: 0,
    isFirstTime: true,
  });

  const [nfcPoints, setNfcPoints] = useState(0);

  // Cart operations
  const addToCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);
    if (exists) {
      setCart(
        cart.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const exists = cart.find((p) => p.id === product.id);
    if (exists.qty === 1) {
      setCart(cart.filter((p) => p.id !== product.id));
    } else {
      setCart(
        cart.map((p) => (p.id === product.id ? { ...p, qty: p.qty - 1 } : p))
      );
    }
  };

  const handleDeleteCart = (product) => {
    setCart(cart.filter((p) => p.id !== product.id));
  };

  //  Add Item
  const handleAddItemClose = () => {
    setShowNewCategory(false);
    setNewItem({
      category: "",
      name: "",
      price: "",
      stock: "",
      loyalty: "Yes",
    });
    setOpenAddItem(false);
  };

  // Edit item close
  const handleEditItemClose = () => {
    setOpenEditItem(false);
    setSelectedItem(null);
    setNewItem({
      category: "",
      name: "",
      price: "",
      stock: "",
      loyalty: "Yes",
    });
  };

  const validateNewItem = () => {
    const { category, name, price, stock } = newItem;
    if (!category) return alert("Please select a category") && false;
    if (!name.trim()) return alert("Please enter item name") && false;
    if (!price || Number(price) <= 0)
      return alert("Please enter a valid price") && false;
    if (!stock || Number(stock) < 0)
      return alert("Please enter valid stock") && false;
    return true;
  };

  //  Add New Item
  const handleAddNewItem = async () => {
    if (!validateNewItem()) return;

    try {
      // Convert loyalty to boolean
      const loyaltyBoolean = newItem.loyalty === "Yes";

      // Replace with actual logged-in user ID from context if available
      const userId = 4;

      const payload = {
        category: newItem.category,
        item_name: newItem.name,
        price: Number(newItem.price),
        stock: Number(newItem.stock),
        loyality_price: loyaltyBoolean,
      };

      // Call backend API
      const response = await axios.post(
        "http://localhost:8000/api/pos/add-items",
        payload,
        {
          headers: {
            Authorization: `Bearer ${aToken}`, // from context
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        const addedItem = response.data.data;
        await fetchItems();
        // Reset form & close modal
        setNewItem({
          category: "",
          name: "",
          price: "",
          stock: "",
          loyalty: "Yes",
        });
        handleAddItemClose();
        toast.success("Item added successfully!");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error(error.response?.data?.message || "Failed to add item");
    }
  };

  // fetch items
  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("aToken"); // your Sanctum token or similar
      const response = await axios.get("http://localhost:8000/api/pos/get-items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProducts(response.data.data);
        console.log(response.data.data);

      }
    } catch (error) {
      console.error("Error fetching POS items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [aToken]);

  // Update/Edit item
  const handleUpdateItem = async () => {
    try {
      const payload = {
        category: newItem.category,
        item_name: newItem.name,
        price: Number(newItem.price),
        stock: Number(newItem.stock),
        loyality_price: newItem.loyalty === "Yes",
      };

      const response = await axios.put(
        `http://localhost:8000/api/pos/update-item/${selectedItem.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Item updated successfully!");
        await fetchItems();
        handleEditItemClose();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error(error.response?.data?.message || "Failed to update item");
    }
  };

  // checkot 
  const handleCheckout = async () => {
    try {
      const payload = {
        customer_name: walkInCustomer.name || "Walk-in",
        phone: walkInCustomer.phone || "",
        email: walkInCustomer.email || "",
        items: cart.map((p) => ({
          id: p.id,
          qty: p.qty,
        })),
        subtotal,
        discount,
        total,
      };

      const response = await axios.post(
        "http://localhost:8000/api/pos/checkout",
        payload,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Checkout successful!");
        setCart([]);
        handleCheckoutClose();
        setOpenPaymentSuccess(true);
        fetchItems();
      }
    } catch (error) {
      console.log(error.response?.data?.message);

      toast.error(error.response?.data?.message || "Checkout failed!");
    }
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

  const validateWalkInCustomer = () => {
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (walkInCustomer.phone && !phoneRegex.test(walkInCustomer.phone)) {
      alert("Enter a valid 10-digit phone number");
      return false;
    }
    if (walkInCustomer.email && !emailRegex.test(walkInCustomer.email)) {
      alert("Enter a valid email");
      return false;
    }
    return true;
  };

  // Checkout modal handlers
  const handleCheckoutOpenWithValidation = () => {
    if (cart.length === 0) return alert("Cart is empty");
    setOpenCheckout(true);
  };

  const handleCheckoutClose = () => setOpenCheckout(false);

  // Cancel confirmation handlers
  const handleCancelClick = () => setOpenCancelConfirm(true);
  const handleCancelClose = () => setOpenCancelConfirm(false);

  // Filters
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 0;
  const total = subtotal - discount;

  const calculatePoints = () => {
    let points = walkInCustomer.points;
    let isFirstTime = walkInCustomer.isFirstTime;

    if (isFirstTime) {
      points += 30;
      isFirstTime = false;
    }

    points += Math.floor(cart.reduce((acc, item) => acc + item.price * item.qty, 0) / 100);

    setWalkInCustomer({ ...walkInCustomer, points, isFirstTime });
    setNfcPoints(points);
    setOpenNFCPoints(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        bgcolor: "black",
        color: "white",
        p: 2,
        gap: 2,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ---------------- Left Section (Products) ---------------- */}
      <Box sx={{
        flex: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        maxHeight: "100vh",


        scrollbarWidth: 'thin', // for Firefox
        scrollbarColor: '#374151 transparent',

      }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              POS System
            </Typography>
            <Typography variant="body2" color="gray">
              Point of Sale and Product Management
            </Typography>
          </Box>
          <Button
            sx={{
              background: "linear-gradient(to right, #06b6d4, #9333ea)",
              color: "white",
              borderRadius: 2,
              width: { xs: "100%", sm: 213 },
              height: 50,
              fontSize: 16,
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={() => setOpenAddItem(true)}
          >
            + Add New Item
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2, bgcolor: "#0E111B", p: 1, }}>
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
                minWidth: 80,
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
                  minHeight: 150,
                  minWidth: 200,
                  width: "100%",
                  border: 2,
                  borderColor: "#374151",
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      sx={{ color: "#0CD7FF", fontWeight: "bold", fontSize: 14 }}
                    >
                      LKR{item.price}
                    </Typography>

                    {/* Edit Icon */}
                    <IconButton
                      size="small"
                      sx={{ color: "white" }}
                      onClick={() => {
                        setSelectedItem(item); // store full item object
                        setNewItem({
                          category: item.category,
                          name: item.item_name,
                          price: item.price,
                          stock: item.stock,
                          loyalty: item.loyality_price ? "Yes" : "No",
                        });
                        setOpenEditItem(true);
                      }}
                    >
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" color="white" fontSize={12}>
                      {item.item_name}
                    </Typography>

                    {item.fav && (
                      <IconButton
                        size="small"
                        sx={{ color: "white" }}
                      >
                        <StarIcon
                          sx={{
                            color: "#C6379F",
                            width: 15,
                            height: 14,
                          }}
                        />
                      </IconButton>

                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="#9CA3AF" fontSize={10}>
                      {item.category}
                    </Typography>

                    <Box></Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="white" sx={{ mt: 1 }} fontSize={12}>
                      Stock: {item.stock}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => addToCart(item)}
                    >
                      <img
                        src="/images/add.png"
                        alt="add"
                        style={{ width: 25, height: 25 }}
                      />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ---------------- Right Section ---------------- */}
      <Box sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: { md: 400 }, // keep within screen
        overflow: "hidden",
      }}>
        {/* Customer Box */}
        <Box
          sx={{
            bgcolor: "#0E111B",
            p: 2,
            borderRadius: 2,
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
                width: "100%",
                height: 35,
                borderRadius: 1.5,
              }}
              onClick={calculatePoints}
            >
              Read NFC Card
            </Button>
            <Button
              fullWidth
              sx={{
                background: "linear-gradient(to right,  #400935ff, #5717a4ff)",
                color: "white",
                textTransform: "none",
                width: "100%",
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
            minHeight: 200,
            overflowY: "auto",
            scrollbarWidth: 'thin', // for Firefox
            scrollbarColor: '#374151 transparent',
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
                    <img
                      src="/images/delete.png"
                      alt="delete"
                      style={{ width: 20, height: 20 }}
                    />
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
          onClick={handleCheckoutOpenWithValidation}
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" fontSize={18}>
              Add Item
            </Typography>
            <IconButton onClick={handleAddItemClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={1} display="flex" flexDirection="column" gap={0.9} sx={{ color: "#374151" }} >
            {/* Category Selector */}
            <Typography variant="body2" sx={{ color: "374151" }}>
              Category
            </Typography>
            <TextField
              select
              label="Select Category"
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
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF", // change to your desired color
                },
              }}
            >
              {categories.slice(1).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
              <MenuItem value="Other" onClick={() => setShowNewCategory(true)}>
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
                  onClick={handleAddCategory}
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

            {/* Item */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Item
            </Typography>
            <TextField
              label="Enter Item"
              name="item"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            {/* Price */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Price
            </Typography>
            <TextField
              label="Enter price"
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            {/* Stock */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Stock
            </Typography>
            <TextField
              label="Available stock"
              type="number"
              value={newItem.stock}
              onChange={(e) =>
                setNewItem({ ...newItem, stock: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            {/* Loyalty */}
            <Box>
              <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                Loyalty Point
              </Typography>
              <RadioGroup
                row
                name="loyalty"
                value={newItem.loyalty}
                onChange={(e) =>
                  setNewItem({ ...newItem, loyalty: e.target.value })
                }
                sx={{ display: "flex", gap: 2 }}
              >
                {["Yes", "No"].map((option) => (
                  <Box
                    key={option}
                    sx={{
                      width: "150px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      borderRadius: 1,
                      bgcolor: "#171C2D",
                      border: "1px solid #4b5563",
                      cursor: "pointer",
                    }}
                    onClick={() => setNewItem({ ...newItem, loyalty: option })}
                  >
                    {/* Label Left */}
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                      {option}
                    </Typography>

                    {/* Radio Right */}
                    <Radio
                      value={option}
                      checked={newItem.loyalty === option}
                      onChange={(e) =>
                        setNewItem({ ...newItem, loyalty: e.target.value })
                      }
                      sx={{
                        color: "gray",
                        "&.Mui-checked": {
                          color: "#9CA3AF", // purple highlight
                        },
                      }}
                    />
                  </Box>
                ))}
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

      {/* ---------------- Edit Item Modal ---------------- */}
      <Modal open={openEditItem} onClose={handleEditItemClose}>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" fontSize={18}>
              Edit Item
            </Typography>
            <IconButton onClick={handleEditItemClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={1} display="flex" flexDirection="column" gap={0.9} sx={{ color: "#374151" }} >
            {/* Category Selector */}
            <Typography variant="body2" sx={{ color: "374151" }}>
              Category
            </Typography>
            <TextField
              select
              label="Select Category"
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
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF", // change to your desired color
                },
              }}
            >
              {categories.slice(1).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
              <MenuItem value="Other" onClick={() => setShowNewCategory(true)}>
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
                  onClick={handleAddCategory}
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

            {/* Item */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Item
            </Typography>
            <TextField
              label="Enter Item"
              name="item"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            {/* Price */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Price
            </Typography>
            <TextField
              label="Enter price"
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            {/* Stock */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Stock
            </Typography>
            <TextField
              label="Available stock"
              type="number"
              value={newItem.stock}
              onChange={(e) =>
                setNewItem({ ...newItem, stock: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            {/* Loyalty */}
            <Box>
              <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
                Loyalty Point
              </Typography>
              <RadioGroup
                row
                name="loyalty"
                value={newItem.loyalty}
                onChange={(e) =>
                  setNewItem({ ...newItem, loyalty: e.target.value })
                }
                sx={{ display: "flex", gap: 2 }}
              >
                {["Yes", "No"].map((option) => (
                  <Box
                    key={option}
                    sx={{
                      width: "150px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      borderRadius: 1,
                      bgcolor: "#171C2D",
                      border: "1px solid #4b5563",
                      cursor: "pointer",
                    }}
                    onClick={() => setNewItem({ ...newItem, loyalty: option })}
                  >
                    {/* Label Left */}
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                      {option}
                    </Typography>

                    {/* Radio Right */}
                    <Radio
                      value={option}
                      checked={newItem.loyalty === option}
                      onChange={(e) =>
                        setNewItem({ ...newItem, loyalty: e.target.value })
                      }
                      sx={{
                        color: "gray",
                        "&.Mui-checked": {
                          color: "#9CA3AF", // purple highlight
                        },
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleUpdateItem}
              sx={{
                background: "linear-gradient(to right, #06b6d4, #9333ea)",
                textTransform: "none",
                mt: 2,
              }}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ---------------- Walk-in Customer Modal ---------------- */}
      <Modal open={openWalkIn} onClose={handleWalkInClose}>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" fontSize={18}>
              Walk-in Customer
            </Typography>
            <IconButton onClick={handleWalkInClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Customer Name (Optional)"
              value={walkInCustomer.name}
              onChange={(e) =>
                setWalkInCustomer({ ...walkInCustomer, name: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            <TextField
              label="Phone Number (Optional)"
              value={walkInCustomer.phone}
              onChange={(e) =>
                setWalkInCustomer({ ...walkInCustomer, phone: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            <TextField
              label="Email (Optional)"
              value={walkInCustomer.email}
              onChange={(e) =>
                setWalkInCustomer({ ...walkInCustomer, email: e.target.value })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": {
                  color: "#9CA3AF",
                },
              }}
            />
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              bgcolor="#1F2937"
              p={1}
              borderRadius={1}
            >
              <img
                src="/images/warning-line.png"
                alt="warning-line"
                style={{ width: 16, height: 16 }}
              />
              <Typography
                variant="body2"
                color="#9CA3AF"
                fontSize={10}
                textAlign="center"
              >
                Walk-in customers don't earn loyalty points but can still make
                purchases
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1e293b",
                  "&:hover": { bgcolor: "#334155" },
                  color: "white",
                  width: "48%",
                }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #3b82f6, #9333ea)",
                  width: "48%",
                }}
                onClick={() => {
                  // Validate walk-in customer first
                  if (!validateWalkInCustomer()) return; // stop if invalid

                  handleWalkInClose();
                  handleCheckoutOpenWithValidation(); // open checkout modal
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* ---------------- Cancel Confirmation Modal ---------------- */}
      <Modal open={openCancelConfirm} onClose={handleCancelClose}>
        <Box
          sx={{
            bgcolor: "#0f172a",
            color: "white",
            p: 4,
            borderRadius: 3,
            width: 380,
            mx: "auto",
            mt: "15%",
            textAlign: "center",
            outline: "none",
            boxShadow: 24,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <img
              src="/images/cancel.png"
              alt="cancel"
              style={{ width: 60, height: 60, margin: "0 auto" }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              background:
                "linear-gradient(to right, #0CD7FF, #A837CA, #B737B5, #C6379F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Are you sure to cancel this?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              sx={{
                background: "linear-gradient(to right, #06b6d4, #9333ea)",
                color: "white",
                px: 3,
                borderRadius: 2,
                textTransform: "none",
              }}
              onClick={() => {
                setOpenCancelConfirm(false);
                setOpenWalkIn(false); //  close Walk-in modal as well
                setWalkInCustomer({
                  // Clear walk-in customer info
                  name: "",
                  phone: "",
                  email: "",
                });
              }}
            >
              Yes
            </Button>
            <Button
              sx={{
                bgcolor: "#1e293b",
                color: "white",
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { bgcolor: "#334155" },
              }}
              onClick={handleCancelClose}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ---------------- Checkout Modal ---------------- */}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
              {walkInCustomer.name?.[0]?.toUpperCase()}
            </Box>
            <Box>
              <Typography>{walkInCustomer.name}</Typography>
              <Typography variant="body2" color="gray">
                {walkInCustomer.phone}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
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
              onClick={handleCheckout}
            >
              Pay Now
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* -------------- Payment Successful Modal ---------------- */}
      <Modal
        open={openPaymentSuccess}
        onClose={() => setOpenPaymentSuccess(false)}
      >
        <Box
          sx={{
            bgcolor: "#0f172a",
            color: "white",
            p: 4,
            borderRadius: 3,
            width: 350,
            mx: "auto",
            mt: "15%",
            textAlign: "center",
            outline: "none",
            boxShadow: 24,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <img
              src="/images/successful.png"
              alt="cancel"
              style={{ width: 60, height: 60, margin: "0 auto" }}
            />
          </Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
            sx={{
              background:
                "linear-gradient(to right, #0CD7FF, #A837CA, #B737B5, #C6379F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Payment Successful!
          </Typography>

          <Button
            sx={{
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              color: "white",
              textTransform: "none",
              width: "160px",
              height: "35px",
            }}
            onClick={() => setOpenPaymentSuccess(false)}
          >
            Ok
          </Button>
        </Box>
      </Modal>

      {/* ---------------- NFC Points Modal ---------------- */}
      <Modal open={openNFCPoints} onClose={() => setOpenNFCPoints(false)}>
        <Box
          sx={{
            bgcolor: "#0f172a",
            color: "white",
            p: 4,
            borderRadius: 3,
            width: 350,
            mx: "auto",
            mt: "15%",
            textAlign: "center",
            outline: "none",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ fontSize: 50, mb: 1 }}>
            <img
              src="/images/star.png"
              alt="star"
              style={{ width: 60, height: 60, margin: "0 auto" }}
            />
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            mb={3}
            sx={{
              display: "inline-block",
              background:
                "linear-gradient(to right, #0CD7FF, #A837CA, #B737B5, #C6379F)",
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NFC {nfcPoints} Points !
          </Typography>

          <Button
            onClick={() => setOpenNFCPoints(false)}
            sx={{
              background: "linear-gradient(to right, #06b6d4, #9333ea)",
              color: "white",
              px: 4,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PosSystem;
