import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Button, Typography, Alert, Stack } from "@mui/material";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return setError("Please select a file");
    if (!user) return setError("User not logged in");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id || user._id);
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.msg);
      setError("");
    } catch (err) {
      setError(err.response?.data?.msg || "Upload failed");
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 420,
        margin: "auto",
        padding: 4,
        mt: 8,
        background: "#fff",
        borderRadius: 3,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={700} color="#1a237e">
        Upload Excel File
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          sx={{
            background: "#16c0c1",
            fontWeight: 600,
            textTransform: "none",
            color: '#fff',
            '&:hover': { background: '#1de9b6' },
          }}
        >
          Choose File
          <input
            type="file"
            accept=".xls,.xlsx"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <Typography color="#1a237e" sx={{ minWidth: 120, fontSize: 15 }}>
          {file ? file.name : "No file chosen"}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        size="large"
        sx={{
          mt: 1,
          width: 160,
          background: "#1a237e",
          color: "#fff",
          fontWeight: 700,
          letterSpacing: 1,
          borderRadius: 2,
          '&:hover': { background: "#3949ab" },
        }}
        onClick={handleUpload}
      >
        Upload
      </Button>
      {message && <Alert severity="success" sx={{ mt: 3, width: "100%" }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 3, width: "100%" }}>{error}</Alert>}
    </Box>
  );
};

export default ExcelUpload; 