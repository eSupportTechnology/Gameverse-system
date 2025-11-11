import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddUserDialog from "./AddUserDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import DeleteSuccessDialog from "./DeleteSuccessDialog";
import UpdateSuccessDialog from "./UpdateSuccess";
import CreateSuccessDialog from "./CreateSuccessDialog";
import axios from "axios";

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);
  const [createSuccessOpen, setCreateSuccessOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    fullname: "",
    role: "Operator",
    username: "",
    email: "",
    password: "",
    active_status: true,
    avatar: null,
    profile_img: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // delete success popup
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  const mapUser = (user) => ({
    id: user.id,
    fullName: user.fullname,
    username: user.username,
    email: user.email,
    role: user.role,
    status: Number(user.active_status) === 1 ? "Active" : "Inactive",
    lastLogin: user.last_login_at || "N/A",
    avatar: user.avatar || "/images/default.png",
  });

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users");

        const formattedUsers = res.data.map((user) => ({
          id: user.id,
          fullName: user.fullname,
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.active_status ? "Active" : "Inactive",
          lastLogin: user.last_login_at || "N/A",
          avatar: user.avatar || "/images/default.png",
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleOpen = () => {
    setIsEditing(false);
    setFormData({
      fullname: "",
      role: "operator",
      username: "",
      email: "",
      password: "",
      active_status: true,
      avatar: null,
    });
    setOpen(true);
  };

  const handleEditClick = (user, index) => {
    setIsEditing(true);
    setEditIndex(index);

    setFormData({
      id: user.id,
      fullname: user.fullName,
      username: user.username || "",
      email: user.email || "",
      role: user.role,
      active_status: user.status === "Active",
      password: "",
      avatar: user.avatar || null,
    });

    setOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex === null) return;

    const userId = users[deleteIndex].id;
    try {
      const token = localStorage.getItem("aToken");

      await axios.delete(`http://localhost:8000/api/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((_, idx) => idx !== deleteIndex));
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
      setDeleteSuccessOpen(true);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleClose = () => setOpen(false);

  const handleCreateOrUpdate = (user) => {
    const formattedUser = mapUser(user);
    if (isEditing && editIndex !== null) {
      setUsers((prev) =>
        prev.map((u, idx) => (idx === editIndex ? formattedUser : u))
      );
      setUpdateSuccessOpen(true);
    } else {
      setUsers((prev) => [...prev, formattedUser]);
      setCreateSuccessOpen(true);
    }
    setOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "500vh", color: "#fff", pt: "70px", px: 3 }}>
      {/* HEADER & SEARCH */}
      <Box sx={{ mb: 3 }}>
        {/* Top header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>User Management</Typography>
            <Typography variant="body2" color="gray">
              Manage users, roles, and permissions
            </Typography>
          </Box>
          <Button
            onClick={handleOpen}
            sx={{
              background: "linear-gradient(90deg,  #CF36E1 , #33B2F7)",
              color: "#fff",
              px: 3,
              py: 1,
              width: "150px",
              borderRadius: "8px",
              fontWeight: "600",
              textTransform: "none",
              "&:hover": { opacity: 0.9 },
            }}
          >
            + Add User
          </Button>
        </Box>

        {/* All Users + Search bar */}
        <Box
          sx={{
            backgroundColor: "#171C2D",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.2,
            mb: 2,
          }}
        >
          <Button

            sx={{
              backgroundColor: "#0d2a38",
              color: "#fff",
              border: "1px solid #00b8ff",
              textTransform: "none",
              fontWeight: "bold",
              px: 5,
              borderRadius: "5px",
              "&:hover": {
                backgroundColor: "#10374b",
                borderColor: "#00c8ff",
              },
            }}
          >
            All Users
          </Button>

          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "8px",
                backgroundColor: "#0e111b84",
                input: { color: "white" },
              },
            }}
            sx={{ width: "40%" }}
          />
        </Box>
      </Box>

      {/* OUTER CONTAINER */}
      <Box sx={{ backgroundColor: "#0E111B", p: 2, borderRadius: 2, overflowX: "auto", paddingBottom: "100px" }}>
        <Box sx={{ backgroundColor: "#37415174", borderRadius: 1, p: 2 }}>
          {/* Table Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "0.75fr 1fr 1fr 0.5fr 0.61fr",
              gap: 2,
              py: 0.25,
              px: 2,
              borderBottom: "1px solid #2d374876",
              color: "#9ca3afff",
              fontSize: "0.9rem",
            }}
          >
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last Login</span>
            <span>Action</span>
          </Box>

          {/* Table Rows */}
          {users
            .filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((user, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "0.75fr 1fr 1fr 0.5fr 0.65fr",
                  gap: 2,
                  alignItems: "center",
                  py: 2,
                }}
              >
                {/* User */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar src={user.avatar} alt={user.fullName} />
                  <Typography color="white">{user.fullName}</Typography>
                </Box>
                <Typography color="white">{user.role}</Typography>
                <Box
                  sx={{
                    backgroundColor: user.status === "Active" ? "#065f4674" : "#7f1d1d6d",
                    px: 1.8,
                    py: 0.7,
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "white",
                    display: "inline-block",
                    textAlign: "center",
                    width: "fit-content",
                  }}
                >
                  {user.status}
                </Box>
                <Typography color="white">{user.lastLogin}</Typography>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                  <IconButton
                    onClick={() => handleEditClick(user, idx)}
                    sx={{
                      color: "#9CA3AF",
                      background: "#ffffff1a",
                      p: 1,
                      "&:hover": { color: "#fff", background: "#ffffff2d" },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDeleteClick(idx)}
                    sx={{
                      color: "#f87171",
                      background: "#ffffff1a",
                      p: 1,
                      "&:hover": { color: "#fff", background: "#dc2626" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>

      {/* Dialogs */}
      <AddUserDialog
        open={open}
        onClose={handleClose}
        onCreate={handleCreateOrUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      <DeleteSuccessDialog
        open={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
      />

      <CreateSuccessDialog
        open={createSuccessOpen}
        onClose={() => setCreateSuccessOpen(false)}
      />

      <UpdateSuccessDialog
        open={updateSuccessOpen}
        onClose={() => setUpdateSuccessOpen(false)}
      />
    </Box>
  );
}
