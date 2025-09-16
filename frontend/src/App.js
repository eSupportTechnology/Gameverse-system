import React from "react";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<Home />} />
        <Route path="/stations/*" element={<Station />} />
        <Route path="/pos/*" element={<Pos />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/games" element={<OtherGames />} />
        <Route path="/users" element={<User />} />
        <Route
          path="/reports"
          element={
            <div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>
              Reports (Coming soon)
            </div>
          }
        />
        <Route
          path="/settings"
          element={
            <div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>
              Settings (Coming soon)
            </div>
          }
        />

        {/* Operator nested routes */}
        <Route path="/operator/*" element={<OperatorLayout />}>
          <Route path="booking" element={<BookingManagement />} />
          <Route path="pos" element={<PosSystem />} />
          <Route path="games" element={<GamesManagement />} />
          <Route path="" element={<Navigate to="booking" replace />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
