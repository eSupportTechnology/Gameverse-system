
/**
 * GAMEVERSE DUMMY DATA COLLECTIONS
 * ================================
 * This file contains all dummy data used throughout the Gameverse application
 * for development and testing purposes.
 */

import poolTable from './pool_table.jpg'
import PS5station from './ps5_station.jpg'
import racingSimulator from './racing_simulators.jpg'
import poolGaming from './pool_gaming.jpg'
import caromGaming from './carom_gaming.png'
import archeryGaming from './archery_gaming.png'
import arcadeMachine from './arcade_machine.png'

// Simple booking data for quick reference and calendar views
export const bookings = [
    { station: "PSS Station 1", time: "12:30", user: "Nithin K", status: "inprogress", date: "2025-10-03" },
    { station: "PSS Station 1", time: "01:00", user: "Nithin K", status: "inprogress",date: "2025-10-03" },
    { station: "PSS Station 2", time: "01:30", user: "Nithin K", status: "inprogress",date: "2025-10-03" },
    { station: "PSS Station 2", time: "02:00", user: "Nithin K", status: "inprogress",date: "2025-10-03" },
    { station: "PSS Station 3", time: "02:00", user: "Sara Ch", status: "upcoming",date: "2025-10-03" },
    { station: "PSS Station 3", time: "02:30", user: "Sara Ch", status: "upcoming",date: "2025-10-03" },
    { station: "PSS Station 3", time: "03:00", user: "Sara Ch", status: "upcoming",date: "2025-10-03" },
    { station: "PSS Station 3", time: "03:30", user: "Sara Ch", status: "upcoming",date: "2025-10-03" },
    { station: "8 Ball Pool(Suprime)", time: "12:00", user: "Nikhil K", status: "completed",date: "2025-10-03" },
    { station: "8 Ball Pool(Suprime)", time: "12:30", user: "Nikhil K", status: "completed" ,date: "2025-10-03"},
    { station: "8 Ball Pool(Premium)", time: "12:00", user: "Nikhil K", status: "inprogress",date: "2025-10-03" },
    { station: "8 Ball Pool(Premium)", time: "12:30", user: "Nikhil K", status: "inprogress",date: "2025-10-03" },
    { station: "8 Ball Pool(Premium)", time: "01:00", user: "Nikhil K", status: "inprogress",date: "2025-10-03" },
];




/**
 * DETAILED BOOKING DATA
 * ====================
 * Comprehensive booking records with complete user information,
 * payment details, and booking metadata for the booking management system
 */
export const sampleBookings = [
  {
    user: "Alex Chen",
    phone:"+94 725656963",
    email:"alexchen@gmail.com",
    station: "PS5 Station 1",
    game: "Spider-Man 2",
    time: "1.00–12.00",
    date: "2025-10-03",
    duration:"2h 0m",
    extendedTime:"00.00",
    price: "400",
    paymentMethod:'Credit card',
    onlineDeposit:"000",
    balanceAmount:"000",
    loyaltyPrice: "150pts",
    status: "upcoming",
  },
  {
    user: "Nithin Kumar",
    phone:"+94 715656169",
    email:"Alexchen@gmail.com",
    station: "PS5 Station 1",
    game: "FIFA-24",
    time: "03.30–05.00",
    date: "2025-10-03",
    duration:"1h 30m",
    extendedTime:"00.00",
    price: "300",
    paymentMethod:'Credit card',
    onlineDeposit:"000",
    balanceAmount:"000",
    loyaltyPrice: "40pts",
    status: "inprogress",
  },
  {
    user: "Sara Chen",
    phone:"+94 725656963",
    email:"sarachen@gmail.com",
    station: "PS5 Station 1",
    game: "Barbie 2",
    time: "02.30–03.30",
    date: "2025-10-03",
    extendedTime:"00.00",
    duration:"1h 0m",
    price: "200",
    paymentMethod:'Cash',
    onlineDeposit:"000",
    balanceAmount:"000",
    loyaltyPrice: "220pts",
    status: "upcoming",
  },
  {
    user: "Nik Akesh",
    phone:"+94 725656963",
    email:"nikakesh@gmail.com",
    station: "Pool",
    game: "8 Ball Pool (Supreme)",
    time: "12.00–12.30",
    date: "2025-10-03",
    duration:"0h 30m",
    extendedTime:"00.00",
    price: "300",
    paymentMethod:'Credit card',
    onlineDeposit:"000",
    balanceAmount:"000",
    loyaltyPrice: "50pts",
    status: "completed",
  },
];



