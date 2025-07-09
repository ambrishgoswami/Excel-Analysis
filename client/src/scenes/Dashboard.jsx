import React, { useEffect, useRef, useState } from "react";
import { useGetDashboardQuery } from "@/state/api";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import logo from "@/assets/logo.png";

// Realistic rose petal SVGs (3 variants)
const petalSVGs = [
  `<svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2C18 8 26 10 26 18C26 26 18 30 14 30C10 30 2 26 2 18C2 10 10 8 14 2Z" fill="url(#paint0_radial)" stroke="#a31545" stroke-width="1.5"/><defs><radialGradient id="paint0_radial" cx="0.5" cy="0.5" r="0.7" fx="0.6" fy="0.2" gradientTransform="translate(14 16) scale(12 14)" gradientUnits="userSpaceOnUse"><stop stop-color="#ff4b6e"/><stop offset="1" stop-color="#a31545"/></radialGradient></defs></svg>`,
  `<svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 3C17 10 25 12 25 19C25 27 17 29 14 29C11 29 3 27 3 19C3 12 11 10 14 3Z" fill="url(#paint1_radial)" stroke="#a31545" stroke-width="1.5"/><defs><radialGradient id="paint1_radial" cx="0.5" cy="0.5" r="0.7" fx="0.7" fy="0.3" gradientTransform="translate(14 16) scale(11 13)" gradientUnits="userSpaceOnUse"><stop stop-color="#ff5c8d"/><stop offset="1" stop-color="#a31545"/></radialGradient></defs></svg>`,
  `<svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="14" cy="18" rx="12" ry="10" fill="url(#paint2_radial)" stroke="#a31545" stroke-width="1.5"/><defs><radialGradient id="paint2_radial" cx="0.5" cy="0.5" r="0.7" fx="0.4" fy="0.2" gradientTransform="translate(14 18) scale(12 10)" gradientUnits="userSpaceOnUse"><stop stop-color="#ff6f91"/><stop offset="1" stop-color="#a31545"/></radialGradient></defs></svg>`
];

// Revert to a single simple SVG for petal
const petalSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C13.5 6 18 8 18 13C18 17 14.5 21 12 21C9.5 21 6 17 6 13C6 8 10.5 6 12 2Z" fill="#c2185b" stroke="#ad1457" stroke-width="1.5"/><ellipse cx="12" cy="13" rx="3.5" ry="6" fill="#e57373" opacity="0.7"/></svg>`;

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

// Confetti animation for seasonal theme
function ConfettiOverlay() {
  useEffect(() => {
    const colors = ["#ff4081", "#ffd600", "#69f0ae", "#536dfe", "#ffab40", "#00bcd4"];
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 1000;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const confetti = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 6 + Math.random() * 8,
      d: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05
    }));
    let animationFrame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach(c => {
        ctx.beginPath();
        ctx.lineWidth = c.r;
        ctx.strokeStyle = c.color;
        ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
        ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r);
        ctx.stroke();
      });
      update();
      animationFrame = requestAnimationFrame(draw);
    }
    function update() {
      confetti.forEach(c => {
        c.y += c.d;
        c.tiltAngle += c.tiltAngleIncremental;
        c.tilt = Math.sin(c.tiltAngle) * 15;
        if (c.y > canvas.height) {
          c.x = Math.random() * canvas.width;
          c.y = -10;
        }
      });
    }
    draw();
    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.removeChild(canvas);
    };
  }, []);
  return null;
}

// Typewriter effect for greeting
function useTypewriter(text, speed = 60) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

function Dashboard() {
  const { data, isLoading } = useGetDashboardQuery();
  const authUser = useSelector((state) => state.auth.user);

  // Personalized greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 5) return "Good Night";
    if (hour < 11) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Motivational quotes in English only
  const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Rise up, start fresh, see the bright opportunity in each new day.",
    "Push yourself, because no one else is going to do it for you.",
    "Dream big and dare to fail.",
    "Don't watch the clock; do what it does. Keep going.",
    "Great things never come from comfort zones.",
    "Doubt kills more dreams than failure ever will.",
    "Your only limit is your mind."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // List of Hindu festival dates (MM-DD format)
  const festivalDates = [
    "03-25", // Holi 2024
    "11-01", // Diwali 2024
    "01-01"  
    
  ];
  const today = new Date();
  const todayStr = (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  const isFestival = festivalDates.includes(todayStr);

  const greetingText = `${getGreeting()}, ${data?.user?.name || authUser?.name || 'User'}!`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, md: 3 },
      }}
    >
      {isFestival && <ConfettiOverlay />}
      <FallingPetals count={18} />
      {/* Welcome Card */}
      <Box
        sx={{
          maxWidth: 700,
          width: '100%',
          mx: 'auto',
          background: '#fff',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          p: { xs: 3, md: 5 },
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img src={logo} alt="Logo" style={{ height: 90, width: 90, borderRadius: 16, boxShadow: '0 2px 8px rgba(31,38,135,0.08)' }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="#16c0c1" mb={1}>
          {greetingText}
        </Typography>
        <Typography variant="h4" fontWeight={800} color="#1a237e" mb={0.5}>
          Welcome
        </Typography>
        <Typography color="text.secondary" fontSize={18} mb={2}>
          You have successfully logged in. Your analytics and uploads will appear here.
        </Typography>
        <Box mt={2}>
          <Typography fontStyle="italic" color="#3949ab" fontSize={18}>
            "{randomQuote}"
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
