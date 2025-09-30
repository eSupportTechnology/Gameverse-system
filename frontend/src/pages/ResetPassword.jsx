import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const { loginRole,aToken,setAToken,oToken } = useContext(AdminContext)


  const handleReset = async (e) => {
  e.preventDefault();

  try {
    // Pick the correct token based on loginRole
    const token = loginRole === "Admin" ? localStorage.getItem("aToken") : localStorage.getItem("oToken");
    console.log(loginRole);
    

    if (!token) {
      toast.error("No token found, please login first");
      return;
    }

    // Make API call with correct token
    await axios.post(
      "http://127.0.0.1:8000/api/reset-password",
      { password, password_confirmation: confirmPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Password reset successful, please login again");

    // Clear the correct token
    if (loginRole === "admin") {
      localStorage.removeItem("aToken");
    } else {
      localStorage.removeItem("oToken");
    }   

    // Redirect to login
    window.location.href = "/admin/login";

  } catch (error) {
    console.log(error.response?.data || error.message);
    toast.error("Failed to reset password");
  }
};


  return (
    <div style={{
      background: '#0B0B0F',
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          // mt: 10,
          p: 3,
          borderRadius: 2,
          bgcolor: "#0A192F",
          boxShadow: 6,

        }}
    >
        <Typography variant="h5" fontWeight="600" align="center"
          sx={{
            mb: 1,
            background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleReset}>
          <TextField
            type="password"
            label="New Password"
            size="small"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              sx: {
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                fontWeight: 500,
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#9CA3AF",
                fontSize: "14px",
                "&.Mui-focused": {
                  color: "skyblue", 
                },
              },
            }}
        />
        <TextField
          type="password"
          label="Confirm Password"
          size="small"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          InputProps={{
              sx: {
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                color: "white",
                fontWeight: 500,
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#9CA3AF",
                fontSize: "14px",
                "&.Mui-focused": {
                  color: "skyblue", 
                },
              },
            }}
        />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: 14,
              fontWeight: 'bold',
              mt: 1,
              py: 1,
              borderRadius: 2,
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
            }}

          >
            Reset Password
          </Button>
      </form>
    </Box>
    </div>
  );
};

export default ResetPassword;
