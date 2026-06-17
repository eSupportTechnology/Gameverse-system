import React, { useState, useEffect } from "react";
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
  Switch,
  Avatar,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelPopup from "./CancelPopup";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";
import { useLoading } from "../context/LoadingContext";

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export default function AddUserDialog({
  open,
  onClose,
  onCreate,
  formData,
  setFormData,
  isEditing,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (open && !isEditing) {
      setFormData((prev) => ({ ...prev, password: generatePassword() }));
    }
  }, [open, isEditing]);

  const { setLoading: setGlobalLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openCancelPopup, setOpenCancelPopup] = React.useState(false);

  const handleOpenCancelPopup = () => setOpenCancelPopup(true);
  const handleCloseCancelPopup = () => setOpenCancelPopup(false);

  const handleConfirmCancel = () => {
    setOpenCancelPopup(false);
    onClose(); // actually close the Add User dialog
  };

  const handleToggle = (e) => {
    setFormData((prev) => ({ ...prev, active_status: e.target.checked }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // keep the real file for backend upload
      setFormData((prev) => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profile_img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGlobalLoading(true);
    setMessage("");

    if (
      !formData.fullname ||
      !formData.contactNo ||
      !formData.username ||
      !formData.email
    ) {
      toast.error("Please fill all required fields.");
      setLoading(false);
      setGlobalLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("aToken");
      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }

      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("contact_no", formData.contactNo);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("role", formData.role);

      // active_status always integer
      data.append("active_status", formData.active_status ? 1 : 0);

      // only append password if not empty
      if (formData.password && formData.password.trim() !== "") {
        data.append("password", formData.password);
      }

      // only append avatar if user uploaded new File
      if (formData.avatar instanceof File) {
        data.append("avatar", formData.avatar);
      }
      let response;
      if (isEditing) {
        data.append("_method", "PUT");

        response = await axios.post(
          `${API_BASE_URL}/api/update-user/${formData.id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Add user
        console.table(Object.fromEntries(data.entries()));
        response = await axios.post(`${API_BASE_URL}/api/add-user`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setLoading(false);
      onCreate(response.data.user, true);

      // Reset form
      setFormData({
        fullname: "",
        contactNo: "",
        username: "",
        email: "",
        password: "",
        role: "operator",
        active_status: false,
        avatar: null,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="sm"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          backgroundColor: "#111827",
          color: "#fff",
          borderRadius: "8px",
          width: "480px",
          border: "1px solid #374151",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {isEditing ? "Edit User" : "Add New User"}
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* image to can be upload here */}
      <Box display="flex" alignItems="center" justifyContent="center">
        <label htmlFor="avatar-upload">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          {formData.profile_img ? (
            <Avatar
              src={formData.profile_img}
              sx={{ width: 80, height: 80, cursor: "pointer" }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 80, color: "#9CA3AF" }} />
            </Box>
          )}
        </label>
      </Box>

      <DialogContent sx={{ overflowY: "auto" }}>
        <Typography variant="subtitle2">Full Name</Typography>
        <TextField
          margin="dense"
          name="fullname"
          value={formData.fullname || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter Full Name"
          sx={{
            mb: 2,
            backgroundColor: "#171C2D",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              color: "white",
              "& fieldset": { borderColor: "#374151" },
            },
          }}
        />

        <Typography variant="subtitle2">Contact Number</Typography>
        <TextField
          margin="dense"
          name="contactNo"
          value={formData.contactNo || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter Contact Number"
          sx={{
            mb: 2,
            backgroundColor: "#171C2D",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#374151" },
            },
          }}
        />

        <Typography variant="subtitle2">User Role</Typography>
        <TextField
          select
          margin="dense"
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          fullWidth
          displayEmpty
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  backgroundColor: "#171C2D",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "white",
                  mt: 1,
                },
              },
            },
          }}
          sx={{
            mb: 2,
            backgroundColor: "#171C2D",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              color: "white",
              "& fieldset": { borderColor: "#374151" },
              "& .MuiSelect-icon": { color: "white" },
            },
            "& .MuiSelect-select:empty": { color: "#0008130c" },
          }}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="operator">Operator</MenuItem>
        </TextField>

        <Typography variant="subtitle2">User Name</Typography>
        <TextField
          margin="dense"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter user name"
          sx={{
            mb: 2,
            backgroundColor: "##171C2D",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#374151" },
            },
          }}
        />

        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Email
        </Typography>
        <TextField
          margin="dense"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter email"
          sx={{
            mb: 2,
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
            },
          }}
        />

        {!isEditing && (
          <>
            <Typography variant="subtitle2">
              Password <span style={{ color: "#5C5E7A", fontSize: "12px", fontWeight: 400 }}>(auto-generated)</span>
            </Typography>
            <TextField
              margin="dense"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              fullWidth
              placeholder="Enter password or use auto-generated"
              sx={{
                mb: 2,
                backgroundColor: "#171C2D",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  color: "white",
                  "& fieldset": { borderColor: "#374151" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          password: generatePassword(),
                        }))
                      }
                      title="Regenerate password"
                      sx={{ color: "#94a3b8", "&:hover": { color: "#CF36E1" } }}
                    >
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </>
        )}

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
            Active User
          </Typography>
          <Switch
            checked={formData.active_status}
            onChange={handleToggle}
            sx={{
              "& .MuiSwitch-thumb": { backgroundColor: "#33B2F7" },
              "& .Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#33B2F7",
              },
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={handleOpenCancelPopup}
          sx={{
            background: "#1e293b",
            color: "white",
            px: 3,
            py: 1,
            borderRadius: "4px",
            border: "0.3px solid #809fcd4e",
            textTransform: "none",
            fontSize: "16px",
            width: "214px",
            height: "40px",
            "&:hover": { background: "#334155" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(90deg,#33B2F7,#CF36E1)",
            color: "#fff",
            px: 3,
            py: 1,
            borderRadius: "4px",
            fontSize: "16px",
            width: "218px",
            height: "40px",
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          }}
        >
          {isEditing ? "Update" : "Create"}
        </Button>
        <CancelPopup
          open={openCancelPopup}
          handleCancelClose={handleCloseCancelPopup}
          handleConfirm={handleConfirmCancel}
        />
      </DialogActions>
    </Dialog>
  );
}