/**
 * GAMES & ACTIVITIES DATA
 * ======================
 * Available games and activities with pricing, location,
 * and category information for the games management system
 */
export const games = [
  {
    id: 1,
    title: "Coin Operated Machines",
    location: "Zone E",
    quantity: "01",
    playing_method:'Coin',
    price: 400,
    full_amount:800,
    discount_price:100,
    balance_payment:900,
    category: "Arcade Machine",
  },
  {
    id: 2,
    title: "F1 Adult Target",
    location: "Zone F",
    quantity: "05",
    playing_method:'Arrows',
    price: 600,
    full_amount:700,
    discount_price:100,
    balance_payment:900,
    category: "Archery",
  },
  {
    id: 3,
    title: "Carrom",
    location: "Zone F",
    players:"04",
    playing_method:'Per hour',
    price: 75,
    full_amount:850,
    discount_price:100,
    balance_payment:900,
    category: "Carrom",
  },
  {
    id: 4,
    title: "F1 Youth Target",
    location: "Zone E",
    quantity: "05",
    playing_method:'Arrows',
    price: 600,
    full_amount:950,
    discount_price:100,
    balance_payment:900,
    category: "Arcade Machine",
  },
  {
    id: 5,
    title: "F1 Youth Target",
    location: "Zone E",
    quantity: "05",
    playing_method:'Arrows',
    price: 600,
    full_amount:650,
    discount_price:100,
    balance_payment:900,
    category: "Arcade Machine",
  },
  {
    id: 6,
    title: "F1 Adult Target",
    location: "Zone F",
    quantity: "05",
    playing_method:'Arrows',
    price: 600,
    full_amount:700,
    discount_price:100,
    balance_payment:900,
    category: "Arcade Machine",
  },
];

/**
 * GAMING STATIONS DATA
 * ===================
 * All gaming stations with their specifications, pricing,
 * availability status, and booking statistics
 */
export const dummyStations = [
  {
    id: 1,
    name: "PS5 Station",
    type: "PlayStation",
    location: "Zone A",
    price: 100,
    time: 30,
    status: "Available",
    bookings: 6,
  },
  {
    id: 2,
    name: "PS5+VR (PS V R2)",
    type: "PlayStation",
    location: "Zone A",
    price: 300,
    time: 30,
    status: "Playing",
    bookings: 8,
  },
  {
    id: 3,
    name: "Car Racing Simulator",
    type: "Simulator",
    location: "Zone B",
    price: 300,
    time: 30,
    status: "Offline",
    bookings: 11,
  },
  {
    id: 4,
    name: "CR5+VR (PS V R2)",
    type: "Simulator",
    location: "Zone B",
    price: 450,
    time: 30,
    status: "Available",
    bookings: 8,
  },
  {
    id: 5,
    name: "8 Ball Pool (Premium)",
    type: "Pool",
    location: "Zone C",
    price: 300,
    time: 30,
    status: "Playing",
    bookings: 5,
  },
  {
    id: 6,
    name: "8 Ball Pool (Supreme)",
    type: "Pool",
    location: "Zone C",
    price: 600,
    time: 30,
    status: "Available",
    bookings: 7,
  },
  {
    id: 7,
    name: "PS5 Station Pro",
    type: "PlayStation",
    location: "Zone A",
    price: 150,
    time: 60,
    status: "Available",
    bookings: 12,
  },
  {
    id: 8,
    name: "VR Racing Pro",
    type: "Simulator",
    location: "Zone B",
    price: 500,
    time: 45,
    status: "Playing",
    bookings: 9,
  },
];


/**
 * NFC USERS DATA
 * ==============
 * Registered NFC card users with loyalty points,
 * contact information, and account status
 */
