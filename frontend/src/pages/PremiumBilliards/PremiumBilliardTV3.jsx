import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export default function PremiumBilliardTV() {
  const currentPlayer = {
    name: "Lahiru Lakshitha",
    id: "12345",
    startTime: "12:30",
    endTime: "13:30",
    timeLeft: "30:29",
    progress: 50,
  };

  const nextInLine = [
    { id: "12345", name: "Lahiru Lakshitha", timeSlot: "12:30 - 13:30" },
    { id: "12346", name: "Isuru Pradep", timeSlot: "13:30 - 14:30" },
    { id: "12347", name: "Raveen Kanishka", timeSlot: "14:30 - 15:30" },
    { id: "12348", name: "Muditha Dilshan", timeSlot: "15:30 - 16:30" },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        backgroundImage: "linear-gradient(135deg, #1a0033 0%, #0a0a1a 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 1.5,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            }}
          >
            Premium Billiard Table 3
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Current Player - Full Width */}
          <Box
            sx={{
              backgroundColor: "rgba(30, 15, 60, 0.8)",
              borderRadius: 3,
              padding: 2.5,
              border: "1px solid rgba(138, 43, 226, 0.4)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#fff",
                fontWeight: "bold",
                marginBottom: 1.5,
              }}
            >
              Current Player
            </Typography>

            <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
              {/* Player Image */}
              <Box
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "3px solid rgba(236, 72, 153, 0.5)",
                  flexShrink: 0,
                }}
              >
                <img
                  src="../images/premiumbtable.png"
                  alt="Premium Billiard Table"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Player Info */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ marginBottom: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <img src="../images/p_name.png" alt="Player" style={{ width: 22, height: 22 }} />
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: 16,
                      }}
                    >
                      Player Name :
                    </Typography>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {currentPlayer.name}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ marginBottom: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <img src="../images/p_id.png" alt="ID" style={{ width: 22, height: 22 }} />
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: 16,
                      }}
                    >
                      Player ID :
                    </Typography>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {currentPlayer.id}
                    </Typography>
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={currentPlayer.progress}
                    sx={{
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "& .MuiLinearProgress-bar": {
                        background: "linear-gradient(90deg, #00D9FF 0%, #EC4899 100%)",
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 1,
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
                      {currentPlayer.startTime}
                    </Typography>
                    <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
                      {currentPlayer.endTime}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Time Left */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingX: 3,
                }}
              >
                <Typography
                  sx={{
                    color: "#EC4899",
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 1,
                  }}
                >
                  Time Left
                </Typography>
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: 48,
                    fontWeight: "bold",
                    lineHeight: 1,
                  }}
                >
                  {currentPlayer.timeLeft}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Section - Next in Line & QR Code side by side */}
          <Box sx={{ display: "flex", gap: 2.5 }}>
            {/* Next in Line */}
            <Box
              sx={{
                backgroundColor: "rgba(30, 15, 60, 0.8)",
                borderRadius: 3,
                padding: 2.5,
                border: "1px solid rgba(138, 43, 226, 0.4)",
                flex: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  marginBottom: 1.5,
                  textAlign: "center",
                }}
              >
                NEXT IN LINE
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {nextInLine.map((player) => (
                  <Box
                    key={player.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: 1.5,
                      backgroundColor: "rgba(139, 92, 246, 0.15)",
                      borderRadius: 2,
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: "120px" }}>
                      <img src="../images/tuser.png" alt="User" style={{ width: 24, height: 24 }} />
                      <Typography sx={{ color: "#fff", fontSize: 16, fontWeight: "500" }}>
                        {player.id}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "#fff", fontSize: 16, fontWeight: "500", flex: 1, paddingLeft: 2 }}>
                      {player.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: 14,
                        minWidth: "120px",
                        textAlign: "right",
                      }}
                    >
                      {player.timeSlot}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* QR Code */}
            <Box
              sx={{
                backgroundColor: "rgba(30, 15, 60, 0.8)",
                borderRadius: 3,
                padding: 2.5,
                border: "1px solid rgba(138, 43, 226, 0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 1.5,
                }}
              >
                Scan to visit our site
              </Typography>
              <Box
                sx={{
                  width: 220,
                  height: 220,
                  backgroundColor: "#fff",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                }}
              >
                <img
                  src="../images/scan.png"
                  alt="Scan QR Code"
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
