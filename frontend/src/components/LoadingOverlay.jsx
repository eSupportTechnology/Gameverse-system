import { Box, CircularProgress } from "@mui/material";
import { useLoading } from "../context/LoadingContext";

export default function LoadingOverlay() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(6, 8, 15, 0.75)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Box sx={{ position: "relative", width: 72, height: 72 }}>
        <CircularProgress
          size={72}
          thickness={2.5}
          sx={{
            color: "#CF36E1",
            position: "absolute",
            top: 0,
            left: 0,
            filter: "drop-shadow(0 0 8px #CF36E1)",
          }}
        />
        <CircularProgress
          size={52}
          thickness={3}
          sx={{
            color: "#33B2F7",
            position: "absolute",
            top: "10px",
            left: "10px",
            filter: "drop-shadow(0 0 6px #33B2F7)",
            animationDirection: "reverse",
          }}
        />
      </Box>
    </Box>
  );
}
