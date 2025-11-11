import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const StationCard = ({ station, onEdit, onToggleStatus }) => {
  const colors = {
    available: {
      bg: "#2A2D3E",
      glow: "#10B981",
      button: "#EF4444",
      buttonHover: "#dc2626",
    },
    playing: {
      bg: "#2A2D3E",
      glow: "#8B5CF6",
      button: "#EF4444",
      buttonHover: "#dc2626",
    },
    offline: {
      bg: "#2A2D3E",
      glow: "#EF4444",
      button: "#10B981",
      buttonHover: "#059669",
    },
  };

  const status = station.status.toLowerCase();
  const theme = colors[status] || colors.available;

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: "12px",
        backgroundColor: "#0d1727ff",
        border: "1px solid rgba(255,255,255,0.08)",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.25s ease",
        boxSizing: "border-box",
        overflow: "visible",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.35)",
        "&:hover": {
          boxShadow: "0px 6px 16px rgba(0,0,0,0.45)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 0,
          "&:last-child": { pb: 0 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* ===== Top Row ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: theme.glow,
                  boxShadow: `0 0 8px ${theme.glow}`,
                }}
              />
              <Typography
                sx={{
                  color: theme.glow,
                  backgroundColor: `${theme.glow}22`,
                  px: 1.5,
                  py: 0.3,
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {station.status}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => onEdit(station)}
              sx={{
                color: "#9CA3AF",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* ===== Title + Type ===== */}
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              mb: 0.2,
            }}
          >
            {station.name}
          </Typography>
          <Typography sx={{ color: "#9CA3AF", fontSize: "0.85rem", mb: 1 }}>
            {station.type}
          </Typography>

          {/* ===== Time + Price (single background box) ===== */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              backgroundColor: "rgba(210, 216, 229, 0.1)", // single background
              px: 2,
              py: 0.4,
              borderRadius: "6px",
            }}
          >
            {/* Time */}
            <Typography sx={{ color: "#e5e5e6", fontSize: "0.7rem" }}>
              {station.time} min
            </Typography>

            {/* Price */}
            <Typography
              sx={{
                color: "#b3b6b8ff",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}
            >
              LKR {station.price}
            </Typography>
          </Box>

          {/* ===== Location + Bookings (Two-column layout) ===== */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
            <Typography sx={{ color: "#9CA3AF", fontSize: "0.8rem" }}>Location:</Typography>
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.8rem" }}>
              {station.location}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ color: "#9CA3AF", fontSize: "0.8rem" }}>No of bookings:</Typography>
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.8rem" }}>
              {station.bookings}
            </Typography>
          </Box>
        </Box>

        {/* ===== Bottom Button ===== */}
        <Button
          fullWidth
          onClick={() => onToggleStatus(station.id)}
          sx={{
            backgroundColor: `${theme.button}28`,
            color: theme.button, // ✅ dynamic font color
            py: 0.2,
            fontWeight: 400,
            borderRadius: "6px",
            fontSize: "0.8rem",
            minHeight: "20px",
            border: `1px solid ${theme.button}`,
            textTransform: "none",
            "&:hover": {
              backgroundColor: `${theme.buttonHover}`,
            },
          }}
        >
          {status === "available" ? "Set offline" : "Set online"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StationCard;
