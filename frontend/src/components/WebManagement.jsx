import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import AddGameDialog from './AddGameDialog';
import AddEventDialog from './AddEventDialog';
import { BookingGames, OtherGames, Event } from '../assets/assets';
import AddGalleyDialog from './AddGalleyDialog';
import EditIcon from '../assets/editicon.png';


const categories = [
  { label: 'Booking Games' },
  { label: 'Other Games' },
  { label: 'Event & Tournaments' },
  { label: "Gallery" }
]

const routeMap = {
  "PS5 Stations": "/web-portal/station",
  "Pool Tables": "/web-portal/pool",
  "Racing Simulators": "/web-portal/simulator",
};


const WebManagement = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('Booking Games');
  const [openAddGame, setOpenAddGame] = useState(false);
  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [openAddPhoto, setOpenAddPhoto] = useState(false)

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
        <Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row" }}
          justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2}>

          {/* Category */}
          <ToggleButtonGroup
            value={activeCategory}
            exclusive
            onChange={(e, newCategory) => newCategory && setActiveCategory(newCategory)}
            sx={{
              gap: 1,
              flexWrap: 'wrap',
              '& .MuiToggleButton-root': {
                bgcolor: '#1F2937',
                color: '#9CA3AF',
                border: 'none',
                padding: '8px 27px',
                textTransform: 'none',
                fontWeight: '600',
                fontSize: 12,
                '&.Mui-selected': {
                  bgcolor: 'rgba(12, 215, 255, 0.3)',
                  border: '1px solid #0CD7FF',
                  color: '#0CD7FF',
                },
              },
            }}
          >
            {categories.map((cat) => (
              <ToggleButton key={cat.label} value={cat.label}>
                {cat.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box>
            {activeCategory === "Other Games" && (
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
                onClick={() => setOpenAddGame(true)}
              >
                + Add Games
              </Button>
            )}

            {activeCategory === "Event & Tournaments" && (
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
                onClick={() => setOpenAddEvent(true)}
              >
                + Add Event & Tournaments
              </Button>
            )}
            {activeCategory === "Gallery" && (
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
                onClick={() => setOpenAddPhoto(true)}
              >
                + Add Photos
              </Button>
            )}
            {/* add fotm this to  */}
            <AddGameDialog
              open={openAddGame}
              onClose={() => setOpenAddGame(false)}
            />

            <AddEventDialog
              open={openAddEvent}
              onClose={() => setOpenAddEvent(false)}
            />

            <AddGalleyDialog
              open={openAddPhoto}
              onClose={() => setOpenAddPhoto(false)}
            />
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
            {/* Booking Games section */}
            {activeCategory === "Booking Games" &&
              BookingGames.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {/* EDIT ICON BUTTON */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#C500FFCC",  
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={() => console.log("Edit clicked")}
                  >
                    <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                  </Box>

                  <Box sx={{
                    backgroundColor: "#000000",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
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
                          height: "240px",
                          objectFit: "cover",
                        }}
                      />

                      {/* TEXT CONTENT */}
                      <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
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
                    <button onClick={() => navigate(routeMap[item.title])} className="card-button">{item.button}</button>
                  </Box>
                </Box>
              ))
            }


            {activeCategory === "Other Games" &&
              OtherGames.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    position:'relative'
                  }}
                >
                  {/* EDIT ICON BUTTON */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: "#C500FFCC",  
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={() => console.log("Edit clicked")}
                  >
                    <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                  </Box>

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

            {activeCategory === "Event & Tournaments" &&
              Event.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    position:"relative"
                  }}
                >
                  {/* EDIT ICON BUTTON */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: "#C500FFCC",  
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={() => console.log("Edit clicked")}
                  >
                    <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                  </Box>

                  <Box sx={{
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid transparent",
                    backgroundImage: "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",

                  }}>
                    <Box sx={{ backgroundColor: "#000000", flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: "12px", height: 295 }}>
                      {/* IMAGE */}
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "196px",
                          objectFit: "cover",
                        }}
                      />

                      {/* TEXT CONTENT */}
                      <Box sx={{ p: 2, textAlign: "center", flexGrow: 1, }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "500", color: "white" }}>
                          {item.title}
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          fontWeight: "400",
                          marginTop: "8px",
                          background: "linear-gradient(180deg, #CF36E1, #15A2EF)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}>
                          {item.date}
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

            {activeCategory === "Gallery" &&
              Event.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "100%",
                    position:'relative'
                  }}
                >
                  {/* EDIT ICON BUTTON */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      backgroundColor: "#C500FFCC",  
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      zIndex: 10,
                    }}
                    onClick={() => console.log("Edit clicked")}
                  >
                    <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                  </Box>

                  <Box sx={{
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid transparent",
                    backgroundImage: "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",

                  }}>
                    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: "12px", height: 248 }}>
                      {/* IMAGE */}
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          borderRadius: "12px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
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

export default WebManagement
