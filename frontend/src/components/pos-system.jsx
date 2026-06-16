import StarIcon from "@mui/icons-material/Star";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogContent,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
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
      setOpenReceipt(true);

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
  const downloadPOSReceipt = (r) => {
    if (!r) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 25;
    const contentW = pageW - margin * 2;

    // Background
    doc.setFillColor(8, 14, 26);
    doc.rect(0, 0, pageW, 297, "F");
    doc.setFillColor(12, 215, 255);
    doc.rect(0, 0, pageW, 2.5, "F");
    doc.setFillColor(13, 23, 45);
    doc.rect(0, 2.5, pageW, 52, "F");

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(12, 215, 255);
    doc.text("GAMEVERSE", pageW / 2, 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("GAMING LOUNGE", pageW / 2, 27, { align: "center" });
    doc.setDrawColor(30, 50, 80);
    doc.setLineWidth(0.3);
    doc.line(margin + 20, 31, pageW - margin - 20, 31);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(229, 231, 235);
    doc.text("POS PAYMENT RECEIPT", pageW / 2, 39, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Ref: #${String(r.sale?.id || "").padStart(6, "0")}`, pageW / 2, 47, { align: "center" });
    doc.setDrawColor(12, 215, 255);
    doc.setLineWidth(0.4);
    doc.line(0, 54.5, pageW, 54.5);

    // Customer detail rows
    const detailRows = [
      ["Customer Name", r.sale?.customer_name || "-"],
      ["Card Number",   r.sale?.customer_id   || "-"],
      ["Date",          dayjs().format("DD/MM/YYYY HH:mm")],
    ];

    let y = 68;
    detailRows.forEach(([label, value], idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(16, 26, 46);
        doc.rect(margin, y - 5.5, contentW, 11, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(label, margin + 4, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(229, 231, 235);
      doc.text(String(value), pageW - margin - 4, y, { align: "right" });
      y += 13;
    });

    // Items header
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("ITEMS", pageW / 2, y, { align: "center" });
    y += 6;

    r.cart.forEach((item, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(16, 26, 46);
        doc.rect(margin, y - 5.5, contentW, 11, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`${item.name} × ${item.qty}`, margin + 4, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(229, 231, 235);
      doc.text(`LKR ${Number(item.price * item.qty).toFixed(2)}`, pageW - margin - 4, y, { align: "right" });
      y += 13;
    });

    // Dashed separator
    y += 4;
    doc.setDrawColor(30, 60, 100);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(margin, y, pageW - margin, y);
    doc.setLineDashPattern([], 0);

    // Payment summary
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("PAYMENT SUMMARY", pageW / 2, y, { align: "center" });

    y += 8;
    doc.setFillColor(16, 26, 46);
    doc.rect(margin, y - 5.5, contentW, 11, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Subtotal", margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(229, 231, 235);
    doc.text(`LKR ${Number(r.subtotal || 0).toFixed(2)}`, pageW - margin - 4, y, { align: "right" });
    y += 13;

    const disc = Number(r.discount || 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Discount", margin + 4, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(disc > 0 ? 253 : 229, disc > 0 ? 196 : 231, disc > 0 ? 0 : 235);
    doc.text(`LKR ${disc.toFixed(2)}`, pageW - margin - 4, y, { align: "right" });
    y += 8;

    // Total box
    const boxW = 100;
    const boxX = (pageW - boxW) / 2;
    doc.setFillColor(10, 22, 42);
    doc.setDrawColor(12, 215, 255);
    doc.setLineWidth(0.6);
    doc.roundedRect(boxX, y, boxW, 24, 3, 3, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("TOTAL PAID", pageW / 2, y + 8, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(12, 215, 255);
    doc.text(`LKR ${Number(r.total || 0).toFixed(2)}`, pageW / 2, y + 19, { align: "center" });

    // Footer
    doc.setDrawColor(20, 35, 60);
    doc.setLineWidth(0.3);
    doc.line(margin, 272, pageW - margin, 272);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(55, 65, 81);
    doc.text("Thank you for choosing Gameverse Gaming Lounge!", pageW / 2, 279, { align: "center" });
    doc.text("We hope to see you again soon.", pageW / 2, 285, { align: "center" });
    doc.setFillColor(12, 215, 255);
    doc.rect(0, 294.5, pageW, 2.5, "F");

    doc.save(`POSReceipt_${r.sale?.id || ""}.pdf`);
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
                <Box sx={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 10, gap: 2 }}>
                  <Box sx={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #0CD7FF22, #8A38F522)", border: "1px solid #0CD7FF44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <InboxOutlinedIcon sx={{ fontSize: 34, color: "#0CD7FF" }} />
                  </Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#9CA3AF" }}>No Items Found</Typography>
                  <Typography sx={{ fontSize: 13, color: "#4B5563" }}>No products match your search</Typography>
                </Box>
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
    <Dialog
        open={openReceipt}
        onClose={() => setOpenReceipt(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            background: "#080E1A",
            color: "white",
            overflow: "hidden",
            border: "1px solid rgba(12,215,255,0.15)",
            boxShadow: "0 0 40px rgba(12,215,255,0.08)",
            maxHeight: "90vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "linear-gradient(#0CD7FF, #8A38F5)", borderRadius: "4px" },
          },
        }}
      >
        <Box>
          {/* Header */}
          <Box sx={{ background: "linear-gradient(135deg, #0CD7FF22 0%, #8A38F522 100%)", borderBottom: "1px solid rgba(12,215,255,0.2)", px: 3, pt: 3, pb: 2.5, textAlign: "center" }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #0CD7FF, #8A38F5)", mb: 1.5 }}>
              <CheckCircleIcon sx={{ color: "#fff", fontSize: 30 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 0.5 }}>
              Payment Confirmed!
            </Typography>
            <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.4 }}>GAMEVERSE GAMING LOUNGE</Typography>
            <Typography sx={{ color: "#4B5563", fontSize: 11, mt: 0.3 }}>
              Ref: #{String(receiptData?.sale?.id || "").padStart(6, "0")}
            </Typography>
          </Box>

          {/* Tear-line */}
          <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
            <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, ml: -1.2 }} />
            <Box sx={{ flex: 1, borderTop: "2px dashed rgba(255,255,255,0.08)", mx: 1 }} />
            <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, mr: -1.2 }} />
          </Box>

          {/* Customer info */}
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            {[
              { icon: <PersonIcon sx={{ fontSize: 15, color: "#4B5563" }} />, label: "Customer", value: receiptData?.sale?.customer_name || "-" },
              { icon: <CreditCardIcon sx={{ fontSize: 15, color: "#4B5563" }} />, label: "Card No", value: receiptData?.sale?.customer_id || "-" },
            ].map(({ icon, label, value }) => (
              <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {icon}
                  <Typography sx={{ color: "#6B7280", fontSize: 13 }}>{label}</Typography>
                </Box>
                <Typography sx={{ color: "#E5E7EB", fontSize: 13, fontWeight: 500 }}>{value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Items section */}
          <Box sx={{ px: 3, pt: 0.5, pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <ShoppingBagIcon sx={{ fontSize: 15, color: "#4B5563" }} />
              <Typography sx={{ color: "#6B7280", fontSize: 13 }}>Items</Typography>
            </Box>
            {receiptData?.cart?.map((item, i) => (
              <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.7, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>{item.name} × {item.qty}</Typography>
                <Typography sx={{ color: "#E5E7EB", fontSize: 12, fontWeight: 500 }}>LKR {Number(item.price * item.qty).toFixed(2)}</Typography>
              </Box>
            ))}
          </Box>

          {/* Subtotal / Discount */}
          <Box sx={{ px: 3, pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.7, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <Typography sx={{ color: "#6B7280", fontSize: 13 }}>Subtotal</Typography>
              <Typography sx={{ color: "#E5E7EB", fontSize: 13, fontWeight: 500 }}>LKR {Number(receiptData?.subtotal || 0).toFixed(2)}</Typography>
            </Box>
            {Number(receiptData?.discount || 0) > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.7, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <Typography sx={{ color: "#6B7280", fontSize: 13 }}>Discount</Typography>
                <Typography sx={{ color: "#E5E7EB", fontSize: 13, fontWeight: 500 }}>LKR {Number(receiptData.discount).toFixed(2)}</Typography>
              </Box>
            )}
          </Box>

          {/* Tear-line */}
          <Box sx={{ display: "flex", alignItems: "center", px: 1, mt: 1 }}>
            <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, ml: -1.2 }} />
            <Box sx={{ flex: 1, borderTop: "2px dashed rgba(255,255,255,0.08)", mx: 1 }} />
            <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: "#080E1A", border: "1px solid rgba(12,215,255,0.15)", flexShrink: 0, mr: -1.2 }} />
          </Box>

          {/* Total amount */}
          <Box sx={{ px: 3, pt: 2, pb: 1, textAlign: "center" }}>
            <Typography sx={{ color: "#6B7280", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", mb: 0.5 }}>
              Total Paid
            </Typography>
            <Box sx={{ display: "inline-block", background: "linear-gradient(135deg, rgba(12,215,255,0.12), rgba(138,56,245,0.12))", border: "1px solid rgba(12,215,255,0.25)", borderRadius: "12px", px: 4, py: 1.2, mt: 0.5 }}>
              <Typography sx={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: 1 }}>
                LKR {Number(receiptData?.total || 0).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {/* Buttons */}
          <Box sx={{ px: 3, pb: 3, pt: 1.5 }}>
            <Button fullWidth startIcon={<DownloadIcon />} onClick={() => downloadPOSReceipt(receiptData)}
              sx={{ background: "linear-gradient(90deg, #0CD7FF, #8A38F5)", color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 14, borderRadius: "10px", py: 1.2, "&:hover": { opacity: 0.88 } }}>
              Download Receipt
            </Button>
            <Button fullWidth onClick={() => setOpenReceipt(false)}
              sx={{ mt: 1.5, color: "#4B5563", textTransform: "none", fontSize: 13, "&:hover": { color: "#9CA3AF", background: "transparent" } }}>
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PosSystem;
