import React, { useState } from "react";
import StationManagement from "./StationManagement";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  ShoppingCart,
  SportsEsports,
  Group,
  BarChart,
  Settings,
  Book,
  SportsEsportsOutlined,
} from "@mui/icons-material";

// Components for each section
const Bookings = () => <h2 style={{ color: "#fff" }}>Bookings Component</h2>;
const Stations = () => <h2 style={{ color: "#fff" }}>Stations Component</h2>;
const POSSystem = () => <h2 style={{ color: "#fff" }}>POS System Component</h2>;
const OtherGames = () => <h2 style={{ color: "#fff" }}>Other Games Component</h2>;
const UsersRoles = () => <h2 style={{ color: "#fff" }}>Users & Roles Component</h2>;
const Reports = () => <h2 style={{ color: "#fff" }}>Reports Component</h2>;
const SettingsPage = () => <h2 style={{ color: "#fff" }}>Settings Component</h2>;

const expandedWidth = 230;
const collapsedWidth = 70;
/*

const menuItems = [
  { text: "Bookings", icon: <Book />, component: <Bookings /> },
  { text: "Stations", icon: <SportsEsports />, component: <Stations /> },
  { text: "POS System", icon: <ShoppingCart />, component: <POSSystem /> },
  { text: "Other Games", icon: <SportsEsportsOutlined />, component: <OtherGames /> },
  { text: "Users& Roles", icon: <Group />, component: <UsersRoles /> },
  { text: "Reports", icon: <BarChart />, component: <Reports /> },
  { text: "Settings", icon: <Settings />, component: <SettingsPage /> },
];
*/

const menuItems = [
  {
    text: "Bookings",
    icon: <img src="../images/b.png" alt="Bookings" style={{ width: 20, height: 20 }} />,
    component: <Bookings />,
  },
  {
    text: "Stations",
    icon: <img src="../images/huge.png" alt="Stations" style={{ width: 20, height: 20 }} />,
    component: <StationManagement />,
  },
  {
    text: "POS System",
    icon: <img src="../images/card.png" alt="POS System" style={{ width: 20, height: 20 }} />,
    component: <POSSystem />,
  },
  {
    text: "Other Games",
    icon: <img src="../images/ic.png" alt="Other Games" style={{ width: 20, height: 20 }} />,
    component: <OtherGames />,
  },
  {
    text: "Users& Roles",
    icon: <img src="../images/user.png" alt="Users & Roles" style={{ width: 20, height: 20 }} />,
    component: <UsersRoles />,
  },
  {
    text: "Reports",
    icon: <img src="../images/report.png" alt="Reports" style={{ width: 20, height: 20 }} />,
    component: <Reports />,
  },
  {
    text: "Settings",
    icon: <img src="../images/set.png" alt="Settings" style={{ width: 20, height: 20 }} />,
    component: <SettingsPage />,
  },
];

export default function SidebarLayout() {
  const [active, setActive] = useState("Stations");
  const [open, setOpen] = useState(true);

  const currentComponent =
    menuItems.find((item) => item.text === active)?.component || null;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? expandedWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            backgroundColor: "#000000ff",
            height: "800px",
            color: "#fff",
            borderRight: "1px solid rgba(255,255,255,0.1)", // subtle right border
          },
        }}
      >
        {/* Logo + Toggle Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
          }}
        >
          {open && (
            <img src="../images/logo.png" alt="Logo" style={{ height: 40 }} />
          )}
          <img
            src="../images/toggle.png"
            alt="Toggle"
            style={{ height: 20, cursor: "pointer", marginTop: "10px" }}
            onClick={() => setOpen(!open)}
          />
        </Box>

        {/* Divider under logo */}
        <Divider sx={{ borderColor: "#1F2937", mb: 2 }} />

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={!open ? item.text : ""} placement="right">
              <ListItemButton
                onClick={() => setActive(item.text)}
                sx={{
                  mb: 0.5,
                  marginRight: 1,
                  marginLeft: 1,
                  borderRadius: 1,
                  padding: 0.5,
                  justifyContent: open ? "flex-start" : "center",
                  background:
                    active === item.text
                      ? "linear-gradient(90deg, #09375089, #520b5aff)"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: 0,
                    fontSize:"16px",
                    paddingLeft:0.75,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active === item.text ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          backgroundColor: "#000000ff",
          minHeight: "100vh",
        }}
      >
        {currentComponent}
      </Box>
    </Box>
  );
}
