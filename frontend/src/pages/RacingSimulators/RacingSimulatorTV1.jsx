import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";

export default function RacingSimulatorTV() {
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [nextInLine, setNextInLine] = useState([]);

  const stationName = "Racing Simulator 1";
  const currentPlayer = currentPlayers[0];

  const parseDuration = (dur) => {
    if (!dur) return 0;
    const match = dur.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    let interval;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings`);
        const bookings = res.data.data;

        // current players
        const current = bookings
          .filter((b) => b.station === stationName && b.status === "confirmed")
          .map((b, index) => {
            if (!b.start_time) return null;

            const [hourStr, minStr] = b.start_time.split(":");
            const hours = parseInt(hourStr, 10);
            const minutes = parseInt(minStr, 10);
            if (isNaN(hours) || isNaN(minutes)) return null;

            const start = new Date();
            start.setHours(hours, minutes, 0, 0);

            const durationMinutes =
              (parseDuration(b.duration) || 0) +
              (parseDuration(b.extended_time) || 0);
            const end = new Date(start.getTime() + durationMinutes * 60000);

            return {
              id: b.id,
              name: b.customer_name,
              image: `../images/ps5${index + 1}.png`,
              startTime: b.start_time,
              endTime: formatTime(end),
              durationMinutes,
              startDate: start,
              endDate: end,
              index,
              timeLeft: "",
              progress: 0,
            };
          })
          .filter(Boolean);

        setCurrentPlayers(current);

        // next in line
        const next = bookings
          .filter((b) => b.station === stationName && b.status === "pending")
          .sort(
            (a, b) =>
              new Date(`${a.booking_date}T${a.start_time}:00`) -
              new Date(`${b.booking_date}T${b.start_time}:00`)
          )
          .map((b) => {
            if (!b.start_time) return null;

            const [hourStr, minStr] = b.start_time.split(":");
            const hours = parseInt(hourStr, 10);
            const minutes = parseInt(minStr, 10);
            if (isNaN(hours) || isNaN(minutes)) return null;

            const start = new Date(b.booking_date);
            start.setHours(hours, minutes, 0, 0);

            const durationMinutes =
              parseDuration(b.duration) +
              parseDuration(b.extended_time || "0m");
            const end = new Date(start.getTime() + durationMinutes * 60000);

            return {
              id: b.id,
              name: b.customer_name,
              players: "",
              timeSlot: `${b.start_time} - ${formatTime(end)}`,
            };
          })
          .filter(Boolean);

        setNextInLine(next);

        // live update timer and progress
        interval = setInterval(() => {
          setCurrentPlayers((players) =>
            players.map((p) => {
              const now = new Date();
              const totalSeconds = p.durationMinutes * 60;

              let elapsed = (now - p.startDate) / 1000;
              if (elapsed < 0) elapsed = 0;
              if (elapsed > totalSeconds) elapsed = totalSeconds;

              const remaining = totalSeconds - elapsed;
              const h = Math.floor(remaining / 3600);
              const m = Math.floor((remaining % 3600) / 60);
              const s = Math.floor(remaining % 60);
              const progress = (elapsed / totalSeconds) * 100;

              return {
                ...p,
                timeLeft: `${h > 0 ? h + "h " : ""}${m < 10 ? "0" : ""}${m}:${
                  s < 10 ? "0" : ""
                }${s}`,
                progress,
              };
            })
          );
        }, 1000);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchBookings();

    return () => clearInterval(interval);
  }, []);

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
          Racing Simulator 1
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                src="../images/racing_si.png"
                alt="Racing Simulator"
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
                  <img
                    src="../images/p_name.png"
                    alt="Player"
                    style={{ width: 22, height: 22 }}
                  />
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
                    {currentPlayer?.name || "--"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ marginBottom: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <img
                    src="../images/p_id.png"
                    alt="ID"
                    style={{ width: 22, height: 22 }}
                  />
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
                    {currentPlayer?.id || "--"}
                  </Typography>
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box>
                <LinearProgress
                  variant="determinate"
                  value={currentPlayer?.progress || 0}
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
                    {currentPlayer?.startTime || "--"}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
                    {currentPlayer?.endTime || "--"}
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
                {currentPlayer?.timeLeft || "00:00"}
              </Typography>
            </Box>
          </Box>
        </Box>

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
