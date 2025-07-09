import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from "@mui/material";
import { InsertDriveFile, CalendarToday } from "@mui/icons-material";

const UploadHistory = () => {
  const user = useSelector((state) => state.auth.user);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/upload/history/${user.id || user._id}`);
        setUploads(res.data);
      } catch (err) {
        setError("Failed to fetch upload history");
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, [user]);

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
        Upload History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : uploads.length === 0 ? (
        <Typography>No uploads found.</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 800,
            borderRadius: 3,
            boxShadow: 4,
            background: "#fff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#f5f7fa" }}>
                <TableCell sx={{ color: "#1a237e", fontWeight: 700, fontSize: 18 }}>
                  File Name
                </TableCell>
                <TableCell sx={{ color: "#1a237e", fontWeight: 700, fontSize: 18 }}>
                  Uploaded At
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uploads.map((upload, idx) => (
                <TableRow
                  key={upload._id}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#f5f7fa" : "#e0e7ef",
                    transition: "background 0.2s",
                    '&:hover': { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1a237e', fontWeight: 600 }}>
                    <InsertDriveFile sx={{ color: '#1976d2', mr: 1 }} />
                    {upload.originalFileName}
                  </TableCell>
                  <TableCell sx={{ color: '#333', fontWeight: 500 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarToday sx={{ color: '#ffb74d', fontSize: 18 }} />
                      <span>{new Date(upload.uploadedAt).toLocaleString()}</span>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UploadHistory; 