import React, { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [globalSearch, setGlobalSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const seenBookingIds = useRef(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedUser");
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);

  // Poll for new bookings and generate notifications
  useEffect(() => {
    const pollBookings = async () => {
      const token = localStorage.getItem("aToken") || localStorage.getItem("oToken");
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data?.success) return;

        const bookings = res.data.data || [];
        const currentIds = new Set(bookings.map((b) => b.id));

        if (seenBookingIds.current === null) {
          // First load — record existing IDs silently
          seenBookingIds.current = currentIds;
          return;
        }

        const newBookings = bookings.filter((b) => !seenBookingIds.current.has(b.id));
        if (newBookings.length > 0) {
          const newNotifs = newBookings.map((b) => ({
            id: `booking-${b.id}-${Date.now()}`,
            bookingId: b.id,
            title: "New Booking",
            message: `${b.customer_name || "Someone"} booked ${b.station || "a station"}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
          }));
          setNotifications((prev) => [...newNotifs, ...prev]);
        }

        seenBookingIds.current = currentIds;
      } catch {
        // silently ignore poll errors
      }
    };

    const interval = setInterval(pollBookings, 10000);
    pollBookings();
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearNotifications = () => setNotifications([]);

  const loginUser = (userData) => {
    setLoggedUser(userData);
    localStorage.setItem("loggedUser", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("aToken");
    localStorage.removeItem("oToken");
    localStorage.removeItem("loginRole");
  };

  const value = {
    loggedUser,
    loginUser,
    logoutUser,
    globalSearch,
    setGlobalSearch,
    notifications,
    unreadCount,
    markAllRead,
    clearNotifications,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
