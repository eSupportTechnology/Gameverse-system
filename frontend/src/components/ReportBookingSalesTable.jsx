import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Button, IconButton } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReportProductSalesTable from "./ReportProductSalesTable";
import ReportOtherGamesSalesTable from "./ReportOtherGamesSalesTable";
import ReportNFCcustomersTable from "./ReportNFCcustomersTable";

const ReportBookingSalesTable = ({
  showOnlyBooking = false,
  onReturnToOverview,
  activeTabFromParent = 1,
}) => {
  const [activeTab, setActiveTab] = useState(activeTabFromParent);

  // When parent changes tab (via quick actions), update it
  useEffect(() => {
    setActiveTab(activeTabFromParent);
  }, [activeTabFromParent]);

  const tabs = [
    "Overview",
    "Booking Sales",
    "Product Sales",
    "Other Games Sales",
    "NFC Customers",
  ];

  const tableHeaderStyle = {
    backgroundColor: "#0E4450",
    color: "#fff",
    fontWeight: 600,
    fontSize: "14px",
    padding: "14px 18px",
    borderBottom: "1px solid #1f2937",
  };

  const tableRowStyle = {
    padding: "14px 18px",
    color: "#d1d5db",
    fontSize: "14px",
    borderBottom: "1px solid #1f2937",
  };

  const bookings = [
    {
      name: "Danuka Perera",
      contact: "0705568923",
      time: "10.00 AM",
      duration: "1 Hrs",
      revenue: "LKR 600",
    },
    {
      name: "Vishwa Pradeep",
      contact: "0253692548",
      time: "11.00 AM",
      duration: "2 Hrs 30 Min",
      revenue: "LKR 1450",
    },
    {
      name: "Mayumi Lakshika",
      contact: "0782536598",
      time: "02.00 PM",
      duration: "1 Hrs 30 Min",
      revenue: "LKR 850",
    },
    {
      name: "Udara Devinda",
      contact: "0774586936",
      time: "08.30 PM",
      duration: "30 Min",
      revenue: "LKR 400",
    },
    {
      name: "Danuka Perera",
      contact: "0705568923",
      time: "10.00 AM",
      duration: "1 Hrs",
      revenue: "LKR 600",
    },
    {
      name: "Vishwa Pradeep",
      contact: "0253692548",
      time: "11.00 AM",
      duration: "2 Hrs 30 Min",
      revenue: "LKR 1450",
    },
    {
      name: "Mayumi Lakshika",
      contact: "0782536598",
      time: "02.00 PM",
      duration: "1 Hrs 30 Min",
      revenue: "LKR 850",
    },
    {
      name: "Udara Devinda",
      contact: "0774586936",
      time: "08.30 PM",
      duration: "30 Min",
      revenue: "LKR 400",
    },
    {
      name: "Danuka Perera",
      contact: "0705568923",
      time: "10.00 AM",
      duration: "1 Hrs",
      revenue: "LKR 600",
    },
  ];

  // Handle export functionality
  const handleExport = () => {
    toast.info("Exporting report data...");
    // Export logic would go here
    setTimeout(() => {
      toast.success("Report exported successfully!");
    }, 1000);
  };

  return (
    <Box sx={{ pt: { xs: 2, sm: 4, md: 6 } }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
        }}
      >
        {/* Left Titles */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "20px", sm: "24px", md: "28px" },
              fontWeight: "bold",
              mb: 0.5,
              letterSpacing: "-0.3px",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            Reports & Analytics
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              fontSize: { xs: "11px", sm: "12px", md: "13px" },
              lineHeight: 1.3,
            }}
          >
            Business performance insights and data analysis
          </Typography>
        </Box>

        {/* Right Buttons — Export Only */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: { xs: 1, sm: 1.5 },
            alignItems: "center",
            flexShrink: 0,
            mt: { xs: 2, md: 0 },
          }}
        >
          {/* Export Button */}
          <Button
            onClick={handleExport}
            variant="contained"
            size="medium"
            sx={{
              background: "linear-gradient(90deg, #a855f7 0%, #06b6d4 100%)",
              color: "#fff",
              borderRadius: "8px",
              px: { xs: 2, sm: 2.5, md: 3 },
              py: { xs: 1, sm: 1.25 },
              fontSize: { xs: "12px", sm: "13px", md: "14px" },
              fontWeight: "600",
              textTransform: "none",
              minHeight: { xs: "40px", sm: "42px", md: "44px" },
              minWidth: { xs: "85px", sm: "100px" },
              whiteSpace: "nowrap",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(90deg, #9333ea 0%, #0891b2 100%)",
                transform: "translateY(-1px)",
              },
              "& .MuiButton-startIcon": {
                marginRight: { xs: 0.75, sm: 1 },
                "& svg": {
                  width: { xs: "16px", sm: "18px" },
                  height: { xs: "16px", sm: "18px" },
                },
              },
            }}
            startIcon={
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            }
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* TOP BAR */}
      <Box
        sx={{
          backgroundColor: "#0E111B",
          borderRadius: "8px",
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => {
            setActiveTab(newValue);
            if (tabs[newValue] === "Overview") {
              if (onReturnToOverview) onReturnToOverview();
            }
          }}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: "45px",
            "& .MuiTabs-flexContainer": {
              gap: "12px",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              minHeight: "42px",
              padding: "8px 20px",
              borderRadius: "4px",
              border: "0.5px solid #374151",
              backgroundColor: "#1F2937",
              color: "#94a3b8",
              fontSize: "14px",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              border: "0.5px solid #0CD7FF",
              backgroundColor: "#0B3C49 !important",
              color: "#0CD7FF !important",
            },
          }}
        >
          {tabs.map((t, i) => (
            <Tab key={i} label={t} />
          ))}
        </Tabs>

        {/* Right Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Date Picker */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: "8px",
              backgroundColor: "#0F172A",
              border: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#fff",
            }}
          >
            11/08/2025 <CalendarMonthIcon />
          </Box>

          {/* Station Dropdown */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: "8px",
              backgroundColor: "#0F172A",
              border: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#fff",
            }}
          >
            PS5 Station 1 <ArrowDropDownIcon />
          </Box>
        </Box>
      </Box>

      {/* CONTENT RENDERING FIXED HERE */}
      {activeTab === 1 && (
        <>
          {/* BOOKING TABLE */}
          <Box
            sx={{
              mt: 3,
              backgroundColor: "#0A0F1A",
              p: 3,
              borderRadius: "12px",
              color: "#fff",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#111827",
                borderRadius: "10px",
                overflow: "hidden",
                maxHeight: "450px",
                overflowY: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                  borderBottom: "1px solid #1F2937",

                  // Column borders
                  "& > div": {
                    borderRight: "1px solid #1F2937",
                    "&:last-child": { borderRight: "none" },
                  },
                }}
              >
                <Box sx={tableHeaderStyle}>Player Name</Box>
                <Box sx={tableHeaderStyle}>Contact Number</Box>
                <Box sx={tableHeaderStyle}>Start Time</Box>
                <Box sx={tableHeaderStyle}>Duration</Box>
                <Box sx={tableHeaderStyle}>Revenue</Box>
              </Box>

              {bookings.map((row, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                    borderBottom: "1px solid #1F2937",

                    "&:hover": { backgroundColor: "#1a2433" },

                    // Column borders inside rows
                    "& > div": {
                      borderRight: "1px solid #1F2937",
                      "&:last-child": { borderRight: "none" },
                    },
                  }}
                >
                  <Box sx={tableRowStyle}>{row.name}</Box>
                  <Box sx={tableRowStyle}>{row.contact}</Box>
                  <Box sx={tableRowStyle}>{row.time}</Box>
                  <Box sx={tableRowStyle}>{row.duration}</Box>
                  <Box sx={tableRowStyle}>{row.revenue}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* TABS */}
      {activeTab === 2 && <ReportProductSalesTable />}
      {activeTab === 3 && <ReportOtherGamesSalesTable />}
      {activeTab === 4 && <ReportNFCcustomersTable />}
    </Box>
  );
};

export default ReportBookingSalesTable;
