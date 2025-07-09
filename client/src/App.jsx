import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { loginSuccess } from "./state/authSlice";

import { themeSettings } from "./theme";
import Layout from "./scenes/Layout";
import Dashboard from "./scenes/Dashboard";
import Products from "./scenes/Products";
import Customers from "./scenes/Customers";
import Transactions from "./scenes/Transactions";
import Geography from "./scenes/Geography";
import Overview from "./scenes/Overview";
import Daily from "./scenes/Daily";
import Monthly from "./scenes/Monthly";
import Breakdown from "./scenes/Breakdown";
import Admin from "./scenes/Admin";
import Performance from "./scenes/Performance";
import Login from "./scenes/Login";
import Register from "./scenes/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UploadHistory from "./scenes/UploadHistory";
import DataMapping from "./components/DataMapping";
import ExcelUpload from "./components/ExcelUpload";
import AdminPanel from "./scenes/AdminPanel";
import Terms from "./scenes/Terms";
import NotFound from "./scenes/NotFound";
import Settings from './scenes/Settings';
import ErrorBoundary from './components/ErrorBoundary';

// Get the base URL from environment variable
const baseURL = import.meta.env.VITE_APP_BASE_URL || '/';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/geography" element={<Geography />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/breakdown" element={<Breakdown />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/upload history" element={<UploadHistory />} />
          <Route path="/data-mapping" element={
            <ErrorBoundary>
              <DataMapping />
            </ErrorBoundary>
          } />
          <Route path="/upload-excel-file" element={<ExcelUpload />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/history" element={<UploadHistory />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </>
  ),
  {
    basename: baseURL
  }
);

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch(loginSuccess({ token, user: JSON.parse(user) }));
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
