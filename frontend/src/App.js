import { useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import NFCUsers from "./pages/NFCUsers";
import OtherGames from "./pages/OtherGames";
import Pos from "./pages/Pos";
import PremiumBilliardTV1 from "./pages/PremiumBilliards/PremiumBilliardTV1";
import PremiumBilliardTV2 from "./pages/PremiumBilliards/PremiumBilliardTV2";
import PremiumBilliardTV3 from "./pages/PremiumBilliards/PremiumBilliardTV3";
import PS5Station1TVScreen from "./pages/PS5Stations/PS5Station1TVScreen";
import PS5Station2TVScreen from "./pages/PS5Stations/PS5Station2TVScreen";
import PS5Station3TVScreen from "./pages/PS5Stations/PS5Station3TVScreen";
import PS5Station4TVScreen from "./pages/PS5Stations/PS5Station4TVScreen";
import PS5Station5TVScreen from "./pages/PS5Stations/PS5Station5TVScreen";
import RacingSimulatorTV1 from "./pages/RacingSimulators/RacingSimulatorTV1";
import RacingSimulatorTV2 from "./pages/RacingSimulators/RacingSimulatorTV2";
import RacingSimulatorTV3 from "./pages/RacingSimulators/RacingSimulatorTV3";
import RacingSimulatorTV4 from "./pages/RacingSimulators/RacingSimulatorTV4";
import Reports from "./pages/Reports";
import ResetPassword from "./pages/ResetPassword";
import Station from "./pages/Station";
import SupremeBilliardTV1 from "./pages/SupremeBilliards/SupremeBilliardTV1";
import SupremeBilliardTV2 from "./pages/SupremeBilliards/SupremeBilliardTV2";
import TVScreenControl from "./pages/TVScreenControl";
import User from "./pages/Users";
import ValuableOffersScreen from "./pages/ValuableOffersScreen";
import WebPortal from "./pages/WebPortal";
import TVAutoSlider from "./pages/TVAutoSlider";


function App() {
  const { aToken, oToken, loginRole } = useContext(AdminContext);

  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ===================== ADMIN ROUTES ===================== */}
        {aToken && loginRole === "admin" && (
          <>
            <Route path="/" element={<Booking />} />
            <Route path="/stations/*" element={<Station />} />
            <Route path="/pos/*" element={<Pos />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/games" element={<OtherGames />} />
            <Route path="/users" element={<User />} /> {/* admin-only */}
            <Route path="/nfc-users" element={<NFCUsers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/web-portal/*" element={<WebPortal />} />
          

            {/* TV Screens */}
            <Route path="/tv-screens" element={<TVScreenControl />} />
            <Route path="/tv-slider" element={<TVAutoSlider />} />
            <Route path="/ps5-station1" element={<PS5Station1TVScreen />} />
            <Route path="/ps5-station2" element={<PS5Station2TVScreen />} />
            <Route path="/ps5-station3" element={<PS5Station3TVScreen />} />
            <Route path="/ps5-station4" element={<PS5Station4TVScreen />} />
            <Route path="/ps5-station5" element={<PS5Station5TVScreen />} />
            <Route path="/racing-simulator1" element={<RacingSimulatorTV1 />} />
            <Route path="/racing-simulator2" element={<RacingSimulatorTV2 />} />
            <Route path="/racing-simulator3" element={<RacingSimulatorTV3 />} />
            <Route path="/racing-simulator4" element={<RacingSimulatorTV4 />} />
            <Route path="/supreme-billiard1" element={<SupremeBilliardTV1 />} />
            <Route path="/supreme-billiard2" element={<SupremeBilliardTV2 />} />
            <Route path="/premium-billiard1" element={<PremiumBilliardTV1 />} />
            <Route path="/premium-billiard2" element={<PremiumBilliardTV2 />} />
            <Route path="/premium-billiard3" element={<PremiumBilliardTV3 />} />
            <Route path="/valuable-offers" element={<ValuableOffersScreen />} />
            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* ===================== OPERATOR ROUTES ===================== */}
        {oToken && loginRole === "operator" && (
          <>
            {/* Shared routes accessible to operator (all except Users & Roles) */}
            <Route path="/" element={<Booking />} />
            <Route path="/stations/*" element={<Station />} />
            <Route path="/pos/*" element={<Pos />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/games" element={<OtherGames />} />
            <Route path="/nfc-users" element={<NFCUsers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/web-portal/*" element={<WebPortal />} />
            <Route path="/tv-screens" element={<TVScreenControl />} />
            <Route path="/ps5-station1" element={<PS5Station1TVScreen />} />
            <Route path="/ps5-station2" element={<PS5Station2TVScreen />} />
            <Route path="/ps5-station3" element={<PS5Station3TVScreen />} />
            <Route path="/ps5-station4" element={<PS5Station4TVScreen />} />
            <Route path="/ps5-station5" element={<PS5Station5TVScreen />} />
            <Route path="/racing-simulator1" element={<RacingSimulatorTV1 />} />
            <Route path="/racing-simulator2" element={<RacingSimulatorTV2 />} />
            <Route path="/racing-simulator3" element={<RacingSimulatorTV3 />} />
            <Route path="/racing-simulator4" element={<RacingSimulatorTV4 />} />
            <Route path="/supreme-billiard1" element={<SupremeBilliardTV1 />} />
            <Route path="/supreme-billiard2" element={<SupremeBilliardTV2 />} />
            <Route path="/premium-billiard1" element={<PremiumBilliardTV1 />} />
            <Route path="/premium-billiard2" element={<PremiumBilliardTV2 />} />
            <Route path="/premium-billiard3" element={<PremiumBilliardTV3 />} />
            <Route path="/valuable-offers" element={<ValuableOffersScreen />} />

            {/* Block Users & Roles */}
            <Route path="/users" element={<Navigate to="/" replace />} />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* ===================== LOGIN ROUTES ===================== */}
        {!aToken && !oToken && (
          <>
            <Route path="/admin/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
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
