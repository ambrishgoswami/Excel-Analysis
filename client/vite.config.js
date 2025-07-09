import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
