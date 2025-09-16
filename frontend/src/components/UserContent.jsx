import React, { useState } from "react";
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
import DeleteSuccessDialog from "./DeleteSuccessDialog"; // ✅ import success dialog
import UpdateSuccessDialog from "./UpdateSuccess";
import CreateSuccessDialog from "./CreateSuccessDialog";


export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);
 const [createSuccessOpen, setCreateSuccessOpen] = useState(false);


  const [users, setUsers] = useState([
    { fullName: "Alex Chen", role: "Admin", status: "Active", lastLogin: "02.35pm", avatar: "/images/user1.png" },
    { fullName: "Sarah Kim", role: "Admin", status: "Active", lastLogin: "04.45pm", avatar: "/images/user2.png" },
    { fullName: "Anne Nikolos", role: "Operator", status: "Inactive", lastLogin: "10.45pm", avatar: "/images/user3.png" },
    { fullName: "Nithin Akesh", role: "Operator", status: "Active", lastLogin: "05.05pm", avatar: "/images/user1.png" },
  ]);

  const [formData, setFormData] = useState({
    fullName: "", role: "Operator", username: "", password: "", status: "Active", lastLogin: "", avatar: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // delete success popup
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);

  const handleOpen = () => {
    setIsEditing(false);
    setFormData({ fullName: "", role: "Operator", username: "", password: "", status: "Active", lastLogin: "", avatar: "" });
    setOpen(true);
  };

  const handleEditClick = (user, index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData(user);
    setOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((_, idx) => idx !== deleteIndex));
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
    setDeleteSuccessOpen(true); // ✅ show success popup
  };

  const handleClose = () => setOpen(false);

const handleCreateOrUpdate = () => {
  if (isEditing && editIndex !== null) {
    setUsers((prev) => prev.map((u, idx) => (idx === editIndex ? formData : u)));
    //updateSuccessOpen(true);
    setUpdateSuccessOpen(true); // update success popup
  } else {
    setUsers((prev) => [...prev, formData]);
    setCreateSuccessOpen(true); // ✅ create success popup
  }
  setOpen(false);
};


  

  return (
    <Box sx={{ backgroundColor: "#000", minHeight: "500vh", color: "#fff", pt: "70px", px: 3 }}>
      {/* HEADER & SEARCH */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>User Management</Typography>
            <Typography variant="body2" color="gray">Manage users, roles, and permissions</Typography>
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

        <Box sx={{ backgroundColor: "#111827", p: 1, borderRadius: 2, mb: 1, display: "flex" }}>
          <TextField
            placeholder="Search"
            variant="outlined"
            fullWidth
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
            sx={{ width: "50%" }}
          />
        </Box>
      </Box>

      {/* OUTER CONTAINER - #0E111B */}
      <Box sx={{ backgroundColor: "#0E111B", p: 2, borderRadius: 2, overflowX: "auto", paddingBottom:"100px" }}>
        {/* TABLE CONTAINER - #374151 */}
        <Box sx={{ backgroundColor: "#37415174", borderRadius: 1, p: 2 }}>
          {/* Table Header */}
          <Box
            sx={{
              display: "grid",
              //gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.5fr",
              display: "grid",
gridTemplateColumns: "0.75fr 1fr 1fr 0.5fr 0.61fr",
              gap: 2,
              py: 0.25,
              px:2,
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
                  gap: 1,
                  alignItems: "center",
                  py: 0.5,
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
                <Box sx={{ padding:1 }}>
                  <IconButton
                    onClick={() => handleEditClick(user, idx)}
                    sx={{ color: "#9CA3AF", background:"#c0bdbd43", p:1, m:1, "&:hover": { color: "#fff" } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(idx)}
                    sx={{ color: "#9CA3AF", background:"#c0bdbd43", p:1, "&:hover": { color: "#fff", background:"#c0bdbdfb" } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>

      {/* Add/Edit Dialog */}
      <AddUserDialog
        open={open}
        onClose={handleClose}
        onCreate={handleCreateOrUpdate}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />

      {/* Delete Success Dialog */}
      <DeleteSuccessDialog
        open={deleteSuccessOpen}
        onClose={() => setDeleteSuccessOpen(false)}
      />

{/* Create Success Dialog */}
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
