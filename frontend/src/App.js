import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Station from "./pages/Station";
import Booking from "./pages/Booking";
import Pos from "./pages/Pos";
import OtherGames from "./pages/OtherGames";
import User from "./pages/Users";
import NFCUsers from "./pages/NFCUsers";

import GamesManagement from "./components/GamesManagement";
import PosSystem from "./components/pos-system";
import OperatorLayout from "./components/OperatorLayout";
import BookingManagement from "./components/BookingManagement";
import { AdminContext } from "./context/AdminContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { aToken, oToken } = useContext(AdminContext);

  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        {aToken ? (
          <>
            {/* Admin routes */}
            <Route path="/" element={<Booking />} />
            <Route path="/stations/*" element={<Station />} />
            <Route path="/pos/*" element={<Pos />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/games" element={<OtherGames />} />
            <Route path="/users" element={<User />} />
            <Route path="/nfc-users" element={<NFCUsers />} />
            <Route
              path="/reports"
              element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Reports (Coming soon)</div>}
            />
            <Route
              path="/settings"
              element={<div style={{ color: "#fff", marginTop: "80px", padding: "16px" }}>Settings (Coming soon)</div>}
            />
            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : oToken ? (
          <>
            {/* Operator-only routes */}
            <Route path="/operator/*" element={<OperatorLayout />}>
              <Route path="booking" element={<BookingManagement/>} />
              <Route path="pos" element={<PosSystem />} />
              <Route path="games" element={<GamesManagement />} />
              <Route index element={<Navigate to="booking" replace />} />
            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/operator/booking" replace />} />
          </>
        ) : (
          <>
            {/* Login routes */}
            <Route path="/admin/login" element={<Login />} />
            {/* redirect `/` to login explicitly */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            {/* redirect everything else to login */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </>
        )}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;

