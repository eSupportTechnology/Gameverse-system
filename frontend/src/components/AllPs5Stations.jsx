import { Box, Button, Typography } from '@mui/material'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from 'react'
import { useNavigate } from "react-router-dom";
import { AllStations } from '../assets/assets';

const AllPs5Stations = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
            <Typography variant="h5" fontWeight="bold" fontSize={24}>Website Management </Typography>
            <Typography variant="body2" color="gray" fontSize={16}>Manage Website</Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box display="flex" flexDirection={{ xs: "column", sm: "row", md: "row" }}
          justifyContent={{ xs: "flex-start", sm: "space-between", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2} gap={1}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* BACK BUTTON */}
            <Button
              onClick={() => navigate(-1)}
              sx={{
                bgcolor: "#1F2937",
                color: "#9CA3AF",
                padding: "10px 16px",
                minWidth: "40px",
                borderRadius: "4px",
                textTransform: "none",
                "&:hover": { bgcolor: "#1F2937" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </Button>

            {/* CATEGORY BUTTON */}
            <Button
              sx={{
                bgcolor: "rgba(12, 215, 255, 0.3)",
                border: "1px solid #0CD7FF",
                color: "#0CD7FF",
                padding: "8px 20px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: "8px",
                "&:hover": { bgcolor: "rgba(12, 215, 255, 0.3)" },
              }}
            >
              All PS5 Stations
            </Button>

          </Box>

          <Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                borderRadius: "6px",
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
              }}
            // onClick={() => setOpenAddGame(true)}
            >
              + Add Stations
            </Button>

            {/* <AddGameDialog
              open={openAddGame}
              onClose={() => setOpenAddGame(false)}
            /> */}


          </Box>

        </Box>

        {/* Card sections */}
        <div style={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px", }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
              p: 2,
              alignItems: "stretch",
            }}
          >
            {AllStations.map((item, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                <Box sx={{
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  height: 360,
                  border: "1px solid transparent",
                  backgroundImage: "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",

                }}>
                  <Box sx={{ backgroundColor: "#000000", flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: "12px" }}>
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "190px",
                        objectFit: "cover",
                      }}
                    />

                    {/* TEXT CONTENT */}
                    <Box sx={{ p: 2, textAlign: "center", flexGrow: 1, }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "500", color: "white" }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: "14px", fontWeight: "400", marginTop: "8px", color: "#FFFFFF" }}>
                        {item.desc}
                      </p>
                    </Box>
                  </Box>
                </Box>

                {/* BUTTON */}
                <Box sx={{ py: 2 }}>
                  <button className="card-button-red">Remove</button>
                </Box>
              </Box>
            ))
            }

          </Box>
        </div>

      </Box>
    </div>
  )
}

export default AllPs5Stations
