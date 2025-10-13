import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNFCUserDialog from "./AddNFCUserDialog";
import EditNFCUserDialog from "./EditNFCUserDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import DeleteSuccessDialog from "./DeleteSuccessDialog";
import CreateSuccessDialog from "./CreateSuccessDialog";
import UpdateSuccessDialog from "./UpdateSuccess";
import { nfcUsers } from "../assets/assets";

export default function NFCUserContent() {
  const [users, setUsers] = useState(nfcUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [createSuccessOpen, setCreateSuccessOpen] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    nicNumber: "",
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cardNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNo.includes(searchQuery)
  );

  const handleAddUser = () => {
    setFormData({
      fullName: "",
      phoneNo: "",
      nicNumber: "",
    });
    setAddDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      phoneNo: user.phoneNo,
      nicNumber: user.nicNumber || "",
    });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const newUsers = users.filter((_, index) => index !== deleteIndex);
    setUsers(newUsers);
    setDeleteDialogOpen(false);
    setDeleteSuccessOpen(true);
  };

  const handleCreateUser = (newUserData) => {
    const newUser = {
      id: users.length + 1,
      fullName: newUserData.fullName,
      cardNo: `GV${String(115 + users.length).padStart(4, '0')}`,
      phoneNo: newUserData.phoneNo,
      points: 0,
      status: "active",
      avatar: "/images/user.png",
      nicNumber: newUserData.nicNumber,
    };
    setUsers([...users, newUser]);
    setAddDialogOpen(false);
    setCreateSuccessOpen(true);
  };

  const handleUpdateUser = (updatedUserData) => {
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id
        ? {
            ...user,
            fullName: updatedUserData.fullName,
            phoneNo: updatedUserData.phoneNo,
            nicNumber: updatedUserData.nicNumber,
          }
        : user
    );
    setUsers(updatedUsers);
    setEditDialogOpen(false);
    setUpdateSuccessOpen(true);
  };

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    );
    setUsers(updatedUsers);
  };

  return (
    <Box sx={{ p: 3, pt: 6, bgcolor: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          NFC Card User Management
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#888",
            mb: 3,
          }}
        >
          NFC User Control Made Easy
        </Typography>

        {/* Search and Add Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: "400px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid #00d4ff",
                },
              },
              "& .MuiInputBase-input": {
                color: "#fff",
                padding: "12px 14px",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#888",
                opacity: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#888" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleAddUser}
            sx={{
              backgroundColor: "linear-gradient(135deg, #00d4ff 0%, #7b68ee 100%)",
              background: "linear-gradient(135deg, #00d4ff 0%, #7b68ee 100%)",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 24px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "16px",
              "&:hover": {
                background: "linear-gradient(135deg, #00b8e6 0%, #6b5bd4 100%)",
              },
            }}
          >
            + Add User
          </Button>
        </Box>
      </Box>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#1a1a1a",
          borderRadius: "12px",
          border: "1px solid #333",
        }}
      >
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2a2a2a" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", border: "none", width: "25%", px: 3 }}>
                User
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", border: "none", width: "15%", px: 3 }}>
                Card No
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", border: "none", width: "20%", px: 3 }}>
                Phone No
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", border: "none", width: "10%", px: 3 }}>
                Points
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", border: "none", width: "30%", px: 3, textAlign: "center" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#2a2a2a",
                  },
                }}
              >
                <TableCell sx={{ border: "none", py: 2, px: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Typography sx={{ color: "#fff", fontWeight: "500" }}>
                      {user.fullName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "#fff", border: "none", px: 3 }}>
                  {user.cardNo}
                </TableCell>
                <TableCell sx={{ color: "#fff", border: "none", px: 3 }}>
                  {user.phoneNo}
                </TableCell>
                <TableCell sx={{ color: "#fff", border: "none", px: 3 }}>
                  {user.points}
                </TableCell>
                <TableCell sx={{ border: "none", px: 3 }}>
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <IconButton
                      onClick={() => handleEditUser(user)}
                      sx={{
                        backgroundColor: "#2a2a2a",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#3a3a3a",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <Button
                      onClick={() => toggleUserStatus(user.id)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        textTransform: "none",
                        minWidth: "70px",
                        "&:hover": {
                          backgroundColor: "#45a049",
                        },
                      }}
                    >
                      Enable
                    </Button>

                    <Button
                      onClick={() => toggleUserStatus(user.id)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        textTransform: "none",
                        minWidth: "70px",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                        },
                      }}
                    >
                      Disable
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialogs */}
      <AddNFCUserDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreate={handleCreateUser}
        formData={formData}
        setFormData={setFormData}
      />

      <EditNFCUserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUpdate={handleUpdateUser}
        formData={formData}
        setFormData={setFormData}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete NFC User"
        message="Are you sure you want to delete this NFC user? This action cannot be undone."
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