export const nfcUsers = [
  {
    id: 1,
    fullName: "Alex Chen",
    cardNo: "GV0111",
    phoneNo: "071 3226298",
    points: 126,
    status: "active",
    avatar: "/images/user1.png",
  },
  {
    id: 2,
    fullName: "Sarah Kim",
    cardNo: "GV0112",
    phoneNo: "071 3826868",
    points: 6,
    status: "active",
    avatar: "/images/user2.png",
  },
  {
    id: 3,
    fullName: "Anne Nikolos",
    cardNo: "GV0113",
    phoneNo: "071 3216868",
    points: 54,
    status: "active",
    avatar: "/images/user3.png",
  },
  {
    id: 4,
    fullName: "Nithin Akesh",
    cardNo: "GV0114",
    phoneNo: "071 3226568",
    points: 26,
    status: "active",
    avatar: "/images/user.png",
  },
];

/**
 * REPORTS & ANALYTICS DATA
 * ========================
 * Dummy data for dashboard metrics, reports, and business analytics
 */

// Revenue and financial metrics for reports
export const revenueData = [
  {
    id: 1,
    period: "Today",
    totalRevenue: 25800,
    currency: "LKR",
    totalBookings: 47,
    totalSales: 157,
    rejectedBookings: 8,
    growthPercentage: 15.2,
    date: "2025-10-16"
  },
  {
    id: 2,
    period: "Yesterday", 
    totalRevenue: 22400,
    currency: "LKR",
    totalBookings: 42,
    totalSales: 134,
    rejectedBookings: 5,
    growthPercentage: 8.7,
    date: "2025-10-15"
  },
  {
    id: 3,
    period: "This Week",
    totalRevenue: 156800,
    currency: "LKR",
    totalBookings: 285,
    totalSales: 892,
    rejectedBookings: 23,
    growthPercentage: 12.4,
    date: "2025-10-14"
  },
  {
    id: 4,
    period: "This Month",
    totalRevenue: 687500,
    currency: "LKR",
    totalBookings: 1247,
    totalSales: 3892,
    rejectedBookings: 89,
    growthPercentage: 18.9,
    date: "2025-10-01"
  },
  {
    id: 5,
    period: "This Year",
    totalRevenue: 8250000,
    currency: "LKR",
    totalBookings: 15673,
    totalSales: 47285,
    rejectedBookings: 1205,
    growthPercentage: 24.3,
    date: "2025-01-01"
  }
];

// Performance metrics for dashboard
export const performanceMetrics = [
  {
    id: 1,
    metric: "Station Utilization",
    value: 85,
    unit: "%",
    icon: "puzzle",
    trend: "up",
    description: "Average utilization across all gaming stations"
  },
  {
    id: 2,
    metric: "Customer Rating",
    value: 4.8,
    unit: "/5",
    icon: "star",
    trend: "up", 
    description: "Average customer satisfaction rating"
  },
  {
    id: 3,
    metric: "Avg Session Time",
    value: 2.5,
    unit: "hours",
    icon: "clock",
    trend: "up",
    description: "Average gaming session duration per customer"
  },
  {
    id: 4,
    metric: "Station Uptime",
    value: 98.5,
    unit: "%",
    icon: "activity",
    trend: "stable",
    description: "System availability and uptime percentage"
  }
];

/**
 * SALES & TRANSACTIONS DATA
 * ========================
 * Point of sale transactions and inventory data
 */

// POS items for retail sales
export const posItems = [
  {
    id: 1,
    name: "Energy Drink - Red Bull",
    category: "Beverages",
    price: 350,
    stock: 45,
    barcode: "7622210995568",
    description: "250ml energy drink",
    supplier: "Red Bull Lanka"
  },
  {
    id: 2,
    name: "Gaming Headset - HyperX",
    category: "Accessories",
    price: 12500,
    stock: 8,
    barcode: "0740617274325",
    description: "Professional gaming headset",
    supplier: "HyperX Official"
  },
  {
    id: 3,
    name: "Snack Pack - Pringles",
    category: "Snacks",
    price: 280,
    stock: 32,
    barcode: "0038000845338",
    description: "Original flavor chips 165g",
    supplier: "Keells Super"
  },
  {
    id: 4,
    name: "Gaming Mouse Pad",
    category: "Accessories", 
    price: 1800,
    stock: 15,
    barcode: "1234567890123",
    description: "Large RGB mouse pad",
    supplier: "Tech World"
  }
];

