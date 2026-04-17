import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
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
import { API_BASE_URL } from "../apiConfig";
import { AppContext } from "../context/AppContext";
import jsPDF from "jspdf";
import dayjs from "dayjs";

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
  const { globalSearch } = useContext(AppContext);

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
    email: "",
  });
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [scannedCardNumber, setScannedCardNumber] = useState("");

  // NFC Dialog State
  const [openAddNFCUserDialog, setOpenAddNFCUserDialog] = useState(false);

  const handleOpenAddNFCUserDialog = () => setOpenAddNFCUserDialog(true);
  const handleCloseAddNFCUserDialog = () => setOpenAddNFCUserDialog(false);
  const [rewards, setRewards] = useState({});
  const [selectedRewards, setSelectedRewards] = useState({});
  const [openReceipt, setOpenReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  // Cart operations
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart`);

      if (res.data.success) {
        setCart(
          res.data.data.map((c) => ({
            id: c.pos_item.id,
            name: c.pos_item.item_name,
            price: c.pos_item.price,
            qty: c.quantity,
          })),
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
      await axios.post(`${API_BASE_URL}/api/cart/add`, {
        pos_item_id: item.id,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, stock: Number(p.stock) - 1 } : p,
        ),
      );

      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Out of stock");
    }
  };

  const removeFromCart = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/api/cart/decrease`, {
        pos_item_id: item.id,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, stock: Number(p.stock) + 1 } : p,
        ),
      );

      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove from cart");
    }
  };

  const handleDeleteCart = async (item) => {
    try {
      await axios.post(`${API_BASE_URL}/api/cart/remove`, {
        pos_item_id: item.id,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, stock: Number(p.stock) + Number(item.qty) }
            : p,
        ),
      );

      setCart((prev) => prev.filter((c) => c.id !== item.id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete cart item");
    }
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
        `${API_BASE_URL}/api/pos/add-items`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
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

      const response = await axios.get(`${API_BASE_URL}/api/pos/get-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  const fetchRewards = async (cardNo) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/pos-rewards/${cardNo}`);
      if (res.data.success) {
        setRewards(res.data.data || {});
      }
    } catch (err) {
      console.error("Failed to fetch rewards");
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
        `${API_BASE_URL}/api/pos/update-item/${selectedItem.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
        },
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
        `${API_BASE_URL}/api/nfc-users`,
        payload,
        { headers: { Authorization: `Bearer ${aToken}` } },
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
    const title = (p.item_name || "").toLowerCase();

    const matchLocal = !searchTerm || title.includes(searchTerm.toLowerCase());

    const matchGlobal =
      !globalSearch || title.includes(globalSearch.toLowerCase());

    return matchLocal && matchGlobal;
  });

  // Category filter
  const filteredProducts =
    activeCategory === "All"
      ? searchedProducts
      : searchedProducts.filter(
          (p) =>
            p.category &&
            p.category.toLowerCase() === activeCategory.toLowerCase(),
        );

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const total = Math.max(subtotal - Number(discount || 0), 0);

  const handlePayNow = async () => {
    try {
      const saleResponse = await axios.post(
        `${API_BASE_URL}/api/pos/checkout`,
        {
          customer_name: customerName,
          customer_id: customerId,
          discount: discount,
          email: nfcFormData.email,
          used_reward:
            Object.keys(selectedRewards).length > 0 ? selectedRewards : null,
        },
      );

      const saleData = saleResponse.data?.data;
      const saleId = saleData?.id;

      for (let type in selectedRewards) {
        await axios.post(`${API_BASE_URL}/api/pos-use-reward`, {
          card_no: customerId,
          type,
          sale_id: saleId,
        });
      }

      setReceiptData({
        sale: saleData,
        cart: [...cart],
        subtotal,
        discount,
        total,
      });

      setOpenCheckout(false);
      setOpenPaymentSuccess(true);

      fetchCart();
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };
  const wsRef = useRef(null);

  const fetchUserByCardUID = async (cardUID) => {
    try {
      const token = localStorage.getItem("aToken");

      const res = await axios.get(
        `${API_BASE_URL}/api/nfc-users/by-card/${cardUID}`,
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        },
      );

      if (res.data.success && res.data.data) {
        const user = res.data.data;

        setNfcFormData({
          fullName: user.full_name,
          phoneNo: user.phone_no,
          nicNumber: user.nic_number,
          nfcCardNumber: cardUID,
          email: user.email,
          avatar: user.avatar ? `${API_BASE_URL}/storage/${user.avatar}` : "",
        });
        await fetchRewards(cardUID);

        setCustomerName(user.full_name);
        setCustomerId(user.nfc_card_number || cardUID);
        setScannedCardNumber(cardUID);
      } else {
        setNfcFormData({
          fullName: "",
          phoneNo: "",
          nicNumber: "",
          nfcCardNumber: cardUID,
          avatar: "",
        });
        await fetchRewards(cardUID);

        setCustomerName("");
        setCustomerId(cardUID);
        setScannedCardNumber(cardUID);
      }
    } catch (err) {
      console.error("Failed to fetch NFC user:", err);
      setScannedCardNumber(cardUID);
    }
  };
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:6789");
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connected (Parent)");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.action === "card_detected") {
        const cardUID = msg.uid.replace(/\s/g, ":");

        fetchUserByCardUID(cardUID);
      }

      if (msg.action === "write_result") {
        if (msg.success) {
          toast.success("Data written to card successfully!");
          fetchUserByCardUID(msg.userId);
        } else {
          toast.error("Failed to write to card");
        }
      }
    };

    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []);
  console.log(rewards);
  const downloadPOSReceipt = (saleData, cartItems) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("POS Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Sale ID: ${saleData.id}`, 20, 35);
    doc.text(`Customer: ${saleData.customer_name || "-"}`, 20, 45);
    doc.text(`Card: ${saleData.customer_id || "-"}`, 20, 55);
    doc.text(`Date: ${dayjs().format("DD/MM/YYYY HH:mm")}`, 20, 65);

    let y = 80;

    doc.text("Items:", 20, y);
    y += 10;

    cartItems.forEach((item) => {
      doc.text(
        `${item.name} x${item.qty} = LKR ${item.price * item.qty}`,
        20,
        y,
      );
      y += 10;
    });

    y += 10;

    const total = cartItems.reduce(
      (sum, i) => sum + i.price * i.qty,
      0,
    );

    doc.setFontSize(14);
    doc.text(`TOTAL: LKR ${total.toFixed(2)}`, 20, y);

    doc.save(`POS_Receipt_${saleData.id}.pdf`);
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
              "& input": { color: "white", paddingLeft: "8px" },
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
          aToken={aToken}
          setCart={setCart}
          setProducts={setProducts}
          rewards={rewards}
          selectedRewards={selectedRewards} // track selected rewards
          setSelectedRewards={setSelectedRewards}
          scanIcon={scanIcon}
          addIcon={addIcon}
          openAddNFCUserDialog={openAddNFCUserDialog}
          handleOpenAddNFCUserDialog={handleOpenAddNFCUserDialog}
          handleCloseAddNFCUserDialog={handleCloseAddNFCUserDialog}
          nfcFormData={nfcFormData}
          setNfcFormData={setNfcFormData}
          scannedCardNumber={scannedCardNumber}
          setScannedCardNumber={setScannedCardNumber}
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
        customer={{
          name: customerName,
          cardNumber: scannedCardNumber,
          avatar: nfcFormData.avatar,
        }}
        discount={discount}
        setDiscount={setDiscount}
        subtotal={subtotal}
        total={total}
        onPayNow={handlePayNow}
        setCustomerName={setCustomerName}
        setCustomerId={setCustomerId}
      />

      <PaymentSuccessPopup
        open={openPaymentSuccess}
        onClose={() => {setOpenPaymentSuccess(false);
          setOpenReceipt(true);}}
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
    <Dialog
        open={openReceipt}
        onClose={() => setOpenReceipt(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "#0F172A",
            color: "white",
            p: 2,
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 20,
            textAlign: "center",
            color: "#E5E7EB",
          }}
        >
          POS Receipt
        </DialogTitle>

        <DialogContent>
          {receiptData && (
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                mb: 3,
              }}
            >
              {[
                ["Sale ID", receiptData.sale?.id || "-"],
                ["Customer Name", receiptData.sale?.customer_name || "-"],
                ["Card Number", receiptData.sale?.customer_id || "-"],
                [
                  "Date",
                  dayjs().format("DD/MM/YYYY HH:mm"),
                ],
              ].map(([label, value]) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.2,
                  }}
                >
                  <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: 14 }}>
                    {value}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

              {/* ITEMS (same style as bookings list) */}
              {receiptData.cart.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.2,
                  }}
                >
                  <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                    {item.name} x{item.qty}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: 14 }}>
                    LKR {item.price * item.qty}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.1)" }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                  Subtotal
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: 14 }}>
                  LKR {receiptData.subtotal}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                  Discount
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: 14 }}>
                  LKR {receiptData.discount}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Typography sx={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>
                  Total
                </Typography>
                <Typography sx={{ color: "#22C55E", fontSize: 15, fontWeight: 600 }}>
                  LKR {receiptData.total}
                </Typography>
              </Box>

              <Button
                fullWidth
                onClick={() =>
                  downloadPOSReceipt(receiptData.sale, receiptData.cart)
                }
                sx={{
                  mt: 3,
                  backgroundColor: "transparent",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 999,
                  py: 1.2,
                  border: "1px solid rgba(255,255,255,0.7)",
                  "&:hover": {
                    backgroundColor: "#16A34A",
                    border: "1px solid #16A34A",
                  },
                }}
              >
                Download Receipt
              </Button>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenReceipt(false)}
            sx={{
              px: 5,
              borderRadius: "8px",
              textTransform: "none",
              background: "#1F2937",
              color: "white",
              "&:hover": { background: "#374151" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PosSystem;
