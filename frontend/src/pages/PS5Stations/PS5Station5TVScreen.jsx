import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { API_BASE_URL } from "../../apiConfig";
import { useNavigate } from "react-router-dom";
import TVOfferPlayer from "../TVOfferPlayer";
import { useLocation } from "react-router-dom";


export default function TVScreens() {
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [nextInLine, setNextInLine] = useState([]);

  const stationName = "PS5 Station 5";
  const STATION_KEY = "ps5-5";
  const [offer, setOffer] = useState(null);
  const [showOffer, setShowOffer] = useState(false);
  const [offerLoaded, setOfferLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
    
    // for auto slide
    const stationOrder = [
    "/ps5-station1",
    "/ps5-station2",
    "/ps5-station3",
    "/ps5-station4",
    "/ps5-station5",
    "/racing-simulator1",
    "/racing-simulator2",
    "/racing-simulator3",
    "/racing-simulator4",
    "/supreme-billiard1",
    "/supreme-billiard2",
    "/premium-billiard1",
    "/premium-billiard2",
    "/premium-billiard3",
  ];

  const goNext = () => {
  setShowOffer(false); 
  const currentIndex = stationOrder.indexOf(location.pathname);
  navigate(stationOrder[(currentIndex + 1) % stationOrder.length]);
};

  // helper for empty slots
  const placeholderPlayer = (idx) => ({
    id: "",
    name: "",
    index: idx,
    image: `../images/ps5${idx + 1}.png`, 
    startTime: "--:--",
    endTime: "--:--",
    timeLeft: "0:00",
    progress: 0,
    endDate: new Date(),
    durationMinutes: 0,
    isPlaceholder: true, 
  });


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
  let fetchInterval;
  let countdownInterval;

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings`);
      const bookings = res.data.data;
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      const todayBookings = bookings.filter(
        b =>
          b.station === stationName &&
          b.booking_date === todayStr &&
          b.start_time &&
          (b.status === "confirmed" || b.status === "pending")
      );

      const slotMap = {};
      todayBookings.forEach(b => {
        const startDate = new Date(`${b.booking_date} ${b.start_time}`);
        const durationMinutes =
          (parseDuration(b.duration) || 0) +
          (parseDuration(b.extended_time || "0m") || 0);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        if (!slotMap[b.start_time]) {
          slotMap[b.start_time] = { startDate, endDate, bookings: [] };
        }

        slotMap[b.start_time].bookings.push({
          ...b,
          startDate,
          endDate,
          durationMinutes,
        });
      });

      const slots = Object.values(slotMap).sort(
        (a, b) => a.startDate - b.startDate
      );

      const nowSlot = slots.find(
        s => now >= s.startDate && now < s.endDate
      );

      setCurrentPlayers(prevPlayers => {
        let freshPlayers = [0, 1, 2, 3].map(idx => placeholderPlayer(idx));

        if (nowSlot) {
          nowSlot.bookings.forEach((b, idx) => {
            if (idx < 4) {
              const existing = prevPlayers[idx] || {};
              freshPlayers[idx] = {
                ...b,
                index: idx,
                id: b.id,
                name: b.customer_name,
                image: `../images/ps5${idx + 1}.png`,
                startTime: b.start_time,
                endTime: formatTime(b.endDate),
                //keep existing countdown if present
                timeLeft: existing.timeLeft || "0:00",
                progress: existing.progress || 0,
                endDate: b.endDate,
                durationMinutes: b.durationMinutes,
                isPlaceholder: false,
              };
            }
          });
        }

        return freshPlayers;
      });

      // NEXT IN LINE
      const upcoming = slots
        .filter(s => s.startDate > now)
        .map(slot => {
          const allNames = slot.bookings.map(
            b => `${b.id}-${b.customer_name}`
          );

          const staticNames =
            allNames.length > 2 ? allNames.slice(0, 2) : allNames;

          const scrollNames =
            allNames.length > 2 ? allNames.slice(2) : [];

          return {
            key: slot.startDate.getTime(),
            staticNames,
            scrollNames,
            shouldScroll: scrollNames.length > 0,
            startTime: formatTime(slot.startDate),
            endTime: formatTime(slot.endDate),
          };
        });

      setNextInLine(upcoming);
    } catch (err) {
      console.error(err);
    }
  };

  fetchBookings();
  fetchInterval = setInterval(fetchBookings, 1000);

  //Countdown
  countdownInterval = setInterval(() => {
    const now = new Date();

    setCurrentPlayers(players =>
      players.map(p => {
        if (p.isPlaceholder) return p;

        const remainingSec = Math.max(
          (p.endDate - now) / 1000,
          0
        );

        const totalSec = p.durationMinutes * 60 || 1;

        const h = Math.floor(remainingSec / 3600);
        const m = Math.floor((remainingSec % 3600) / 60);
        const s = Math.floor(remainingSec % 60);

        return {
          ...p,
          timeLeft: `${h ? h + "h " : ""}${m
            .toString()
            .padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`,
          progress: ((totalSec - remainingSec) / totalSec) * 100,
        };
      })
    );
  }, 1000);

  return () => {
    clearInterval(fetchInterval);
    clearInterval(countdownInterval);
  };
}, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/tv-screen`)
      .then(res => {
        const stationOffer = res.data.find(o => o.station_key === STATION_KEY);
        //console.log("OFFER:", stationOffer); 

        setOffer(stationOffer || null);
        setOfferLoaded(true);
      })
      .catch(err => {
        //console.error("OFFER ERROR:", err); 
        setOffer(null);
        setOfferLoaded(true);
      });
  }, []);


  useEffect(() => {
      if (!offerLoaded) return;
  
      const timer = setTimeout(() => {
        if (offer && offer.status === "posted") {
          setShowOffer(true);
        } else {
          goNext();
        }
      }, 30000);
  
      return () => clearTimeout(timer);
    }, [offerLoaded]);
  
    // useEffect(() => {
    //   // Auto-slide to next station 
    //   const slideTimer = setInterval(() => {
    //     const currentPath = window.location.pathname;
    //     const currentIndex = stationOrder.indexOf(currentPath);
    //     const nextIndex = (currentIndex + 1) % stationOrder.length;
    //     navigate(stationOrder[nextIndex]);
    //   }, 15000);
  
    //   return () => clearInterval(slideTimer);
    // }, [navigate]);
  
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
            <Box key={player.id || `player-${player.index}`}  sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
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
                key={p.key}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: 300 }}>
                  <PersonIcon sx={{ color: "#EC4899", fontSize: 22 }} />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    maxWidth: 260,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: 15,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      flexShrink: 0,
                    }}
                  >
                    {p.staticNames.join(" , ")}
                    {p.staticNames.length > 0 && p.shouldScroll ? " , " : ""}
                  </Typography>
                    {/* auto scroll */}
                  {p.shouldScroll && (
                    <Box className="marquee" sx={{ overflow: "hidden" }}>
                      <span style={{ color: "#fff", fontSize: 15 }}>
                        {p.scrollNames.join(" , ")}
                      </span>
                    </Box>
                  )}
                </Box>
              </Box>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontSize: 14,
                    minWidth: "130px",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {p.startTime} - {p.endTime}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* QR code section */}
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
          {showOffer && offer && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: "black",
                zIndex: 9999,
              }}
            >
              <TVOfferPlayer
                url={`${API_BASE_URL}/storage/${offer.file_path}`}
                type={offer.file_type}
                onDone={goNext}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
