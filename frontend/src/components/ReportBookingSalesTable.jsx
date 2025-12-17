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
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReportProductSalesTable from "./ReportProductSalesTable";
import ReportOtherGamesSalesTable from "./ReportOtherGamesSalesTable";
import ReportNFCcustomersTable from "./ReportNFCcustomersTable";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";
import { getBookingStations } from "../api";

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
  const [selectedStation, setSelectedStation] = useState("");
  
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [bookings, setBookings] = useState([]);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const [stations, setStations] = useState([]);


  
useEffect(() => {
  if (activeTab === 1 && selectedStation && selectedDate) {
    fetchCompletedBookings();
  }
}, [activeTab, selectedStation, selectedDate]);




useEffect(() => {
  const fetchStations = async () => {
    const list = await getBookingStations();
    setStations(list || []);
    if (list.length > 0) setSelectedStation(list[0]);
  };
  fetchStations();
}, []);


  const handleDropdownClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleDropdownClose = () => setAnchorEl(null);

  const handleDropdownSelect = (item) => {
  setSelectedStation(item); // set the station
  setAnchorEl(null);         

  // fetch bookings immediately for new station
  if (activeTab === 1 && selectedDate) {
    fetchCompletedBookings(item, selectedDate);
  }
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

  const fetchCompletedBookings = async () => {
  if (!selectedStation || !selectedDate) return;

  try {
    const formattedDate = format(selectedDate, "yyyy-MM-dd"); // YYYY-MM-DD

    const res = await fetch(
      `http://127.0.0.1:8000/api/reports/booking-sales?station=${selectedStation}&date=${formattedDate}`
    );
    const data = await res.json();

    if (data.success) {
      setBookings(data.data);
    }
  } catch (err) {
    console.error(err);
  }
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
     <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            // format="dd-MM-yyyy"
            slotProps={{
              textField: {
                InputProps: {
                  sx: {
                    color: "#fff",
                    height: "45px",
                    padding : "10px"

                  },
                },
                sx: {
                  width: 160,
                  backgroundColor: "#0F172A",
                  borderRadius: "8px",

                  "& .MuiOutlinedInput-input": {
                    color: "#ffffff !important",
                    WebkitTextFillColor: "#ffffff !important",
                  },

                  "& input": {
                    color: "#ffffff !important",
                  },

                  "& .MuiSvgIcon-root": {
                    color: "#ffffff",
                  },

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1e293b",
                  },

                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0CD7FF",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#0CD7FF",
                  },
                },
              },
            }}
          />
    </LocalizationProvider> 

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
               {selectedStation || "Select Station"}
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
                    {stations.map((station, index) => (
                      <Box
                        key={index}
                        onClick={() => handleDropdownSelect(station)}
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
                        {station}
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

              {bookings.map((row, i) => (
                <Box
                  key={i}
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
                  <Box sx={tableRowStyle}>LKR {row.amount}</Box>

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
