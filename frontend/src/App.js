import { useContext } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Booking from "./pages/Booking";
import NFCUsers from "./pages/NFCUsers";
import OtherGames from "./pages/OtherGames";
import Pos from "./pages/Pos";
import PremiumBilliardTV from "./pages/PremiumBilliardTV";
import PS5StationTVScreen from "./pages/PS5StationTVScreen";
import RacingSimulatorTV from "./pages/RacingSimulatorTV";
import Station from "./pages/Station";
import SupremeBilliardTV from "./pages/SupremeBilliardTV";
import TVOffers from "./pages/TVOffers";
import TVScreenControl from "./pages/TVScreenControl";
import User from "./pages/Users";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import GamesManagement from "./components/GamesManagement";
//import operaterBookingManagement from "./components/OperaterBookingManagement";
import OperatorBookingManagement from "./components/OperatorBookingManagement";

import OperatergameManagemnt from "./components/OperatergameManagement";
import OperatorLayout from "./components/OperatorLayout";
import OperatorPosSystem from "./components/OperatorPosSystem";
import { AdminContext } from "./context/AdminContext";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import ResetPassword from "./pages/ResetPassword";
import WebPortal from "./pages/WebPortal";

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
            <Route path="/reports" element={<Reports />} />
            <Route path="/web-portal/*" element={<WebPortal />} />
            
            {/* TV Screens Routes */}
            <Route path="/tv-screens" element={<TVScreenControl />} />
            <Route path="/tv-screens/ps5-station" element={<PS5StationTVScreen />} />
            <Route path="/tv-screens/racing-simulator" element={<RacingSimulatorTV />} />
            <Route path="/tv-screens/supreme-billiard" element={<SupremeBilliardTV />} />
            <Route path="/tv-screens/premium-billiard" element={<PremiumBilliardTV />} />
            <Route path="/tv-screens/offers" element={<TVOffers />} />
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
              <Route path="booking" element={<OperatorBookingManagement />} />
              <Route path="pos" element={<OperatorPosSystem />} />
              <Route path="games" element={<OperatergameManagemnt />} />
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

