import React from "react";
import { Box } from "@mui/material";
import StationCard from "./StationCard";

const StationsGrid = ({
  stations,
  onEditStation,
  onToggleStatus,
  bookings = [],
}) => {
  return (
    <Box sx={{ backgroundColor: "#050a16ff", p: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          "@media (max-width: 900px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
          },
          "@media (max-width: 600px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            onEdit={onEditStation}
            onToggleStatus={onToggleStatus}
            bookings={bookings}
          />
        ))}
      </Box>
    </Box>
  );
};

export default StationsGrid;
