import React from "react";
import { Box, Typography } from "@mui/material";
import SidebarLayout from "../components/Sidebar";

export default function TVOffers() {
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SidebarLayout />
      <Box
        sx={{
          flex: 1,
          height: "100vh",
          backgroundColor: "#000",
          backgroundImage: "linear-gradient(135deg, #1a0033 0%, #0a0a1a 100%)",
          display: "flex",
          flexDirection: "column",
          padding: 3,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, position: "absolute", left: 24 }}>
            <img
              src="../images/logo.png"
              alt="Gameverse Logo"
              style={{ height: 50 }}
            />
          </Box>
          <Typography
            variant="h3"
            sx={{
              background: "linear-gradient(90deg, #00D9FF 0%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: "3rem",
              textAlign: "center",
            }}
          >
            Valuable Offers Available
          </Typography>
        </Box>

        {/* Offers Display */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "1200px",
              backgroundColor: "rgba(30, 15, 60, 0.8)",
              borderRadius: 4,
              padding: 4,
              border: "2px solid rgba(138, 43, 226, 0.5)",
              boxShadow: "0 10px 40px rgba(138, 43, 226, 0.3)",
            }}
          >
            {/* Offer Image */}
            <Box
              sx={{
                width: "100%",
                height: "500px",
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1a0050 0%, #000033 100%)",
                border: "2px solid rgba(138, 43, 226, 0.3)",
              }}
            >
              <img
                src="../images/offers.png"
                alt="Special Offers"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