// Sales transactions history
export const salesHistory = [
  {
    id: "TXN001",
    date: "2025-10-16",
    time: "14:30",
    items: [
      { name: "Energy Drink - Red Bull", quantity: 2, price: 350 },
      { name: "Snack Pack - Pringles", quantity: 1, price: 280 }
    ],
    subtotal: 980,
    tax: 98,
    total: 1078,
    paymentMethod: "Cash",
    cashier: "John Doe",
    customer: "Alex Chen"
  },
  {
    id: "TXN002", 
    date: "2025-10-16",
    time: "15:45",
    items: [
      { name: "Gaming Headset - HyperX", quantity: 1, price: 12500 }
    ],
    subtotal: 12500,
    tax: 1250,
    total: 13750,
    paymentMethod: "Card",
    cashier: "Jane Smith",
    customer: "Sarah Kim"
  }
];

/**
 * USER MANAGEMENT DATA
 * ===================
 * Staff, admin, and customer user data
 */

// Staff and admin users
export const staffUsers = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@gameverse.lk",
    role: "Manager",
    phone: "+94 77 1234567",
    joinDate: "2024-01-15",
    status: "active",
    permissions: ["all"],
    lastLogin: "2025-10-16 09:30"
  },
  {
    id: 2,
    fullName: "Jane Smith", 
    email: "jane.smith@gameverse.lk",
    role: "Cashier",
    phone: "+94 71 2345678",
    joinDate: "2024-03-10",
    status: "active", 
    permissions: ["pos", "bookings"],
    lastLogin: "2025-10-16 08:15"
  },
  {
    id: 3,
    fullName: "Mike Johnson",
    email: "mike.johnson@gameverse.lk", 
    role: "Technician",
    phone: "+94 76 3456789",
    joinDate: "2024-02-20",
    status: "active",
    permissions: ["stations", "maintenance"],
    lastLogin: "2025-10-15 16:45"
  }
];

/**
 * NOTIFICATION & ALERT DATA
 * =========================
 * System notifications, alerts, and messaging data
 */

export const notifications = [
  {
    id: 1,
    type: "booking",
    title: "New Booking Received",
    message: "Alex Chen booked PS5 Station 1 for 2 hours",
    timestamp: "2025-10-16 14:30",
    read: false,
    priority: "normal"
  },
  {
    id: 2,
    type: "system",
    title: "Station Offline",
    message: "Car Racing Simulator in Zone B is offline",
    timestamp: "2025-10-16 13:15", 
    read: false,
    priority: "high"
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Completed",
    message: "Payment of LKR 1,200 received from Sarah Kim",
    timestamp: "2025-10-16 12:45",
    read: true,
    priority: "normal"
  }
];

/**
 * BOOKING STATUS CONSTANTS
 * =======================
 * Status definitions and color codes for bookings
 */

export const bookingStatuses = {
  upcoming: {
    label: "Upcoming",
    color: "#3b82f6",
    bgColor: "#eff6ff"
  },
  inprogress: {
    label: "In Progress", 
    color: "#f59e0b",
    bgColor: "#fffbeb"
  },
  completed: {
    label: "Completed",
    color: "#10b981", 
    bgColor: "#ecfdf5"
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
    bgColor: "#fef2f2"
  }
};

/**
 * APPLICATION CONSTANTS
 * ====================
 * General constants and configuration values
 */

export const appConstants = {
  currency: "LKR",
  timeZone: "Asia/Colombo",
  businessHours: {
    open: "09:00",
    close: "22:00"
  },
  loyaltyPointsRate: 1, // 1 point per LKR spent
  taxRate: 0.1, // 10% tax
  bookingSlotDuration: 30, // minutes
  maxBookingDuration: 480 // 8 hours in minutes
};


/**
 * WEB PORATAL DUMMY DATA
 * ====================
 */

export const BookingGames = [
  {
    title: "PS5 Stations",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: PS5station,
    button: "View Stations"
  },
  {
    title: "Pool Tables",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: poolTable,
    button: "View Tables"
  },
  {
    title: "Racing Simulators",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: racingSimulator ,
    button: "View Simulators"
  }
];

export const OtherGames = [
  {
    title: "Arcade Machine",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: arcadeMachine,
  },
  {
    title: "Archery Gaming",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: archeryGaming,
  },
  {
    title: "Carrom Gaming",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: caromGaming ,
  },
  {
    title: "Pool Gaming",
    desc: "Latest PS5 games with 4K graphics and immersive gameplay on premium gaming setups",
    image: poolGaming ,
  }
];

