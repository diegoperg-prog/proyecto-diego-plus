import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",              // 👈  muy importante
  build: {
    outDir: "dist",
    assetsDir: "assets"
  }
});
