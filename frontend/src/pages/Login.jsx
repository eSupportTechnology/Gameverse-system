import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { AppContext } from "../context/AppContext";
import { API_BASE_URL } from "../apiConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useContext(AppContext);

  const { setAToken, setOToken, loginRole, setLoginRole } =
    useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, { email, password });

      const { token, role, must_reset_password } = res.data;

      // Store token under the right key based on actual role returned
      if (role === "operator") {
        localStorage.setItem("oToken", token);
        setOToken(token);
      } else {
        localStorage.setItem("aToken", token);
        setAToken(token);
      }

      localStorage.setItem("loginRole", role);
      setLoginRole(role);

      // Store user info in context + localStorage
      loginUser(res.data.user);

      // Persist reset flag so routing enforces it across reloads
      localStorage.setItem("mustResetPassword", must_reset_password ? "1" : "0");

      if (must_reset_password) {
        toast.info("You must reset your password before continuing.");
        window.location.href = "/reset-password";
      } else {
        toast.success("Login successful!");
        window.location.href = "/";
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    }
  };

  return (
    <div style={{ background: "#0B0B0F" }}>
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          minHeight: "100vh",
        }}
      >
        <Box
          component="form"
          onSubmit={onSubmitHandler}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "#0A192F",
            p: 2,
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            align="center"
            sx={{
              mb: 1,
              background: "linear-gradient(90deg, #00C6FF, #FF00CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {loginRole} Login
          </Typography>

          <Box>
            <Typography
              fontSize={14}
              fontWeight={500}
              color="#FFFFFF"
              gutterBottom
            >
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
            <Typography
              fontSize={14}
              fontWeight={500}
              color="#FFFFFF"
              gutterBottom
            >
              Password
            </Typography>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      sx={{ color: "#9CA3AF" }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
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
              fontWeight: "bold",
              mt: 1,
              py: 1,
              borderRadius: 2,
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              "&:hover": {
                background: "linear-gradient(to right, #0bbfe0, #732ed1)",
              },
            }}
          >
            Login
          </Button>

          {/* Switch between Admin & Operator */}
          {loginRole === "admin" ? (
            <Typography
              fontSize={13}
              align="center"
              color="white"
              sx={{ mt: 1 }}
            >
              Operator Login?{" "}
              <span
                onClick={() => setLoginRole("operator")}
                style={{
                  cursor: "pointer",
                  color: "#0CD7FF",
                  textDecoration: "underline",
                }}
              >
                Click here
              </span>
            </Typography>
          ) : (
            <Typography
              fontSize={13}
              align="center"
              color="white"
              sx={{ mt: 1 }}
            >
              Admin Login?{" "}
              <span
                onClick={() => setLoginRole("admin")}
                style={{
                  cursor: "pointer",
                  color: "#0CD7FF",
                  textDecoration: "underline",
                }}
              >
                Click here
              </span>
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Login;
