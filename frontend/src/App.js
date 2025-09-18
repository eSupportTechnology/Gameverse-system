import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Station from "./pages/Station";
import Booking from "./pages/Booking";
import Pos from "./pages/Pos";
import OtherGames from "./pages/OtherGames";
import User from "./pages/Users";

import GamesManagement from "./components/GamesManagement";
import PosSystem from "./components/pos-system";
import OperatorLayout from "./components/OperatorLayout";
import BookingManagement from "./components/BookingManagement";
import { AdminContext } from "./context/AdminContext";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";

function App() {
  const { aToken } = useContext(AdminContext);

  return (
    <Router>
      <Routes>
        {aToken ? (
          <>
            {/* Admin routes */}
            <Route path="/" element={<Home />} />
            <Route path="/stations/*" element={<Station />} />
            <Route path="/pos/*" element={<Pos />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/games" element={<OtherGames />} />
            <Route path="/users" element={<User />} />
            <Route
              path="/reports"
              element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Reports (Coming soon)</div>}
            />
            <Route
              path="/settings"
              element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Settings (Coming soon)</div>}
            />

            {/* Operator nested routes */}
            <Route path="/operator/*" element={<OperatorLayout />}>
              <Route path="booking" element={<BookingManagement />} />
              <Route path="pos" element={<PosSystem />} />
              <Route path="games" element={<GamesManagement />} />
              <Route index element={<Navigate to="booking" replace />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Only login */}
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
