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
      width: { xs: 220, sm: 260 },
      minHeight: '100vh',
      background: 'rgba(26,35,126,0.65)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 3,
      position: 'relative',
      borderTopRightRadius: 32,
      borderBottomRightRadius: 32,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      borderLeft: '6px solid',
      borderImage: 'linear-gradient(180deg, #16c0c1 0%, #1a237e 100%) 1',
      overflow: 'hidden',
    }}
  >
    {/* Close button for mobile */}
    {isMobile && (
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
        aria-label="Close sidebar"
      >
        <CloseIcon />
      </IconButton>
    )}
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
    <List sx={{ width: '100%', mt: 2 }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.text}
          selected={selected === item.route}
          onClick={() => onNavClick(item.route)}
          sx={{
            borderRadius: 3,
            mb: 1.5,
            mx: 1.5,
            background: selected === item.route ? 'linear-gradient(90deg, #16c0c1 0%, #1a237e 100%)' : 'transparent',
            color: '#fff',
            boxShadow: selected === item.route ? '0 2px 12px 0 rgba(22,192,193,0.10)' : 'none',
            fontWeight: selected === item.route ? 800 : 500,
            minHeight: 54,
            px: 3,
            transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
            fontSize: 18,
            '&:hover': {
              background: 'linear-gradient(90deg, #16c0c1 0%, #1a237e 100%)',
              boxShadow: '0 2px 12px 0 rgba(22,192,193,0.13)',
              transform: 'scale(1.04)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#fff', minWidth: 40, fontSize: 28, mr: 1 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 18, fontWeight: 600, fontFamily: 'Montserrat,sans-serif' }} />
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
          background: 'rgba(26,35,126,0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          color: '#fff',
          width: { xs: 220, sm: 260 },
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          borderLeft: '6px solid',
          borderImage: 'linear-gradient(180deg, #16c0c1 0%, #1a237e 100%) 1',
          overflow: 'hidden',
        }
      }}
    >
      <SidebarContent selected={selected} onNavClick={handleNavClick} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
    </Drawer>
  );
};

export default Sidebar;
