import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Popper,
  Paper,
  Modal,
  MenuItem,
  Select,
  FormControl,
  TextField,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import searchIcon from "../assets/search.png";
import scanIcon from "../assets/scan.png";
import addIcon from "../assets/plus.png";
import EditIcon from "../assets/editicon.png";
import sucessIcon from "../assets/sucessicon.png";
import AddNFCUserDialog from "./AddNFCUserDialog";

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
  const { aToken } = useContext(AdminContext);

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
  const [createSuccess, setcreateSuccess] = useState(false);
  const [editSuccess, seteditSuccess] = useState(false);

  const selectRef = useRef(null);
  const plusRef = useRef(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

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

  // ---------------- NFC USER FORM STATE ----------------
  const [nfcFormData, setNfcFormData] = useState({
    fullName: "",
    phoneNo: "",
    nicNumber: "",
  });

  const [nfcPoints, setNfcPoints] = useState(0);

  const handleCreateNFCUser = (data) => {
    console.log("New NFC User:", data);
    // TODO: send to backend if needed
    setOpenAddNFCUserDialog(false);
  };

  // NFC Dialog State
  const [openAddNFCUserDialog, setOpenAddNFCUserDialog] = useState(false);

  const handleOpenAddNFCUserDialog = () => setOpenAddNFCUserDialog(true);
  const handleCloseAddNFCUserDialog = () => setOpenAddNFCUserDialog(false);

  // Cart operations
  const addToCart = (product) => {
    // BLOCK if no stock
    if (product.stock <= 0) return;

    const exists = cart.find((p) => p.id === product.id);

    if (exists) {
      setCart(
        cart.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }

    // DECREASE STOCK
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );
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

    // INCREASE STOCK
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock + 1 } : p
      )
    );
  };

  const handleDeleteCart = (product) => {
    // Find how many were in cart
    const deletedItem = cart.find((p) => p.id === product.id);
    if (!deletedItem) return;

    // Remove from cart
    setCart(cart.filter((p) => p.id !== product.id));

    // RESTORE STOCK (all qty)
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock + deletedItem.qty } : p
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.qty || 1);
  }, 0);

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
        setcreateSuccess(true);
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
      const response = await axios.get(
        "http://localhost:8000/api/pos/get-items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching POS items:", error);
      // IMPORTANT FIX
      setProducts([]);
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
        seteditSuccess(true);
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
  // Search filter
  const searchedProducts = products.filter((p) => {
    const title = p.item_name || p.name || "";
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Category filter
  const filteredProducts =
    activeCategory === "All"
      ? searchedProducts
      : searchedProducts.filter(
          (p) =>
            (p.category || p.item_category || "").toLowerCase() ===
            activeCategory.toLowerCase()
        );

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 0;
  const total = subtotal - discount;

  // const calculatePoints = () => {
  //   let points = walkInCustomer.points;
  //   let isFirstTime = walkInCustomer.isFirstTime;

  //   if (isFirstTime) {
  //     points += 30;
  //     isFirstTime = false;
  //   }

  //   points += Math.floor(
  //     cart.reduce((acc, item) => acc + item.price * item.qty, 0) / 100
  //   );

  //   setWalkInCustomer({ ...walkInCustomer, points, isFirstTime });
  //   setNfcPoints(points);
  //   setOpenNFCPoints(true);
  // };

  return (
    <Box
      sx={{
        bgcolor: "black",
        color: "white",
        p: 2,
        //width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ---------------- FULL-WIDTH TOP HEADER ---------------- */}

      <Box sx={{ width: "100%", mb: 2 }}>
        {/* Title + Add Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 1.5,
          }}
        >
          {/* LEFT TITLE */}
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
              POS System
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#fff" }}>
              Point of Sale and Product Management
            </Typography>
          </Box>
          {/* RIGHT BUTTON */}
          <Button
            sx={{
              background: "linear-gradient(to right, #06b6d4, #9333ea)",
              color: "white",
              px: 3,
              py: 1,
              fontSize: 15,
              fontWeight: "bold",
              borderRadius: "10px",
              textTransform: "none",
            }}
            onClick={() => setOpenAddItem(true)}
          >
            + Add New Item
          </Button>
        </Box>

        {/* Categories + Search */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            //width: "100%",
            // height: 60,
            bgcolor: "#0E111B",
            p: 1,
          }}
        >
          {/* Left: Category Buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant="contained"
                onClick={() => setActiveCategory(cat)}
                sx={{
                  bgcolor: activeCategory === cat ? "#1aa6bc58" : "#1F2937",
                  border: activeCategory === cat ? "1px solid #0CD7FF" : "none",
                  color: activeCategory === cat ? "#0CD7FF" : "#A1A1A1",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#374151" },
                  minWidth: 90,
                  height: 40,
                  borderRadius: "5px",
                  px: 3,
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          {/* Right: Search Bar */}
          <TextField
            placeholder="Search items..."
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 487,
              bgcolor: "#1E293B",
              borderRadius: "8px",
              "& input": { color: "A1A1A1", paddingLeft: "8px" },
              "& fieldset": { borderColor: "#374151" },
            }}
            InputProps={{
              startAdornment: (
                <img
                  src={searchIcon}
                  alt="search"
                  style={{ width: 18, opacity: 0.7, marginRight: 6 }}
                />
              ),
            }}
          />
        </Box>
      </Box>

      {/* LEFT + RIGHT SECTIONS BELOW HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          height: "calc(100vh - 120px)", // adjust 120px if your header height differs
          overflow: "hidden",
          flexGrow: 1,
        }}
      >
        {/* LEFT SECTION: Products Grid */}
        <Box
          sx={{
            flex: 2,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: "#0E111B" },
            "&::-webkit-scrollbar-thumb": {
              background: "#3B4556",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#4A5568",
            },
          }}
        >
          <Box
            sx={{
              bgcolor: "#0E111B",
              p: 2,
              borderRadius: 2,
              //height: "100%",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              {filteredProducts.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    bgcolor: "#171E2A",
                    borderRadius: 2,
                    position: "relative",
                    minHeight: 150,
                    minWidth: 200,
                    //width: "100%",
                    border: 2,
                    borderColor: "#374151",
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={{
                          color: "#0CD7FF",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
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
                        <img
                          src={EditIcon}
                          alt="edit"
                          style={{ width: 16, height: 16 }}
                        />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="white"
                        fontSize={12}
                      >
                        {item.item_name}
                      </Typography>

                      {Number(item.loyality_price) === 1 && (
                        <IconButton size="small" disableRipple>
                          <StarIcon
                            sx={{ color: "#C6379F", width: 15, height: 14 }}
                          />
                        </IconButton>
                      )}
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="#9CA3AF" fontSize={10}>
                        {item.category}
                      </Typography>
                      <Box></Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body2"
                        color="white"
                        sx={{ mt: 1 }}
                        fontSize={12}
                      >
                        Stock: {item.stock}
                      </Typography>

                      <IconButton
                        size="small"
                        disabled={item.stock <= 0}
                        onClick={() => addToCart(item)}
                        sx={{
                          opacity: item.stock <= 0 ? 0.4 : 1,
                          pointerEvents: item.stock <= 0 ? "none" : "auto",
                        }}
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
              ))}
            </Box>
          </Box>
        </Box>

        {/* ---------------- Right Section ---------------- */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: "#0E111B" },
            "&::-webkit-scrollbar-thumb": {
              background: "#3B4556",
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#4A5568",
            },
          }}
        >
          {/* Single container for NFC + Cart */}
          <Box
            sx={{
              bgcolor: "#0E111B",
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Typography fontWeight="bold">NFC Card Number</Typography>

            {/* NFC Input Box */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#1E293B",
                borderRadius: 1.5,
                height: "34px",
                p: 1,
              }}
            >
              <TextField
                placeholder="Enter NFC Card Number"
                variant="standard"
                InputProps={{ disableUnderline: true }}
                sx={{
                  flex: 1,
                  input: { color: "#fff" },
                }}
              />

              <IconButton>
                <img src={scanIcon} />
              </IconButton>

              <IconButton onClick={handleOpenAddNFCUserDialog}>
                <img src={addIcon} width={25} height={25} alt="Add NFC User" />
              </IconButton>
              <AddNFCUserDialog
                open={openAddNFCUserDialog}
                onClose={handleCloseAddNFCUserDialog}
                onCreate={handleCreateNFCUser}
                formData={nfcFormData}
                setFormData={setNfcFormData}
              />
            </Box>

            {/* Cart Box */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                minHeight: 200,
                flexGrow: 1, // so cart box expands in container if needed
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography fontWeight={600} fontSize={16}>
                  Cart Items
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography fontSize={16} fontWeight={600}>
                    Total:
                  </Typography>
                  <Typography fontSize={16} fontWeight={600} color="#10B981">
                    {totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
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
                      height: "34px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography fontWeight={600} fontSize={14}>
                        {item.item_name}
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
                        disabled={
                          products.find((p) => p.id === item.id)?.stock <= 0
                        }
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
                mt: 2,
              }}
              onClick={handleCheckoutOpenWithValidation}
            >
              Checkout
            </Button>
          </Box>
        </Box>
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
          {/* Header */}
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

          {/* Form Fields */}
          <Box
            mt={1}
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{ color: "#374151" }}
          >
            {/* Category Selector */}
            <Typography variant="body2" sx={{ color: "white" }}>
              Category
            </Typography>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={newItem.category}
                onChange={(e) => {
                  if (e.target.value === "Other") {
                    setShowNewCategory(true); // open popup modal
                  } else {
                    setNewItem({ ...newItem, category: e.target.value });
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#0E111B",
                      color: "white",
                      border: "1px solid #1F2937",
                      borderRadius: "8px",
                      mt: 1,
                      "& .MuiMenuItem-root": {
                        color: "#9CA3AF",
                        fontSize: "0.9rem",
                        "&:hover": { backgroundColor: "#1E293B" },
                      },
                    },
                  },
                }}
                sx={{
                  bgcolor: "#0E111B",
                  color: "white",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#374151",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#6B7280",
                  },
                  "& .MuiSvgIcon-root": { color: "#9CA3AF" },
                }}
                renderValue={(selected) =>
                  !selected ? "Select Category" : selected
                }
              >
                {["Drinks", "Snacks", "Dessert", "Ice Cream"].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
                <MenuItem
                  value="Other"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#9CA3AF",
                  }}
                >
                  Other category
                  <Typography
                    component="span"
                    sx={{
                      color: "#9CA3AF",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      ml: 1,
                    }}
                  >
                    +
                  </Typography>
                </MenuItem>
              </Select>
            </FormControl>

            {/* ---------------- Popup Box for "Other Category" ---------------- */}
            <Modal
              open={showNewCategory}
              onClose={() => setShowNewCategory(false)}
            >
              <Box
                sx={{
                  bgcolor: "#0E111B",
                  color: "white",
                  borderRadius: 2,
                  p: 3,
                  width: 250,
                  mx: "auto",
                  mt: "25vh",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  boxShadow: "0px 0px 20px rgba(0,0,0,0.6)",
                  border: "1px solid #1F2937",
                }}
              >
                <Typography fontSize={14} color="#9CA3AF">
                  Category
                </Typography>
                <TextField
                  placeholder="Enter Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#374151" },
                      "&:hover fieldset": { borderColor: "#6B7280" },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#9CA3AF",
                      opacity: 1,
                    },
                    "& .MuiInputBase-root": {
                      bgcolor: "#171C2D",
                      borderRadius: 1,
                      height: 40,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    handleAddCategory();
                    setShowNewCategory(false);
                  }}
                  disabled={!newCategory.trim()}
                  sx={{
                    background: "linear-gradient(to right, #06b6d4, #9333ea)",
                    textTransform: "none",
                    height: 36,
                    borderRadius: 1,
                  }}
                >
                  Add
                </Button>
              </Box>
            </Modal>

            {/* Item Name */}
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
                "& .MuiInputLabel-root": { color: "#9CA3AF" },
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
                "& .MuiInputLabel-root": { color: "#9CA3AF" },
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
                setNewItem({ ...newItem, stock: Number(e.target.value) })
              }
              fullWidth
              variant="outlined"
              sx={{
                ...textFieldSx,
                "& .MuiInputLabel-root": { color: "#9CA3AF" },
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
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                      {option}
                    </Typography>
                    <Radio
                      value={option}
                      checked={newItem.loyalty === option}
                      onChange={(e) =>
                        setNewItem({ ...newItem, loyalty: e.target.value })
                      }
                      sx={{
                        color: "gray",
                        "&.Mui-checked": { color: "#9CA3AF" },
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>
            </Box>

            {/* Buttons */}
            <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1e293b",
                  "&:hover": { bgcolor: "#334155" },
                  color: "white",
                }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddNewItem}
                sx={{
                  background: "linear-gradient(to right, #06b6d4, #9333ea)",
                  textTransform: "none",
                }}
              >
                Add Item
              </Button>
            </Box>
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

          <Box
            mt={1}
            display="flex"
            flexDirection="column"
            gap={0.9}
            sx={{ color: "#374151" }}
          >
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
            <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#1e293b",
                  "&:hover": { bgcolor: "#334155" },
                  color: "white",
                }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleUpdateItem}
                sx={{
                  background: "linear-gradient(to right, #06b6d4, #9333ea)",
                  textTransform: "none",
                }}
              >
                Edit
              </Button>
            </Box>
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
                setOpenAddItem(false);
                setOpenEditItem(false);
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
            borderRadius: 3,
            width: 380,
            mx: "auto",
            mt: "6%",
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
          <Box display="flex" alignItems="center" gap={2} mt={3}>
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
                fontSize: 20,
              }}
            >
              {(walkInCustomer?.name || "Alex Chen")[0].toUpperCase()}
            </Box>
            <Box>
              <Typography fontWeight="500">
                {walkInCustomer?.name || "Alex Chen"}
              </Typography>
              <Typography variant="body2" color="gray">
                {walkInCustomer?.phone || "GV001234"}
              </Typography>
            </Box>
          </Box>

          {/* Totals */}
          <Box mt={3}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Total:</Typography>
              <Typography fontWeight="400">
                LKR {Number(subtotal).toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Discount</Typography>
              {/* <Typography>LKR {Number(discount).toFixed(2)}</Typography> */}
              <Typography color="#94A3B8">.................</Typography>
            </Box>
            <Box borderBottom="1px solid #334155" my={2} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
              }}
            >
              <Typography fontWeight="600">Balance:</Typography>
              <Typography fontWeight="400" sx={{ color: "#38BDF8" }}>
                LKR {Number(total).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Pay Button */}
          <Box mt={4}>
            <Button
              fullWidth
              sx={{
                py: 1,
                fontWeight: "bold",
                borderRadius: 2,
                background: "linear-gradient(90deg, #05DFFF, #BC0BFF)",
                color: "white",
                textTransform: "none",
                fontSize: 16,
                "&:hover": { opacity: 0.95 },
              }}
              onClick={() => setOpenPaymentSuccess(true)}
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
              src={sucessIcon}
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

      {/* create success model */}
      <Dialog
        open={createSuccess}
        PaperProps={{
          sx: {
            backgroundColor: "#070F1E",
            color: "white",
            width: "400px",
            padding: "20px",
            borderRadius: "12px",
            border: "2px solid #0aaffb59",
            //boxShadow: "0px 0px 30px rgba(8, 0, 255, 0.39)", // green glow
            textAlign: "center",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "600",
            background: "linear-gradient(to right, #1963f6d0, #e428edff)",
            WebkitBackgroundClip: "text",
            fontSize: "24px",
            WebkitTextFillColor: "transparent",
          }}
        >
          <img
            src="/images/successu.png"
            alt="success"
            width="80"
            height={80}
            style={{ marginBottom: 8 }}
          />
          <br />
          Item Added Successful !
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => setcreateSuccess(false)}
            sx={{
              background: "linear-gradient(to right, #2287a3d0, #8a38f557)",
              color: "#fff",
              width: "150px",
              textTransform: "none",
              "&:hover": { opacity: 0.9 },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit success model */}
      <Dialog
        open={editSuccess}
        PaperProps={{
          sx: {
            backgroundColor: "#070F1E",
            color: "white",
            width: "400px",
            padding: "20px",
            borderRadius: "12px",
            border: "2px solid #0aaffb59",
            //boxShadow: "0px 0px 30px rgba(8, 0, 255, 0.39)", // green glow
            textAlign: "center",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "600",
            background: "linear-gradient(to right, #1963f6d0, #e428edff)",
            WebkitBackgroundClip: "text",
            fontSize: "24px",
            WebkitTextFillColor: "transparent",
          }}
        >
          <img
            src="/images/successu.png"
            alt="success"
            width="80"
            height={80}
            style={{ marginBottom: 8 }}
          />
          <br />
          Update Successful !
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={() => seteditSuccess(false)}
            sx={{
              background: "linear-gradient(to right, #2287a3d0, #8a38f557)",
              color: "#fff",
              width: "150px",
              textTransform: "none",
              "&:hover": { opacity: 0.9 },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PosSystem;
