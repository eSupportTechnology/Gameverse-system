import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function TVScreens() {
  const currentPlayers = [
    { name: "Lahiru Lakshitha", id: "123456", image: "../images/ps51.png" },
    { name: "Kavindu Malshan", id: "123457", image: "../images/ps52.png" },
    { name: "Prasad Isuru", id: "123458", image: "../images/ps53.png" },
    { name: "Sanka Dineth", id: "123459", image: "../images/ps54.png" },
  ];

  const progress = 65;
  const startTime = "12:30";
  const endTime = "13:30";
  const timeLeft = "30:29";

  const nextInLine = [
    {
      id: "12346",
      name: "Isuru Pradep",
      players: "12347 - Kavindu Malshan ....",
      timeSlot: "12:30 - 13:30",
    },
    { id: "12347", name: "Raveen Kanishka", players: "", timeSlot: "14:30 - 15:30" },
    { id: "12348", name: "Muditha Dilshan", players: "", timeSlot: "15:30 - 16:30" },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#1a0033",
        backgroundImage: "linear-gradient(135deg, #1a0033 0%, #0a0a1a 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 1.5,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: 1,
          marginBottom: 1,
        }}
      >
        <img src="../images/logo.png" alt="Gameverse Logo" style={{ height: 55 }} />

        <Typography
          sx={{
            background: "linear-gradient(90deg, #00D9FF 0%, #7B61FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            fontSize: "2.3rem",
            letterSpacing: 2,
          }}
        >
          PS5 Station 2
        </Typography>
      </Box>

      {/* CURRENT PLAYERS */}
      <Box
        sx={{
          backgroundColor: "rgba(30, 15, 60, 0.6)",
          borderRadius: 3,
          border: "2px solid rgba(123, 97, 255, 0.5)",
          padding: 2,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.6rem",
            marginBottom: 2,
          }}
        >
          CURRENT PLAYERS
        </Typography>

        {/* Player Cards */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            paddingX: 2,
            marginBottom: 2,
          }}
        >
          {currentPlayers.map((player, index) => (
            <Box
              key={player.id}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 1.5,
                  border:
                    index === 2
                      ? "3px solid rgba(100, 180, 255, 0.8)"
                      : "3px solid rgba(236, 72, 153, 0.6)",
                }}
              >
                <img
                  src={player.image}
                  alt={player.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: index === 2 ? "grayscale(100%)" : "none",
                  }}
                />
              </Box>

              <Typography sx={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                Player : {player.name}
              </Typography>

              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                ID : {player.id}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Progress + Time Left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #00D9FF 0%, #EC4899 100%)",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 0.5,
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {startTime}
              </Typography>

              <Typography sx={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {endTime}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ color: "#EC4899", fontSize: 13, fontWeight: "bold", marginBottom: 0.5 }}
            >
              Time Left
            </Typography>
            <Typography sx={{ color: "#fff", fontSize: 34, fontWeight: "bold" }}>
              {timeLeft}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* BOTTOM SECTION */}
      <Box sx={{ display: "flex", gap: 2, flex: "0 0 32%", marginTop: 1 }}>
        {/* NEXT IN LINE */}
        <Box
          sx={{
            backgroundColor: "rgba(30, 15, 60, 0.6)",
            borderRadius: 3,
            border: "2px solid rgba(123, 97, 255, 0.5)",
            padding: 2,
            flex: 2.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.6rem",
              marginBottom: 1,
            }}
          >
            NEXT IN LINE
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
            {nextInLine.map((p) => (
              <Box
                key={p.id}
                sx={{
                  backgroundColor: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.4)",
                  borderRadius: 2,
                  paddingY: 1.2,
                  paddingX: 1.6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PersonIcon sx={{ color: "#EC4899", fontSize: 24 }} />
                  <Typography sx={{ color: "#fff", fontSize: 15 }}>
                    {p.id} – {p.name}
                    {p.players && ` , ${p.players}`}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 14,
                    minWidth: "130px",
                    textAlign: "right",
                  }}
                >
                  {p.timeSlot}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* QR Section */}
        <Box
          sx={{
            backgroundColor: "rgba(30, 15, 60, 0.6)",
            borderRadius: 3,
            border: "2px solid rgba(123, 97, 255, 0.5)",
            padding: 2,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 1,
              fontSize: "1.1rem",
            }}
          >
            Scan to visit our site
          </Typography>

          <Box
            sx={{
              width: "100%",
              maxWidth: 160,
              aspectRatio: "1",
              backgroundColor: "#fff",
              borderRadius: 2,
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="../images/scan.png"
              alt="QR"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
