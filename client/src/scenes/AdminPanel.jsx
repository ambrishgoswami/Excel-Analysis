import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

const AdminPanel = () => {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [roleInput, setRoleInput] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get("/management/admin/stats"),
          axios.get("/management/users"),
        ]);
        setStats(statsRes.data);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load admin data", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleRoleChange = async (userId) => {
    try {
      await axios.patch(`/management/user/${userId}/role`, { role: roleInput });
      setSnackbar({ open: true, message: "Role updated", severity: "success" });
      setEditDialog({ open: false, user: null });
      setRoleInput("");
      // Refresh users
      const res = await axios.get("/management/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSnackbar({ open: true, message: "Failed to update role", severity: "error" });
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await axios.patch(`/management/user/${userId}/status`, { status: !currentStatus });
      setSnackbar({ open: true, message: "Status updated", severity: "success" });
      // Refresh users
      const res = await axios.get("/management/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/management/user/${userId}`);
      setSnackbar({ open: true, message: "User deleted", severity: "success" });
      // Refresh users
      const res = await axios.get("/management/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSnackbar({ open: true, message: "Failed to delete user", severity: "error" });
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <Box m={4}>
        <Alert severity="error">Access denied. Admins only.</Alert>
      </Box>
    );
  }

  return (
    <Box m={{ xs: 1, sm: 2, md: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: 22, sm: 28, md: 34 } }}>
        Admin Panel
      </Typography>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          {/* Stat Cards */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: "#1976d2", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{stats?.totalUsers || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: "#43a047", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Active Users</Typography>
                  <Typography variant="h4">{stats?.activeUsers || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: "#ffa726", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Total Uploads</Typography>
                  <Typography variant="h4">{stats?.totalUploads || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: "#6c3fc5", color: "white" }}>
                <CardContent>
                  <Typography variant="h6">Total Analyses</Typography>
                  <Typography variant="h4">{stats?.totalAnalyses || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>User Growth (Monthly)</Typography>
                  <ResponsiveContainer width="100%" height={window.innerWidth < 600 ? 150 : 200}>
                    <BarChart data={stats?.userGrowth || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#1976d2" name="Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>Upload Trend (Monthly)</Typography>
                  <ResponsiveContainer width="100%" height={window.innerWidth < 600 ? 150 : 200}>
                    <LineChart data={stats?.uploadTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#ffa726" name="Uploads" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>Analysis Trend (Monthly)</Typography>
                  <ResponsiveContainer width="100%" height={window.innerWidth < 600 ? 150 : 200}>
                    <LineChart data={stats?.analysisTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis allowDecimals={false} />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#6c3fc5" name="Analyses" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={1}>Recent Uploads</Typography>
                  {stats?.recentUploads?.length ? (
                    stats.recentUploads.map((u, i) => (
                      <Box key={i} mb={1}>
                        <Typography fontSize={15}>
                          <b>{u.user?.name || "Unknown"}</b> uploaded <b>{u.originalFileName}</b> on {new Date(u.uploadedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography>No recent uploads.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={1}>Recent Analyses</Typography>
                  {stats?.recentAnalyses?.length ? (
                    stats.recentAnalyses.map((a, i) => (
                      <Box key={i} mb={1}>
                        <Typography fontSize={15}>
                          <b>{a.user?.name || "Unknown"}</b> ran <b>{a.analysisType}</b> on {new Date(a.createdAt).toLocaleString()}
                          {a.inputFile && <> (File: <b>{a.inputFile}</b>)</>}
                        </Typography>
                        {a.resultSummary && (
                          <Typography fontSize={13} color="text.secondary">{a.resultSummary}</Typography>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Typography>No recent analyses.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* User Management Table Responsive */}
          <Box mt={3} sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Registered</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={{ padding: 8 }}>{user.name}</td>
                    <td style={{ padding: 8 }}>{user.email}</td>
                    <td style={{ padding: 8 }}>{user.role}</td>
                    <td style={{ padding: 8 }}>{user.status ? "Active" : "Inactive"}</td>
                    <td style={{ padding: 8 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: 8 }}>
                      <Tooltip title="Change Role">
                        <IconButton onClick={() => { setEditDialog({ open: true, user: user }); setRoleInput(user.role); }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.status === false ? "Activate" : "Deactivate"}>
                        <IconButton onClick={() => handleStatusToggle(user._id, user.status)}>
                          {user.status === false ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton onClick={() => handleDelete(user._id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* Edit Role Dialog */}
          <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, user: null })}>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogContent>
              <TextField
                select
                label="Role"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                SelectProps={{ native: true }}
                fullWidth
                sx={{ mt: 2 }}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog({ open: false, user: null })}>Cancel</Button>
              <Button variant="contained" onClick={() => handleRoleChange(editDialog.user._id)}>
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default AdminPanel; 