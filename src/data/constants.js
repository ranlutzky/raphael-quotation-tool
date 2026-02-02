export const CATEGORIES = {
  VALVES: "Valves",
  ACCESSORIES: "Accessories",
  SPARE_PARTS: "Spare Parts",
  DIAPHRAGMS: "Diaphragms",
  FREE_TEXT: "Free Text",
};

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

export const INITIAL_CUSTOMERS = [
  "AceFlo",
  "Al Yaseah",
  "Atlantica Fire",
  "AYSO",
  "Belgicas",
]; // וכו'.. תעתיק את כל הרשימה שלך לכאן

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
};

export const PRODUCTS_DB = {
  "FDV-DE0": {
    desc: "Electric Actuated, Local Reset Deluge Valve",
    category: "Valves",
  },
  "FDV-DP0": {
    desc: "Pneumatic Actuated, Local Reset Deluge Valve",
    category: "Valves",
  },
  // תוסיף כאן את כל הרשימה הארוכה ששלחת קודם
};

export const DIAPHRAGMS_DB = {
  'Deluge (FDV) Diaphragm 2"': 70,
  'Deluge (FDV) Diaphragm 2.5"': 94.5,
  // תמשיך את הרשימה...
};

export const ACCESSORIES_DB = {
  "Pressure Switch Weather Proof (Potter PS-10)": 210,
  "Standard Solenoid": 220,
  // תמשיך את הרשימה...
};

export const SORTED_ACCESSORIES_KEYS = Object.keys(ACCESSORIES_DB).sort(
  (a, b) => a.localeCompare(b)
);

export const PAYMENT_PRESETS = ["AS USUAL", "ADVANCED", "NET +30", "NET +60"];
export const DELIVERY_PRESETS = ["EXW", "FOB", "C&F"];
// הוסף את זה לסוף הקובץ src/data/constants.js

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
    '12"': 0,
  },
  "Cast Steel": {
    '1.5"': 150,
    '2"': 150,
    '2.5"': 200,
    '3"': 250,
    '4"': 400,
    '6"': 600,
    '8"': 900,
    '10"': 1200,
    '12"': 1500,
  },
  "ST. St.": {
    '1.5"': 400,
    '2"': 400,
    '2.5"': 550,
    '3"': 700,
    '4"': 1100,
    '6"': 1800,
    '8"': 2800,
    '10"': 3800,
    '12"': 5000,
  },
  "Ni Al Bz": {
    '1.5"': 600,
    '2"': 600,
    '2.5"': 850,
    '3"': 1100,
    '4"': 1700,
    '6"': 2800,
    '8"': 4200,
    '10"': 5800,
    '12"': 7500,
  },
};
