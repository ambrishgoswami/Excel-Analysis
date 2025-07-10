import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // or '/your-subpath/' if not at root
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/auth": "http://localhost:5000",
      "/upload": "http://localhost:5000",
      "/management": "http://localhost:5000",
      "/api": "http://localhost:5000",
    },
    historyApiFallback: true,
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['@nivo/core', '@nivo/bar', '@nivo/line', '@nivo/pie', '@nivo/geo'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  define: {
    'process.env.VITE_APP_BASE_URL': JSON.stringify(process.env.VITE_APP_BASE_URL || 'https://excel-analysis.netlify.app/'),
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://excel-analysis-backend-g0cc.onrender.com'),
  },
});
