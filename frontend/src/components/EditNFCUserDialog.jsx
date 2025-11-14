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
  Switch,
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

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, activeUser: e.target.checked }));
  };

  const handleOpenCancelPopup = () => setOpenCancelPopup(true);
  const handleCloseCancelPopup = () => setOpenCancelPopup(false);

  const hasChanges = () => {
    return (
      formData.fullName !== originalData.fullName ||
      formData.phoneNo !== originalData.phoneNo ||
      formData.nicNumber !== originalData.nicNumber ||
      formData.nfcCardNumber !== originalData.nfcCardNumber ||
      formData.activeUser !== originalData.activeUser
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

    if (!formData.nfcCardNumber.trim()) {
      newErrors.nfcCardNumber = "NFC Card Number is required";
    }

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
            backgroundColor: "#111827",
            border: "1px solid #374151",
            borderRadius: "12px",
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            px: 3,
          }}
        >
          Edit NFC Customer
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#888",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 1, px: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {/* NFC Card Number */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    mb: 1,
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  NFC Card Number
                </Typography>
                <TextField
                  name="nfcCardNumber"
                  value={formData.nfcCardNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter NFC Card Number"
                  fullWidth
                  error={!!errors.nfcCardNumber}
                  helperText={errors.nfcCardNumber}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#0f1322",
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
                        boxShadow: "0 0 0 2px rgba(0, 212, 255, 0.1)",
                      },
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      padding: "12px 14px",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#666",
                      opacity: 1,
                      fontSize: "14px",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                      fontSize: "12px",
                    },
                  }}
                />
              </Box>

              {/* Full Name */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    mb: 1,
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  Full Name
                </Typography>
                <TextField
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#0f1322",
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
                        boxShadow: "0 0 0 2px rgba(0, 212, 255, 0.1)",
                      },
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      padding: "12px 14px",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#666",
                      opacity: 1,
                      fontSize: "14px",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                      fontSize: "12px",
                    },
                  }}
                />
              </Box>

              {/* Phone Number */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    mb: 1,
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  Phone Number
                </Typography>
                <TextField
                  name="phoneNo"
                  value={formData.phoneNo || ""}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  fullWidth
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#0f1322",
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
                        boxShadow: "0 0 0 2px rgba(0, 212, 255, 0.1)",
                      },
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      padding: "12px 14px",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#666",
                      opacity: 1,
                      fontSize: "14px",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                      fontSize: "12px",
                    },
                  }}
                />
              </Box>

              {/* NIC Number */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#fff",
                    mb: 1,
                    fontWeight: "500",
                    fontSize: "14px"
                  }}
                >
                  NIC Number
                </Typography>
                <TextField
                  name="nicNumber"
                  value={formData.nicNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter NIC Number"
                  fullWidth
                  error={!!errors.nicNumber}
                  helperText={errors.nicNumber}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#0f1322",
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
                        boxShadow: "0 0 0 2px rgba(0, 212, 255, 0.1)",
                      },
                      "&.Mui-error fieldset": {
                        border: "1px solid #f44336",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      padding: "12px 14px",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#666",
                      opacity: 1,
                      fontSize: "14px",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#f44336",
                      marginLeft: 0,
                      marginTop: "4px",
                      fontSize: "12px",
                    },
                  }}
                />
              </Box>

              {/* Active User Switch - Text and toggle next to each other */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 0.5
              }}>
                <Typography sx={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  Active User
                </Typography>
                <Switch
                  checked={formData.activeUser !== undefined ? formData.activeUser : true}
                  onChange={handleSwitchChange}
                  sx={{
                    "& .MuiSwitch-switchBase": {
                      color: "#666",
                      "&.Mui-checked": {
                        color: "#00d4ff",
                        "&:hover": {
                          backgroundColor: "rgba(0, 212, 255, 0.1)",
                        },
                      },
                    },
                    "& .MuiSwitch-track": {
                      backgroundColor: "#444",
                      opacity: 1,
                    },
                    "& .Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#00d4ff",
                      opacity: 0.5,
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "space-between",
              gap: 2,
              p: 3,
              pt: 0.5,
            }}
          >
            <Button
              onClick={handleOpenCancelPopup}
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "14px",
                border: "1px solid #333",
                width: "48%",
                "&:hover": {
                  backgroundColor: "#374151",
                  border: "1px solid #444",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              sx={{
                background: "linear-gradient(90deg, #00d4ff 0%, #8A38F5 100%)",
                color: "#fff",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "14px",
                width: "48%",
                // boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
                "&:hover": {
                  background: "linear-gradient(90deg, #8A38F5 0%, #00d4ff 100%)",
                  // boxShadow: "0 6px 20px rgba(0, 212, 255, 0.4)",
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
        handleConfirm={handleConfirmCancel}
      />
    </>
  );
}