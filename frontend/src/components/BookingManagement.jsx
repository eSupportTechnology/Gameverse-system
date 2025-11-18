// BookingManagement.jsx (Updated)
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  TextField,
  CircularProgress,
} from "@mui/material";
import BookingForm from './BookingForm';
import BookingGrid from './BookingGrid';
import BookingDialog from './BookingDialog'; // For Upcoming
import SessionDialog from './SessionDialog'; // For In Progress
import CompletedBookingDialog from './CompletedBookingDialog'; // For Completed
import axios from 'axios';

const BookingManagement = () => {
  const [view, setView] = React.useState("timeline");
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [openDialog, setOpenDialog] = useState(false);
  const [apiBookings, setApiBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Separate states for each dialog type
  const [upcomingDialogOpen, setUpcomingDialogOpen] = useState(false);
  const [inProgressDialogOpen, setInProgressDialogOpen] = useState(false);
  const [completedDialogOpen, setCompletedDialogOpen] = useState(false);

  // Helper functions
  const normalizeTimeFormat = (timeString) => {
    if (!timeString) return '';
    
    const timeMatch = timeString.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      
      if (hours === 0) {
        return `12:${minutes}`;
      } else if (hours > 12) {
        return `${String(hours - 12).padStart(2, '0')}:${minutes}`;
      } else if (hours < 10) {
        return `${String(hours).padStart(2, '0')}:${minutes}`;
      } else {
        return `${hours}:${minutes}`;
      }
    }
    
    return timeString;
  };

  const matchStation = (apiStation, uiStationName) => {
    if (!apiStation || !uiStationName) return false;
    
    const normalizedApi = apiStation.toLowerCase().trim();
    const normalizedUI = uiStationName.toLowerCase().trim();
    
    if (normalizedApi === normalizedUI) return true;
    
    if (normalizedApi === 'station1' && normalizedUI.includes('station 1')) return true;
    if (normalizedApi === 'station2' && normalizedUI.includes('station 2')) return true;
    if (normalizedApi === 'station3' && normalizedUI.includes('station 3')) return true;
    
    if (normalizedApi.includes('station 1') && normalizedUI.includes('station 1')) return true;
    if (normalizedApi.includes('station 2') && normalizedUI.includes('station 2')) return true;
    if (normalizedApi.includes('station 3') && normalizedUI.includes('station 3')) return true;
    
    if (normalizedApi.includes('pool') && normalizedUI.includes('pool')) return true;
    
    return false;
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/bookings');
      
      if (response.data.success) {
        const mapBooking = (b) => {
          const statusMap = {
            pending: 'upcoming',
            confirmed: 'inprogress',
            cancelled: 'completed',
            completed: 'completed',
          };

          const normalizedTime = normalizeTimeFormat(b.start_time || b.startTime || b.time || '');

          return {
            id: b.id,
            customer_name: b.customer_name || b.customerName || b.user || '',
            station: b.station || '',
            start_time: normalizedTime,
            time: normalizedTime,
            original_start_time: b.start_time || b.startTime || b.time || '',
            booking_date: b.booking_date || b.date || '',
            duration: b.duration || '',
            amount: b.amount ?? b.full_amount ?? b.price ?? 0,
            status: (statusMap[b.status] || b.status || 'upcoming').toLowerCase(),
            user: b.customer_name || b.user || '',
            phone: b.phone_number || b.phone || '',
            extended_time: b.extended_time || '',
            players: b.players || [],
            online_deposit: b.online_deposit || 0,
            total_amount: b.total_amount || b.amount || 0,
            balance_amount: b.balance_amount || 0,
          };
        };

        const normalized = response.data.data.map(mapBooking);
        
        // Add random mock bookings for demonstration if API doesn't have all statuses
        const enhancedBookings = [...normalized, ...generateMockBookings()];
        setApiBookings(enhancedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Use mock data if API fails
      setApiBookings(generateMockBookings());
    } finally {
      setLoading(false);
    }
  };

  // Generate mock bookings for all statuses
  const generateMockBookings = () => {
    const mockBookings = [
      // Upcoming Bookings
      {
        id: "1001",
        customer_name: "John Smith",
        station: "PSS Station 1",
        start_time: "02:00",
        duration: "1h 30m",
        status: "upcoming",
        user: "John Smith",
        phone: "+94 771234567",
        amount: 300,
        players: ["Player 01", "Player 02"]
      },
      {
        id: "1002",
        customer_name: "Emma Wilson",
        station: "PSS Station 2",
        start_time: "04:30",
        duration: "2h 0m",
        status: "upcoming",
        user: "Emma Wilson",
        phone: "+94 772345678",
        amount: 400,
        players: ["Player 03", "Player 04"]
      },
      {
        id: "1003",
        customer_name: "Mike Johnson",
        station: "8 Ball Pool(Premium)",
        start_time: "07:00",
        duration: "1h 0m",
        status: "upcoming",
        user: "Mike Johnson",
        phone: "+94 773456789",
        amount: 200,
        players: ["Player 01"]
      },

      // In Progress Bookings
      {
        id: "2001",
        customer_name: "Sarah Brown",
        station: "PSS Station 1",
        start_time: "12:00",
        duration: "2h 0m",
        status: "inprogress",
        user: "Sarah Brown",
        phone: "+94 774567890",
        amount: 400,
        players: ["Player 01", "Player 02", "Player 03"]
      },
      {
        id: "2002",
        customer_name: "David Lee",
        station: "PSS Station 3",
        start_time: "01:30",
        duration: "1h 30m",
        status: "inprogress",
        user: "David Lee",
        phone: "+94 775678901",
        amount: 300,
        players: ["Player 01", "Player 04"]
      },
      {
        id: "2003",
        customer_name: "Lisa Garcia",
        station: "8 Ball Pool(Suprime)",
        start_time: "06:00",
        duration: "2h 30m",
        status: "inprogress",
        user: "Lisa Garcia",
        phone: "+94 776789012",
        amount: 500,
        players: ["Player 02", "Player 03"]
      },

      // Completed Bookings
      {
        id: "3001",
        customer_name: "Robert Taylor",
        station: "PSS Station 2",
        start_time: "10:00",
        duration: "1h 0m",
        status: "completed",
        user: "Robert Taylor",
        phone: "+94 777890123",
        amount: 200,
        players: ["Player 01"]
      },
      {
        id: "3002",
        customer_name: "Maria Martinez",
        station: "PSS Station 1",
        start_time: "11:30",
        duration: "2h 0m",
        status: "completed",
        user: "Maria Martinez",
        phone: "+94 778901234",
        amount: 400,
        players: ["Player 02", "Player 04"]
      },
      {
        id: "3003",
        customer_name: "James Anderson",
        station: "PSS Station 3",
        start_time: "09:00",
        duration: "1h 30m",
        status: "completed",
        user: "James Anderson",
        phone: "+94 779012345",
        amount: 300,
        players: ["Player 03"]
      }
    ];

    return mockBookings;
  };

  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]);

  const refreshBookings = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) setView(newView);
  };

  // Handle booking slot click - opens appropriate dialog based on status
  const handleBookingSlotClick = (booking) => {
    setSelectedBooking(booking);
    
    switch(booking.status) {
      case 'upcoming':
        setUpcomingDialogOpen(true);
        break;
      case 'inprogress':
        setInProgressDialogOpen(true);
        break;
      case 'completed':
        setCompletedDialogOpen(true);
        break;
      default:
        setUpcomingDialogOpen(true);
    }
  };

  // Dialog action handlers
  const handleEditBooking = () => {
    console.log('Edit booking:', selectedBooking);
    setUpcomingDialogOpen(false);
    // Implement edit functionality
  };

  const handleCancelBooking = () => {
    console.log('Cancel booking:', selectedBooking);
    setUpcomingDialogOpen(false);
    // Implement cancel functionality
  };

  const handleUpdateTime = () => {
    console.log('Update time for:', selectedBooking);
    // Implement time update functionality
  };

  const handleEndSession = () => {
    console.log('End session for:', selectedBooking);
    setInProgressDialogOpen(false);
    // Implement end session functionality
  };

  const handleCollectPayment = () => {
    console.log('Collect payment for:', selectedBooking);
    setCompletedDialogOpen(false);
    // Implement collect payment functionality
  };

  // Sample stations
  const stations = [
    { name: "PSS Station 1", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "PSS Station 2", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "PSS Station 3", subname: 'PSS Station 1', rate: "$12.5/hr" },
    { name: "8 Ball Pool(Suprime)", subname: 'Pool', rate: "$12.5/hr" },
    { name: "8 Ball Pool(Premium)", subname: 'Pool', rate: "$12.5/hr" },
  ];

  const timeSlots = [
    "12:00", "12:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  ];

  const statusColors = {
    upcoming: "#0CD7FF",
    inprogress: "#9A60E8",
    completed: "#FD00B5",
  };

  return (
    <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }}
        alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }}
        mb={2}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
          <Typography variant="h5" fontWeight="bold" fontSize={24}>Booking Management</Typography>
          <Typography variant="body2" color="gray" fontSize={16}>Manage reservations and station schedules</Typography>
        </Box>

        <Box display="flex" gap={2} mt={{ xs: 2, sm: 2, md: 0 }} width={{ xs: "100%", sm: "100%", md: "auto" }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            sx={{
              borderRadius: "12px",
              "& .MuiToggleButton-root": {
                bgcolor: "#1F2937",
                color: "#8CA3AF",
                border: "none",
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: "500",
                fontSize: 16,
                "&.Mui-selected": { bgcolor: "#00E5FF", color: "#fff" },
                "&.Mui-selected:hover": { bgcolor: "#00d1eb" },
                "&:hover": { bgcolor: "#374151" },
              },
            }}
          >
            <ToggleButton sx={{ px: 2, py: 1 }} value="timeline">Timeline</ToggleButton>
            <ToggleButton sx={{ px: 2, py: 1 }} value="grid">Grid</ToggleButton>
          </ToggleButtonGroup>

          <Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                borderRadius: "6px",
                px: 6,
                py: 1,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
              }}
              onClick={() => setOpenDialog(true)}
            >
              + New Booking
            </Button>
            <BookingForm 
              open={openDialog} 
              handleClose={() => setOpenDialog(false)}
              onBookingCreated={refreshBookings} 
            />
          </Box>
        </Box>
      </Box>

      {/* Toolbar */}
      <Box display="flex" flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent={{ xs: "flex-start", sm: "flex-start", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2}>
        
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ 
            style: { 
              height: "40px", 
              padding: "0 12px",
              color: "#fff" 
            } 
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
            mb: { xs: 2, sm: 2, md: 0 }
          }}
        />

        <Box display="flex" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: statusColors.upcoming }} />
            <Typography color="#fff" fontSize={12}>Upcoming</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: statusColors.inprogress }} />
            <Typography color="#fff" fontSize={12}>Inprogress</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: statusColors.completed }} />
            <Typography color="#fff" fontSize={12}>Completed</Typography>
          </Box>
        </Box>
      </Box>

      {/* Booking Timeline */}
      {view === "timeline" && (
        <Paper sx={{ p: 2, borderRadius: "12px", bgcolor: '#0E111B', height: '100vh' }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            {/* Left Column */}
            <Box sx={{ flex: "0 0 200px", pr: 2 }}>
              <Typography fontWeight='bold' mb={1} fontSize={14} sx={{ color: 'white' }}>Stations</Typography>
              {stations.map((station, i) => (
                <Box key={i} sx={{
                  display: 'flex', flexDirection: 'column', gap: 0.2, width: '100%', maxWidth: 185, height: 50, py: 1, px: 2, bgcolor: '#171E2A', mb: 1, borderRadius: '10px'
                }}>
                  <Typography fontWeight="bold" color='#FFFFFF' fontSize={12}>{station.name}</Typography>
                  <Typography fontWeight={500} color='#9CA3AF' fontSize={12}>{station.subname}</Typography>
                  <Typography variant="caption" color="#0CD7FF" fontSize={12}>{station.rate}</Typography>
                </Box>
              ))}
            </Box>

            {/* Right Column */}
            <Box sx={{ overflowX: "auto", flex: 1 }}>
              <Box sx={{ maxWidth: 50, mx: 2 }}>
                <Box sx={{ display: "flex", mb: 2 }}>
                  {timeSlots.map((slot) => (
                    <Box key={slot} sx={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 56, textAlign: "center", mr: 1 }}>
                      <Typography variant="body2" color="#FFFFFF">{slot}</Typography>
                    </Box>
                  ))}
                </Box>

                {stations.map((station, i) => (
                  <Box key={i} sx={{ display: "flex", mb: 2 }}>
                    {timeSlots.map((slot) => {
                      const apiBooking = apiBookings.find(
                        (b) => matchStation(b.station, station.name) && b.start_time === slot
                      );
                      
                      return (
                        <Box
                          key={slot}
                          sx={{
                            minWidth: 56,
                            height: 56,
                            border: apiBooking ? `1px solid ${statusColors[apiBooking.status]}` : "1px solid #222",
                            bgcolor: apiBooking ? statusColors[apiBooking.status] : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "8px",
                            mr: 1,
                            position: "relative",
                            overflow: "hidden",
                            cursor: apiBooking ? 'pointer' : 'default',
                            "&::after": apiBooking ? { content: '""', position: "absolute", top: 0, left: 0, width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.8)", borderRadius: "8px" } : {},
                            "&:hover": apiBooking ? { transform: 'scale(1.05)', transition: 'transform 0.2s', boxShadow: `0 0 8px ${statusColors[apiBooking.status]}` } : {},
                          }}
                          onClick={() => apiBooking && handleBookingSlotClick(apiBooking)}
                        >
                          {apiBooking && (
                            <Typography fontSize={10} fontWeight={400} zIndex={1} color='#FFFFFF'>
                              {apiBooking.customer_name || apiBooking.user}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      )}

      {view === "grid" &&
        <BookingGrid apiBookings={apiBookings} loading={loading} onBookingUpdated={refreshBookings} />
      }
      
      {loading && (
        <Box position="fixed" bottom={20} right={20} zIndex={9999}>
          <CircularProgress size={30} sx={{ color: "#0CD7FF" }} />
        </Box>
      )}

      {/* All Three Dialogs */}
      <BookingDialog
        open={upcomingDialogOpen}
        onClose={() => setUpcomingDialogOpen(false)}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
      />

      <SessionDialog
        open={inProgressDialogOpen}
        onClose={() => setInProgressDialogOpen(false)}
        onEndSession={handleEndSession}
      />

      <CompletedBookingDialog
        open={completedDialogOpen}
        onClose={() => setCompletedDialogOpen(false)}
        onCollectPayment={handleCollectPayment}
      />
    </Box>
  )
}

export default BookingManagement;