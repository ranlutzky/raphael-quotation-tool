/// <reference types="vite/client" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// --- הוספה חשובה: טען את המידע ---
// שים לב: שנה את הנתיב './src/data/prices.json' לנתיב האמיתי של קובץ המחירים שלך!
import pricesData from "./src/data/prices.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // --- הוספה חשובה: הזרקת המשתנה ---
  define: {
    // אנחנו משתמשים ב-JSON.stringify כדי שזה יעבור כאובייקט תקין לקוד
    PRICES_STD_EUR_RAW: JSON.stringify(pricesData),
  },

  server: {
    allowedHosts: true,
    host: true,
  },
});
