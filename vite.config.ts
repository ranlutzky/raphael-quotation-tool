import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ייבוא המחירונים - הסרתי את הסיומת .js כדי ש-Vite יזהה אותם אוטומטית
import { pricesData } from "./src/data/prices_std_eur";
import { pricesStdUsd } from "./src/data/prices_std_usd";
import { pricesHgEur } from "./src/data/prices_hg_eur";
import { pricesHgUsd } from "./src/data/prices_hg_usd";

export default defineConfig({
  plugins: [react()],
  define: {
    // הזרקת המחירונים לשימוש גלובלי באפליקציה
    PRICES_STD_EUR_RAW: JSON.stringify(pricesData || {}),
    PRICES_STD_USD_RAW: JSON.stringify(pricesStdUsd || {}),
    PRICES_HG_EUR_RAW: JSON.stringify(pricesHgEur || {}),
    PRICES_HG_USD_RAW: JSON.stringify(pricesHgUsd || {}),
  },
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  },
});
