import React from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import logo from "@/assets/logo.png";

const navItems = [
  { text: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
  { text: "Upload Excel File", icon: <UploadFileIcon />, route: "/upload-excel-file" },
  { text: "Data Mapping", icon: <TableChartIcon />, route: "/data-mapping" },
  { text: "History", icon: <HistoryIcon />, route: "/history" },
  { text: "Admin Panel", icon: <AdminPanelSettingsIcon />, route: "/admin-panel" },
  { text: "Terms & Conditions", icon: <GavelOutlinedIcon />, route: "/terms" },
  { text: "Settings", icon: <SettingsIcon />, route: "/settings" },
];

const SidebarContent = ({ selected, onNavClick, onClose, isMobile }) => (
  <Box
    sx={{
      width: isMobile ? '100vw' : { xs: 220, sm: 260 },
      maxWidth: isMobile ? '100vw' : undefined,
      minHeight: '100vh',
      background: isMobile ? 'linear-gradient(180deg, #1a237e 0%, #16c0c1 100%)' : 'rgba(26,35,126,0.65)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      py: isMobile ? 0 : 3,
      position: 'relative',
      borderRadius: isMobile ? 0 : '0 32px 32px 0',
      boxShadow: isMobile ? 'none' : '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      borderLeft: isMobile ? 'none' : '6px solid',
      borderImage: isMobile ? undefined : 'linear-gradient(180deg, #16c0c1 0%, #1a237e 100%) 1',
      overflow: 'hidden',
    }}
  >
    {/* Mobile header with close button, logo, and title */}
    {isMobile && (
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2, background: 'rgba(0,0,0,0.10)', minHeight: 56 }}>
        <IconButton
          onClick={onClose}
          sx={{ color: '#fff', mr: 1 }}
          aria-label="Close sidebar"
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
          <Typography fontWeight={900} fontSize={20} fontFamily="'Montserrat',sans-serif" letterSpacing={1}>
            Exalytic
          </Typography>
        </Box>
      </Box>
    )}
    {/* Desktop logo/title */}
    {!isMobile && (
      <Box sx={{ mb: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Box sx={{
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '50%',
          p: 1.2,
          mb: 1.2,
          boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img src={logo} alt="Logo" style={{ width: 48, height: 48 }} />
        </Box>
        <Typography variant="h5" fontWeight={900} color="#fff" fontFamily="'Montserrat',sans-serif" letterSpacing={2} sx={{ textAlign: 'center', fontSize: 26 }}>
          Exalytic
        </Typography>
      </Box>
    )}
    <List sx={{ width: '100%', mt: isMobile ? 1 : 2 }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.text}
          selected={selected === item.route}
          onClick={() => onNavClick(item.route)}
          sx={{
            borderRadius: isMobile ? 1.5 : 3,
            mb: isMobile ? 0.5 : 1.5,
            mx: isMobile ? 1 : 1.5,
            background: selected === item.route ? 'linear-gradient(90deg, #16c0c1 0%, #1a237e 100%)' : 'transparent',
            color: '#fff',
            boxShadow: selected === item.route && !isMobile ? '0 2px 12px 0 rgba(22,192,193,0.10)' : 'none',
            fontWeight: selected === item.route ? 800 : 500,
            minHeight: isMobile ? 44 : 54,
            px: isMobile ? 2 : 3,
            transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
            fontSize: isMobile ? 16 : 18,
            '&:hover': {
              background: 'linear-gradient(90deg, #16c0c1 0%, #1a237e 100%)',
              boxShadow: !isMobile ? '0 2px 12px 0 rgba(22,192,193,0.13)' : 'none',
              transform: !isMobile ? 'scale(1.04)' : 'none',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#fff', minWidth: isMobile ? 32 : 40, fontSize: isMobile ? 22 : 28, mr: 1 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, fontFamily: 'Montserrat,sans-serif' }} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(location.pathname);
  const isMobile = !isNonMobile;

  React.useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  // On navigation, update selected and close sidebar on mobile
  const handleNavClick = (route) => {
    navigate(route);
    setSelected(route);
    if (isMobile) setIsSidebarOpen(false);
  };

  if (isNonMobile) {
    return <SidebarContent selected={selected} onNavClick={handleNavClick} isMobile={false} />;
  }

  return (
    <Drawer
      open={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      variant="temporary"
      anchor="left"
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          background: { xs: 'linear-gradient(180deg, #1a237e 0%, #16c0c1 100%)', sm: 'rgba(26,35,126,0.65)' },
          color: '#fff',
          width: { xs: '100vw', sm: 260 },
          maxWidth: { xs: '100vw', sm: 320 },
          borderRadius: { xs: 0, sm: '0 32px 32px 0' },
          boxShadow: { xs: 'none', sm: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' },
          borderLeft: { xs: 'none', sm: '6px solid' },
          borderImage: { xs: undefined, sm: 'linear-gradient(180deg, #16c0c1 0%, #1a237e 100%) 1' },
          overflow: 'hidden',
        }
      }}
    >
      <SidebarContent selected={selected} onNavClick={handleNavClick} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
    </Drawer>
  );
};

export default Sidebar;
