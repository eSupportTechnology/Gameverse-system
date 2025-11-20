import { Box, Button, Typography, Dialog, DialogContent, DialogTitle, IconButton, TextField, MenuItem, } from '@mui/material'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { AllRacing } from '../assets/assets';
import CloseIcon from "@mui/icons-material/Close";
import upload from '../assets/upload.png'
import EditIcon from '../assets/editicon.png';
import ThumbnailUpdate from './ThumbnailUpdate';
import UpdateSuccessDialog from './UpdateSuccess';
import CancelPopup from './CancelPopup';
import RemovePopup from './RemovePopup';
import backArrow from '../assets/back_arrow.png'


const AllRacingSimulators = () => {
  const navigate = useNavigate();
  const [simulators, setSimulators] = useState(AllRacing);
  const [openAddRacing, setOpenAddRacing] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // add | edit
  const [editIndex, setEditIndex] = useState(null);

  // form fields
  const [simulatorName, setSimulatorName] = useState("");
  const [description, setDescription] = useState("");
  const [priceNormal, setPriceNormal] = useState("");
  const [timeNormal, setTimeNormal] = useState("");
  const [priceVR, setPriceVR] = useState("");
  const [timeVR, setTimeVR] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [openAddSuccess, setOpenAddSuccess] = useState(false)
  const [addMessage, setAddMessage] = useState('')
  const [openUpdateSuccess, setOpenUpdateSuccess] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  const [removeMessage, setRemoveMessage] = useState("");
  const [simulatorToRemove, setSimulatorToRemove] = useState(null);
  const [removeSimulator, setRemoveSimulator] = useState(false)


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  // open ADD dialog
  const handleAdd = () => {
    setDialogMode("add");
    setSimulatorName("");
    setDescription("");
    setPriceNormal("");
    setPriceVR("");
    setTimeNormal("30 Min");
    setTimeVR("30 Min");
    setThumbnail("");
    setOpenAddRacing(true);
  };

  // open EDIT dialog
  const handleEdit = (item, index) => {
    setDialogMode("edit");
    setEditIndex(index);

    setSimulatorName(item.title);
    setDescription(item.desc);
    setPriceNormal(item.priceNormal);
    setPriceVR(item.priceVR);
    setTimeNormal(item.timeNormal);
    setTimeVR(item.timeVR);
    setThumbnail(item.image);

    setOpenAddRacing(true);
  };

  // save station (Add or Update)
  const handleSave = () => {
    const newData = {
      title: simulatorName,
      desc: description,
      priceNormal,
      priceVR,
      timeNormal,
      timeVR,
      image: thumbnail,
    };

    if (dialogMode === "add") {
      setSimulators([...simulators, newData]);
      setAddMessage('Simulator Added Successful !')
      setOpenAddSuccess(true)
    } else {
      const updated = [...simulators];
      updated[editIndex] = newData;
      setSimulators(updated);
      setOpenUpdateSuccess(true)
    }

    setOpenAddRacing(false);
  };

  const handleCancelConfirm = async () => {
    setCancelOpen(false);
    setOpenAddRacing(false)
  }

  // delete station
  const handleRemove = (index) => {
    setSimulatorToRemove(index);
    setRemoveMessage('Are you want to remove this simulator?')
    setRemoveSimulator(true);
  };

  const removeConfirm = async () => {
    setSimulators(simulators.filter((_, i) => i !== simulatorToRemove));
    setRemoveSimulator(false);
    setSimulatorToRemove(null);
  }

  const cancelRemove = () => {
    setRemoveSimulator(false);
    setSimulatorToRemove(null);
  };

  return (
    <div>
      <Box sx={{ p: 2, bgcolor: "1E1E1E", color: "#fff", minHeight: "100vh", overflowX: "hidden", ml: 0 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
            <Typography variant="h5" fontWeight="bold" fontSize={24}>Website Management </Typography>
            <Typography variant="body2" color="gray" fontSize={16}>Manage Website</Typography>
          </Box>
        </Box>

        {/* Toolbar */}
        <Box display="flex" flexDirection={{ xs: "column", sm: "row", md: "row" }}
          justifyContent={{ xs: "flex-start", sm: "space-between", md: "space-between" }} px={1.5} py={1.5} borderRadius='10px' bgcolor='#0E111B' alignItems={{ xs: "flex-start", sm: "flex-start", md: "center" }} mb={2} gap={1}>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* BACK BUTTON */}
            <Button
              onClick={() => navigate(-1)}
              sx={{
                bgcolor: "#1F2937",
                color: "#9CA3AF",
                padding: "10px 16px",
                minWidth: "40px",
                borderRadius: "4px",
                textTransform: "none",
                "&:hover": { bgcolor: "#1F2937" },
              }}
            >
              <img src={backArrow} alt="back-icon" />
            </Button>

            {/* CATEGORY BUTTON */}
            <Button
              sx={{
                bgcolor: "rgba(12, 215, 255, 0.3)",
                border: "1px solid #0CD7FF",
                color: "#0CD7FF",
                padding: "8px 20px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
                borderRadius: "8px",
                "&:hover": { bgcolor: "rgba(12, 215, 255, 0.3)" },
              }}
            >
              All Racing Simulators
            </Button>

          </Box>

          <Box>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                borderRadius: "6px",
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: "600",
                "&:hover": { background: "linear-gradient(to right, #0bbfe0, #732ed1)" },
              }}
              onClick={handleAdd}
            >
              + Add Racing Simulators
            </Button>

          </Box>

        </Box>

        {/* Card sections */}
        <div style={{ minHeight: "100vh", backgroundColor: '#0E111B', borderRadius: "10px", }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
              p: 2,
              alignItems: "stretch",
            }}
          >
            {simulators.map((item, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  height: "100%",
                  position: 'relative'
                }}
              >
                {/* EDIT ICON BUTTON */}
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
                  onClick={() => handleEdit(item, index)}
                >
                  <img src={EditIcon} alt="edit-icon" style={{ width: 16 }} />
                </Box>

                <Box sx={{
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  height: 360,
                  border: "1px solid transparent",
                  backgroundImage: "linear-gradient(#0E111B, #0E111B), linear-gradient(180deg, #CF36E1, #15A2EF)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",

                }}>
                  <Box sx={{ backgroundColor: "#000000", flexGrow: 1, display: "flex", flexDirection: "column", borderRadius: "12px" }}>
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "190px",
                        objectFit: "cover",
                      }}
                    />

                    {/* TEXT CONTENT */}
                    <Box sx={{ p: 2, textAlign: "center", flexGrow: 1, }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "500", color: "white" }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: "14px", fontWeight: "400", marginTop: "8px", color: "#FFFFFF" }}>
                        {item.desc}
                      </p>
                    </Box>
                  </Box>
                </Box>

                {/* BUTTON */}
                <Box sx={{ py: 2 }}>
                  <button className="card-button-red"
                    onClick={() => handleRemove(index)}
                  >Remove</button>
                </Box>
              </Box>
            ))
            }

          </Box>
        </div>

        {/* ADD Pool Dialog */}
        {/* Dialog */}
        <Dialog
          open={openAddRacing}
          onClose={() => setOpenAddRacing(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: "#111827",
              color: "white",
              borderRadius: "12px",
              border: "0.5px solid #374151",
            },
          }}
        >
          <DialogTitle sx={{ color: "white", fontWeight: "bold", fontSize: '18px' }}>
            {dialogMode === "add" ? "Add Racing Simulator" : "Edit Racing Simulator Details"}
            <IconButton
              onClick={() => setOpenAddRacing(false)}
              sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              // maxHeight: "70vh",            
              // overflowY: "auto",

              /* Scrollbar styling */
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#4B5563",
                borderRadius: "10px",
              },
            }}
          >

            {/* Name */}
            <p style={{ marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Simulator Name</p>
            <TextField
              fullWidth
              placeholder="Enter Simulator Name"
              variant="outlined"
              value={simulatorName}
              onChange={(e) => setSimulatorName(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#171C2D",
                  borderRadius: "8px",
                  color: "white",
                  border: "0.5px solid #374151",

                  "& .MuiInputBase-input": {
                    padding: "12px 14px",
                    fontSize: "14px",
                  },
                },
              }}
            />

            {/* Description */}
            <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Description</p>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter Short Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "#171C2D",
                  borderRadius: "8px",
                  color: "white",
                  border: "0.5px solid #374151",

                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                },
              }}
            />

            {/* Pricing Normal */}
            <Box sx={{ mt: 2 }}>
              <p style={{ marginBottom: 1, fontSize: '14px', fontWeight: 500 }}>Pricing Details (Normal)</p>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                {/* TIME */}
                <Box sx={{ flex: 1 }}>
                  <p style={{ marginBottom: 6, fontSize: 12, fontWeight: 200, color: "#9CA3AF" }}>
                    Time
                  </p>

                  <TextField
                    select
                    fullWidth
                    defaultValue="30 Min"
                    value={timeNormal}
                    onChange={(e) => setTimeNormal(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root fieldset": { borderColor: "#374151" },
                      "& .MuiSelect-select": { color: "#9CA3AF" },
                      "& .MuiOutlinedInput-root": { height: 45 },   // align height
                    }}
                  >
                    <MenuItem value="30 Min">30 Min</MenuItem>
                    <MenuItem value="1 Hour">1 Hour</MenuItem>
                  </TextField>
                </Box>

                {/* PRICE */}
                <Box sx={{ flex: 1 }}>
                  <p style={{ marginBottom: 6, fontSize: 12, fontWeight: 200, color: "#9CA3AF" }}>
                    Price
                  </p>

                  <TextField
                    fullWidth
                    placeholder="LKR 000"
                    value={priceNormal}
                    onChange={(e) => setPriceNormal(e.target.value)}
                    sx={{
                      input: { color: "white" },
                      "& .MuiOutlinedInput-root fieldset": { borderColor: "#374151" },
                      "& .MuiOutlinedInput-root": { height: 45 },
                    }}
                  />
                </Box>
              </Box>

            </Box>

            {/* Pricing VR */}
            <Box sx={{ mt: 2 }}>
              <p style={{ marginBottom: 1, fontSize: '14px', fontWeight: 500 }}>Pricing Details ( +VR )</p>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                {/* TIME */}
                <Box sx={{ flex: 1 }}>
                  <p style={{ marginBottom: 6, fontSize: 12, fontWeight: 200, color: "#9CA3AF" }}>
                    Time
                  </p>

                  <TextField
                    select
                    fullWidth
                    defaultValue="30 Min"
                    value={timeVR}
                    onChange={(e) => setTimeVR(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root fieldset": { borderColor: "#374151" },
                      "& .MuiSelect-select": { color: "#9CA3AF" },
                      "& .MuiOutlinedInput-root": { height: 45 },   // align height
                    }}
                  >
                    <MenuItem value="30 Min">30 Min</MenuItem>
                    <MenuItem value="1 Hour">1 Hour</MenuItem>
                  </TextField>
                </Box>

                {/* PRICE */}
                <Box sx={{ flex: 1 }}>
                  <p style={{ marginBottom: 6, fontSize: 12, fontWeight: 200, color: "#9CA3AF" }}>
                    Price
                  </p>

                  <TextField
                    fullWidth
                    placeholder="LKR 000"
                    value={priceVR}
                    onChange={(e) => setPriceVR(e.target.value)}
                    sx={{
                      input: { color: "white" },
                      "& .MuiOutlinedInput-root fieldset": { borderColor: "#374151" },
                      "& .MuiOutlinedInput-root": { height: 45 },   // same height as select
                    }}
                  />
                </Box>
              </Box>

            </Box>

            {/* Thumbnail Upload */}
            <p style={{ marginTop: 15, marginBottom: 6, fontSize: '14px', fontWeight: 500 }}>Thumbnail</p>
            <Box
              sx={{
                backgroundColor: "#171C2D",
                borderRadius: "8px",
                height: 190,
                border: "0.5px solid #374151",
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                alignItems: "center",
                color: "#aaa",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />

              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <img src={upload} style={{ width: 30, marginBottom: 6 }} />
                  Upload thumbnail
                </>
              )}
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, gap: 2 }}>
              <Button onClick={() => setCancelOpen(true)}
                sx={{
                  flex: 1,
                  borderRadius: "4px",
                  backgroundColor: "#1A1D2A",
                  color: "white",
                  fontSize: '14px',
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  "&:hover": {
                    backgroundColor: "#3B4859",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                sx={{
                  fontSize: '14px',
                  fontWeight: "bold",
                  flex: 1,
                  textTransform: "none",
                  borderRadius: "4px",
                  background: "linear-gradient(to right, #0CD7FF, #8A38F5)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  "&:hover": {
                    background: "linear-gradient(to right, #8A38F5, #0CD7FF)",
                  },
                }}
              >
                {dialogMode === "add" ? "Add" : "Update"}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

      </Box>

      {/* simulator add success dialog */}
      <ThumbnailUpdate
        open={openAddSuccess}
        onClose={() => setOpenAddSuccess(false)}
        message={addMessage}
      />

      {/* update success dialog */}
      <UpdateSuccessDialog
        open={openUpdateSuccess}
        onClose={() => setOpenUpdateSuccess(false)}
      />

      {/* cancel popup */}
      <CancelPopup
        open={cancelOpen}
        handleCancelClose={() => setCancelOpen(false)}
        handleConfirm={handleCancelConfirm}
      />

      <RemovePopup
        open={removeSimulator}
        handleRemoveClose={cancelRemove}
        removeConfirm={removeConfirm}
        message={removeMessage}
      />

    </div>
  )
}

export default AllRacingSimulators
