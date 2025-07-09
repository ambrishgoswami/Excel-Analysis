import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from "@mui/material";

const DataMapping = () => {
  const user = useSelector((state) => state.auth.user);
  const [uploads, setUploads] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
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
        setError("Failed to fetch uploads");
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, [user]);

  useEffect(() => {
    if (!selectedFileId) {
      setColumns([]);
      setData([]);
      return;
    }
    const file = uploads.find((u) => u._id === selectedFileId);
    if (file && file.data && file.data.length > 0) {
      setColumns(Object.keys(file.data[0]));
      setData(file.data);
    } else {
      setColumns([]);
      setData([]);
    }
  }, [selectedFileId, uploads]);

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Data Mapping
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select File</InputLabel>
            <Select
              value={selectedFileId}
              label="Select File"
              onChange={(e) => setSelectedFileId(e.target.value)}
            >
              {uploads.map((upload) => (
                <MenuItem key={upload._id} value={upload._id}>
                  {upload.originalFileName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {data.length > 0 && (
            <TableContainer component={Paper} sx={{ maxWidth: 700, mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 10).map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col}>{row[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default DataMapping; 