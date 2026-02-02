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
    PRICES_STD_EUR_RAW: JSON.stringify(pricesData),
    PRICES_STD_USD_RAW: JSON.stringify(pricesStdUsd),
    PRICES_HG_EUR_RAW: JSON.stringify(pricesHgEur),
    PRICES_HG_USD_RAW: JSON.stringify(pricesHgUsd),

    // כאן אנחנו מזריקים את האופציות האמיתיות שמצאת
    OPTIONS: JSON.stringify({
      bodyMaterials: ["Ductile Iron", "Cast Steel", "ST. St.", "Ni Al Bz"],
      trimMaterials: [
        "Copper/Brass",
        "Ductile Iron",
        "Stainless Steel",
        "Cupro Nickel 90/10",
        "Monel",
        "Full Sea Water Trim",
      ],
      connections: ["TH*TH", "FL*FL", "GR*GR", "FL*GR", "GR*FL"],
      sizes: ['1.5"', '2"', '2.5"', '3"', '4"', '6"', '8"', '10"', '12"'],
    }),
  },
  server: {
    allowedHosts: true,
    host: true,
  },
});
