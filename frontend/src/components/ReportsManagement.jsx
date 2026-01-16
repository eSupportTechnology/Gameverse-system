import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import { revenueData } from "../assets/assets";
import ReportCards from "./ReportCards";
import SalesChart from "./ReportSalesChart";
import QuickActions from "./ReportQuickActions";
import ReportBookingSalesTable from "./ReportBookingSalesTable";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

const ReportsManagement = () => {
  const [dateFilter, setDateFilter] = useState("today");
  const [viewMode, setViewMode] = useState("overview");
  const [openTab, setOpenTab] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [productsSold, setProductsSold] = useState(0);

//Fetched Total Sales
  useEffect(() => {
  const fetchTotalSales = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/total-sales`
      );

      if (res.data.success) {
        setTotalSales(res.data.total_sales);
      }
    } catch (error) {
      console.error("Error fetching total sales", error);
    }
  };

  fetchTotalSales();
}, []);

//To fetch Products SOld
useEffect(() => {
  const fetchProductsSold = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/products-sold`
      );

      if (res.data.success) {
        setProductsSold(res.data.products_sold);
      }
    } catch (error) {
      console.error("Error fetching products sold", error);
    }
  };

  fetchProductsSold();
}, []);

  // Handle date filter changes
  const handleDateFilterChange = (newFilter) => {
    setDateFilter(newFilter);
    toast.success(`Date filter changed to: ${newFilter}`);
  };

  // Handle export functionality
  const handleExport = () => {
    toast.info("Exporting report data...");
    // Export logic
    setTimeout(() => {
      toast.success("Report exported successfully!");
    }, 1000);
  };

  // Get current data based on date filter
  const getCurrentData = () => {
    const filterMap = {
      today: "Today",
      yesterday: "Yesterday",
      week: "This Week",
      month: "This Month",
      year: "This Year",
    };

    return (
      revenueData.find((data) => data.period === filterMap[dateFilter]) ||
      revenueData[0]
    );
  };

  const currentData = getCurrentData();

  const [newCustomersCount, setNewCustomersCount] = useState(0);

  useEffect(() => {
    const fetchNewCustomers = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/reports/new-customers`
        );

        if (res.data.success) {
          setNewCustomersCount(res.data.count);
        }
      } catch (error) {
        console.error("Error fetching new customers count", error);
      }
    };

    fetchNewCustomers();
  }, []);

  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const fetchTotalBookings = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/reports/total-bookings`
        );

        if (res.data.success) {
          setTotalBookings(res.data.count);
        }
      } catch (error) {
        console.error("Error fetching total bookings", error);
      }
    };

    fetchTotalBookings();
  }, []);
