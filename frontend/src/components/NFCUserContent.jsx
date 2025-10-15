import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import { nfcUsers } from "../assets/assets";

export default function NFCUserContent() {
  const [users, setUsers] = useState(nfcUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    nicNumber: "",
  });

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.get("http://127.0.0.1:8000/api/nfc-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        // Merge backend data with dummy data
        const backendUsers = res.data.data.map(user => {
          // Format phone number: XXX XXXXXXX
          let formattedPhone = user.phone_no;
          if (user.phone_no) {
            const numericPhone = user.phone_no.replace(/\D/g, "");
            if (numericPhone.length === 10) {
              formattedPhone = numericPhone.slice(0, 3) + " " + numericPhone.slice(3);
            }
          }
          
          return {
            id: user.id,
            fullName: user.full_name,
            cardNo: user.card_no,
            phoneNo: formattedPhone,
            points: user.points,
            status: user.status,
            avatar: user.avatar || "/images/user.png",
            nicNumber: user.nic_number,
            isDummy: false, // Mark as API user (can be deleted)
          };
        });
        
        // Mark dummy users
        const dummyUsersWithFlag = nfcUsers.map(user => ({
          ...user,
          isDummy: true, // Mark as dummy (cannot be deleted)
        }));
        
        // Combine dummy users with backend users
        setUsers([...dummyUsersWithFlag, ...backendUsers]);
      }
    } catch (err) {
      console.error("Error fetching NFC users:", err);
      // Keep dummy data if fetch fails with flag
      const dummyUsersWithFlag = nfcUsers.map(user => ({
        ...user,
        isDummy: true,
      }));
      setUsers(dummyUsersWithFlag);
    }
  };

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

  const handleDeleteUser = (user) => {
    // Only allow deletion of API users (not dummy data)
    if (!user.isDummy) {
      setDeleteUserId(user.id);
      setDeleteDialogOpen(true);
    } else {
      toast.error("Cannot delete dummy data users");
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.delete(`http://127.0.0.1:8000/api/nfc-users/${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("User deleted successfully");
        setDeleteDialogOpen(false);
        fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
      setDeleteDialogOpen(false);
    }
  };

  const handleCreateUser = async (newUserData) => {
    try {
      const token = localStorage.getItem("aToken");
      const payload = {
        full_name: newUserData.fullName,
        phone_no: newUserData.phoneNo,
        nic_number: newUserData.nicNumber,
      };

      const res = await axios.post("http://127.0.0.1:8000/api/nfc-users", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        toast.success("User created successfully");
        setAddDialogOpen(false);
        fetchUsers(); // Refresh the list
        
        // Reset form
        setFormData({
          fullName: "",
          phoneNo: "",
          nicNumber: "",
        });
      }
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.response?.data?.message || "Failed to create user. Make sure you are logged in.");
    }
  };

  const handleUpdateUser = async (updatedUserData) => {
    try {
      const token = localStorage.getItem("aToken");
      const payload = {
        full_name: updatedUserData.fullName,
        phone_no: updatedUserData.phoneNo,
        nic_number: updatedUserData.nicNumber,
      };

      const res = await axios.put(
        `http://127.0.0.1:8000/api/nfc-users/${selectedUser.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("User updated successfully");
        setEditDialogOpen(false);
        fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.response?.data?.message || "Failed to update user. Make sure you are logged in.");
    }
  };

  const toggleUserStatus = async (userId, isDummy) => {
    // Only allow status toggle for API users (not dummy data)
    if (!isDummy) {
      try {
        const token = localStorage.getItem("aToken");
        const res = await axios.patch(
          `http://127.0.0.1:8000/api/nfc-users/${userId}/toggle-status`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          toast.success("User status updated successfully");
          fetchUsers(); // Refresh the list
        }
      } catch (err) {
        console.error("Error toggling user status:", err);
        toast.error(err.response?.data?.message || "Failed to update user status");
      }
    } else {
      toast.error("Cannot modify dummy data users");
    }
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
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
                      onClick={() => user.status === "inactive" && toggleUserStatus(user.id, user.isDummy)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: user.status === "active" ? "#4caf50" : "#1b4d2b",
                        color: "#fff",
                        textTransform: "none",
                        minWidth: "80px",
                        border: user.status === "active" ? "none" : "1px solid #4caf50",
                        "&:hover": {
                          backgroundColor: user.status === "active" ? "#4caf50" : "#2d5f3f",
                        },
                        cursor: user.status === "active" ? "default" : "pointer",
                      }}
                    >
                      Enable
                    </Button>

                    <Button
                      onClick={() => user.status === "active" && toggleUserStatus(user.id, user.isDummy)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: user.status === "inactive" ? "#f44336" : "#4d1a1a",
                        color: "#fff",
                        textTransform: "none",
                        minWidth: "80px",
                        border: user.status === "inactive" ? "none" : "1px solid #f44336",
                        "&:hover": {
                          backgroundColor: user.status === "inactive" ? "#f44336" : "#5f2d2d",
                        },
                        cursor: user.status === "inactive" ? "default" : "pointer",
                      }}
                    >
                      Disable
                    </Button>

                    {/* Delete button only for API-created users (not dummy data) */}
                    {!user.isDummy && (
                      <IconButton
                        onClick={() => handleDeleteUser(user)}
                        sx={{
                          backgroundColor: "#2a2a2a",
                          color: "#f44336",
                          "&:hover": {
                            backgroundColor: "#3a3a3a",
                            color: "#ff5252",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
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
    </Box>
  );
}