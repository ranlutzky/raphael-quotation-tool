import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // מאפשר גישה מכל כתובת IP (חשוב לדוקר/סנדבוקס)
    allowedHosts: true, // <-- שורת הקסם: מאשרת כל כתובת URL שהסנדבוקס מייצר
  },
});
