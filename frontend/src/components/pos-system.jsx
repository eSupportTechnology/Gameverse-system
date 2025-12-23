import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditIcon from "../assets/editicon.png";
import addIcon from "../assets/plus.png";
import scanIcon from "../assets/scan.png";
import searchIcon from "../assets/search.png";
import sucessIcon from "../assets/sucessicon.png";
import { AdminContext } from "../context/AdminContext";
import AddEditItemModal from "./AddEditItemModal";
import CancelPopup from "./CancelPopup";
import CheckoutModal from "./CheckoutModal";
import SuccessPopup from "./ItemAddSuccessPopup";
import PaymentSuccessPopup from "./paymentsuccess";
import RightSection from "./RightSectionPos";
import UpdateSuccessDialog from "./UpdateSuccess";

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
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openCancelConfirm, setOpenCancelConfirm] = useState(false);
  const [openPaymentSuccess, setOpenPaymentSuccess] = useState(false);
  const [createSuccess, setcreateSuccess] = useState(false);
  const [editSuccess, seteditSuccess] = useState(false);
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
  const [nfcFormData, setNfcFormData] = useState({
    fullName: "",
    phoneNo: "",
    nicNumber: "",
  });

  // NFC Dialog State
  const [openAddNFCUserDialog, setOpenAddNFCUserDialog] = useState(false);

  const handleOpenAddNFCUserDialog = () => setOpenAddNFCUserDialog(true);
  const handleCloseAddNFCUserDialog = () => setOpenAddNFCUserDialog(false);


  
  // Cart operations
  const fetchCart = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/cart");

    if (res.data.success) {
      setCart(
        res.data.data.map((c) => ({
          id: c.pos_item.id,
          name: c.pos_item.item_name,
          price: c.pos_item.price,
          qty: c.quantity,          
        }))
      );
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchItems();
  fetchCart();
}, []);

const addToCart = async (item) => {
  try {
    await axios.post("http://localhost:8000/api/cart/add", {
      pos_item_id: item.id,
    });

    // refresh stock
    fetchItems(); 
     // refresh cart
    fetchCart(); 
  } catch (err) {
    toast.error(err.response?.data?.message || "Out of stock");
  }
};

const removeFromCart = async (item) => {
  await axios.post("http://localhost:8000/api/cart/decrease", {
    pos_item_id: item.id,
  });

  fetchItems();
  fetchCart();
};
const handleDeleteCart = async (item) => {
  await axios.post("http://localhost:8000/api/cart/remove", {
    pos_item_id: item.id,
  });

  fetchItems();
  fetchCart();
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
    const token = localStorage.getItem("aToken");

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
    setProducts([]); // safety
  } finally {
    setLoading(false);
  }
};


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

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewItem({ ...newItem, category: newCategory });
      setNewCategory("");
      setShowNewCategory(false);
    }
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

  const handleCancelConfirm = () => {
    setOpenCancelConfirm(false);
    setOpenAddItem(false);
    setOpenEditItem(false);
  };

  const handleCreateNFCUser = async (formData) => {
    try {
      const payload = {
        nfc_card_number: formData.nfcCardNumber,
        full_name: formData.fullName,
        phone_no: formData.phoneNo,
        nic_number: formData.nicNumber,
        active_user: formData.activeUser,
      };

      const response = await axios.post(
        "http://localhost:8000/api/nfc-users",
        payload,
        { headers: { Authorization: `Bearer ${aToken}` } }
      );

      if (response.status === 201) {
        toast.success("NFC User added successfully");
        setNfcFormData({
          nfcCardNumber: "",
          fullName: "",
          phoneNo: "",
          nicNumber: "",
          activeUser: true,
        });
        setOpenAddNFCUserDialog(false);
      }
    } catch (err) {
      console.error(err.response?.data);
      toast.error(err.response?.data?.message || "Failed to add NFC user");
    }
  };

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
          p.category &&
          p.category.toLowerCase() === activeCategory.toLowerCase()
      );


  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = 0;
  const total = subtotal - discount;


  const handlePayNow = async () => {
  try {
    await axios.post("http://localhost:8000/api/pos/checkout");

    setOpenCheckout(false);
    setOpenPaymentSuccess(true);

    fetchCart();   // 🔥 cart must be empty now
    fetchItems();  // 🔥 stock refreshed
  } catch (err) {
    toast.error(err.response?.data?.message || "Checkout failed");
  }
};

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
              {filteredProducts.length === 0 && (
  <Typography color="gray" textAlign="center">
    No items found
  </Typography>
)}

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

        <RightSection
          scanIcon={scanIcon}
          addIcon={addIcon}
          openAddNFCUserDialog={openAddNFCUserDialog}
          handleOpenAddNFCUserDialog={handleOpenAddNFCUserDialog}
          handleCloseAddNFCUserDialog={handleCloseAddNFCUserDialog}
          nfcFormData={nfcFormData}
          setNfcFormData={setNfcFormData}
          cart={cart}
          totalPrice={totalPrice}
          products={products}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          handleDeleteCart={handleDeleteCart}
          handleCheckoutOpenWithValidation={handleCheckoutOpenWithValidation}
          handleCreateNFCUser={handleCreateNFCUser}
        />
      </Box>

      <AddEditItemModal
        open={openAddItem}
        onClose={handleAddItemClose}
        mode="add"
        newItem={newItem}
        setNewItem={setNewItem}
        categories={categories}
        showNewCategory={showNewCategory}
        setShowNewCategory={setShowNewCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        handleSubmit={handleAddNewItem}
        handleCancelClick={handleCancelClick}
        textFieldSx={textFieldSx}
      />

      <AddEditItemModal
        open={openEditItem}
        onClose={handleEditItemClose}
        mode="edit"
        newItem={newItem}
        setNewItem={setNewItem}
        categories={categories}
        showNewCategory={showNewCategory}
        setShowNewCategory={setShowNewCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        handleSubmit={handleUpdateItem}
        handleCancelClick={handleCancelClick}
        textFieldSx={textFieldSx}
      />

      <CancelPopup
        open={openCancelConfirm}
        handleCancelClose={handleCancelClose}
        handleConfirm={handleCancelConfirm}
      />

      <CheckoutModal
        open={openCheckout}
        onClose={handleCheckoutClose}
        // customerName="Alex Chen"
        // customerId="GV001234"
        subtotal={subtotal}
        total={total}
        onPayNow={handlePayNow}
      />

      <PaymentSuccessPopup
        open={openPaymentSuccess}
        onClose={() => setOpenPaymentSuccess(false)}
        icon={sucessIcon}
      />

      <SuccessPopup
        open={createSuccess}
        onClose={() => setcreateSuccess(false)}
      />
      <UpdateSuccessDialog
        open={editSuccess}
        onClose={() => seteditSuccess(false)}
      />
    </Box>
  );
};

export default PosSystem;
