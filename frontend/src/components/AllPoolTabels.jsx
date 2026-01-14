import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AllPool } from "../assets/assets";
import CloseIcon from "@mui/icons-material/Close";
import upload from "../assets/upload.png";
import EditIcon from "../assets/editicon.png";
import ThumbnailUpdate from "./ThumbnailUpdate";
import UpdateSuccessDialog from "./UpdateSuccess";
import CancelPopup from "./CancelPopup";
import RemovePopup from "./RemovePopup";
import backArrow from "../assets/back_arrow.png";
import { addPoolTable, updatePoolTable, deleteSimulator } from "../api";
import { toast } from "react-toastify";
import axios from "axios";
import poolImg from "../assets/superme_billiard_1.jpg";
import { API_BASE_URL } from "../apiConfig";

const AllPoolTabels = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState([]);
  const [openAddPool, setOpenAddPool] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // add | edit
  const [editIndex, setEditIndex] = useState(null);

  // form fields
  const [tableName, setTableName] = useState("");
  const [location, setLocation] = useState("");
  // const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [openAddSuccess, setOpenAddSuccess] = useState(false);
  const [addMessage, setAddMessage] = useState("");
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const [removeMessage, setRemoveMessage] = useState("");
  const [poolToRemove, setPoolToRemove] = useState(null);
  const [removePool, setRemovePool] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(URL.createObjectURL(file));
    setThumbnailFile(file);
  };

  React.useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stations`);
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setPools(data.filter((s) => s.type === "Pool"));
    } catch (err) {
      console.error(err);
    }
  };

  // open ADD dialog
  const handleAdd = () => {
    setDialogMode("add");
    setTableName("");
    // setDescription("");
    setPrice("");
    setTime("30 Min");
    setThumbnail(null);
    setThumbnailFile(null);

    setOpenAddPool(true);
  };

  // open EDIT dialog
  const handleEdit = (item, index) => {
    setDialogMode("edit");
    setEditIndex(index);

    setTableName(item.name);
    setLocation(item.location);
    // setDescription(item.description);
    setPrice(item.price);
    setTime(item.time === 60 ? "1 Hour" : "30 Min");
    setThumbnail(
      item.thumbnail ? `${API_BASE_URL}/storage/${item.thumbnail}` : null
    );
    setThumbnailFile(null);

    setOpenAddPool(true);
  };

  // save Pool (Add or Update)
  const handleSave = async () => {
    // Validation
    if (!tableName || !price) {
      return alert("Please fill all required fields");
    }

    // Convert time strings to minutes
    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      if (timeStr.includes("Hour")) return 60;
      return 30; // default to 30 minutes
    };

    const payload = {
      name: tableName,
      location: location,
      // description: description,
      price: price,
      time: parseTime(time),
      type: "Pool",
    };

    const form = new FormData();
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== "") {
        form.append(key, payload[key]);
      }
    }

    if (thumbnailFile) {
      form.append("thumbnail", thumbnailFile);
    }

    try {
      let url = `${API_BASE_URL}/api/stations`;
      let method = "POST";

      if (dialogMode === "edit") {
        const id = pools[editIndex].id;
        url = `${API_BASE_URL}/api/stations/${id}`;
        form.append("_method", "PUT"); // for Laravel to handle PUT
        method = "POST";
      }

      const token = localStorage.getItem("aToken");

      const res = await axios({
        method,
        url,
        data: form,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        `Table ${dialogMode === "edit" ? "updated" : "created"} successfully!`
      );
      setOpenAddPool(false);
      fetchPools(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save table. Make sure you are logged in."
      );
    }
  };

  const handleCancelConfirm = async () => {
    setCancelOpen(false);
    setOpenAddPool(false);
  };

  // delete pool table
  const handleRemove = (index) => {
    setPoolToRemove(index);
    setRemoveMessage("Are you want to remove this Table?");
    setRemovePool(true);
  };

  const removeConfirm = async () => {
    try {
      const id = pools[poolToRemove].id;
      await deleteSimulator(id);
      setRemovePool(false);
      setPoolToRemove(null);
      fetchPools();
    } catch (err) {
      console.error(err);
      alert("Failed to delete table.");
    }
  };

  const cancelRemove = () => {
    setRemovePool(false);
    setPoolToRemove(null);
  };

  return (
    <div>
      <Box
        sx={{
          p: 2,
          bgcolor: "1E1E1E",
          color: "#fff",
          minHeight: "100vh",
          overflowX: "hidden",
          ml: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Typography variant="h5" fontWeight="bold" fontSize={24}>
              Website Management{" "}
            </Typography>
            <Typography variant="body2" color="gray" fontSize={16}>
              Manage Website
            </Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row", md: "row" }}
          justifyContent={{
            xs: "flex-start",
            sm: "space-between",
            md: "space-between",
          }}
          px={1.5}
          py={1.5}
          borderRadius="10px"
          bgcolor="#0E111B"
          alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
          mb={2}
          gap={1}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* BACK BUTTON */}
            <Button
              onClick={() => navigate(-1)}
              sx={{
                bgcolor: "#1F2937",
                color: "#9CA3AF",
                padding: "10px 16px",
                minWidth: "40px",
                borderRadius: "4px",
                textTransform: "none",
                "&:hover": { bgcolor: "#1F2937" },
              }}
            >
              <img src={backArrow} alt="back-icon" />
            </Button>

            {/* CATEGORY BUTTON */}
            <Button
              sx={{
                bgcolor: "rgba(12, 215, 255, 0.3)",
                border: "1px solid #0CD7FF",
                color: "#0CD7FF",
                padding: "8px 20px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: "8px",
                "&:hover": { bgcolor: "rgba(12, 215, 255, 0.3)" },
              }}
            >
              All Pool Tables
            </Button>
          </Box>

          <Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                borderRadius: "6px",
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": {
                  background: "linear-gradient(to right, #0bbfe0, #732ed1)",
                },
              }}
              onClick={handleAdd}
            >
              + Add Pool Table
            </Button>
          </Box>
        </Box>

        {/* Card sections */}
        <Box
          sx={{
            height: 510,
            backgroundColor: "#0E111B",
            borderRadius: "10px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#374151",
              borderRadius: "10px",
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
              p: 2,
              alignItems: "stretch",
            }}
          >
            {pools.map((item, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* EDIT ICON BUTTON */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    backgroundColor: "#C500FFCC",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={() => handleEdit(item, index)}
                >
                  <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                </Box>

                <Box
                  sx={{
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    height: 360,
                    border: "1px solid transparent",
                    backgroundImage:
                      "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#000000",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: "12px",
                    }}
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        item.thumbnail
                          ? `${API_BASE_URL}/storage/${item.thumbnail}`
                          : poolImg
                      }
                      alt={item.name || "Pool Image"}
                      style={{
                        width: "100%",
                        height: "190px",
                        objectFit: "cover",
                      }}
                    />

                    {/* TEXT CONTENT */}
                    <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "white",
                        }}
                      >
                        {item.name}
                      </h3>
                      {/* <p style={{ fontSize: "14px", fontWeight: "300", marginTop: "8px", color: "#FFFFFF" }}>
                        {item.description}
                      </p> */}
                    </Box>
                  </Box>
                </Box>

                {/* BUTTON */}
                <Box sx={{ py: 2 }}>
                  <button
                    className="card-button-red"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ADD Pool Dialog */}
        {/* Dialog */}
        <Dialog
          open={openAddPool}
          onClose={() => setOpenAddPool(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: "#111827",
              color: "white",
              borderRadius: "12px",
              border: "0.5px solid #374151",
            },
          }}
        >
          <DialogTitle
            sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
          >
            {dialogMode === "add"
              ? "Add Pool Table Details"
              : "Edit Pool Table Details"}
            <IconButton
              onClick={() => setOpenAddPool(false)}
              sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              // maxHeight: "70vh",
              // overflowY: "auto",

              /* Scrollbar styling */
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#4B5563",
                borderRadius: "10px",
              },
            }}
          >
            {/* Pool Name */}
            <p style={{ marginBottom: 6, fontSize: "14px", fontWeight: 500 }}>
              Station Name
            </p>
            <TextField
              select
              fullWidth
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Select Station"
              InputProps={{
                sx: {
                  backgroundColor: "#171C2D",
                  borderRadius: "8px",
                  color: "white",
                  border: "0.5px solid #374151",
                  "& .MuiSelect-select": {
                    color: "white",
                    padding: "12px 14px",
                    fontSize: 14,
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Station
              </MenuItem>

              {/* PS5 Stations */}
              <MenuItem value="PS5 Station 1">PS5 Station 1</MenuItem>
              <MenuItem value="PS5 Station 2">PS5 Station 2</MenuItem>
              <MenuItem value="PS5 Station 3">PS5 Station 3</MenuItem>
              <MenuItem value="PS5 Station 4">PS5 Station 4</MenuItem>
              <MenuItem value="PS5 Station 5">PS5 Station 5</MenuItem>

              {/* Racing Simulators */}
              <MenuItem value="Racing Simulator 1">Racing Simulator 1</MenuItem>
              <MenuItem value="Racing Simulator 2">Racing Simulator 2</MenuItem>
              <MenuItem value="Racing Simulator 3">Racing Simulator 3</MenuItem>
              <MenuItem value="Racing Simulator 4">Racing Simulator 4</MenuItem>

              {/* Supreme Billiards */}
              <MenuItem value="Supreme Billiard 1">Supreme Billiard 1</MenuItem>
              <MenuItem value="Supreme Billiard 2">Supreme Billiard 2</MenuItem>

              {/* Premium Billiards */}
              <MenuItem value="Premium Billiard 1">Premium Billiard 1</MenuItem>
              <MenuItem value="Premium Billiard 2">Premium Billiard 2</MenuItem>
              <MenuItem value="Premium Billiard 3">Premium Billiard 3</MenuItem>
            </TextField>
            {/* Location */}
            <p style={{ marginBottom: 6, fontSize: "14px", fontWeight: 500 }}>
              Location
            </p>
            <TextField
              fullWidth
              placeholder="Enter Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#171C2D",
                  borderRadius: "8px",
                  color: "white",
                  border: "0.5px solid #374151",
                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    fontSize: "14px",
                  },
                },
              }}
            />

            {/* Description */}
            {/* <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Description</p>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Short Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#171C2D",
                  borderRadius: "8px",
                  color: "white",
                  border: "0.5px solid #374151",

                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                },
              }}
            /> */}

            {/* Pricing Normal */}
            <Box sx={{ mt: 2 }}>
              <p style={{ marginBottom: 1, fontSize: "14px", fontWeight: 500 }}>
                Pricing Details (Normal)
              </p>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                {/* TIME */}
                <Box sx={{ flex: 1 }}>
                  <p
                    style={{
                      marginBottom: 6,
                      fontSize: 12,
                      fontWeight: 200,
                      color: "#9CA3AF",
                    }}
                  >
                    Time
                  </p>

                  <TextField
                    select
                    fullWidth
                    defaultValue="30 Min"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root fieldset": {
                        borderColor: "#374151",
                      },
                      "& .MuiSelect-select": { color: "#9CA3AF" },
                      "& .MuiOutlinedInput-root": { height: 45 }, // align height
                    }}
                  >
                    <MenuItem value="30 Min">30 Min</MenuItem>
                    <MenuItem value="1 Hour">1 Hour</MenuItem>
                  </TextField>
                </Box>

                {/* PRICE */}
                <Box sx={{ flex: 1 }}>
                  <p
                    style={{
                      marginBottom: 6,
                      fontSize: 12,
                      fontWeight: 200,
                      color: "#9CA3AF",
                    }}
                  >
                    Price
                  </p>

                  <TextField
                    fullWidth
                    placeholder="LKR 000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    sx={{
                      input: { color: "white" },
                      "& .MuiOutlinedInput-root fieldset": {
                        borderColor: "#374151",
                      },
                      "& .MuiOutlinedInput-root": { height: 45 },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Thumbnail Upload */}
            <p
              style={{
                marginTop: 15,
                marginBottom: 6,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Thumbnail
            </p>
            <Box
              sx={{
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                height: 190,
                border: "0.5px solid #374151",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#aaa",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />

              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <img src={upload} style={{ width: 30, marginBottom: 6 }} />
                  Upload thumbnail
                </>
              )}
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                onClick={() => setCancelOpen(true)}
                sx={{
                  flex: 1,
                  borderRadius: "4px",
                  backgroundColor: "#1A1D2A",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  "&:hover": {
                    backgroundColor: "#3B4859",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  flex: 1,
                  textTransform: "none",
                  borderRadius: "4px",
                  background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  "&:hover": {
                    background: "linear-gradient(to right, #8A38F5, #0CD7FF)",
                  },
                }}
              >
                {dialogMode === "add" ? "Add" : "Update"}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>

      {/* Table add success dialog */}
      <ThumbnailUpdate
        open={openAddSuccess}
        onClose={() => setOpenAddSuccess(false)}
        message={addMessage}
      />

      {/* update success dialog */}
      <UpdateSuccessDialog
        open={openUpdateSuccess}
        onClose={() => setOpenUpdateSuccess(false)}
      />

      {/* cancel popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleCancelConfirm}
      />

      <RemovePopup
        open={removePool}
        handleRemoveClose={cancelRemove}
        removeConfirm={removeConfirm}
        message={removeMessage}
      />
    </div>
  );
};

export default AllPoolTabels;
