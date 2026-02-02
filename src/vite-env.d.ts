import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// אנחנו מייבאים את המידע מהקובץ החדש שיצרת
import { pricesData } from "./src/data/prices.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // כאן הקסם קורה: אנחנו מזריקים את המידע האמיתי
    PRICES_STD_EUR_RAW: JSON.stringify(pricesData),
  },
  server: {
    allowedHosts: true,
    host: true,
  },
});
