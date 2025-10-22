import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl
} from "@mui/material";
import { toast } from "react-toastify";
import { revenueData } from '../assets/assets';
import ReportCards from './ReportCards';

const ReportsManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dateFilter, setDateFilter] = useState('today');

  // Handle date filter changes
  const handleDateFilterChange = (newFilter) => {
    setDateFilter(newFilter);
    toast.success(`Date filter changed to: ${newFilter}`);
  };

  // Handle export functionality
  const handleExport = () => {
    toast.info('Exporting report data...');
    // Export logic would go here
    setTimeout(() => {
      toast.success('Report exported successfully!');
    }, 1000);
  };

  // Get current data based on date filter
  const getCurrentData = () => {
    const filterMap = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'week': 'This Week',
      'month': 'This Month',
      'year': 'This Year'
    };
    
    return revenueData.find(data => data.period === filterMap[dateFilter]) || revenueData[0];
  };

  const currentData = getCurrentData();

  // Metric cards data - now using data from assets.js
  const metrics = [
    {
      id: 1,
      icon: (
        <img 
          src="/images/report Icon/reportIcon1.png" 
          alt="Total Revenue Icon" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
      ),
      value: `${currentData.totalRevenue.toLocaleString()} ${currentData.currency}`,
      label: 'Total Revenue',
      change: `+${currentData.growthPercentage}%`,
      changePositive: true,
      iconBg: {
        backgroundColor: 'linear-gradient(135deg, #1d4254 0%, #222140 100%)',
        backgroundImage: 'url(/images/report Icon/reportIconBackground.png)'
      },
      iconColor: '#fff'
    },
    {
      id: 2,
      icon: (
        <img 
          src="/images/report Icon/reportIcon2.png" 
          alt="Total Bookings Icon" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
      ),
      value: currentData.totalBookings.toString(),
      label: 'Total Bookings',
      change: `+${(currentData.growthPercentage - 6.5).toFixed(1)}%`,
      changePositive: true,
      iconBg: {
        backgroundColor: 'linear-gradient(135deg, #1d4254 0%, #222140 100%)',
        backgroundImage: 'url(/images/report Icon/reportIconBackground.png)'
      },
      iconColor: '#fff'
    },
    {
      id: 3,
      icon: (
        <img 
          src="/images/report Icon/reportIcon3.png" 
          alt="Total Sales Icon" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
      ),
      value: currentData.totalSales.toString(),
      label: 'Total Sales',
      change: `+${currentData.growthPercentage}%`,
      changePositive: true,
      iconBg: {
        backgroundColor: 'linear-gradient(135deg, #1d4254 0%, #222140 100%)',
        backgroundImage: 'url(/images/report Icon/reportIconBackground.png)'
      },
      iconColor: '#fff'
    },
    {
      id: 4,
      icon: (
        <img 
          src="/images/report Icon/reportIcon4.png" 
          alt="Rejected Bookings Icon" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
      ),
      value: currentData.rejectedBookings.toString().padStart(2, '0'),
      label: 'Rejected Bookings',
      change: `+${(currentData.growthPercentage - 10).toFixed(1)}%`,
      changePositive: false,
      iconBg: {
        backgroundColor: 'linear-gradient(135deg, #1d4254 0%, #222140 100%)',
        backgroundImage: 'url(/images/report Icon/reportIconBackground.png)'
      },
      iconColor: '#fff'
    }
  ];



  const tabs = ['OverView', 'Station Sales', 'Bookings', 'Income'];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0e1a', 
        color: '#fff', 
        p: { xs: 1.5, sm: 2, md: 3 },
        pt: { xs: 12, sm: 13, md: 10 }, // Increased top padding to avoid navbar overlap
        width: '100%',
        maxWidth: '100vw',
        overflow: 'auto',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: { xs: 2, md: 3 }, width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          mb: { xs: 1.5, md: 2 },
          gap: { xs: 1.5, md: 2 }
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontSize: { xs: '20px', sm: '24px', md: '28px' }, 
                fontWeight: 'bold', 
                mb: 0.5, 
                letterSpacing: '-0.3px',
                color: '#fff',
                lineHeight: 1.2
              }}
            >
              Reports & Analytics
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6b7280', 
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                lineHeight: 1.3
              }}
            >
              Business performance insights and data analysis
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'row', sm: 'row' },
            gap: { xs: 1, sm: 1.5 }, 
            alignItems: 'center',
            width: { xs: 'auto', md: 'auto' },
            flexShrink: 0
          }}>
            {/* Date Filter Dropdown */}
            <FormControl size="small" sx={{ minWidth: { xs: 130, sm: 150 } }}>
              <Select
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                sx={{
                  backgroundColor: '#1a202e',
                  color: '#fff',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  fontSize: { xs: '12px', sm: '13px', md: '14px' },
                  height: { xs: '40px', sm: '42px', md: '44px' },
                  '& .MuiSelect-select': {
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 1.5, sm: 2 }
                  },
                  '& .MuiSelect-icon': {
                    color: '#fff',
                    width: '20px',
                    height: '20px'
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover': {
                    backgroundColor: '#2d3748',
                  }
                }}
              >
                <MenuItem value="today" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>Today</MenuItem>
                <MenuItem value="yesterday" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>Yesterday</MenuItem>
                <MenuItem value="week" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>This Week</MenuItem>
                <MenuItem value="month" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>This Month</MenuItem>
                <MenuItem value="year" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>This Year</MenuItem>
              </Select>
            </FormControl>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              variant="contained"
              size="medium"
              sx={{
                background: 'linear-gradient(90deg, #a855f7 0%, #06b6d4 100%)',
                color: '#fff',
                borderRadius: '8px',
                px: { xs: 2, sm: 2.5, md: 3 },
                py: { xs: 1, sm: 1.25 },
                fontSize: { xs: '12px', sm: '13px', md: '14px' },
                fontWeight: '600',
                textTransform: 'none',
                minHeight: { xs: '40px', sm: '42px', md: '44px' },
                minWidth: { xs: '85px', sm: '100px' },
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: 'linear-gradient(90deg, #9333ea 0%, #0891b2 100%)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0.75, sm: 1 },
                  '& svg': {
                    width: { xs: '16px', sm: '18px' },
                    height: { xs: '16px', sm: '18px' }
                  }
                }
              }}
              startIcon={
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            >
              Export
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ 
        mb: { xs: 2, md: 2.5 }, 
        width: '100%',
        backgroundColor: '#040914ff', // Dark background for the tab row
        borderRadius: { xs: '8px', md: '10px' },
        p: { xs: 1.5, sm: 2, md: 2.5 },
        border: '1px solid #1e293b',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}>
        <Box sx={{ 
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '3px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1a202e'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4a5568',
            borderRadius: '2px'
          }
        }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                display: 'none' // Hide default indicator since we're using custom styling
              },
              '& .MuiTabs-flexContainer': {
                gap: { xs: 0.5, sm: 0.75 },
                pb: 0
              },
              '& .MuiTabs-scrollButtons': {
                width: '30px',
                '&.Mui-disabled': {
                  opacity: 0.3
                }
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab}
                sx={{
                  color: activeTab === index ? '#fff' : '#6b7280',
                  backgroundColor: activeTab === index 
                    ? 'rgba(14, 116, 144, 0.15)' 
                    : '#1a202e',
                  border: activeTab === index ? '1px solid #0891b2' : '1px solid #2d3748',
                  borderRadius: '6px',
                  mx: { xs: 0.25, sm: 0.25 },
                  fontSize: { xs: '10px', sm: '11px', md: '12px' },
                  fontWeight: '500',
                  textTransform: 'none',
                  minHeight: { xs: '30px', sm: '32px', md: '36px' },
                  minWidth: { xs: '70px', sm: '80px', md: '90px' },
                  px: { xs: 1, sm: 1.5, md: 2 },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: activeTab === index 
                      ? 'rgba(14, 116, 144, 0.25)' 
                      : '#2d3748',
                  },
                  '&.Mui-selected': {
                    color: '#fff',
                    background: 'linear-gradient(135deg, rgba(14, 116, 144, 0.2) 0%, rgba(8, 145, 178, 0.15) 100%)',
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <ReportCards metrics={metrics} />
    </Box>
  );
};

export default ReportsManagement;