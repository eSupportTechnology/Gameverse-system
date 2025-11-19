import React from "react";
import { Box, Typography, Card, CardContent, Paper } from "@mui/material";

const ReportCards = ({ metrics }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: { xs: "8px", sm: "12px", md: "16px" },
        mb: { xs: 4, md: 5 },
        "@media (max-width: 900px)": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        "@media (max-width: 600px)": {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
      }}
    >
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          sx={{
            background: "linear-gradient(135deg, #171C2D, #4B5B93)",
            border: "1px solid #1e293b",
            borderRadius: { xs: "10px", md: "16px" },
            p: { xs: 1.5, sm: 2, md: 2.5 },
            height: "150px",
            width: "240px",
            minHeight: { xs: "120px", sm: "140px", md: "150px" },
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              border: "1px solid #334155",
            },
          }}
        >
          <CardContent
            sx={{
              p: 0,
              "&:last-child": { pb: 0 },
              height: "90%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Centered Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: { xs: 0.8, md: 1 },
              }}
            >
              <Paper
                sx={{
                  width: { xs: "40px", sm: "50px", md: "60px" },
                  height: { xs: "40px", sm: "50px", md: "60px" },
                  borderRadius: "50%",
                  backgroundColor: metric.iconBgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "none",
                  "& svg, & img": {
                    width: { xs: "20px", sm: "24px", md: "28px" },
                    height: { xs: "20px", sm: "24px", md: "28px" },
                    objectFit: "contain",
                  },
                }}
              >
                {metric.icon}
              </Paper>
            </Box>

            {/* Change Percentage - Top Right */}
            <Typography
              sx={{
                position: "absolute",
                top: { xs: "12px", sm: "16px", md: "20px" },
                right: { xs: "12px", sm: "16px", md: "20px" },
                color: "#800a70",
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: "600",
                lineHeight: 1,
              }}
            >
              {metric.change}
            </Typography>
            {/* Value and Label - Centered */}
            <Box sx={{ mt: "auto", textAlign: "center", width: '100%' }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: "18px", sm: "20px", md: "28px" },
                  fontWeight: "600",
                  mb: { xs: 0.5, md: 0.75 },
                  letterSpacing: "-0.3px",
                  color: "#fff",
                  lineHeight: "32px",
                  wordBreak: "break-word",
                  fontFamily: "Inter, sans-serif", 
                }}
              >
                {metric.value}
              </Typography>
              <Typography
                sx={{
                  color: "#9CA3AF",
                  fontSize: { xs: "10px", sm: "12px", md: "16px" },
                  fontWeight: "600",
                  lineHeight: "24px",
                  fontFamily: "Inter, sans-serif", 
                }}
              >
                {metric.label}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ReportCards;
