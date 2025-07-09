import React from "react";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TableChartIcon from '@mui/icons-material/TableChart';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
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

const SidebarContent = ({ selected, onNavClick }) => (
  <Box
    sx={{
      width: 250,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #16c0c1 0%, #1a237e 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 3,
    }}
  >
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <img src={logo} alt="Logo" style={{ width: 40, marginRight: 10 }} />
      <Typography variant="h5" fontWeight={700} color="#fff">Exalytic</Typography>
    </Box>
    <List sx={{ width: '100%' }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.text}
          selected={selected === item.route}
          onClick={() => onNavClick(item.route)}
          sx={{
            borderRadius: 2,
            mb: 1,
            background: selected === item.route ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: '#fff',
            '&:hover': { background: 'rgba(255,255,255,0.10)' },
            fontWeight: selected === item.route ? 700 : 400,
          }}
        >
          <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(location.pathname);

  React.useEffect(() => {
    setSelected(location.pathname);
  }, [location.pathname]);

  // On navigation, update selected and close sidebar on mobile
  const handleNavClick = (route) => {
    navigate(route);
    setSelected(route);
    if (!isNonMobile) setIsSidebarOpen(false);
  };

  if (isNonMobile) {
    return <SidebarContent selected={selected} onNavClick={handleNavClick} />;
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
          background: 'linear-gradient(180deg, #16c0c1 0%, #1a237e 100%)',
          color: '#fff',
        }
      }}
    >
      <SidebarContent selected={selected} onNavClick={handleNavClick} />
    </Drawer>
  );
};

export default Sidebar;
