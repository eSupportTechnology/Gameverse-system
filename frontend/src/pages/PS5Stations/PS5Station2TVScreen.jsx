import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";

export default function TVScreens() {
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [nextInLine, setNextInLine] = useState([]);

  const stationName = "PS5 Station 2";

  // Helper to parse duration string like {1h 30m} to minutes
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
            (parseDuration(b.duration) || 0) + (parseDuration(b.extended_time) || 0);
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

      // next in line section
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

          const durationMinutes = parseDuration(b.duration) + parseDuration(b.extended_time || "0m");
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

      // progress and time left updater
      interval = setInterval(() => {
        setCurrentPlayers((players) =>
          players.map((p) => {
            const now = new Date();
            const totalSeconds = p.durationMinutes * 60;

            // elapsed time in seconds
            let elapsed = (now - p.startDate) / 1000;

            // booking hasn't started yet
            if (elapsed < 0) elapsed = 0; 

            // booking finished
            if (elapsed > totalSeconds) elapsed = totalSeconds; 

            // remaining time in seconds
            const remaining = totalSeconds - elapsed;

            const h = Math.floor(remaining / 3600);
            const m = Math.floor((remaining % 3600) / 60);
            const s = Math.floor(remaining % 60);

            // progress percentage
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
          {stationName}
        </Typography>
      </Box>

        {/* //current players section */}
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, paddingX: 2, marginBottom: 2 }}>
          {currentPlayers.map((player) => (
            <Box key={player.id} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <Box
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 2,
                  overflow: "hidden",
                  marginBottom: 1.5,
                  border: player.index === 2 ? "3px solid rgba(100, 180, 255, 0.8)" : "3px solid rgba(236, 72, 153, 0.6)",
                }}
              >
                <img
                  src={player.image}
                  alt={player.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: player.index === 2 ? "grayscale(100%)" : "none",
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={currentPlayers[0]?.progress || 0}
              sx={{
                height: 8,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.1)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #00D9FF 0%, #EC4899 100%)",
                },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 0.5 }}>
              <Typography sx={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {currentPlayers[0]?.startTime || "--:--"}
              </Typography>

              <Typography sx={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
                {currentPlayers[0]?.endTime || "--:--"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ color: "#EC4899", fontSize: 13, fontWeight: "bold", marginBottom: 0.5 }}>
              Time Left
            </Typography>
            <Typography sx={{ color: "#fff", fontSize: 34, fontWeight: "bold" }}>
              {currentPlayers[0]?.timeLeft || "0 min"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* next in line and qr section */}
      <Box sx={{ display: "flex", gap: 2, flex: "0 0 32%", marginTop: 1 }}>
        {/* next in line  */}
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
