import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
  TextField,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReportProductSalesTable from "./ReportProductSalesTable";
import ReportOtherGamesSalesTable from "./ReportOtherGamesSalesTable";
import ReportNFCcustomersTable from "./ReportNFCcustomersTable";
import axios from "axios";
import { formatBookingDate } from "./BookingManagement";
import { API_BASE_URL } from "../apiConfig";

const ReportBookingSalesTable = ({
  showOnlyBooking = false,
  onReturnToOverview,
  activeTabFromParent = 1,
}) => {
  const [activeTab, setActiveTab] = useState(activeTabFromParent);

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

  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = useRef(null);
  const [selectedStation, setSelectedStation] = useState("PS5 Station 1");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/bookings`);

        if (response.data.success) {
          const completedBookings = response.data.data.filter(
            (b) =>
              b.status === "completed" &&
              b.station === selectedStation &&
              formatBookingDate(b.booking_date) === date
          );
          setBookings(completedBookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedStation, date]);

  const stations = [
    "PS5 Station 1",
    "PS5 Station 2",
    "PS5 Station 3",
    "PS5 Station 4",
    "PS5 Station 5",
    "Racing Simulator 1",
    "Racing Simulator 2",
    "Racing Simulator 3",
    "Racing Simulator 4",
    "Supreme Billiard 1",
    "Supreme Billiard 2",
    "Premium Billiard 1",
    "Premium Billiard 2",
    "Premium Billiard 3",
  ];

  const handleDropdownClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleDropdownClose = () => setAnchorEl(null);

  const handleDropdownSelect = (item) => {
    setSelectedStation(item);
    setAnchorEl(null);
  };
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

  // Handle export functionality
  const handleExport = () => {
    toast.info("Exporting report data...");
    // Export logic
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

        {/* Right Buttons */}
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
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              style: {
                height: "40px",
                padding: "0 12px",
                color: "#fff",
              },
            }}
            sx={{
              bgcolor: "#1F2937",
              cursor: "pointer",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
              },
              "& .MuiInputBase-input": {
                color: "#fff",
              },
              mb: { xs: 2, sm: 2, md: 0 },
            }}
          />

          {/* Station Dropdown */}
          <Box sx={{ position: "relative" }}>
            <Box
              ref={anchorRef}
              onClick={handleDropdownClick}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                backgroundColor: "#1F2937",
                border: "1px solid #1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: "#fff",
                cursor: "pointer",
                minWidth: "120px",
                fontSize: "14px",
                boxShadow: "0px 2px 6px rgba(0,0,0,0.35)",
              }}
            >
              {selectedStation}
              <ArrowDropDownIcon />
            </Box>

            {/* POPPER DROPDOWN */}
            <Popper
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              placement="bottom"
              modifiers={[
                {
                  name: "offset",
                  options: { offset: [0, 5] },
                },
              ]}
              sx={{ zIndex: 9999 }}
            >
              <ClickAwayListener onClickAway={handleDropdownClose}>
                <Box sx={{ position: "relative" }}>
                  {/* ARROW (TRIANGLE) */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: "-10px",
                      right: "15px",
                      width: 0,
                      height: 0,
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderBottom: "10px solid #0F172A",
                      filter: "drop-shadow(0px -2px 2px rgba(0,0,0,0.4))",
                    }}
                  />

                  {/* DROPDOWN PANEL */}
                  <Paper
                    sx={{
                      mt: 1,
                      backgroundColor: "#0F172A",
                      color: "#fff",
                      width: "158px",
                      maxHeight: "450px",
                      overflowY: "auto",
                      borderRadius: "4px",
                      boxShadow:
                        "0px 4px 12px rgba(0,0,0,0.45), inset 0px 0px 0px 0px #1e293b",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#334155",
                        borderRadius: "4px",
                      },
                    }}
                  >
                    {stations.map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => handleDropdownSelect(item)}
                        sx={{
                          padding: "10px 14px",
                          borderBottom: "1px solid #1e293b",
                          fontSize: "14px",
                          fontFamily: "Inter",
                          fontWeight: "500px",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#1e293b",
                          },
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Paper>
                </Box>
              </ClickAwayListener>
            </Popper>
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
              {loading && (
                <Box sx={{ p: 2, textAlign: "center", color: "#9ca3af" }}>
                  Loading bookings...
                </Box>
              )}

              {!loading && bookings.length === 0 && (
                <Box sx={{ p: 2, textAlign: "center", color: "#9ca3af" }}>
                  No bookings found
                </Box>
              )}

              {bookings.map((row, i) => (
                <Box
                  key={row.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                    borderBottom: "1px solid #1F2937",
                    "&:hover": { backgroundColor: "#1a2433" },
                    "& > div": {
                      borderRight: "1px solid #1F2937",
                      "&:last-child": { borderRight: "none" },
                    },
                  }}
                >
                  <Box sx={tableRowStyle}>{row.customer_name}</Box>
                  <Box sx={tableRowStyle}>{row.phone_number}</Box>
                  <Box sx={tableRowStyle}>{row.start_time}</Box>
                  <Box sx={tableRowStyle}>{row.duration}</Box>
                  <Box sx={tableRowStyle}>
                    LKR {Number(row.amount).toFixed(2)}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* TABS */}
      {activeTab === 2 && <ReportProductSalesTable date={date} />}
      {activeTab === 3 && <ReportOtherGamesSalesTable date={date} />}
      {activeTab === 4 && <ReportNFCcustomersTable date={date} />}
    </Box>
  );
};

export default ReportBookingSalesTable;
