import React from "react";
import { Box, Button, Typography } from "@mui/material";

const ReportQuickActions = ({ onActionClick }) => {
  const actions = [
    { label: "Booking Sales", icon: "/images/report Icon/group.png" },
    { label: "Product Sales", icon: "/images/report Icon/vector.png" },
    { label: "Other Games Sales", icon: "/images/report Icon/otherGames.png" },
    { label: "NFC Customers", icon: "/images/report Icon/newCostumersIcon.png" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#171C2D",
        borderRadius: "14px",
        p: 2,
        color: "#fff",
        minWidth: "300px",
        height: "350px",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontSize: "20px",
          fontWeight: "600",
          fontFamily: "Inter, sans-serif", 
          lineHeight: "32px",
          mb: 3,
        }}
      >
        Quick Actions
      </Typography>

      <Box display="flex" flexDirection="column" gap={3.5}>
        {actions.map((item, i) => (
          <Button
            key={i}
            onClick={() => onActionClick(item.label)}
            variant="contained"
            startIcon={<img src={item.icon} width={22} />}
            sx={{
              backgroundColor: "#2C5D88",
              textTransform: "none",
              fontWeight: 500,
              fontFamily: "Inter, sans-serif", 
              py: 1.2,
              fontSize: "16px",
              borderRadius: "16px",
              "&:hover": {
                background: "linear-gradient(90deg, rgba(12, 215, 255, 0.1) 0%, rgba(197, 0, 255, 0.2) 69%)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ReportQuickActions;
