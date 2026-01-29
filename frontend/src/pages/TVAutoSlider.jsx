import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import PS5Station1TVScreen from "./PS5Stations/PS5Station1TVScreen";
import PS5Station2TVScreen from "./PS5Stations/PS5Station2TVScreen";
import PS5Station3TVScreen from "./PS5Stations/PS5Station3TVScreen";
import PS5Station4TVScreen from "./PS5Stations/PS5Station4TVScreen";
import PS5Station5TVScreen from "./PS5Stations/PS5Station5TVScreen";
import PremiumBilliardTV1 from "./PremiumBilliards/PremiumBilliardTV1";
import PremiumBilliardTV2 from "./PremiumBilliards/PremiumBilliardTV2";
import PremiumBilliardTV3 from "./PremiumBilliards/PremiumBilliardTV3";
import SupremeBilliardTV1 from "./SupremeBilliards/SupremeBilliardTV1";
import SupremeBilliardTV2 from "./SupremeBilliards/SupremeBilliardTV2";
import RacingSimulatorTV1 from "./RacingSimulators/RacingSimulatorTV1";
import RacingSimulatorTV2 from "./RacingSimulators/RacingSimulatorTV2";
import RacingSimulatorTV3 from "./RacingSimulators/RacingSimulatorTV3";
import RacingSimulatorTV4 from "./RacingSimulators/RacingSimulatorTV4";

const SCREENS = [PS5Station1TVScreen, PS5Station2TVScreen, PS5Station3TVScreen, PS5Station4TVScreen, PS5Station5TVScreen, PremiumBilliardTV1, PremiumBilliardTV2, PremiumBilliardTV3, SupremeBilliardTV1, SupremeBilliardTV2, RacingSimulatorTV1, RacingSimulatorTV2, RacingSimulatorTV3, RacingSimulatorTV4];

export default function TVAutoSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000, // 10s
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <Slider {...settings}>
      {SCREENS.map((Screen, idx) => (
        <div key={idx}>
          <Screen />
        </div>
      ))}
    </Slider>
  );
}
