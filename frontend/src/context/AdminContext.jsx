
import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
  const [oToken, setOToken] = useState(localStorage.getItem("oToken") || "");

  const [loginRole, setLoginRole] = useState(localStorage.getItem("loginRole") || "");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings from API
  const getBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/get-booking", {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      if (res.data.success) {
        setBookings(res.data.data);
        console.log("Fetched bookings:", res.data.data); // ✅ correct place
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when token available
  useEffect(() => {
    if (aToken) {
      getBookings();
      
    }
  }, [aToken]);

  const value = {
    aToken, setAToken, oToken, setOToken, loginRole, setLoginRole,
    bookings,
    loading,
    getBookings,
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
