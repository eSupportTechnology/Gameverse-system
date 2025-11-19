import React from "react";
import { Box, Typography } from "@mui/material";

export default function ValuableOffersScreen() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#150026",
        backgroundImage: "linear-gradient(135deg, #150026 0%, #080815 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <img
          src="../images/logo.png"
          alt="Gameverse Logo"
          style={{ height: 55 }}
        />
      </Box>

      {/* Title Box */}
      <Box
        sx={{
          marginBottom: 3,
          backgroundColor: "rgba(40, 20, 70, 0.55)",
          borderRadius: 3,
          border: "2px solid rgba(140, 120, 255, 0.5)",
          padding: 3,
          boxShadow: "0 0 25px rgba(120, 90, 255, 0.25)",
        }}
      >
        <Typography
          sx={{
            background: "linear-gradient(90deg, #00E4FF 0%, #FF00E5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "700",
            fontSize: "2.8rem",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          Valuable Offers Available
        </Typography>
      </Box>

      {/* Offer Banner Box */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "rgba(40, 20, 70, 0.55)",
          borderRadius: 3,
          border: "2px solid rgba(140, 120, 255, 0.5)",
          padding: 3,
          boxShadow: "0 0 25px rgba(120, 90, 255, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="../images/offers.png"
          alt="Cyber Monday Special Offer"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "18px",
          }}
        />
      </Box>
    </Box>
  );
}
