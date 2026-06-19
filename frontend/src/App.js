import { lazy, Suspense, useContext } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";

const Booking = lazy(() => import("./pages/Booking"));
const Login = lazy(() => import("./pages/Login"));
const NFCUsers = lazy(() => import("./pages/NFCUsers"));
const OtherGames = lazy(() => import("./pages/OtherGames"));
const Pos = lazy(() => import("./pages/Pos"));
const PremiumBilliardTV1 = lazy(() => import("./pages/PremiumBilliards/PremiumBilliardTV1"));
const PremiumBilliardTV2 = lazy(() => import("./pages/PremiumBilliards/PremiumBilliardTV2"));
const PremiumBilliardTV3 = lazy(() => import("./pages/PremiumBilliards/PremiumBilliardTV3"));
const PS5Station1TVScreen = lazy(() => import("./pages/PS5Stations/PS5Station1TVScreen"));
const PS5Station2TVScreen = lazy(() => import("./pages/PS5Stations/PS5Station2TVScreen"));
const PS5Station3TVScreen = lazy(() => import("./pages/PS5Stations/PS5Station3TVScreen"));
const PS5Station4TVScreen = lazy(() => import("./pages/PS5Stations/PS5Station4TVScreen"));
const PS5Station5TVScreen = lazy(() => import("./pages/PS5Stations/PS5Station5TVScreen"));
const RacingSimulatorTV1 = lazy(() => import("./pages/RacingSimulators/RacingSimulatorTV1"));
const RacingSimulatorTV2 = lazy(() => import("./pages/RacingSimulators/RacingSimulatorTV2"));
const RacingSimulatorTV3 = lazy(() => import("./pages/RacingSimulators/RacingSimulatorTV3"));
const RacingSimulatorTV4 = lazy(() => import("./pages/RacingSimulators/RacingSimulatorTV4"));
const Reports = lazy(() => import("./pages/Reports"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Station = lazy(() => import("./pages/Station"));
const SupremeBilliardTV1 = lazy(() => import("./pages/SupremeBilliards/SupremeBilliardTV1"));
const SupremeBilliardTV2 = lazy(() => import("./pages/SupremeBilliards/SupremeBilliardTV2"));
const TVScreenControl = lazy(() => import("./pages/TVScreenControl"));
const User = lazy(() => import("./pages/Users"));
const ValuableOffersScreen = lazy(() => import("./pages/ValuableOffersScreen"));
const WebPortal = lazy(() => import("./pages/WebPortal"));

import LoadingOverlay from "./components/LoadingOverlay";
import "./App.css";

function App() {
  const { aToken, oToken, loginRole } = useContext(AdminContext);
  const mustReset = localStorage.getItem("mustResetPassword") === "1";

  return (
    <Router>
      <LoadingOverlay />
      <Suspense fallback={null}>
      <Routes>

        {/* Always accessible — never blocked by auth or mustReset */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Logged in but must reset password — block everything else */}
        {(aToken || oToken) && mustReset && (
          <Route path="*" element={<Navigate to="/reset-password" replace />} />
        )}

        {/* ===================== ADMIN ROUTES ===================== */}
        {aToken && loginRole === "admin" && !mustReset && (
          <>
            <Route path="/" element={<Booking />} />
            <Route path="/stations/*" element={<Station />} />
            <Route path="/pos/*" element={<Pos />} />
            <Route path="/bookings" element={<Booking />} />
            <Route path="/games" element={<OtherGames />} />
            <Route path="/users" element={<User />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* ===================== OPERATOR ROUTES ===================== */}
        {oToken && loginRole === "operator" && !mustReset && (
          <>
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
            <Route path="/users" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* Not logged in — redirect everything to login */}
        {!aToken && !oToken && (
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        )}

      </Routes>
      </Suspense>
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
