import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Tooltip, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const expandedWidth = 230;
const collapsedWidth = 70;

const operatorMenuItems = [
  { text: "Bookings", path: "/operator/booking", icon: <img src="../images/b.png" alt="Bookings" style={{ width: 20, height: 20 }} /> },
  { text: "POS System", path: "/operator/pos", icon: <img src="../images/card.png" alt="POS System" style={{ width: 20, height: 20 }} /> },
  { text: "Other Games", path: "/operator/games", icon: <img src="../images/ic.png" alt="Other Games" style={{ width: 20, height: 20 }} /> },
];

export default function OperatorSidebar() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Bookings");
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", p: 2 }}>
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
          {operatorMenuItems.map((item) => (
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
                  background: active === item.text ? "linear-gradient(90deg, #09375089, #520b5aff)" : "transparent",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ListItemIcon sx={{ color: "#fff", minWidth: 0, fontSize: "16px", paddingLeft: 0.75, mr: open ? 2 : "auto", justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: active === item.text ? 600 : 400 }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
