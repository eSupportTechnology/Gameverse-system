import React from "react";
import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import StationCard from "./StationCard";

const StationsGrid = ({
  stations,
  onEditStation,
  onToggleStatus,
  bookings = [],
  onDeleteStation,
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
        {stations.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0CD7FF22, #8A38F522)",
                border: "1px solid #0CD7FF44",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InboxOutlinedIcon sx={{ fontSize: 34, color: "#0CD7FF" }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#9CA3AF" }}>
              No Stations Found
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#4B5563" }}>
              No stations have been added yet
            </Typography>
          </Box>
        ) : (
          stations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onEdit={onEditStation}
              onToggleStatus={onToggleStatus}
              bookings={bookings}
              onDelete={onDeleteStation}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default StationsGrid;
