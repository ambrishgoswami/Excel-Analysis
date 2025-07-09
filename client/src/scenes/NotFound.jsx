import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="80vh">
      <Typography variant="h2" color="error" fontWeight={700} gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound; 