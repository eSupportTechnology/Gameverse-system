import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Use a function to get token fresh each time
export const getAxiosInstance = () => {
  const token = localStorage.getItem("aToken");
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

//  Events API

// Get all events
export const getEvents = async () => {
  try {
    const res = await getAxiosInstance().get("/api/events");
    return res.data; // array of events
  } catch (err) {
    console.error("Failed to fetch events:", err);
    return [];
  }
};

// Create new event
export const createEvent = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail); // File object

    const res = await getAxiosInstance().post("/api/events", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // important
    });

    return res.data; // newly created event
  } catch (err) {
    console.error("Failed to create event:", err.response?.data || err);
    throw err;
  }
};

// Update event
export const updateEvent = async (id, data) => {
  try {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.date) formData.append("date", data.date);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    const res = await getAxiosInstance().post(
      `/api/events/${id}?_method=PUT`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Failed to update event:", err.response?.data || err);
    throw err;
  }
};

// Delete event
export const deleteEvent = async (id) => {
  try {
    const res = await getAxiosInstance().delete(`/api/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete event:", err.response?.data || err);
    throw err;
  }
};

// Gallery Section

export const getGallery = async () => {
  try {
    const res = await getAxiosInstance().get("/api/gallery");
    // Map to match frontend structure
    return res.data.map((item) => ({
      id: item.id,
      image: item.image ? `${API_BASE_URL}/storage/${item.image}` : "",
    }));
  } catch (err) {
    console.error("Failed to fetch gallery:", err);
    return [];
  }
};

export const addGalleryPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await getAxiosInstance().post("/api/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      id: res.data.id,
      image: res.data.image ? `${API_BASE_URL}/storage/${res.data.image}` : "",
    };
  } catch (err) {
    console.error("Failed to add photo:", err);
    throw err;
  }
};

export const deleteGalleryPhoto = async (id) => {
  try {
    const res = await getAxiosInstance().delete(`/api/gallery/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete photo:", err);
    throw err;
  }
};

// Simulators API
export const deleteSimulator = async (id) => {
  try {
    const res = await getAxiosInstance().delete(`/api/stations/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete simulator:", err.response?.data || err);
    throw err;
  }
};

// Pool Tables API

// Create a new pool table
export const addPoolTable = async (data) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("location", data.location || "");
    formData.append("price", data.price);
    formData.append("time", data.time === "1 Hour" ? 60 : 30);
    formData.append("type", "Pool");
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    const res = await getAxiosInstance().post("/api/stations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to add pool table:", err.response?.data || err);
    throw err;
  }
};

// Update an existing pool table

export const updatePoolTable = async (id, data) => {
  try {
    const formData = new FormData();

    // Append only if values exist
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.location) formData.append("location", data.location);
    if (data.price) formData.append("price", data.price);
    if (data.time) formData.append("time", data.time === "1 Hour" ? 60 : 30);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    // Use POST with ?_method=PUT for Laravel/method override
    const res = await getAxiosInstance().post(
      `/api/stations/${id}?_method=PUT`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Failed to update pool table:", err.response?.data || err);
    throw err;
  }
};

// Tv Screen API
export const getTvScreens = async () => {
  try {
    const res = await getAxiosInstance().get("/api/tv-screen");

    return res.data.map((item) => ({
      id: item.id,
      station_key: item.station_key,    
      file_type: item.file_type,            
      status: item.status,
      file_path: item.file_path,        
    }));
  } catch (err) {
    console.error("Failed to fetch TV screens:", err);
    return [];
  }
};

export const uploadTvScreen = async (file, stationKey) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("station_key", stationKey);

  try {
    const res = await getAxiosInstance().post("/api/tv-screen", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Upload failed:", err.response?.data);
    throw err;
  }
};


export const toggleTvScreenStatus = async (id) => {
  try {
    const res = await getAxiosInstance().patch(`/api/tv-screen/${id}/toggle`);
    return res.data;
  } catch (err) {
    console.error(
      "Failed to toggle TV screen status:",
      err.response?.data || err
    );
    throw err;
  }
};

export const deleteTvScreen = async (id) => {
  try {
    const res = await getAxiosInstance().delete(`/api/tv-screen/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete TV screen:", err.response?.data || err);
    throw err;
  }
};
