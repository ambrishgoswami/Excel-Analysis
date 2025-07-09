import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, TextField, Button, Chip, Paper, Divider, Avatar, Alert } from "@mui/material";
import { logout } from "../state/authSlice";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  // Password change state
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSave = () => {
    // Here you would call your API to update the user profile
    setEditing(false);
    setMessage("Profile updated (demo only)");
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Box
      display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%)',
      }}
    >
      <Paper elevation={4} sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 5,
        minWidth: 350,
        maxWidth: 520,
        width: '100%',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        mx: { xs: 2, sm: 'auto' },
        border: '1.5px solid #e3e8f0',
      }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: '#1a237e', fontSize: 32, fontWeight: 700 }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </Avatar>
          <Typography variant="h4" fontWeight={800} color="#1a237e" fontFamily="'Montserrat', sans-serif">Settings</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={!editing}
            fullWidth
          />
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!editing}
            fullWidth
          />
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={600}>Role:</Typography>
            <Chip label={user?.role || "User"} color={user?.role === 'admin' ? 'secondary' : 'primary'} />
          </Box>
          {message && <Typography color="success.main">{message}</Typography>}
          <Box display="flex" gap={2} mt={3} mb={1}>
            {editing ? (
              <Button variant="contained" color="primary" onClick={handleSave} fullWidth>Save</Button>
            ) : (
              <Button 
                variant="contained" 
                sx={{ background: '#1a237e', color: '#fff', fontWeight: 600, '&:hover': { background: '#3949ab' } }} 
                onClick={() => setEditing(true)} 
                fullWidth
              >
                Edit
              </Button>
            )}
            <Button variant="contained" color="error" onClick={handleLogout} fullWidth>Logout</Button>
          </Box>
        </Box>
        <Divider sx={{ my: 4 }} />
        {/* Change Password Section */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight={800} mb={2} color="#1a237e" fontFamily="'Montserrat', sans-serif" letterSpacing={1}>
            Change Password
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              fullWidth
            />
            {passwordMsg && <Alert severity="success">{passwordMsg}</Alert>}
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <Button
              variant="contained"
              sx={{ background: '#1a237e', color: '#fff', fontWeight: 600, '&:hover': { background: '#3949ab' } }}
              onClick={async () => {
                setPasswordMsg("");
                setPasswordError("");
                if (!currentPassword || !newPassword || !confirmPassword) {
                  setPasswordError("Please fill all fields.");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  setPasswordError("New passwords do not match.");
                  return;
                }
                if (newPassword.length < 6) {
                  setPasswordError("Password must be at least 6 characters.");
                  return;
                }
                try {
                  const response = await fetch("/auth/change-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: user.email,
                      currentPassword,
                      newPassword,
                    }),
                  });
                  const data = await response.json();
                  if (response.ok) {
                    setPasswordMsg("Password changed successfully");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  } else {
                    setPasswordError(data.msg || "Failed to change password");
                  }
                } catch (err) {
                  setPasswordError("Server error. Please try again later.");
                }
              }}
              fullWidth
            >
              Save Password
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 4 }} />
        {/* Manage Devices Section (Mock) */}
        <Box>
          <Typography variant="h6" fontWeight={800} mb={2} color="#1a237e" fontFamily="'Montserrat', sans-serif" letterSpacing={1}>
            Manage Devices
          </Typography>
          {[ // Mock device/session data
            { id: 1, device: 'Chrome on Windows', location: 'Delhi, India', lastActive: 'Just now', current: true },
            { id: 2, device: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
            { id: 3, device: 'Edge on Windows', location: 'Bangalore, India', lastActive: 'Yesterday', current: false },
          ].map(session => (
            <Box key={session.id} display="flex" alignItems="center" justifyContent="space-between" p={2} mb={2} borderRadius={2} bgcolor={session.current ? '#e3f2fd' : '#f5f7fa'}>
              <Box>
                <Typography fontWeight={600}>{session.device} {session.current && <Chip label="This device" size="small" color="primary" sx={{ ml: 1 }} />}</Typography>
                <Typography fontSize={14} color="text.secondary">{session.location} • Last active: {session.lastActive}</Typography>
              </Box>
              {!session.current && (
                <Button size="small" color="error" variant="outlined" sx={{ fontWeight: 600, borderRadius: 2, '&:hover': { background: '#ffebee', color: '#b71c1c' } }}>Logout</Button>
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings; 