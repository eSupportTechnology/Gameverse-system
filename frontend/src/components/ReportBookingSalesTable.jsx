import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  TextField,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReportProductSalesTable from "./ReportProductSalesTable";
import ReportOtherGamesSalesTable from "./ReportOtherGamesSalesTable";
import ReportNFCcustomersTable from "./ReportNFCcustomersTable";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";
import { toast } from "react-toastify";

const ReportBookingSalesTable = ({
  showOnlyBooking = false,
  onReturnToOverview,
  activeTabFromParent = 1,
  dateFilter = "today",
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
  const [selectedStation, setSelectedStation] = useState("All Stations");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (activeTab === 1) fetchBookings();
  }, [selectedStation, date, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("aToken");
      const stationParam =
        selectedStation !== "All Stations"
          ? `&station=${encodeURIComponent(selectedStation)}`
          : "";
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/bookings?date=${date}${stationParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        const completed = res.data.data.filter((b) => b.status === "completed");
        setBookings(completed);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const stations = [
    "All Stations",
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

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/reports/export-doc?filter=${dateFilter}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `report_${dateFilter}_${new Date().toISOString().split("T")[0]}.docx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export report.");
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

  return (
    <Box sx={{ pt: { xs: 2, sm: 4, md: 6 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: "20px", md: "28px" }, fontWeight: "bold", color: "#fff" }}
          >
            Reports & Analytics
          </Typography>
          <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
            Business performance insights and data analysis
          </Typography>
        </Box>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{
            background: "linear-gradient(90deg, #a855f7 0%, #06b6d4 100%)",
            color: "#fff",
            borderRadius: "8px",
            px: 3,
            py: 1.25,
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            mt: { xs: 2, md: 0 },
            "&:hover": { background: "linear-gradient(90deg, #9333ea 0%, #0891b2 100%)" },
          }}
          startIcon={
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        >
          Export
        </Button>
      </Box>

      {/* Top Bar */}
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
            if (tabs[newValue] === "Overview" && onReturnToOverview) onReturnToOverview();
          }}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            minHeight: "45px",
            "& .MuiTabs-flexContainer": { gap: "12px" },
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
            inputProps={{ style: { height: "40px", padding: "0 12px", color: "#fff" } }}
            sx={{
              bgcolor: "#1F2937",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#00E5FF" },
              },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
          />

          {/* Station Dropdown — only for Booking tab */}
          {activeTab === 1 && (
            <Box sx={{ position: "relative" }}>
              <Box
                ref={anchorRef}
                onClick={handleDropdownClick}
                sx={{
                  px: 2, py: 1,
                  borderRadius: "8px",
                  backgroundColor: "#1F2937",
                  border: "1px solid #1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: "#fff",
                  cursor: "pointer",
                  minWidth: "140px",
                  fontSize: "14px",
                }}
              >
                {selectedStation}
                <ArrowDropDownIcon />
              </Box>

              <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom"
                modifiers={[{ name: "offset", options: { offset: [0, 5] } }]}
                sx={{ zIndex: 9999 }}
              >
                <ClickAwayListener onClickAway={handleDropdownClose}>
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute", top: "-10px", right: "15px",
                        width: 0, height: 0,
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderBottom: "10px solid #0F172A",
                        filter: "drop-shadow(0px -2px 2px rgba(0,0,0,0.4))",
                      }}
                    />
                    <Paper
                      sx={{
                        mt: 1, backgroundColor: "#0F172A", color: "#fff",
                        width: "170px", maxHeight: "400px", overflowY: "auto",
                        borderRadius: "4px",
                        "&::-webkit-scrollbar": { width: "6px" },
                        "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: "4px" },
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
                            cursor: "pointer",
                            backgroundColor: selectedStation === item ? "#1e293b" : "transparent",
                            "&:hover": { backgroundColor: "#1e293b" },
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
          )}
        </Box>
      </Box>

      {/* Booking Sales Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3, backgroundColor: "#0A0F1A", p: 3, borderRadius: "12px" }}>
          <Box
            sx={{
              backgroundColor: "#111827",
              borderRadius: "10px",
              overflow: "hidden",
              maxHeight: "500px",
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: "4px" },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 2fr 1fr 1fr 1fr",
                borderBottom: "1px solid #1F2937",
                "& > div": { borderRight: "1px solid #1F2937", "&:last-child": { borderRight: "none" } },
              }}
            >
              {["Customer Name", "Phone", "Station", "Start Time", "Duration", "Amount"].map((h) => (
                <Box key={h} sx={tableHeaderStyle}>{h}</Box>
              ))}
            </Box>

            {loading && (
              <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>Loading bookings...</Box>
            )}
            {!loading && bookings.length === 0 && (
              <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>No completed bookings found</Box>
            )}

            {bookings.map((row) => (
              <Box
                key={row.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 2fr 1fr 1fr 1fr",
                  borderBottom: "1px solid #1F2937",
                  "&:hover": { backgroundColor: "#1a2433" },
                  "& > div": { borderRight: "1px solid #1F2937", "&:last-child": { borderRight: "none" } },
                }}
              >
                <Box sx={tableRowStyle}>{row.customer_name || "-"}</Box>
                <Box sx={tableRowStyle}>{row.phone_number || "-"}</Box>
                <Box sx={tableRowStyle}>{row.station || "-"}</Box>
                <Box sx={tableRowStyle}>{row.start_time || "-"}</Box>
                <Box sx={tableRowStyle}>{row.duration ? `${row.duration}h` : "-"}</Box>
                <Box sx={tableRowStyle}>LKR {Number(row.amount || 0).toFixed(2)}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 2 && <ReportProductSalesTable date={date} />}
      {activeTab === 3 && <ReportOtherGamesSalesTable date={date} />}
      {activeTab === 4 && <ReportNFCcustomersTable date={date} />}
    </Box>
  );
};

export default ReportBookingSalesTable;
