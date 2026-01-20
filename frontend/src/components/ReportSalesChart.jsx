import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

// const data = [
//   { day: "Monday", bookings: 20000, products: 12000, games: 8000 },
//   { day: "Tuesday", bookings: 22000, products: 13000, games: 11000 },
//   { day: "Wednesday", bookings: 16000, products: 14000, games: 5000 },
//   { day: "Thursday", bookings: 20000, products: 8000, games: 17000 },
//   { day: "Friday", bookings: 15000, products: 11000, games: 9000 },
//   { day: "Saturday", bookings: 22000, products: 16000, games: 12000 },
//   { day: "Sunday", bookings: 14000, products: 9000, games: 7000 },
// ];

// Custom Legend 
const CustomLegend = () => {
  const items = [
    { color: "#A855F7", label: "Bookings" },
    { color: "#22D3EE", label: "Products" },
    { color: "#EC4899", label: "Other Games" },
  ];

  return (
    <Box mt={2} display="flex" justifyContent="center" gap={4}>
      {items.map((item) => (
        <Box key={item.label} display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: item.color,
            }}
          />
          <Typography sx={{ color: "#9CA3AF", fontSize: "14px" }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// // Tooltip styling
// const customTooltipStyle = {
//   backgroundColor: "#fef8f8ff",
//   border: "1px solid #374151",
//   borderRadius: "8px",
//   color: "#fff",
//   padding: "10px",
// };

const ReportSalesChart = ({data, filter}) => {

  const labelMap = {
    day: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year",
  };
   const chartData = [
    {
      day: labelMap[filter] || "Today",
      bookings: data?.bookings || 0,
      products: data?.products || 0,
      games: data?.games || 0,
    },
  ];
  
  return (
    <Card
      sx={{
        backgroundColor: "#171C2D",
        borderRadius: "14px",
        p: 1,
        height: "365px",
      }}
    >
      <CardContent>
        {/* Title + Weekly Button */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography sx={{ color: "#fff", fontSize: "24px", fontWeight: 700 }}>
            Total Sales
          </Typography>

        
          <Box
            sx={{
              background: "#D9D9D9",
              width: "66px",
              height: "24px",
              borderRadius: "16px",
              color: "black",
              fontSize: "12px",
              display: "flex",
              justifyContent: "center", 
              alignItems: "center", 
            }}
          >
            {labelMap[filter] || "Today"}
          </Box>
        </Box>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={6} barSize={22}>
            <CartesianGrid stroke="#1f2937" vertical={false} />

            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 25000]}
              ticks={[0, 5000, 10000, 15000, 20000, 25000]}
              tickFormatter={(value) =>
                value === 0 ? "0" : `${value / 1000}k`
              }
            />

            {/* <Tooltip contentStyle={customTooltipStyle} /> */}

            <Bar dataKey="bookings" fill="#A855F7" radius={[2, 2, 0, 0]} />
            <Bar dataKey="products" fill="#22D3EE" radius={[2, 2, 0, 0]} />
            <Bar dataKey="games" fill="#EC4899" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <CustomLegend />
      </CardContent>
    </Card>
  );
};

export default ReportSalesChart;
