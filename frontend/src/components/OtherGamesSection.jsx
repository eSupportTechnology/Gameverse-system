import React from "react";
import { Box } from "@mui/material";
import EditIcon from "../assets/editicon.png";
import arcadeImage from "../assets/arcade_machine.png";
import archeryImage from "../assets/archery_gaming.png";
import carromImage from "../assets/carom_gaming.png";
import upload from "../assets/upload.png";
import { API_BASE_URL } from "../apiConfig";

const BASE_URL = `${API_BASE_URL}/storage/`;

const getMethodType = (method) => {
  if (!method) return "";
  if (typeof method === "object") return (method.type || "").toLowerCase();
  return method.toLowerCase();
};

const getGameDefaults = (item) => {
  let image = item.image || (item.thumbnail ? BASE_URL + item.thumbnail : null);
  let desc = item.description || item.desc;

  const method = getMethodType(item.method);

  if (!image) {
    switch (method) {
      case "per hour":
        image = carromImage;
        break;
      case "coin":
        image = arcadeImage;
        break;
      case "arrow":
        image = archeryImage;
        break;
      default:
        image = upload;
    }
  }

  if (!desc) {
    switch (method) {
      case "per hour":
        desc = "Play by the hour on Carrom table";
        break;
      case "coin":
        desc = "Enjoy coin-operated arcade games";
        break;
      case "arrow":
        desc = "Test your aim with archery games";
        break;
      default:
        desc = "Enjoy this exciting game!";
    }
  }

  return { image, desc };
};

const OtherGamesSection = ({ games, handleRemoveGame, onEditGame }) => {
  return (
    <>
      {games?.map((item, index) => {
        const { image: displayImage, desc: displayDesc } = getGameDefaults(item);
        const methodType = getMethodType(item.method);
        const isArrow = methodType === "arrow";
        const isPerMinute = methodType === "per minute";

        const rawPkgs = item.packages;
        const allPackages = Array.isArray(rawPkgs)
          ? rawPkgs
          : rawPkgs && typeof rawPkgs === "object"
            ? Object.values(rawPkgs)
            : [];

        return (
          <Box
            key={item.id || index}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
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
              onClick={() => onEditGame(item)}
            >
              <img src={EditIcon} alt="edit" style={{ width: 16 }} />
            </Box>

            {/* Card */}
            <Box
              sx={{
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                height: 400,
                border: "1px solid transparent",
                backgroundImage:
                  "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#000",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                }}
              >
                <img
                  src={displayImage}
                  alt={item.title || "game"}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                  }}
                />

                <Box sx={{ p: 2, textAlign: "center", flexGrow: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: "white" }}>
                    {item.title}
                  </h3>

                  {isArrow && allPackages.length > 0 ? (
                    <Box sx={{ mt: 1 }}>
                      {allPackages.map((pkg, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#1a1f30",
                            borderRadius: "8px",
                            px: 2,
                            py: 0.8,
                            mb: 0.8,
                            border: "1px solid #2a2f45",
                          }}
                        >
                          <span style={{ color: "#0CD7FF", fontSize: 13, fontWeight: 500 }}>
                            {pkg.arrows} Arrows
                          </span>
                          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                            Rs. {Number(pkg.price).toLocaleString()}
                          </span>
                        </Box>
                      ))}
                    </Box>
                  ) : isPerMinute && allPackages.length > 0 ? (
                    <Box sx={{ mt: 1 }}>
                      {allPackages.map((pkg, i) => (
                        <Box
                          key={i}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#1a1f30",
                            borderRadius: "8px",
                            px: 2,
                            py: 0.8,
                            mb: 0.8,
                            border: "1px solid #2a2f45",
                          }}
                        >
                          <span style={{ color: "#0CD7FF", fontSize: 13, fontWeight: 500 }}>
                            {pkg.minutes} Minutes
                          </span>
                          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
                            Rs. {Number(pkg.price).toLocaleString()}
                          </span>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 300,
                        marginTop: 8,
                        color: "#fff",
                      }}
                    >
                      {displayDesc}
                    </p>
                  )}
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
