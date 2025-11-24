/*import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";

export default function TVOffer() {
  const [posts, setPosts] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      file: null,
      fileType: null,
      posted: false, // new property
    }))
  );

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, file, fileType: file.type.startsWith("video") ? "video" : "image" }
          : post
      )
    );
  };

  const handlePost = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, posted: true } : post
      )
    );
    console.log("Posted item:", posts.find((p) => p.id === id));
  };

  const handleDelete = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, file: null, fileType: null, posted: false } : post
      )
    );
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#000", minHeight: "100vh" }}>
      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography variant="h4" sx={{ color: "#fff", fontWeight: "bold", fontSize: "26px", mb: 0.5 }}>
          TV Screen Management
        </Typography>
        <Typography variant="h6" sx={{ color: "#888", fontSize: "15px" }}>
          Manage TV Screens
        </Typography>
      </Box>

      <Box sx={{ mb: 3, backgroundColor: "#0b0e17", borderRadius: "8px", p: "4px 8px" }}>
        <Tabs
          value={0}
          sx={{
            "& .MuiTabs-flexContainer": { alignItems: "center" },
            "& .MuiTab-root": {
              color: "#00bcd4",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "14px",
              backgroundColor: "rgba(0,188,212,0.1)",
              border: "1px solid rgba(0,188,212,0.5)",
              borderRadius: "6px",
              px: 2,
              mx: 0.5,
              minHeight: "32px",
              "&.Mui-selected": {
                backgroundColor: "#015b6b",
                color: "#00e5ff",
                borderColor: "#00e5ff",
              },
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab label="All Offers" />
        </Tabs>
      </Box>

      <Box sx={{ backgroundColor: "rgba(11, 14, 23, 1)", borderRadius: "10px", px: 0, p: 1, border: "1px solid #1c1f27" }}>
        <Grid container spacing={2} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={3} key={post.id}>
              <Card
                sx={{
                  backgroundColor: "#171c2d",
                  border: "1px solid #222",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  width: 240,
                  px: 0,
                  p: 1.5,
                  height: 170,
                  transition: "all 0.3s ease",
                  "&:hover": { borderColor: "#00d4ff", transform: "translateY(-2px)" },
                }}
                onClick={() =>
                  !post.posted && document.getElementById(`fileInput-${post.id}`).click()
                }
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#111625",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {post.file ? (
                    post.fileType === "video" ? (
                      <video
                        src={URL.createObjectURL(post.file)}
                        controls
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(post.file)}
                        alt="Uploaded"
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                      />
                    )
                  ) : (
                    <Box sx={{ textAlign: "center", color: "#aaa" }}>
                      <CloudUploadOutlined sx={{ fontSize: 38, color: "#818586ff" }} />
                      <Typography sx={{ fontSize: "13px", color: "#bbb", mt: 1 }}>
                        Upload your post or video
                      </Typography>
                    </Box>
                  )}
                </Box>

                <input
                  id={`fileInput-${post.id}`}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, post.id)}
                />
              </Card>

              {!post.posted ? (
                <Button
                  fullWidth
                  onClick={() => handlePost(post.id)}
                  sx={{
                    mt: 1.2,
                    backgroundColor: "#009bbd",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "8px",
                    py: 1,
                    "&:hover": { backgroundColor: "#00b6d9" },
                  }}
                >
                  Post
                </Button>
              ) : (
                <Box sx={{ display: "flex", mt: 1.2, gap: 1 }}>
                  <Button
                    fullWidth
                    sx={{
                      backgroundColor: "#8e44ad",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "8px",
                      py: 1,
                      "&:hover": { backgroundColor: "#9b59b6" },
                    }}
                  >
                    Hold
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleDelete(post.id)}
                    sx={{
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "8px",
                      py: 1,
                      "&:hover": { backgroundColor: "#ff4d4d" },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
*/

import React, { useState } from "react";
import { Box, Typography, Card, Grid, Tabs, Tab, Button } from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";

