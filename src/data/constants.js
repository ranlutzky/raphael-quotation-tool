// --- קטגוריות ואפשרויות בסיסיות ---
export const CATEGORIES = {
  VALVES: "Valves",
  ACCESSORIES: "Accessories",
  SPARE_PARTS: "Spare Parts",
  DIAPHRAGMS: "Diaphragms",
  FREE_TEXT: "Free Text",
};

export const OPTIONS = {
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
};

// --- אנשי מכירות וחתימות ---
export const SALES_PEOPLE = [
  "RAN LUTZKY",
  "TAL FISHBHIN",
  "OGENIA ARBITMAN",
  "OHAD LEV",
  "OTHER",
];

export const SIGNATURES = {
  "RAN LUTZKY": {
    name: "Ran Lutzky",
    title: "International Sales Manager",
    region: "The Americas & Southern Europe",
    phone: "+972-556822524",
    email: "rlutzky@raphael-valves.com",
  },
  "TAL FISHBHIN": {
    name: "Tal Fishbhin",
    title: "International Sales Manager",
    region: "APAC & EMEA",
    phone: "+972-52-484-4664",
    email: "tfishbhin@raphael-valves.com",
  },
  "OGENIA ARBITMAN": {
    name: "Ogenia Arbitman",
    title: "Sales Support",
    region: "",
    phone: "+972-54-5-366116",
    email: "oarbitman@raphael-valves.com",
  },
  "OHAD LEV": {
    name: "Ohad Lev",
    title: "VP & Head of FP Division",
    region: "",
    phone: "+972-52-4478213",
    email: "ohadl@raphael-valves.com",
  },
  OTHER: {
    name: "",
    title: "Sales Manager",
    region: "International",
    phone: "",
    email: "",
  },
};

// --- לקוחות ---
export const INITIAL_CUSTOMERS = [
  "AceFlo",
  "Al Yaseah",
  "Atlantica Fire",
  "AYSO",
  "Belgicas",
  "Canosider",
  "Capolavori",
  "Everest Fire",
  "Fire Pro",
  "NAFFCO",
];

// --- מסדי נתונים של מוצרים ---
export const PRODUCTS_DB = {
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
    desc: "3W Electric Actuated, Remote Reset Deluge Valve",
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
    desc: "3W Hydraulic Actuated, Remote Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-DA1": {
    desc: "Hydraulic + Anticolumning Actuated, Remote Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-PE0": {
    desc: "Electric Actuated, Pressure Control, Local Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-PP0": {
    desc: "Pneumatic Actuated, Pressure Control, Local Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-PC0": {
    desc: "Electro-Pneumatic Actuated, Pressure Control, Local Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-PH0": {
    desc: "Hydraulic Actuated, Pressure Control, Local Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-PE1": {
    desc: "Electric Actuated, Pressure Control, Remote Reset Deluge Valve",
    category: "Valves",
  },
  "FPS-SIE0": {
    desc: "Single Interlock, Electric Actuated Pre-Action Valve",
    category: "Valves",
  },
  "FPS-SIP0": {
    desc: "Single Interlock, Pneumatic Actuated Pre-Action Valve",
    category: "Valves",
  },
  "FPS-DCE1": {
    desc: "Double Interlock, Electric-Pneumatic Actuated Pre-Action Valve",
    category: "Valves",
  },
  "FDV-R-PN2": {
    desc: "Remote Resetting, Pressure Reducing Valve",
    category: "Valves",
  },
  "FDV-R-RN2": {
    desc: "Remote Resetting, Pressure Sustaining Valve",
    category: "Valves",
  },
};

export const ACCESSORIES_DB = {
  "Standard Solenoid (Brass)": 220,
  "Standard Solenoid (St.St.)": 450,
  "Standard Solenoid EX PROOF": 350,
  "Pressure Switch PS-10": 210,
  "Water Motor Alarm": 290,
  'Pressure Gauge 4" (St.St)': 55,
  'Pressure Gauge 2.5"': 35,
  "Automatic Drain Valve": 85,
  "Manual Emergency Release": 120,
  'Check Valve 1/2"': 45,
  'Ball Valve 1/2" (Brass)': 25,
  'Y-Strainer 1/2" (Brass)': 35,
  "Drip Cup": 65,
};

export const DIAPHRAGMS_DB = {
  'Deluge (FDV) Diaphragm 1.5"': 70,
  'Deluge (FDV) Diaphragm 2"': 70,
  'Deluge (FDV) Diaphragm 2.5"': 95,
  'Deluge (FDV) Diaphragm 3"': 119,
  'Deluge (FDV) Diaphragm 4"': 165,
  'Deluge (FDV) Diaphragm 6"': 310,
  'Deluge (FDV) Diaphragm 8"': 490,
  'Deluge (FDV) Diaphragm 10"': 720,
  'Deluge (FDV) Diaphragm 12"': 950,
};

// --- תוספות מחיר לחומרים ---
export const BODY_MATERIAL_ADDONS = {
  "Ductile Iron": {
    '1.5"': 0,
    '2"': 0,
    '2.5"': 0,
    '3"': 0,
    '4"': 0,
    '6"': 0,
    '8"': 0,
    '10"': 0,
  },
  "Cast Steel": {
    '1.5"': 150,
    '2"': 150,
    '3"': 250,
    '4"': 400,
    '6"': 600,
    '8"': 900,
    '10"': 1200,
  },
  "ST. St.": {
    '1.5"': 400,
    '2"': 400,
    '2.5"': 550,
    '3"': 700,
    '4"': 1100,
    '6"': 1800,
    '8"': 2800,
  },
  "Ni Al Bz": {
    '1.5"': 600,
    '2"': 600,
    '2.5"': 850,
    '3"': 1100,
    '4"': 1700,
    '6"': 2800,
    '8"': 4200,
  },
};

// --- מיונים והגדרות תשלום ---
export const SORTED_ACCESSORIES_KEYS = Object.keys(ACCESSORIES_DB).sort(
  (a, b) => a.localeCompare(b)
);
export const SORTED_DIAPHRAGMS_KEYS = Object.keys(DIAPHRAGMS_DB).sort((a, b) =>
  a.localeCompare(b)
);

export const PAYMENT_PRESETS = ["AS USUAL", "ADVANCED", "NET +30", "NET +60"];
export const DELIVERY_PRESETS = ["EXW", "FOB", "C&F"];
