import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VoiceCommand from "../components/VoiceCommand";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isNonMobile);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Voice command handler
  const handleVoiceCommand = (action) => {
    switch (action) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        break;
      case "admin":
        navigate("/admin-panel");
        break;
      case "uploadHistory":
        navigate("/upload history");
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isNonMobile={isNonMobile}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Box sx={{ flex: 1, p: { xs: 1, md: 3 } }}>
          <Outlet />
        </Box>
        <VoiceCommand onCommand={handleVoiceCommand} />
      </Box>
    </Box>
  );
};

export default Layout;
