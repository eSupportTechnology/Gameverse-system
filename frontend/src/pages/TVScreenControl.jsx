import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/Sidebar";

const TVScreenControl = () => {
  const navigate = useNavigate();

  const tvScreens = [
    {
      id: 1,
      title: "PS5 Station",
      image: "/images/ps5.png",
      path: "/tv-screens/ps5-station",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: "Racing Simulator",
      image: "/images/racing_si.png",
      path: "/tv-screens/racing-simulator",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: "Supreme Billiard Table",
      image: "/images/supremebtable.png",
      path: "/tv-screens/supreme-billiard",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: 4,
      title: "Premium Billiard Table",
      image: "/images/premiumbtable.png",
      path: "/tv-screens/premium-billiard",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      id: 5,
      title: "TV Offers",
      image: "/images/offers.png",
      path: "/tv-screens/offers",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <SidebarLayout />
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#0a0e27",
          color: "white",
          overflowY: "auto",
          padding: 4,
        }}
      >
        {/* Header with Search Bar */}
        <Box 
          sx={{ 
            marginBottom: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Title Section */}
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 1,
              }}
            >
              TV Screen Control Panel
            </Typography>
            <Typography variant="body1" sx={{ color: "#8b92b0" }}>
              TV Screen Control Made Easy
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box
            sx={{
              backgroundColor: "#1a1f3a",
              borderRadius: 2,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              minWidth: "500px",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "16px",
                width: "100%",
              }}
            />
          </Box>
        </Box>

        {/* TV Screen Cards Grid */}
        <Grid container spacing={3}>
          {tvScreens.map((screen) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={screen.id}>
              <Card
                sx={{
                  backgroundColor: "#1a1f3a",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                <CardActionArea onClick={() => handleCardClick(screen.path)}>
                  <Box
                    sx={{
                      height: 180,
                      background: screen.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 3,
                    }}
                  >
                    <Box
                      component="img"
                      src={screen.image}
                      alt={screen.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ backgroundColor: "#0f1326", padding: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      {screen.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TVScreenControl;
