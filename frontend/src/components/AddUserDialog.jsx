import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddUserDialog({
  open,
  onClose,
  onCreate,
  formData,
  setFormData,
  isEditing,
}) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ backgroundColor: "#0E111B", color: "white" }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">
            {isEditing ? "Edit User" : "Add New User"}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#9CA3AF" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <TextField
            margin="dense"
            fullWidth
            select
            label="User Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#9CA3AF" } }}
            InputProps={{ style: { color: "white" } }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Operator">Operator</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            fullWidth
            label="User Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#9CA3AF" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <TextField
            margin="dense"
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: "#9CA3AF" } }}
            InputProps={{ style: { color: "white" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: "#9CA3AF" }}>
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            sx={{
              background: "linear-gradient(90deg, #33B2F7, #CF36E1)",
              color: "white",
              px: 3,
              "&:hover": { opacity: 0.9 },
            }}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
