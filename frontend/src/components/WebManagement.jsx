import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddGameDialog from "./AddGameDialog";
import AddEventDialog from "./AddEventDialog";
import { BookingGames, OtherGames, Event, Gallery } from "../assets/assets";
import AddGalleyDialog from "./AddGalleyDialog";
import EditIcon from "../assets/editicon.png";
import CloseIcon from "@mui/icons-material/Close";
import upload from "../assets/upload.png";
import CancelPopup from "./CancelPopup";
import UpdateSuccessDialog from "./UpdateSuccess";
import ThumbnailUpdate from "./ThumbnailUpdate";
import RemovePopup from "./RemovePopup";
import axios from "axios";
import { toast } from "react-toastify";
import OtherGamesSection from "./OtherGamesSection";
import AddNewGame from "./AddNewGame";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../api";
import { getGallery, addGalleryPhoto, deleteGalleryPhoto } from "../api";



const categories = [
  { label: "Booking Games" },
  { label: "Other Games" },
  { label: "Event & Tournaments" },
  { label: "Gallery" },
];

const routeMap = {
  "PS5 Stations": "/web-portal/station",
  "Pool Tables": "/web-portal/pool",
  "Racing Simulators": "/web-portal/simulator",
};

const WebManagement = () => {
  const navigate = useNavigate();

  const [bookingGames, setBookingGames] = useState(BookingGames);
  const [games, setGames] = useState(OtherGames);
  const [event, setEvent] = useState(Event);
  const [gallery, setGallery] = useState(Gallery);
  const [activeCategory, setActiveCategory] = useState("Booking Games");

  const [openAddGame, setOpenAddGame] = useState(false);
  const [openEditGame, setOpenEditGame] = useState(false);
  const [editDbGameData, setEditDbGameData] = useState(null);
  const [openEditDbGame, setOpenEditDbGame] = useState(false);

  const [editData, setEditData] = useState(null);
  const [gameRemoveMessage, setGameRemoveMessage] = useState("");
  const [gameToRemove, setGameToRemove] = useState(null);
  const [removeGame, setRemoveGame] = useState(false);

  const [openAddEvent, setOpenAddEvent] = useState(false);
  const [openEditEvent, setOpenEditEvent] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [eventRemoveMessage, setEventRemoveMessage] = useState("");
  const [eventToRemove, setEventToRemove] = useState(null);
  const [removeEvent, setRemoveEvent] = useState(false);

  const [openAddPhoto, setOpenAddPhoto] = useState(false);
  const [photoRemoveMessage, setPhotoRemoveMessage] = useState("");
  const [photoToRemove, setPhotoToRemove] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editStationCategory, setEditStationCategory] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [openCategoryUpdate, setOpenCategoryUpdate] = useState(false);
  const [thumbUpdateSuccess, setThumbUpdateSuccess] = useState(false);
  const [dbGames, setDbGames] = useState([]);

  const handleUpdate = () => {
    const updatedList = bookingGames.map((game) =>
      game.title === selectedCategory.titleBeforeEdit ? selectedCategory : game
    );

    setBookingGames(updatedList);
    console.log(updatedList);

    setEditStationCategory(false);
    setOpenCategoryUpdate(true);
  };

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Store the actual File object for API submission
  setSelectedCategory((prev) => ({
    ...prev,
    thumbnail: file, // <--- store the File object here
  }));

  // Optional: store preview separately
  const reader = new FileReader();
  reader.onload = () => setSelectedImage(reader.result);
  reader.readAsDataURL(file);
};


  const handleConfirm = async () => {
    setCancelOpen(false);
    setEditStationCategory(false);
  };

  // Other game section - SIMPLIFIED
  const handleAddGame = () => {
    // Just refresh the games list from API
    fetchGames();
    console.log("Game added - refreshing list");
  };

  const handleUpdateGame = () => {
    fetchGames();
    console.log("Game updated - refreshing list");
  };

  const handleRemoveGame = (game) => {
    setGameToRemove(game);
    setGameRemoveMessage(`Are you sure you want to remove "${game.title}"?`);
    setRemoveGame(true);
  };

  const removeGameConfirm = async () => {
    if (!gameToRemove) return;

    const token = localStorage.getItem("aToken");
    if (!token) {
      console.error("No token found");
      toast.error("Unauthorized! Please login.");
      return;
    }

    try {
      let apiUrl = "";
      if (gameToRemove.source === "portable") {
        apiUrl = `http://127.0.0.1:8000/api/portal_games/${gameToRemove.id}`;
      } else {
        apiUrl = `http://127.0.0.1:8000/api/games/${gameToRemove.id}`;
      }

      await axios.delete(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from frontend state
      if (gameToRemove.source === "portable") {
        setGames(games.filter((g) => g.id !== gameToRemove.id));
      } else {
        setDbGames(dbGames.filter((g) => g.id !== gameToRemove.id));
      }

      toast.success("Game removed successfully!");
    } catch (err) {
      console.error("Failed to remove game:", err);
      toast.error("Failed to remove game");
    } finally {
      setRemoveGame(false);
      setGameToRemove(null);
    }
  };

  const cancelRemoveGame = () => {
    setRemoveGame(false);
    setGameToRemove(null);
  };

  // Event and tournament
const handleAddEvent = async (newEvent) => {
  try {
    const eventData = {
      name: newEvent.name,
      date: newEvent.date,
      thumbnail: newEvent.thumbnail || null, // File object from upload
    };

    const savedEvent = await createEvent(eventData);

    setEvent((prev) => [
      ...prev,
      {
        id: savedEvent.id,
        name: savedEvent.name,
        date: savedEvent.date,
        image: savedEvent.thumbnail
          ? `http://127.0.0.1:8000/storage/${savedEvent.thumbnail}`
          : "",
      },
    ]);
  } catch (err) {
    console.error("Error adding event:", err);
    toast.error("Failed to add event");
  }
};




const handleUpdateEvent = async (updatedEvent) => {
  try {
    const eventData = {
      name: updatedEvent.name,
      date: updatedEvent.date,
      thumbnail: updatedEvent.thumbnail || null, // File object
    };

    const savedEvent = await updateEvent(updatedEvent.id, eventData);

    const mappedEvent = {
      id: savedEvent.id,
      name: savedEvent.name,
      date: savedEvent.date,
      image: savedEvent.thumbnail
        ? `http://127.0.0.1:8000/storage/${savedEvent.thumbnail}`
        : "",
    };

    setEvent((prev) =>
      prev.map((e) => (e.id === mappedEvent.id ? mappedEvent : e))
    );

    console.log("Event updated:", mappedEvent);
    toast.success("Event updated successfully!");
  } catch (err) {
    console.error("Error updating event:", err);
    toast.error("Failed to update event");
  }
};



const handleRemoveEvent = (eventItem) => {
  setEventToRemove(eventItem);
  setEventRemoveMessage(`Are you sure you want to remove "${eventItem.name}"?`);
  setRemoveEvent(true);
};

const removeEventConfirm = async () => {
  if (!eventToRemove) return;

  try {
    await deleteEvent(eventToRemove.id);
    setEvent(event.filter((e) => e.id !== eventToRemove.id));
    console.log("Event deleted:", eventToRemove);
  } catch (err) {
    console.error(err);
  } finally {
    setRemoveEvent(false);
    setEventToRemove(null);
  }
};


  const cancelRemoveEvent = () => {
    setRemoveEvent(false);
    setEventToRemove(null);
  };

  useEffect(() => {
  const fetchAllEvents = async () => {
    const eventsFromApi = await getEvents();
   const mappedEvents = eventsFromApi.map((e) => ({
  id: e.id,
  name: e.name || "No Name",
  date: e.date || null,
  image: e.thumbnail ? `http://127.0.0.1:8000/storage/${e.thumbnail}` : "", 
}));

    setEvent(mappedEvents);
  };

  fetchAllEvents();
}, []);

  

  // Gallery section
  useEffect(() => {
  const fetchGallery = async () => {
    const data = await getGallery();
    setGallery(data);
  };
  fetchGallery();
}, []);

// Add
const handleAddPhoto = async (file) => {
  try {
    const newPhoto = await addGalleryPhoto(file);
    setGallery((prev) => [...prev, newPhoto]);
    toast.success("Photo added successfully!");
  } catch {
    toast.error("Failed to add photo");
  }
};

// Remove
const handleRemovePhotoConfirm = async () => {
  try {
    await deleteGalleryPhoto(photoToRemove.id);
    setGallery((prev) => prev.filter((p) => p.id !== photoToRemove.id));
    toast.success("Photo removed!");
  } catch {
    toast.error("Failed to remove photo");
  } finally {
    setRemovePhoto(false);
    setPhotoToRemove(null);
  }
};
 

  const handleRemovePhoto = (index) => {
    setPhotoToRemove(index);
    setPhotoRemoveMessage("Are you want to remove this event?");
    setRemovePhoto(true);
  };

  const removePhotoConfirm = async () => {
    setGallery(gallery.filter((_, i) => i !== photoToRemove));
    setRemovePhoto(false);
    setPhotoToRemove(null);
  };

  const cancelRemovePhoto = () => {
    setRemovePhoto(false);
    setPhotoToRemove(null);
  };

  useEffect(() => {
    if (selectedCategory?.image) {
      setSelectedImage(selectedCategory.image);
    }
  }, [selectedCategory]);

  // Fetch games from API
  useEffect(() => {
    fetchGames();
    fetchDbGames();
  }, []);

  const fetchDbGames = async () => {
    const token = localStorage.getItem("aToken");
    if (!token) return;

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/games", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data ?? res.data;

      if (Array.isArray(data)) {
        const formattedGames = data.map((game) => ({
          ...game,
          image: game.thumbnail_url || "",
        }));

        setDbGames(formattedGames);
        console.log("DB Games:", formattedGames);
      }
    } catch (err) {
      console.error("Error fetching DB games:", err);
    }
  };
  console.log("first", dbGames);
  const fetchGames = async () => {
    const token = localStorage.getItem("aToken");
    if (!token) return;

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/portal_games", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data ?? res.data;
      if (Array.isArray(data)) {
        // Map the API response to match your component's expected structure
        const formattedGames = data.map((game) => ({
          ...game,
          image: game.thumbnail_url || game.image, // Use thumbnail_url from API
        }));
        setGames(formattedGames);
        console.log("Fetched games:", formattedGames);
      } else {
        console.warn("Unexpected games response:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch games:", err);
    }
  };

  const handleSaveGame = () => {
    setEditDbGameData(null);
    setOpenAddGame(false);
    fetchDbGames();
  };
  
  return (
    <div>
      <Box
        sx={{
          p: 2,
          bgcolor: "10374b",
          color: "#fff",
          minHeight: "100vh",
          overflow: "hidden",
          ml: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Typography variant="h5" fontWeight="bold" fontSize={24}>
              Website Management{" "}
            </Typography>
            <Typography color="#fff" fontSize={13}>
              Manage Website
            </Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "column", md: "row" }}
          justifyContent={{
            xs: "flex-start",
            sm: "flex-start",
            md: "space-between",
          }}
          px={1.5}
          py={1.5}
          borderRadius="10px"
          bgcolor="#0E111B"
          alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
          mb={2}
        >
          {/* Category */}
          <ToggleButtonGroup
            value={activeCategory}
            exclusive
            onChange={(e, newCategory) =>
              newCategory && setActiveCategory(newCategory)
            }
            sx={{
              gap: 1,
              flexWrap: "wrap",
              "& .MuiToggleButton-root": {
                bgcolor: "#1F2937",
                color: "#9CA3AF",
                border: "none",
                padding: "8px 27px",
                textTransform: "none",
                fontWeight: "600",
                fontSize: 12,
                "&.Mui-selected": {
                  bgcolor: "#1aa6bc58",
                  borderRadius: "5px",
                  minWidth: 90,
                  height: 45,
                  border: "1px solid #0CD7FF",
                  color: "#0CD7FF",
                  "&:hover": { bgcolor: "#374151" },
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
                  "&:hover": {
                    background: "linear-gradient(to right, #0bbfe0, #732ed1)",
                  },
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
                  "&:hover": {
                    background: "linear-gradient(to right, #0bbfe0, #732ed1)",
                  },
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
                  "&:hover": {
                    background: "linear-gradient(to right, #0bbfe0, #732ed1)",
                  },
                }}
                onClick={() => setOpenAddPhoto(true)}
              >
                + Add Photos
              </Button>
            )}
          </Box>
        </Box>

        {/* Card sections */}
        <Box
          sx={{
            height: 510,
            backgroundColor: "#0E111B",
            borderRadius: "10px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#374151",
              borderRadius: "10px",
            },
          }}
        >
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
              bookingGames.map((item, index) => (
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
                    onClick={() => {
                      setSelectedCategory({
                        ...item,
                        titleBeforeEdit: item.title,
                      });
                      setEditStationCategory(true);
                    }}
                  >
                    <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: "#000000",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      height: 400,
                      border: "1px solid transparent",
                      backgroundImage:
                        "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "content-box, border-box",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#000000",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "12px",
                      }}
                    >
                      {/* IMAGE */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "240px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "240px",
                            backgroundColor: "#0E111B",
                          }}
                        >
                          <img
                            src={upload}
                            alt="upload"
                            style={{ width: 30, height: 30, marginBottom: 6 }}
                          />
                          Upload thumbnail
                        </Box>
                      )}

                      {/* TEXT CONTENT */}
                      <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "300",
                            marginTop: "8px",
                            color: "#FFFFFF",
                          }}
                        >
                          {item.desc}
                        </p>
                      </Box>
                    </Box>
                  </Box>

                  {/* BUTTON */}
                  <Box sx={{ py: 2 }}>
                    <button
                      style={{ fontWeight: 600 }}
                      onClick={() => navigate(routeMap[item.title])}
                      className="card-button"
                    >
                      {item.button}
                    </button>
                  </Box>
                </Box>
              ))}
            {activeCategory === "Other Games" && (
              <OtherGamesSection
                games={games}
                dbGames={dbGames}
                handleRemoveGame={handleRemoveGame}
                setEditData={setEditData}
                setOpenEditGame={setOpenEditGame}
                setEditDbGameData={setEditDbGameData}
                setOpenEditDbGame={setOpenEditDbGame}
              />
            )}

            {/* Event & Tournaments section */}
            {activeCategory === "Event & Tournaments" &&
              event.map((item, index) => (
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
                    onClick={() => {
                      setEditEvent(item);
                      setOpenEditEvent(true);
                    }}
                  >
                    <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                  </Box>

                  <Box
                    sx={{
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid transparent",
                      backgroundImage:
                        "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "content-box, border-box",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#000000",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "12px",
                        height: 295,
                      }}
                    >
                      {/* IMAGE */}
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "196px",
                          objectFit: "cover",
                        }}
                      />

                      {/* TEXT CONTENT */}
                      <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: "500",
                            color: "white",
                          }}
                        >
                          {item.name}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            marginTop: "8px",
                            background:
                              "linear-gradient(180deg, #CF36E1, #15A2EF)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </Box>
                    </Box>
                  </Box>

                  {/* BUTTON */}
                  <Box sx={{ py: 2 }}>
                    <button
                      className="card-button-red"
                      onClick={() => handleRemoveEvent(item)}>
                      Remove
                    </button>
                  </Box>
                </Box>
              ))}

            {/* Gallery section */}
            {activeCategory === "Gallery" &&
              gallery.map((item, index) => (
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
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <DeleteIcon style={{ fontSize: 16, color: "white" }} />
                  </Box>

                  <Box
                    sx={{
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid transparent",
                      backgroundImage:
                        "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                      backgroundOrigin: "border-box",
                      backgroundClip: "content-box, border-box",
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "12px",
                        height: 248,
                      }}
                    >
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
              ))}
          </Box>
        </Box>
      </Box>

      {/* Edit Station Category Dialog */}
      <Dialog
        open={editStationCategory}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: "#111827",
            color: "white",
            borderRadius: "12px",
            border: "0.5px solid #374151",
            p: 1,
          },
        }}
      >
        {/* FORM BODY */}
        <DialogContent
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#4B5563",
              borderRadius: "10px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "700",
              fontSize: "18px",
              py: 0,
            }}
          >
            Edit Station Category Details
            <IconButton
              onClick={() => setEditStationCategory(false)}
              sx={{ color: "#9CA3AF" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Game Name */}
          <p style={{ marginBottom: 6, fontSize: "14px", fontWeight: 500 }}>
            Category Name
          </p>
          <TextField
            fullWidth
            placeholder="Enter Category Name"
            variant="outlined"
            value={selectedCategory?.title || ""}
            onChange={(e) =>
              setSelectedCategory({
                ...selectedCategory,
                title: e.target.value,
              })
            }
            InputProps={{
              sx: {
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                color: "white",
                border: "0.5px solid #374151",

                "& .MuiInputBase-input": {
                  padding: "12px 14px",
                  fontSize: "14px",
                },
              },
            }}
          />

          {/* Description */}
          <p
            style={{
              marginTop: 15,
              marginBottom: 6,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Description
          </p>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Enter Short Description"
            variant="outlined"
            value={selectedCategory?.desc || ""}
            onChange={(e) =>
              setSelectedCategory({ ...selectedCategory, desc: e.target.value })
            }
            InputProps={{
              sx: {
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                color: "white",
                border: "0.5px solid #374151",

                "& .MuiInputBase-input": {
                  fontSize: "14px",
                },
              },
            }}
          />

          {/* Thumbnail Upload */}
          <p
            style={{
              marginTop: 15,
              marginBottom: 6,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Thumbnail
          </p>
          <Box
            sx={{
              backgroundColor: "#171C2D",
              borderRadius: "8px",
              height: 190,
              border: "0.5px solid #374151",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#aaa",
              cursor: "pointer",
            }}
            onClick={() => document.getElementById("thumbnailUpload").click()}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="thumbnailUpload"
              onChange={(e) => handleImageUpload(e)}
            />

            {selectedImage ? (
              <img
                src={selectedImage}
                alt="thumbnail preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <>
                <img
                  src={upload}
                  alt="upload"
                  style={{ width: 30, height: 30, marginBottom: 6 }}
                />
                Upload thumbnail
              </>
            )}
          </Box>
        </DialogContent>

        {/* ACTION BUTTONS */}
        <DialogActions sx={{ px: 3, pb: 2, mt: 1 }}>
          <Button
            onClick={() => setCancelOpen(true)}
            sx={{
              flex: 1,
              borderRadius: "8px",
              backgroundColor: "#1A1D2A",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": {
                backgroundColor: "#3B4859",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              flex: 1,
              textTransform: "none",
              borderRadius: "8px",
              background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              "&:hover": {
                background: "linear-gradient(to right, #8A38F5, #0CD7FF)",
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleConfirm}
      />

      {/* Update Success Dialog */}
      <UpdateSuccessDialog
        open={openCategoryUpdate}
        onClose={() => setOpenCategoryUpdate(false)}
      />

      {/* Thumbnail Update Success */}
      <ThumbnailUpdate
        open={thumbUpdateSuccess}
        onClose={() => setThumbUpdateSuccess(false)}
      />
      {/* Games table edit dialog */}
      <AddNewGame
        open={openEditDbGame}
        handleClose={() => setOpenEditDbGame(false)}
        mode="edit"
        initialData={editDbGameData}
        onSubmit={handleSaveGame}
      />
      {/* Add & Update Other Game Section */}
      <AddGameDialog
        open={openAddGame}
        onClose={() => setOpenAddGame(false)}
        onRefresh={handleAddGame}
      />

      <AddGameDialog
        open={openEditGame}
        onClose={() => setOpenEditGame(false)}
        onRefresh={handleUpdateGame}
        initialData={editData}
      />

      {/* Remove Game Confirm */}
      <RemovePopup
        open={removeGame}
        handleRemoveClose={cancelRemoveGame}
        removeConfirm={removeGameConfirm}
        message={gameRemoveMessage}
      />

      {/* Add & Update Event Section */}
      <AddEventDialog
        open={openAddEvent}
        onClose={() => setOpenAddEvent(false)}
        onSubmit={handleAddEvent}
      />

      <AddEventDialog
        open={openEditEvent}
        onClose={() => setOpenEditEvent(false)}
        onSubmit={handleUpdateEvent}
        initialData={editEvent}
      />

      <RemovePopup
        open={removeEvent}
        handleRemoveClose={cancelRemoveEvent}
        removeConfirm={removeEventConfirm}
        message={eventRemoveMessage}
      />

      {/* Add Photo in Gallery Section */}
      <AddGalleyDialog
        open={openAddPhoto}
        onClose={() => setOpenAddPhoto(false)}
        onSubmit={handleAddPhoto}
      />

      <RemovePopup
        open={removePhoto}
        handleRemoveClose={cancelRemovePhoto}
        removeConfirm={removePhotoConfirm}
        message={photoRemoveMessage}
      />
    </div>
  );
};

export default WebManagement;