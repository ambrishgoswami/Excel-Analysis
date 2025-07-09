/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
  GavelOutlined,
  LightModeOutlined,
  DarkModeOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Chip,
  useMediaQuery,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import { logout } from "../state/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setMode } from "@/state";

import profileImage from "@/assets/avatar.svg";
import FlexBetween from "./FlexBetween";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isMobile = useMediaQuery("(max-width:900px)");

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpload = async (file) => {
    // ...upload logic
    const dataSummary = summarizeExcel(file); // implement a summary function
    const res = await axios.post("/api/ai/insights", { dataSummary });
    setAiInsights(res.data.insights);
  };

  const navItems = [
    // ...other items
    {
      text: "Terms & Conditions",
      icon: <GavelOutlined />,
      route: "/terms"
    },
  ];

  return (
    <AppBar
      sx={{
        position: "static",
        background: '#fff',
        boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.07)',
        borderRadius: '0 0 18px 18px',
        px: 2,
        py: 1,
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FlexBetween sx={{ gap: "1em" }}>
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{ display: { xs: "block", md: "none" }, color: '#16c0c1' }}
          >
            <MenuIcon />
          </IconButton>
        </FlexBetween>

        <FlexBetween gap="1em">
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
                minWidth: 0,
                padding: 0,
                borderRadius: 3,
                background: '#f5f7fa',
                boxShadow: '0 1px 4px 0 rgba(31, 38, 135, 0.04)',
                '&:hover': { background: '#e0e7ef' },
              }}
            >
              <Box
                component="img"
                alt="profile"
                src={profileImage}
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <ArrowDropDownOutlined
                sx={{ color: '#16c0c1', fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem disabled sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2, minWidth: 200 }}>
                <Box
                  component="img"
                  alt="profile"
                  src={profileImage}
                  height="40px"
                  width="40px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover", mb: 1 }}
                />
                <Box textAlign="center" width="100%" display="flex" flexDirection="column" alignItems="center" gap={0.3}>
                  <Typography fontWeight="bold" fontSize="0.95rem">
                    {user.name}
                  </Typography>
                  <Typography fontSize="0.8rem" color="text.secondary">
                    {user.occupation}
                  </Typography>
                  <Typography fontSize="0.75rem" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role === 'admin' ? 'Admin' : 'User'}
                    color={user.role === 'admin' ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 600, mt: 0.5 }}
                  />
                </Box>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
