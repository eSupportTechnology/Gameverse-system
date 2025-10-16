import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelPopup from "./CancelPopup";

export default function EditNFCUserDialog({
  open,
  onClose,
  onUpdate,
  formData,
  setFormData,
}) {
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState({});

  React.useEffect(() => {
    if (open && formData) {
      setOriginalData({ ...formData });
    }
  }, [open, formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, format automatically
    if (name === "phoneNo") {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, "");
      
      // Format: add space after 3rd digit
      let formattedValue = numericValue;
      if (numericValue.length > 3) {
        formattedValue = numericValue.slice(0, 3) + " " + numericValue.slice(3, 10);
      }
      
      // Limit to 10 digits (excluding space)
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOpenCancelPopup = () => setOpenCancelPopup(true);
  const handleCloseCancelPopup = () => setOpenCancelPopup(false);

  const hasChanges = () => {
    return (
      formData.fullName !== originalData.fullName ||
      formData.phoneNo !== originalData.phoneNo ||
      formData.nicNumber !== originalData.nicNumber
    );
  };

  const handleConfirmCancel = () => {
    setOpenCancelPopup(false);
    setFormData({ ...originalData });
    setErrors({});
    onClose();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\d{3}\s\d{7}$/.test(formData.phoneNo.trim())) {
      newErrors.phoneNo = "Phone number format should be 'XXX XXXXXXX'";
    }

    if (!formData.nicNumber.trim()) {
      newErrors.nicNumber = "NIC number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
      setErrors({});
    }
  };

  const handleClose = () => {
    if (hasChanges()) {
      handleOpenCancelPopup();
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #333",
            pb: 2,
          }}
        >
          Edit New NFC User
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#888",
              "&:hover": {
                color: "#fff",
                backgroundColor: "#333",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Full Name */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", mb: 1, fontWeight: "500" }}
                >
                  Full Name
                </Typography>
                <TextField
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#2a2a2a",
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
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
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
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                    },
                  }}
                />
              </Box>

              {/* Phone Number */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", mb: 1, fontWeight: "500" }}
                >
                  Phone Number
                </Typography>
                <TextField
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="0712345645"
                  fullWidth
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#2a2a2a",
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
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
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
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                    },
                  }}
                />
              </Box>

              {/* NIC Number */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#fff", mb: 1, fontWeight: "500" }}
                >
                  NIC Number
                </Typography>
                <TextField
                  name="nicNumber"
                  value={formData.nicNumber}
                  onChange={handleChange}
                  placeholder="Enter NIC number"
                  fullWidth
                  error={!!errors.nicNumber}
                  helperText={errors.nicNumber}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#2a2a2a",
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
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
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
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
              pb: 3,
              px: 3,
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: "#333",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 32px",
                borderRadius: "25px",
                textTransform: "none",
                fontSize: "14px",
                minWidth: "120px",
                "&:hover": {
                  backgroundColor: "#444",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                background: "linear-gradient(135deg, #00d4ff 0%, #7b68ee 100%)",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 32px",
                borderRadius: "25px",
                textTransform: "none",
                fontSize: "14px",
                minWidth: "120px",
                "&:hover": {
                  background: "linear-gradient(135deg, #00b8e6 0%, #6b5bd4 100%)",
                },
              }}
            >
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <CancelPopup
        open={openCancelPopup}
        onClose={handleCloseCancelPopup}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}