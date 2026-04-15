import React, { useState, useEffect, useContext, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNFCUserDialog from "./AddNFCUserDialog";
import EditNFCUserDialog from "./EditNFCUserDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateSuccessDialog from "./UpdateSuccess";
import { API_BASE_URL } from "../apiConfig";
import { AppContext } from "../context/AppContext";
//import { nfcUsers } from "../assets/assets";

export default function NFCUserContent() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [addSuccessDialog, setAddSuccessDialog] = useState(false);
  const { globalSearch } = useContext(AppContext);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openUsedRewards, setOpenUsedRewards] = useState(false);
  const [selectedUsedRewards, setSelectedUsedRewards] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNo: "",
    nicNumber: "",
    activeUser: true,
    profileImage: null,
    email: "",
  });

  // Fetch users from backend on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.get(`${API_BASE_URL}/api/nfc-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        // Merge backend data with dummy data
        const backendUsers = res.data.data.map((user) => {
          // Format phone number: XXX XXXXXXX
          let formattedPhone = user.phone_no;
          if (user.phone_no) {
            const numericPhone = user.phone_no.replace(/\D/g, "");
            if (numericPhone.length === 10) {
              formattedPhone =
                numericPhone.slice(0, 3) + " " + numericPhone.slice(3);
            }
          }

          // Build avatar URL - only use storage URL for actual uploaded files
          let avatarUrl = "/images/user.png";
          if (user.avatar && user.avatar.startsWith("avatars/nfc_users/")) {
            avatarUrl = `${API_BASE_URL}/storage/${user.avatar}`;
          }

          return {
            id: user.id,
            fullName: user.full_name,
            cardNo: user.card_no,
            phoneNo: formattedPhone,
            points: user.points,
            status: user.status,
            avatar: avatarUrl,
            nicNumber: user.nic_number,
            email: user.email,
            gift: user.gift || [],
            used_rewards: user.used_rewards || [],

            // isDummy: false, // Mark as API user (can be deleted)
          };
        });

        //   // Mark dummy users
        //   const dummyUsersWithFlag = nfcUsers.map(user => ({
        //     ...user,
        //     isDummy: true, // Mark as dummy (cannot be deleted)
        //   }));

        //   // Combine dummy users with backend users
        //   setUsers([...dummyUsersWithFlag, ...backendUsers]);

        setUsers(backendUsers);
      }
    } catch (err) {
      console.error("Error fetching NFC users:", err);
      toast.error("Failed to load users from backend");
      // // Keep dummy data if fetch fails with flag
      // const dummyUsersWithFlag = nfcUsers.map(user => ({
      //   ...user,
      //   isDummy: true,
      // }));
      // setUsers(dummyUsersWithFlag);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const name = user.fullName?.toLowerCase() || "";
    const card = user.cardNo?.toLowerCase() || "";
    const phone = user.phoneNo?.toLowerCase() || "";

    const matchLocal =
      !searchQuery ||
      name.includes(searchQuery.toLowerCase()) ||
      card.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery.toLowerCase());

    const matchGlobal =
      !globalSearch ||
      name.includes(globalSearch.toLowerCase()) ||
      card.includes(globalSearch.toLowerCase()) ||
      phone.includes(globalSearch.toLowerCase());

    return matchLocal && matchGlobal;
  });

  const handleAddUser = () => {
    setFormData({
      nfcCardNumber: "",
      fullName: "",
      email: "",
      phoneNo: "",
      nicNumber: "",
      activeUser: true,
      profileImage: null,
    });

    setDialogMode("add");
    setSelectedUserId(null);
    setAddDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      nfcCardNumber: user.cardNo || "",
      fullName: user.fullName,
      email: user.email || "",
      phoneNo: user.phoneNo,
      nicNumber: user.nicNumber || "",
      activeUser: user.status === "active",
      profileImage: user.avatar || null,
    });

    setDialogMode("edit");
    setSelectedUserId(user.id);
    setAddDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    // Only allow deletion of API users (not dummy data)
    //if (!user.isDummy) {
    setDeleteUserId(user.id);
    setDeleteDialogOpen(true);
    // } else {
    //   toast.error("Cannot delete dummy data users");
    // }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.delete(
        `${API_BASE_URL}/api/nfc-users/${deleteUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

  const toggleUserStatus = async (userId) => {
    // Only allow status toggle for API users (not dummy data)
    //if (!isDummy) {
    try {
      const token = localStorage.getItem("aToken");
      const res = await axios.patch(
        `${API_BASE_URL}/api/nfc-users/${userId}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("User status updated successfully");
        fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error("Error toggling user status:", err);
      toast.error(
        err.response?.data?.message || "Failed to update user status",
      );
    }
    // } else {
    //   toast.error("Cannot modify dummy data users");
    // }
  };
  const groupPoints = (points = {}) => {
    const groups = {
      playstation: 0,
      racing: 0,
      supremeBilliard: 0,
      premiumBilliard: 0,
      foodcourt: 0,
      archery: 0,
      arcade: 0,
    };

    Object.entries(points).forEach(([key, value]) => {
      const val = Number(value) || 0;
      const k = key.toLowerCase();

      // PS5 Stations 1-5
      if (k.includes("ps5 station")) {
        groups.playstation += val;
      }

      // Racing Simulator 1-4
      else if (k.includes("racing simulator")) {
        groups.racing += val;
      }

      // Supreme Billiard 1-2
      else if (k.includes("supreme billiard")) {
        groups.supremeBilliard += val;
      }

      // Premium Billiard 1-3
      else if (k.includes("premium billiard")) {
        groups.premiumBilliard += val;
      } else if (k.includes("foodcourt")) {
        groups.foodcourt += val;
      } else if (k.includes("archery")) {
        groups.archery += val;
      } else if (k.includes("arcade")) {
        groups.arcade += val;
      }
    });

    return groups;
  };

  const formatGifts = (gift = {}) => {
    return Object.keys(gift);
  };

  const formatUsedRewards = (used = []) => {
    return used.map((r) => r.type);
  };
  return (
    <>
      <Box sx={{ p: 3, pt: 6, bgcolor: "#000", minHeight: "100vh" }}>
        {/* Header */}
        <Box sx={{ mb: 4, mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "28px",
                  lineHeight: 1.2,
                  mb: 0.5,
                }}
              >
                NFC Customers Management
              </Typography>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                Manage NFC Customers
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleAddUser}
              sx={{
                background:
                  "linear-gradient(90deg, #00d4ff 0%, #ff00ffff 100%)",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #00c4eb 0%, #0066e0 100%)",
                  boxShadow: "0 4px 15px rgba(0, 212, 255, 0.4)",
                },
              }}
            >
              + Add Customer
            </Button>
          </Box>

          {/* Filter and Search in same line with box */}
          <Box
            sx={{
              backgroundColor: "#0E111B",
              borderRadius: "8px",
              padding: "8px 20px",
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* All Customer Filter */}
            <Chip
              label="All Customer"
              sx={{
                backgroundColor: "#1aa6bc58",
                color: "#0CD7FF",
                border: "1px solid #0CD7FF",
                textTransform: "none",
                fontWeight: "bold",
                px: 2,
                py: 2.5,
                borderRadius: "5px",
                "&:hover": {
                  backgroundColor: "#1aa6bc58",
                  borderColor: "#0CD7FF",
                },
              }}
            />

            {/* Search */}
            <Box sx={{ width: "400px" }}>
              <TextField
                placeholder="Search customers..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0f1322",
                    border: "1px solid #333",
                    borderRadius: "6px",
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
                    padding: "10px 14px",
                    fontSize: "16px",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#666",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#666", mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#0E111B",
            p: 1,
            borderRadius: "8px",
          }}
        >
          {/* Users Table */}
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#171c2d",
              borderRadius: "12px",
              border: "1px solid #333",
              overflow: "hidden",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#171c2d" }}>
                  <TableCell
                    sx={{
                      color: "#969aa3",
                      fontWeight: "bold",
                      borderBottom: "2px solid #333",
                      py: 2,
                      fontSize: "14px",
                      width: "25%",
                    }}
                  >
                    Customer
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#969aa3",
                      fontWeight: "bold",
                      borderBottom: "2px solid #333",
                      py: 2,
                      fontSize: "14px",
                      width: "20%",
                    }}
                  >
                    Contact Number
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#969aa3",
                      fontWeight: "bold",
                      borderBottom: "2px solid #333",
                      py: 2,
                      fontSize: "14px",
                      width: "15%",
                    }}
                  >
                    Card No
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#969aa3",
                      fontWeight: "bold",
                      borderBottom: "2px solid #333",
                      py: 2,
                      fontSize: "14px",
                      width: "15%",
                    }}
                  >
                    Points
                  </TableCell>
                  <TableCell sx={{ color: "#969aa3", fontWeight: "bold" }}>
                    Gifts
                  </TableCell>

                  <TableCell sx={{ color: "#969aa3", fontWeight: "bold" }}>
                    Used Rewards
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#969aa3",
                      fontWeight: "bold",
                      borderBottom: "2px solid #333",
                      py: 2,
                      fontSize: "14px",
                      width: "15%",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#969aa3",
                      fontWeight: "bold",
                      borderBottom: "2px solid #333",
                      py: 2,
                      fontSize: "14px",
                      width: "10%",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:last-child td, &:last-child th": { borderBottom: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={user.avatar}
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#333",
                          }}
                        />
                        <Typography
                          sx={{
                            color: "#fff",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          {user.fullName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#e1e3e7",
                        borderBottom: "none",
                        py: 2,
                        fontSize: "14px",
                      }}
                    >
                      {user.phoneNo}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#e1e3e7",
                        borderBottom: "none",
                        py: 2,
                        fontSize: "14px",
                      }}
                    >
                      {user.cardNo}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#e1e3e7",
                        borderBottom: "none",
                        py: 2,
                        fontSize: "12px",
                      }}
                    >
                      {(() => {
                        const g = groupPoints(user.points || {});

                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.3,
                            }}
                          >
                            {g.playstation > 0 && (
                              <Typography>
                                PlayStation: {g.playstation}
                              </Typography>
                            )}

                            {g.racing > 0 && (
                              <Typography>
                                Racing Simulator: {g.racing}
                              </Typography>
                            )}

                            {g.supremeBilliard > 0 && (
                              <Typography>
                                Supreme Billiard: {g.supremeBilliard}
                              </Typography>
                            )}

                            {g.premiumBilliard > 0 && (
                              <Typography>
                                Premium Billiard: {g.premiumBilliard}
                              </Typography>
                            )}

                            {g.foodcourt > 0 && (
                              <Typography>Foodcourt: {g.foodcourt}</Typography>
                            )}

                            {g.archery > 0 && (
                              <Typography>Archery: {g.archery}</Typography>
                            )}

                            {g.arcade > 0 && (
                              <Typography>Arcade: {g.arcade}</Typography>
                            )}

                            {/* If everything is 0 */}
                            {Object.values(g).every((v) => v === 0) && (
                              <Typography sx={{ color: "#666" }}>0</Typography>
                            )}
                          </Box>
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={{ color: "#e1e3e7", fontSize: "12px" }}>
                      {(() => {
                        const gifts = user.gift || {};

                        const activeGifts = Object.entries(gifts).filter(
                          ([, value]) => value?.count > 0,
                        );

                        return activeGifts.length > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.3,
                            }}
                          >
                            {activeGifts.map(([key, value]) => (
                              <Typography key={key} sx={{ fontSize: "12px" }}>
                                🎁 {key} ({value.count})
                              </Typography>
                            ))}
                          </Box>
                        ) : (
                          <Typography sx={{ color: "#666" }}>
                            No Gifts
                          </Typography>
                        );
                      })()}
                    </TableCell>
                    <TableCell sx={{ color: "#e1e3e7", fontSize: "12px" }}>
                      <IconButton
                        onClick={() => {
                          setSelectedUsedRewards(user.used_rewards || []);
                          setOpenUsedRewards(true);
                        }}
                        sx={{
                          color: "#00d4ff",
                          backgroundColor: "rgba(0, 212, 255, 0.1)",
                          borderRadius: "6px",
                          width: "34px",
                          height: "34px",
                          "&:hover": {
                            backgroundColor: "rgba(0, 212, 255, 0.2)",
                          },
                        }}
                      >
                        📋
                      </IconButton>
                    </TableCell>
                    <TableCell
                      onClick={() => toggleUserStatus(user.id)}
                      sx={{
                        borderBottom: "none",
                        py: 2,
                        cursor: "pointer",
                      }}
                    >
                      <Chip
                        label={user.status === "active" ? "Active" : "Inactive"}
                        sx={{
                          backgroundColor:
                            user.status === "active" ? "#153329" : "#4b1e1e",
                          color:
                            user.status === "active" ? "#00bf63" : "#ff4c4c",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          fontSize: "12px",
                          height: "24px",
                          "& .MuiChip-label": {
                            px: 2,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", gap: 3, alignItems: "center" }}
                      >
                        <IconButton
                          onClick={() => handleEditUser(user)}
                          sx={{
                            color: "#fffffffc",
                            backgroundColor: "rgba(142, 142, 142, 0.74)",
                            borderRadius: "6px",
                            width: "32px",
                            height: "32px",
                            "&:hover": {
                              backgroundColor: "rgba(0, 212, 255, 0.2)",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDeleteUser(user)}
                          sx={{
                            color: "#fffffffc",
                            backgroundColor: "rgba(142, 142, 142, 0.74)",
                            borderRadius: "1px",
                            width: "32px",
                            height: "32px",
                            "&:hover": {
                              backgroundColor: "rgba(255, 68, 68, 0.2)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Dialogs */}
        <AddNFCUserDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          formData={formData}
          setFormData={setFormData}
          mode={dialogMode}
          userId={selectedUserId}
          refreshUsers={fetchUsers}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          title="Delete NFC User"
          message="Are you sure you want to delete this NFC user? This action cannot be undone."
        />

        <UpdateSuccessDialog
          open={successDialogOpen}
          onClose={() => setSuccessDialogOpen(false)}
        />

        <Dialog
          open={addSuccessDialog}
          onClose={() => setAddSuccessDialog(false)}
          PaperProps={{
            sx: {
              backgroundColor: "#070F1E",
              color: "white",
              width: "400px",
              padding: "20px",
              borderRadius: "12px",
              border: "2px solid #0aaffb59",
              //boxShadow: "0px 0px 30px rgba(8, 0, 255, 0.39)", // green glow
              textAlign: "center",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "600",
              background: "linear-gradient(to right, #1963f6d0, #e428edff)",
              WebkitBackgroundClip: "text",
              fontSize: "24px",
              WebkitTextFillColor: "transparent",
            }}
          >
            <img
              src="/images/create.png"
              alt="success"
              width="80"
              height={80}
              style={{ marginBottom: 8 }}
            />
            <br />
            Customer Added Successful !
          </DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={() => setAddSuccessDialog(false)}
              sx={{
                background: "linear-gradient(to right, #2287a3d0, #8a38f557)",
                color: "#fff",
                width: "150px",
                textTransform: "none",
                "&:hover": { opacity: 0.9 },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Dialog
        open={openUsedRewards}
        onClose={() => setOpenUsedRewards(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#0E111B",
            color: "#fff",
            minWidth: "400px",
            borderRadius: "12px",
            border: "1px solid #333",
          },
        }}
      >
        <DialogTitle sx={{ color: "#00d4ff" }}>Used Rewards</DialogTitle>

        <DialogContent>
          {selectedUsedRewards.length > 0 ? (
            selectedUsedRewards.map((r, i) => (
              <Box
                key={i}
                sx={{
                  p: 1,
                  mb: 1,
                  backgroundColor: "#171c2d",
                  borderRadius: "6px",
                }}
              >
                <Typography sx={{ fontSize: "13px" }}>🧾 {r.type}</Typography>
                <Typography sx={{ fontSize: "11px", color: "#888" }}>
                  Used at: {new Date(r.used_at).toLocaleString()}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: "#666" }}>No used rewards</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenUsedRewards(false)}
            sx={{ color: "#fff" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
