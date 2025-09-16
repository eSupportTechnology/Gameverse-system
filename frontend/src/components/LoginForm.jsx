import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Link } from "@mui/material";

const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log("login creted");
    


    // ✅ Close the dialog after successful login
    if (onClose) onClose();
  };

  return (
    <div>
      <Box
        component="form"
        onSubmit={onSubmitHandler}
        sx={{ display: "flex", flexDirection: "column", gap: 2, }}
      >
        <Typography variant="h5" fontWeight="600" align="center"
          sx={{
            mb: 1,
            background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
          Admin Login
        </Typography>

        <Box>
          <Typography fontSize={14} fontWeight={500} color="#FFFFFF" gutterBottom>
            Email
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter Email Address"
            InputProps={{
              sx: {
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                "& input::placeholder": {
                  color: "#9CA3AF",
                  fontSize: "14px",
                },
                color: "white",
                fontWeight: 500,
              },
            }}
          />
        </Box>

        <Box>
          <Typography fontSize={14} fontWeight={500} color="#FFFFFF" gutterBottom>
            Password
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            InputProps={{
              sx: {
                backgroundColor: "#1F2937",
                borderRadius: "6px",
                "& input::placeholder": {
                  color: "#9CA3AF",
                  fontSize: "14px",
                },
                color: "white",
                fontWeight: 500,
              },
            }}
          />
        </Box>

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
          Login
        </Button>
      </Box>

    </div>
  )
}

export default LoginForm
