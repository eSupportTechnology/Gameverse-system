import React from "react";
import { Box } from "@mui/material";
import EditIcon from "../assets/editicon.png";
import arcadeImage from "../assets/arcade_machine.png";
import archeryImage from "../assets/archery_gaming.png";
import carromImage from "../assets/carom_gaming.png";
import poolImage from "../assets/pool_gaming.jpg";
import upload from "../assets/upload.png";

const OtherGamesSection = ({
  games,
  dbGames,
  handleRemoveGame,
  setEditData,
  setOpenEditGame,
  setEditDbGameData,
  setOpenEditDbGame,
}) => {
  const combinedGames = [
    ...games.map((g) => ({ ...g, source: "portable" })),
    ...dbGames.map((g) => ({ ...g, source: "db" })),
  ];

  return (
    <>
      {combinedGames.map((item, index) => {
        let displayImage = item.image;
        let displayDesc = item.desc;

        if (!displayImage || !displayDesc) {
          if (item.method === "Per Hour") {
            displayImage = displayImage || carromImage;
            displayDesc = displayDesc || "Play by the hour on Carrom table";
          } else if (item.method === "Coin") {
            displayImage = displayImage || arcadeImage;
            displayDesc = displayDesc || "Enjoy coin-operated arcade games";
          } else if (item.method === "Arrow") {
            displayImage = displayImage || archeryImage;
            displayDesc = displayDesc || "Test your aim with archery games";
          } else {
            displayImage = displayImage || upload;
            displayDesc = displayDesc || "Enjoy this exciting game!";
          }
        }

        return (
          <Box
            key={item.id || index}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Edit Button */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: "#C500FFCC",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                zIndex: 10,
              }}
              onClick={() => {
                if (item.source === "portable") {
                  setEditData(item);
                  setOpenEditGame(true);
                } else {
                  setEditDbGameData(item);
                  setOpenEditDbGame(true);
                }
              }}
            >
              <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
            </Box>

            {/* Card */}
            <Box
              sx={{
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                height: 360,
                border: "1px solid transparent",
                backgroundImage:
                  "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#000000",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                }}
              >
                <img
                  src={displayImage}
                  alt={item.title}
                  style={{ width: "100%", height: "190px", objectFit: "cover" }}
                />
                <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "white",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "300",
                      marginTop: 8,
                      color: "#FFFFFF",
                    }}
                  >
                    {displayDesc}
                  </p>
                </Box>
              </Box>
            </Box>

            {/* Remove Button */}
            <Box sx={{ py: 2 }}>
              <button
                className="card-button-red"
                onClick={() => handleRemoveGame(item)}
              >
                Remove
              </button>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default OtherGamesSection;
