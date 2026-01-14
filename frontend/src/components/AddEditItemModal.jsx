import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  RadioGroup,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddEditItemModal = ({
  open,
  onClose,
  mode = "add",
  newItem,
  setNewItem,
  categories = [],
  showNewCategory,
  setShowNewCategory,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleSubmit,
  handleCancelClick,
  textFieldSx,
}) => {
  const isEdit = mode === "edit";

  return (
    <Modal open={open} onClose={onClose}>
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold" fontSize={18}>
            {isEdit ? "Edit Item" : "Add Item"}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Form */}
        <Box mt={1} display="flex" flexDirection="column" gap={1}>
          {/* Category */}
          <Typography variant="body2">Category</Typography>

          <FormControl fullWidth>
            <Select
              displayEmpty
              value={newItem.category}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setShowNewCategory(true);
                } else {
                  setNewItem({ ...newItem, category: e.target.value });
                  setShowNewCategory(false);
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
              {categories.map((cat) => (
                <MenuItem
                  key={cat}
                  value={cat}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#9CA3AF",
                  }}
                >
                  {cat}
                </MenuItem>
              ))}
              <MenuItem
                value="Other"
                sx={{
                  color: "#9CA3AF",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  ml: 1,
                }}
              >
                Other category +
              </MenuItem>
            </Select>
          </FormControl>

          {/* Other Category Input */}
          {showNewCategory && (
            <Box display="flex" gap={1} mt={1}>
              <TextField
                placeholder="Enter Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                fullWidth
                sx={textFieldSx}
              />
              <Button
                onClick={handleAddCategory}
                disabled={!newCategory.trim()}
                sx={{
                  background: "linear-gradient(to right, #06b6d4, #9333ea)",
                  textTransform: "none",
                }}
              >
                Add
              </Button>
            </Box>
          )}

          {/* Item */}
          <Typography variant="body2">Item</Typography>
          <TextField
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            sx={textFieldSx}
          />

          {/* Price */}
          <Typography variant="body2">Price</Typography>
          <TextField
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            sx={textFieldSx}
          />

          {/* Stock */}
          <Typography variant="body2">Stock</Typography>
          <TextField
            type="number"
            value={newItem.stock}
            onChange={(e) =>
              setNewItem({ ...newItem, stock: Number(e.target.value) })
            }
            sx={textFieldSx}
          />

          {/* Loyalty */}
          <Typography variant="body2" sx={{ color: "white", mb: 1 }}>
            Loyalty Point
          </Typography>
          <RadioGroup
            row
            value={newItem.loyalty}
            onChange={(e) =>
              setNewItem({ ...newItem, loyalty: e.target.value })
            }
            sx={{ display: "flex", gap: 2 }}
          >
            {["Yes", "No"].map((opt) => (
              <Box
                key={opt}
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
                onClick={() => setNewItem({ ...newItem, loyalty: opt })}
              >
                <Typography color="#9CA3AF">{opt}</Typography>
                <Radio
                  checked={newItem.loyalty === opt}
                  value={opt}
                  sx={{
                    color: "gray",
                    "&.Mui-checked": { color: "#9CA3AF" },
                  }}
                />
              </Box>
            ))}
          </RadioGroup>

          {/* Buttons */}
          <Box display="flex" gap={2} mt={2}>
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
              onClick={handleSubmit}
              sx={{
                background: "linear-gradient(to right, #06b6d4, #9333ea)",
                textTransform: "none",
              }}
            >
              {isEdit ? "Update Item" : "Add Item"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEditItemModal;
