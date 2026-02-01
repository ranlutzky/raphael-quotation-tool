/// <reference types="vite/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // זה הפתרון - מאשר את כל הכתובות של הסנדבוקס
    allowedHosts: true,
    host: true,
  },
});
