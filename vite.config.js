import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuración optimizada para Diego+
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    open: true
  }
});
