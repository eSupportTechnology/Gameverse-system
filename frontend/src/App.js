import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Station from "./pages/Station";
import Booking from "./pages/Booking";
// import Pos from "./pages/Pos";
import Pos from "./pages/Pos";
import OtherGames from "./pages/OtherGames";

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Home />} />
          <Route path="/stations/*" element={<Station />} />
          <Route path="/pos/*" element={<Pos />} />
          <Route path="/bookings" element={<Booking/>} />
          <Route path="/games" element={<OtherGames/>} />
          <Route path="users" element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Users & Roles (Coming soon)</div>} />
          <Route path="reports" element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Reports (Coming soon)</div>} />
          <Route path="settings" element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Settings (Coming soon)</div>} />
      </Routes>
    </Router>
  );
}

export default App;
