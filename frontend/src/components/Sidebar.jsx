
import React, { useState } from "react";
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
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";



// Dummy Components
const Bookings = () => <h2 style={{ color: "#fff" }}>Bookings Component</h2>;

const OtherGames = () => <h2 style={{ color: "#fff" }}>Other Games Component</h2>;
const UsersRoles = () => <h2 style={{ color: "#fff" }}>Users & Roles Component</h2>;
const Reports = () => <h2 style={{ color: "#fff" }}>Reports Component</h2>;
const SettingsPage = () => <h2 style={{ color: "#fff" }}>Settings Component</h2>;

const expandedWidth = 230;
const collapsedWidth = 70;

const menuItems = [
  {
    text: "Bookings",
    path: "/bookings",
    icon: <img src="../images/b.png" alt="Bookings" style={{ width: 20, height: 20 }} />,
    component: <Bookings />,
  },
  {
    text: "Stations",
    path: "/stations",
    icon: <img src="../images/huge.png" alt="Stations" style={{ width: 20, height: 20 }} />,
   
  },
  {
    text: "POS System",
    path: "/pos",
    icon: <img src="../images/card.png" alt="POS System" style={{ width: 20, height: 20 }} />,
   
  },
  {
    text: "Other Games",
    path: "/games",
    icon: <img src="../images/ic.png" alt="Other Games" style={{ width: 20, height: 20 }} />,
    component: <OtherGames />,
  },
  {
    text: "Users& Roles",
    path: "/users",
    icon: <img src="../images/user.png" alt="Users & Roles" style={{ width: 20, height: 20 }} />,
    component: <UsersRoles />,
  },
  {
    text: "Reports",
    path: "/reports",
    icon: <img src="../images/report.png" alt="Reports" style={{ width: 20, height: 20 }} />,
    component: <Reports />,
  },
  {
    text: "Settings",
    path: "/settings",
    icon: <img src="../images/set.png" alt="Settings" style={{ width: 20, height: 20 }} />,
    component: <SettingsPage />,
  },
];

export default function SidebarLayout() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Stations");
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
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
            color: "#fff",
            borderRight: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
          }}
        >
          {open && <img src="../images/logo.png" alt="Logo" style={{ height: 40 }} />}
          <img
            src="../images/toggle.png"
            alt="Toggle"
            style={{ height: 20, cursor: "pointer", marginTop: "10px" }}
            onClick={() => setOpen(!open)}
          />
        </Box>

        <Divider sx={{ borderColor: "#1F2937", mb: 2 }} />

        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={!open ? item.text : ""} placement="right">
              <ListItemButton
                onClick={() => {
                  setActive(item.text);
                  navigate(item.path);
                }}
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
                    fontSize: "16px",
                    paddingLeft: 0.75,
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
      </Box>
    </Box>
  );
}
