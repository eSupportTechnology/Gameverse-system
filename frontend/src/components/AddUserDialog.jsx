import React, { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CancelPopup from "./CancelPopup";
import { toast } from "react-toastify";
import axios from "axios";

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

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setFormData((prev) => ({ ...prev, avatar: reader.result }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("aToken");
      console.log("Token:", token);

      if (!token) {
        toast.error("No token found. Please login again.");
        return;
      }
      console.table(formData)
      if (isEditing) {
        //  UPDATE user
        const response = await axios.put(
          `http://localhost:8000/api/update-user/${formData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onCreate(response.data.user, true);
      } else {
          //  Add user
        const response = await axios.post(
          "http://localhost:8000/api/add-user",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onCreate(response.data.user, true);
      }
      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        role: "operator",
        active_status: false,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog
      open={open}
      onClose={() => { }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#111827",
          color: "#fff",
          borderRadius: "16px",
          p: 2,
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


      <Box display="flex" flexDirection="column" alignItems="center" my={2}>
        <label htmlFor="avatar-upload">
          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: "none" }}
          // onChange={handleImageUpload}
          />
          {formData.avatar ? (
            <Avatar
              src={formData.avatar}
              alt="User Avatar"
              sx={{ width: 80, height: 80, cursor: "pointer" }}
            />
          ) : (
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 80, color: "#94a3b8" }} />
            </Box>
          )}
        </label>
        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
          Click to {formData.avatar ? "change" : "upload"} image
        </Typography>
      </Box>

      <DialogContent>

        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
          Full Name
        </Typography>
        <TextField
          margin="dense"
          name="fullname"
          value={formData.fullname || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter Full Name"
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


        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
          User Role
        </Typography>
        <TextField
          select
          margin="dense"
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          fullWidth
          displayEmpty
          placeholder="Select user role"
          sx={{
            mb: 2,
            backgroundColor: "#1e293b4b",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              color: "white",
              "& fieldset": { borderColor: "#334155" },
              "& .MuiSelect-icon": { color: "#1b1e6fff" },
            },
            "& .MuiSelect-select:empty": { color: "#0008130c" },
          }}
        >
          <MenuItem
            value="admin"
            sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096" }}
          >
            Admin
          </MenuItem>
          <MenuItem
            value="operator"
            sx={{ background: "#171C2D", border: "0.3px solid #c9c0c096" }}
          >
            Operator
          </MenuItem>
        </TextField>


        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
          User Name
        </Typography>
        <TextField
          margin="dense"
          name="username"
          value={formData.username || ""}
          onChange={handleChange}
          fullWidth
          placeholder="Enter user name"
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


        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
          email
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


        <Typography variant="subtitle2" sx={{ color: "#94a3b8", mb: 0.5 }}>
          Password
        </Typography>
        <TextField
          margin="dense"
          name="password"
          type="password"
          value={formData.password || ""}
          onChange={handleChange}
          fullWidth
          placeholder="********"
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


        <Box display="flex" alignItems="center" gap={1} mt={2}>
          <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
            Active User
          </Typography>
          <Switch
            checked={formData.active_status || false}
            onChange={handleToggle}
            sx={{
              "& .MuiSwitch-thumb": { backgroundColor: "#33B2F7" },
              "& .Mui-checked + .MuiSwitch-track": { backgroundColor: "#33B2F7" },
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
            borderRadius: "8px",
            border: "0.3px solid #809fcd4e",
            fontWeight: 500,
            fontSize: "20px",
            width: "270px",
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
            borderRadius: "8px",
            fontSize: "20px",
            border: "0.3px solid #809fcd4e",
            width: "270px",
            fontWeight: "600",
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


