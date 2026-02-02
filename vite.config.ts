// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// תיקון הנתיבים שיתאימו בדיוק לקבצים שיצרת בתיקיית ה-data
import { pricesData } from "./src/data/prices_euro.js"; // ודא שזה השם אצלך
import { pricesStdUsd } from "./src/data/prices_std_usd.js";
import { pricesHgEur } from "./src/data/prices_hg_euro.js";
import { pricesHgUsd } from "./src/data/prices_hg_usd.js";
export default defineConfig({
  plugins: [react()],
  define: {
    // 1. מחירונים
    PRICES_STD_EUR_RAW: JSON.stringify(pricesData),
    PRICES_STD_USD_RAW: JSON.stringify(pricesStdUsd),
    PRICES_HG_EUR_RAW: JSON.stringify(pricesHgEur),
    PRICES_HG_USD_RAW: JSON.stringify(pricesHgUsd),

    // 2. קטגוריות (חשוב עבור ה-PRODUCTS_DB)
    CATEGORIES: JSON.stringify({
      VALVES: "Valves",
      ACCESSORIES: "Accessories",
    }),

    // 3. בסיס הנתונים של המוצרים (מה ששלחת עכשיו)
    PRODUCTS_DB: JSON.stringify({
      "FDV-DE0": {
        desc: "Electric Actuated, Local Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DP0": {
        desc: "Pneumatic Actuated, Local Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DC0": {
        desc: "Electro-Pneumatic Actuated, Local Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DH0": {
        desc: "Hydraulic Actuated, Local Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DA0": {
        desc: "Hydraulic + Anticolumning Actuated, Local Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DE1": {
        desc: "Electric Actuated, Remote Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-3W-DE1": {
        desc: "Electric Actuated, Remote Reset Deluge Valve (3 Way)",
        category: "Valves",
      },
      "FDV-DP1": {
        desc: "Pneumatic Actuated, Remote Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DC1": {
        desc: "Electro-Pneumatic Actuated, Remote Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-DH1": {
        desc: "Hydraulic Actuated, Remote Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-3W-DH1": {
        desc: "Hydraulic Actuated, Remote Reset Deluge Valve (3 Way)",
        category: "Valves",
      },
      "FDV-DA1": {
        desc: "Hydraulic + Anticolumning Actuated, Remote Reset Deluge Valve",
        category: "Valves",
      },
      "FDV-PE0": {
        desc: "Electric Actuated, Local Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PP0": {
        desc: "Pneumatic Actuated, Local Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PC0": {
        desc: "Electro-Pneumatic Actuated, Local Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PH0": {
        desc: "Hydraulic Actuated, Local Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PA0": {
        desc: "Hydraulic + Anticolumning Actuated, Local Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PE1": {
        desc: "Electric Actuated, Remote Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PP1": {
        desc: "Pneumatic Actuated, Remote Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PC1": {
        desc: "Electro-Pneumatic Actuated, Remote Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PH1": {
        desc: "Hydraulic Actuated, Remote Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-PA1": {
        desc: "Hydraulic + Anticolumning Actuated, Remote Reset Modulating Deluge Valve",
        category: "Valves",
      },
      "FDV-AE1": {
        desc: "Electric Actuated, Remote Reset Economic Deluge Valve",
        category: "Valves",
      },
      "FDV-3W-AE1": {
        desc: "Electric Actuated, Remote Reset Economic Deluge Valve (3 Way)",
        category: "Valves",
      },
      "FDV-AP1": {
        desc: "Pneumatic Actuated, Remote Reset Economic Deluge Valve",
        category: "Valves",
      },
      "FDV-AC1": {
        desc: "Electro-Pneumatic Actuated, Remote Reset Economic Deluge Valve",
        category: "Valves",
      },
      "FDV-AH1": {
        desc: "Hydraulic Actuated, Remote Reset Economic Deluge Valve",
        category: "Valves",
      },
      "FDV-3W-AH1": {
        desc: "Hydraulic Actuated, Remote Reset Economic Deluge Valve (3 Way)",
        category: "Valves",
      },
      "FDV-R-HH0": {
        desc: "ON/OFF Hydrant, Hydraulic Actuator",
        category: "Valves",
      },
      "FDV-R-HHP": {
        desc: "ON/OFF Hydrant, Hydraulic & Pressure Reducing Actuator",
        category: "Valves",
      },
      "FDV-R-MH0": {
        desc: "Monitor Hydraulic Local Control Valve",
        category: "Valves",
      },
      "FDV-R-MH1": {
        desc: "Monitor Hydraulic Remote Control Valve",
        category: "Valves",
      },
      "FDV-R-ME1": {
        desc: "Monitor Electric Remote Control Valve",
        category: "Valves",
      },
      "FPS-SIE0": {
        desc: "Single Interlock, Electric Actuator Local Reset",
        category: "Valves",
      },
      "FPS-SIP0": {
        desc: "Single Interlock, Pneumatic Actuator Local Reset",
        category: "Valves",
      },
      "FPS-SCE0": {
        desc: "Single Interlock with Pressure Reducing, Electric Actuator Local Reset",
        category: "Valves",
      },
      "FPS-SIE1": {
        desc: "Single Interlock, Electric Actuator Remote Reset",
        category: "Valves",
      },
      "FPS-SCE1": {
        desc: "Single Interlock with Pressure Reducing, Electric Actuator Remote Reset",
        category: "Valves",
      },
      "FPS-DIE0": {
        desc: "Double Interlock, Electric Actuator Local Reset",
        category: "Valves",
      },
      "FPS-DIC0": {
        desc: "Double Interlock, Electric & Pneumatic Actuator Local Reset",
        category: "Valves",
      },
      "FPS-DCE0": {
        desc: "Double Interlock with Pressure Reducing, Electric Actuator Local Reset",
        category: "Valves",
      },
      "FPS-DCE1": {
        desc: "Double Interlock with Pressure Reducing, Electric Actuator Remote Reset",
        category: "Valves",
      },
      "FPS-DIE1": {
        desc: "Double Interlock, Electric Actuator Remote Reset",
        category: "Valves",
      },
      "FDV-R-PN2": {
        desc: "Pressure Reducing Control Valve",
        category: "Valves",
      },
      "FDV-R-RN2": {
        desc: "Pressure Relief Control Valve",
        category: "Valves",
      },
      "FDV-R-LE2": { desc: "Electric Level Control Valve", category: "Valves" },
      "FDV-R-LF2": {
        desc: "Flow Level Control Valve (min/max)",
        category: "Valves",
      },
      "FDV-R-LA2": { desc: "Altitude Control Valve", category: "Valves" },
    }),

    // 4. אופציות לתפריטים
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
      // כאן הוספתי את רשימת הדגמים מתוך ה-DB כדי שתוכל לבחור אותם
      valves: [
        "FDV-DE0",
        "FDV-DP0",
        "FDV-DC0",
        "FDV-DH0",
        "FDV-DA0",
        "FDV-DE1",
        "FDV-3W-DE1",
        "FDV-DP1",
        "FDV-DC1",
        "FDV-DH1",
        "FDV-3W-DH1",
        "FDV-DA1",
        "FDV-PE0",
        "FDV-PP0",
        "FDV-PC0",
        "FDV-PH0",
        "FDV-PA0",
        "FDV-PE1",
        "FDV-PP1",
        "FDV-PC1",
        "FDV-PH1",
        "FDV-PA1",
        "FDV-AE1",
        "FDV-3W-AE1",
        "FDV-AP1",
        "FDV-AC1",
        "FDV-AH1",
        "FDV-3W-AH1",
        "FDV-R-HH0",
        "FDV-R-HHP",
        "FDV-R-MH0",
        "FDV-R-MH1",
        "FDV-R-ME1",
        "FPS-SIE0",
        "FPS-SIP0",
        "FPS-SCE0",
        "FPS-SIE1",
        "FPS-SCE1",
        "FPS-DIE0",
        "FPS-DIC0",
        "FPS-DCE0",
        "FPS-DCE1",
        "FPS-DIE1",
        "FDV-R-PN2",
        "FDV-R-RN2",
        "FDV-R-LE2",
        "FDV-R-LF2",
        "FDV-R-LA2",
      ],
    }),

    ACCESSORIES: JSON.stringify([]),
  },
  server: {
    allowedHosts: true,
    host: true,
  },
});