// fetch chart data 
    const [chartData, setChartData] = useState({
    bookings: 0,
    products: 0,
    games: 0,
  });
    useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/reports/sales-chart?filter=${dateFilter}`
        );

        if (res.data.success) {
          setChartData(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching chart data", err);
      }
    };

    fetchChartData();
  }, [dateFilter]);


  // Metric cards data
  const metrics = [
    {
      id: 1,
      label: "Total Sales",
      icon: <img src="/images/report Icon/salesIcon.png" width={28} />,
      // value: "LKR 15,800",
       value: `LKR ${currentData.totalRevenue.toLocaleString()}`,
      changePositive: true,
      iconBgColor: "#ff6b81",
    },
    {
      id: 2,
      label: "Total Booking",
      icon: <img src="/images/report Icon/group.png" width={28} />,
      value: totalBookings.toString().padStart(2, "0"),
      changePositive: true,
      iconBgColor: "#ffa86b",
    },
    {
      id: 3,
      label: "Products Sold",
      icon: <img src="/images/report Icon/vector.png" width={28} />,
      // value: "60",
      value: currentData.totalSales.toString(),
      changePositive: true,
      iconBgColor: "#2bdc65",
    },
    {
      id: 4,
      label: "New Customers",
      icon: <img src="/images/report Icon/newCostumersIcon.png" width={28} />,
      value: newCustomersCount.toString().padStart(2, "0"),
      changePositive: true,
      iconBgColor: "#b28bff",
    },
  ];

  // Quick Action Handler
  const handleActionClick = (action) => {
    if (action === "Booking Sales") {
      setViewMode("table");
      setOpenTab(1);
    } else if (action === "Product Sales") {
      setViewMode("table");
      setOpenTab(2);
    } else if (action === "Other Games Sales") {
      setViewMode("table");
      setOpenTab(3);
    } else if (action === "NFC Customers") {
      setViewMode("table");
      setOpenTab(4);
    } else {
      toast.info(`${action} coming soon`);
    }
  };

  return (
    <>
      {viewMode === "overview" && (
        <Box
          sx={{
            borderRadius: "12px",
            pt: { xs: 12, sm: 13, md: 10 },
            padding: { xs: 1, sm: 2 },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
            }}
          >
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
                sx={{
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                Business performance insights and data analytics
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "row" },
                gap: { xs: 1, sm: 1.5 },
                alignItems: "center",
                width: { xs: "auto", md: "auto" },
                flexShrink: 0,
              }}
            >
              {/* Date Filter Dropdown */}
              <FormControl size="small" sx={{ minWidth: { xs: 130, sm: 150 } }}>
                <Select
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e.target.value)}
                  sx={{
                    background:
                      "linear-gradient(90deg, rgba(12, 215, 255, 0.1) 0%, rgba(197, 0, 255, 0.2) 69%)",
                    color: "#fff",
                    border: "1px solid #2d3748",
                    borderRadius: "8px",
                    fontSize: { xs: "12px", sm: "13px", md: "14px" },
                    height: { xs: "40px", sm: "42px", md: "44px" },
                    "& .MuiSelect-select": {
                      py: { xs: 1, sm: 1.25 },
                      px: { xs: 1.5, sm: 2 },
                    },
                    "& .MuiSelect-icon": {
                      color: "#fff",
                      width: "20px",
                      height: "20px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: "#2d3748",
                    },
                  }}
                >
                  <MenuItem
                    value="today"
                    sx={{ fontSize: { xs: "11px", sm: "12px" } }}
                  >
                    Today
                  </MenuItem>
                  <MenuItem
                    value="yesterday"
                    sx={{ fontSize: { xs: "11px", sm: "12px" } }}
                  >
                    Yesterday
                  </MenuItem>
                  <MenuItem
                    value="week"
                    sx={{ fontSize: { xs: "11px", sm: "12px" } }}
                  >
                    This Week
                  </MenuItem>
                  <MenuItem
                    value="month"
                    sx={{ fontSize: { xs: "11px", sm: "12px" } }}
                  >
                    This Month
                  </MenuItem>
                  <MenuItem
                    value="year"
                    sx={{ fontSize: { xs: "11px", sm: "12px" } }}
                  >
                    This Year
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Export Button */}
              <Button
                onClick={handleExport}
                variant="contained"
                size="medium"
                sx={{
                  background:
                    "linear-gradient(90deg, #a855f7 0%, #06b6d4 100%)",
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
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #9333ea 0%, #0891b2 100%)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
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

          {/* Metrics Cards */}
          <Box
            sx={{
              minHeight: "100vh",
              backgroundColor: "#0a0e1a",
              color: "#fff",
              p: { xs: 1.5, sm: 2, md: 2 },
              mt: { xs: 1, sm: 2, md: 3 },
              width: "100%",
              maxWidth: "100vw",
              borderRadius: "8px",
              overflow: "auto",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <ReportCards metrics={metrics} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr",
                gap: 3,
                mt: 4,
              }}
            >
              <SalesChart data={chartData} />
              <QuickActions onActionClick={handleActionClick} />
            </Box>
          </Box>
        </Box>
      )}

      {viewMode === "table" && (
        <Box sx={{ p: 5, minHeight: "100vh", color: "#fff" }}>
          <ReportBookingSalesTable
            dateFilter={dateFilter}
            activeTabFromParent={openTab}
            onReturnToOverview={() => setViewMode("overview")}
          />
        </Box>
      )}
    </>
  );
};

export default ReportsManagement;
