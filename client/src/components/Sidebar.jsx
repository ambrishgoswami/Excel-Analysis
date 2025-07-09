/* eslint-disable react/prop-types */
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Popover,
  Button,
  Grid,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  HistoryOutlined,
  PhotoCamera,
  Dashboard,
  GavelOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import profileImage from "@/assets/avatar.svg";
import logo from "@/assets/logo.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout, loginSuccess } from "../state/authSlice";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    route: "/dashboard",
  },
  {
    text: "Upload Excel File",
    icon: <ReceiptLongOutlined />,
  },
  {
    text: "Data Mapping",
    icon: <PointOfSaleOutlined />,
  },
  {
    text: "History",
    icon: <HistoryOutlined />,
  },
  {
    text: "Admin Panel",
    icon: <AdminPanelSettingsOutlined />,
  },
  {
    text: "Terms & Conditions",
    icon: <GavelOutlined />,
    route: "/terms",
  },
];

// Add sound effect for sidebar open/close
const sidebarChime = new Audio("https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3"); // short pleasant chime

function Sidebar({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImg, setProfileImg] = useState(user.profileImage || profileImage);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [logoutAnchorEl, setLogoutAnchorEl] = useState(null);

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      // Upload to backend
      const formData = new FormData();
      formData.append("profileImage", file);
      try {
        const res = await axios.patch(
          `/management/user/${user._id || user.id}/profile-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data.user && res.data.user.profileImage) {
          setProfileImg(res.data.user.profileImage);
        }
      } catch (err) {
        // Optionally show error
        console.error("Profile image upload failed", err);
      }
    }
  };

  return (
    <Box component="nav">
      <Drawer
        open={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          sidebarChime.currentTime = 0;
          sidebarChime.play();
        }}
        variant={isNonMobile ? "persistent" : "temporary"}
        anchor="left"
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isNonMobile ? drawerWidth : '80vw',
          zIndex: isNonMobile ? undefined : 1301,
          transition: 'all 0.3s',
          '& .MuiDrawer-paper': {
            color: '#fff',
            background: 'linear-gradient(135deg, #16c0c1 0%, #1de9b6 100%)',
            boxSizing: 'border-box',
            borderWidth: isNonMobile ? 0 : '2px',
            width: isNonMobile ? drawerWidth : '80vw',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            p: { xs: 1, sm: 2 },
          },
        }}
      >
        <Box width="100%" sx={{ overflowY: 'scroll', flex: 1 }}>
          <Box m={{ xs: 1, sm: 2, md: 4 }}>
            <FlexBetween color="#fff">
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  component="img"
                  src={logo}
                  alt="AnalyseEx Logo"
                  sx={{ height: 44, width: 44, borderRadius: 2, boxShadow: 2, background: '#fff' }}
                />
                <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                 Exalytic
                </Typography>
              </Box>
              {!isNonMobile && (
                <IconButton
                  onClick={() => setIsSidebarOpen(false)}
                  sx={{ color: '#fff' }}
                >
                  <ChevronLeft />
                </IconButton>
              )}
            </FlexBetween>
          </Box>
          <List>
            {navItems.map(({ text, icon, route }) => {
              if (!icon) {
                return (
                  <Typography
                    key={text}
                    sx={{ m: '2.25rem 0 1rem 2rem', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {text}
                  </Typography>
                );
              }
              const lcText = text.toLowerCase().replace(/\s+/g, "-");
              const isActive = active === lcText || pathname === (route || `/${lcText}`);
              return (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(route || `/${lcText}`);
                      setActive(lcText);
                      if (!isNonMobile) setIsSidebarOpen(false);
                    }}
                    sx={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                      borderRadius: '12px',
                      mx: 1,
                      my: 0.5,
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        color: '#fff',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={<Typography fontWeight={600} fontSize={16}>{text}</Typography>}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
            <ListItem key="Settings" disablePadding sx={{ mt: 2 }}>
              <ListItemButton
                onClick={() => {
                  navigate('/settings');
                  setActive('settings');
                  if (!isNonMobile) setIsSidebarOpen(false);
                }}
                sx={{
                  backgroundColor: active === 'settings' ? 'rgba(255,255,255,0.15)' : 'transparent',
                  borderRadius: '12px',
                  mx: 1,
                  my: 0.5,
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.10)',
                    color: '#fff',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}><SettingsOutlined /></ListItemIcon>
                <ListItemText
                  primary={<Typography fontWeight={600} fontSize={16}>Settings</Typography>}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Sidebar;
