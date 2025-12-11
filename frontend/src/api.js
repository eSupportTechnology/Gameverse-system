import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Use a function to get token fresh each time
const getAxiosInstance = () => {
  const token = localStorage.getItem("aToken");
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};

// ------------------ Events API ------------------

// Get all events
export const getEvents = async () => {
  try {
    const res = await getAxiosInstance().get("/events");
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

    const res = await getAxiosInstance().post("/events", formData, {
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

    const res = await getAxiosInstance().post(`/events/${id}?_method=PUT`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("Failed to update event:", err.response?.data || err);
    throw err;
  }
};

// Delete event
export const deleteEvent = async (id) => {
  try {
    const res = await getAxiosInstance().delete(`/events/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete event:", err.response?.data || err);
    throw err;
  }
};


// Gallery Section

export const getGallery = async () => {
  try {
    const res = await getAxiosInstance().get("/gallery");
    // Map to match frontend structure
    return res.data.map((item) => ({
      id: item.id,
      image: item.image ? `http://127.0.0.1:8000/storage/${item.image}` : "",
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

    const res = await getAxiosInstance().post("/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      id: res.data.id,
      image: res.data.image
        ? `http://127.0.0.1:8000/storage/${res.data.image}`
        : "",
    };
  } catch (err) {
    console.error("Failed to add photo:", err);
    throw err;
  }
};

export const deleteGalleryPhoto = async (id) => {
  try {
    const res = await getAxiosInstance().delete(`/gallery/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete photo:", err);
    throw err;
  }
};