export default function TVOffer() {
  const [posts, setPosts] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      file: null,
      fileType: null,
      posted: false,
      isHeld: false, // <-- new property
    }))
  );

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              file,
              fileType: file.type.startsWith("video") ? "video" : "image",
            }
          : post
      )
    );
  };

  const handlePost = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, posted: true } : post))
    );
  };

  const handleDelete = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              file: null,
              fileType: null,
              posted: false,
              isHeld: false,
            }
          : post
      )
    );
  };

  const handleHoldToggle = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isHeld: !post.isHeld } : post
      )
    );
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#000", minHeight: "100vh" }}>
      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography
          variant="h4"
          sx={{ color: "#fff", fontWeight: "bold", fontSize: "26px", mb: 0.5 }}
        >
          TV Screen Management
        </Typography>
        <Typography sx={{ color: "#fff", fontSize: 13 }}>
          Manage TV Screens
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 3,
          backgroundColor: "#0b0e17",
          borderRadius: "8px",
          p: "8px 12px",
        }}
      >
        <Tabs
          value={0}
          sx={{
            "& .MuiTabs-flexContainer": { alignItems: "center" },
            "& .MuiTab-root": {
              color: "#00bcd4",
              textTransform: "none",
              fontSize: "14px",
              backgroundColor: "rgba(0,188,212,0.1)",
              border: "1px solid rgba(0,188,212,0.5)",
              borderRadius: "5px",
              px: 2,
              mx: 0.5,
              minWidth: 120,
              "&.Mui-selected": {
                backgroundColor: "#10374b",
                color: "#0CD7FF",
                borderColor: "#0CD7FF",
              },
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab label="All Offers" />
        </Tabs>
      </Box>

      <Box
        sx={{
          backgroundColor: "rgba(11, 14, 23, 1)",
          borderRadius: "10px",
          px: 0,
          p: 1,
          border: "1px solid #1c1f27",
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={3} key={post.id}>
              <Card
                sx={{
                  backgroundColor: "#171c2d",
                  border: "1px solid #222",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  width: 240,
                  px: 0,
                  p: 1.5,
                  height: 170,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#00d4ff",
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() =>
                  !post.posted &&
                  document.getElementById(`fileInput-${post.id}`).click()
                }
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#111625",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {post.file ? (
                    post.fileType === "video" ? (
                      <video
                        src={URL.createObjectURL(post.file)}
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(post.file)}
                        alt="Uploaded"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    )
                  ) : (
                    <Box sx={{ textAlign: "center", color: "#aaa" }}>
                      <CloudUploadOutlined
                        sx={{ fontSize: 38, color: "#818586ff" }}
                      />
                      <Typography
                        sx={{ fontSize: "13px", color: "#bbb", mt: 1 }}
                      >
                        Upload your post or video
                      </Typography>
                    </Box>
                  )}
                </Box>

                <input
                  id={`fileInput-${post.id}`}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, post.id)}
                />
              </Card>

              {!post.posted ? (
                <Button
                  fullWidth
                  onClick={() => handlePost(post.id)}
                  sx={{
                    mt: 1.2,
                    backgroundColor: "#009bbd",
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "8px",
                    py: 1,
                    "&:hover": { backgroundColor: "#00b6d9" },
                  }}
                >
                  Post
                </Button>
              ) : (
                <Box sx={{ display: "flex", mt: 1.2, gap: 1 }}>
                  <Button
                    fullWidth
                    onClick={() => handleHoldToggle(post.id)}
                    sx={{
                      backgroundColor: post.isHeld ? "#2ecc71" : "#8e44ad",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "8px",
                      py: 1,
                      "&:hover": {
                        backgroundColor: post.isHeld ? "#27ae60" : "#9b59b6",
                      },
                    }}
                  >
                    {post.isHeld ? "Play" : "Hold"}
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleDelete(post.id)}
                    sx={{
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "8px",
                      py: 1,
                      "&:hover": { backgroundColor: "#ff4d4d" },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
