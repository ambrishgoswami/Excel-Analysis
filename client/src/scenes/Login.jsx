import React, { useEffect, useRef } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Link, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../state/authSlice";

const illustration = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80";

// FallingPetals component
const petalSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C13.5 6 18 8 18 13C18 17 14.5 21 12 21C9.5 21 6 17 6 13C6 8 10.5 6 12 2Z" fill="#e57373"/></svg>`;

function FallingPetals({ count = 18 }) {
  const containerRef = useRef();
  const petals = useRef([]);
  const animFrame = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    petals.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      speed: 1.2 + Math.random() * 1.8,
      drift: (Math.random() - 0.5) * 1.2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      size: 18 + Math.random() * 18,
    }));

    function animate() {
      const container = containerRef.current;
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      container.innerHTML = "";
      petals.current.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;
        if (p.y > h + 40) {
          p.y = -40;
          p.x = Math.random() * w;
        }
        const el = document.createElement("div");
        el.style.position = "absolute";
        el.style.left = `${p.x}px`;
        el.style.top = `${p.y}px`;
        el.style.width = `${p.size}px`;
        el.style.height = `${p.size}px`;
        el.style.transform = `rotate(${p.rot}deg)`;
        el.style.pointerEvents = "none";
        el.innerHTML = petalSVG;
        container.appendChild(el);
      });
      animFrame.current = requestAnimationFrame(animate);
    }
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [count]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%)" }}
    >
      <FallingPetals count={18} />
      <Card sx={{ maxWidth: 1100, width: "100%", display: "flex", flexDirection: { xs: "column", md: "row" }, boxShadow: 6, borderRadius: 4, overflow: "hidden" }}>
        <Box flex={1} p={{ xs: 3, md: 5 }} display="flex" alignItems="center" justifyContent="center" bgcolor="#fff">
          <Box width="100%" maxWidth={350}>
            <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">Login</Typography>
            <Typography color="text.secondary" mb={3} textAlign="center">Sign in to your account</Typography>
            <form onSubmit={handleSubmit}>
              <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required type="email" />
              <TextField label="Password" name="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required type="password" />
              {error && <Typography color="error" fontSize={14} mt={1}>{error}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }}>Login</Button>
            </form>
            <Typography mt={2} textAlign="center">
              Don't have an account?{' '}
              <Link href="/register" underline="hover" sx={{ fontWeight: 700, color: '#1a237e' }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
        <Box flex={1} display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f7fa" p={{ xs: 3, md: 5 }}>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={700} mb={2}>Welcome Back!</Typography>
            <Typography color="text.secondary" mb={3}>
              Log in to access your dashboard and explore powerful analytics and insights for your Excel data.
            </Typography>
            <Box component="img" src={illustration} alt="Login Illustration" sx={{ width: { xs: 220, md: 320 }, borderRadius: 3, boxShadow: 2 }} />
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Login; 