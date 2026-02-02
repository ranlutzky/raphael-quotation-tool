import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ייבוא כל המחירונים
import { pricesData } from "./src/data/prices_std_euro.js";
import { pricesStdUsd } from "./src/data/prices_std_usd.js";
import { pricesHgEur } from "./src/data/prices_hg_euro.js";
import { pricesHgUsd } from "./src/data/prices_hg_usd.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // הזרקת המחירונים למשתנים הגלובליים שהקוד שלך מכיר
    PRICES_STD_EUR_RAW: JSON.stringify(pricesData),
    PRICES_STD_USD_RAW: JSON.stringify(pricesStdUsd),
    PRICES_HG_EUR_RAW: JSON.stringify(pricesHgEur),
    PRICES_HG_USD_RAW: JSON.stringify(pricesHgUsd),
  },
  server: {
    allowedHosts: true,
    host: true,
  },
});
