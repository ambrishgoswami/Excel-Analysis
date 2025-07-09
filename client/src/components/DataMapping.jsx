import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from "@mui/material";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const DataMapping = () => {
  const user = useSelector((state) => state.auth.user);
  const [uploads, setUploads] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState("");
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("");
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);

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
      setXAxis("");
      setYAxis("");
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
    setXAxis("");
    setYAxis("");
  }, [selectedFileId, uploads]);

  return (
    <Box m={4}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Data Mapping (X/Y Axis Selection)
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
          {columns.length > 0 && (
            <Box display="flex" gap={2} mb={3}>
              <FormControl fullWidth>
                <InputLabel>X Axis</InputLabel>
                <Select
                  value={xAxis}
                  label="X Axis"
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Y Axis</InputLabel>
                <Select
                  value={yAxis}
                  label="Y Axis"
                  onChange={(e) => setYAxis(e.target.value)}
                >
                  {columns.map((col) => (
                    <MenuItem key={col} value={col}>
                      {col}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Chart Type</InputLabel>
                <Select
                  value={chartType}
                  label="Chart Type"
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <MenuItem value="bar">Bar</MenuItem>
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="pie">Pie</MenuItem>
                  <MenuItem value="doughnut">Doughnut</MenuItem>
                  <MenuItem value="radar">Radar</MenuItem>
                  <MenuItem value="polarArea">Polar Area</MenuItem>
                  <MenuItem value="scatter">Scatter</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          {columns.length > 0 && (
            <Box mb={2}>
              <button
                style={{
                  padding: "8px 24px",
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  fontWeight: 600,
                  cursor: xAxis && yAxis && chartType ? "pointer" : "not-allowed",
                  opacity: xAxis && yAxis && chartType ? 1 : 0.5,
                }}
                disabled={!(xAxis && yAxis && chartType)}
                onClick={() => setShowChart(true)}
              >
                Show Chart
              </button>
            </Box>
          )}
          {showChart && xAxis && yAxis && chartType && (
            <Box maxWidth={700} mb={3}>
              <Typography variant="h6" mb={1}>
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart ({xAxis} vs {yAxis})
              </Typography>
              <Box mb={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600, letterSpacing: 1 }}
                  onClick={() => {
                    if (chartRef.current) {
                      const url = chartRef.current.toBase64Image();
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `chart-${chartType}.png`;
                      link.click();
                    }
                  }}
                >
                  Download as PNG
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ fontWeight: 600, letterSpacing: 1, background: '#6c3fc5' }}
                  onClick={() => {
                    if (chartRef.current) {
                      const url = chartRef.current.toBase64Image();
                      const pdf = new jsPDF({ orientation: "landscape" });
                      pdf.addImage(url, "PNG", 10, 10, 180, 90);
                      pdf.save(`chart-${chartType}.pdf`);
                    }
                  }}
                >
                  Download as PDF
                </Button>
              </Box>
              {(() => {
                let chartData, options;
                if (chartType === "pie" || chartType === "doughnut" || chartType === "radar" || chartType === "polarArea") {
                  chartData = {
                    labels: data.map((row) => row[xAxis]),
                    datasets: [
                      {
                        label: yAxis,
                        data: data.map((row) => Number(row[yAxis]) || 0),
                        backgroundColor: [
                          "#1976d2",
                          "#26a69a",
                          "#ffa726",
                          "#ef5350",
                          "#ab47bc",
                          "#66bb6a",
                          "#d4e157",
                          "#ff7043",
                          "#29b6f6",
                          "#ec407a",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  };
                } else if (chartType === "scatter") {
                  chartData = {
                    datasets: [
                      {
                        label: `${xAxis} vs ${yAxis}`,
                        data: data.map((row) => ({ x: Number(row[xAxis]) || 0, y: Number(row[yAxis]) || 0 })),
                        backgroundColor: "#1976d2",
                      },
                    ],
                  };
                } else {
                  chartData = {
                    labels: data.map((row) => row[xAxis]),
                    datasets: [
                      {
                        label: yAxis,
                        data: data.map((row) => Number(row[yAxis]) || 0),
                        backgroundColor: "rgba(25, 118, 210, 0.5)",
                        borderColor: "#1976d2",
                        borderWidth: 2,
                        fill: chartType === "line",
                        tension: 0.3,
                      },
                    ],
                  };
                }
                options = {
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: false },
                  },
                  scales: chartType === "scatter" ? { x: { type: "linear", position: "bottom" } } : {},
                };
                const chartKey = `${chartType}-${xAxis}-${yAxis}`;
                const chartProps = { ref: chartRef, data: chartData, options };
                if (chartType === "bar") return <Bar key={chartKey} ref={chartRef} data={chartData} options={options} />;
                if (chartType === "line") return <Line key={chartKey} ref={chartRef} data={chartData} options={options} />;
                if (chartType === "pie") return <Pie key={chartKey} ref={chartRef} data={chartData} options={options} />;
                if (chartType === "doughnut") return <Doughnut key={chartKey} ref={chartRef} data={chartData} options={options} />;
                if (chartType === "radar") return <Radar key={chartKey} ref={chartRef} data={chartData} options={options} />;
                if (chartType === "polarArea") return <PolarArea key={chartKey} ref={chartRef} data={chartData} options={options} />;
                if (chartType === "scatter") return <Scatter key={chartKey} ref={chartRef} data={chartData} options={options} />;
                return null;
              })()}
            </Box>
          )}
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
                  {data.slice(0, 5).map((row, idx) => (
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