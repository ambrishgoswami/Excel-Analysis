import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Box, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isNonMobile);
  const user = useSelector((state) => state.auth.user);

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
      </Box>
    </Box>
  );
};

export default Layout;
