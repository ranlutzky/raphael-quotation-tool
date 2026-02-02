import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// --- 1. CONSTANTS & HELPER FUNCTIONS ---

const CATEGORIES = {
  VALVES: "Valves",
  ACCESSORIES: "Accessories",
  SPARE_PARTS: "Spare Parts",
  DIAPHRAGMS: "Diaphragms",
  FREE_TEXT: "Free Text",
};

const INITIAL_CUSTOMERS = [
  "AceFlo",
  "Al Yaseah",
  "Atlantica Fire",
  "AYSO",
  "Belgicas",
  "Canosider",
  "Capolavori",
  "CF Systemas",
  "Chryssafidis",
  "CMC",
  "CMC Fire Solutions",
  "Data Fire",
  "DDC Eng.",
  "DoOil",
  "DOS",
  "DSINT",
  "Eastchain",
  "EndFire",
  "ESE Equipment",
  "Eurosafe",
  "FES",
  "Fierre",
  "Fire Protection Solutions",
  "FireTech",
  "Firing",
  "FitFlow Bolivia",
  "FitFlow Chile",
  "FitFlow Ecuador",
  "FitFlow Peru",
  "FitFlow Uruguay",
  "FluidTechnik",
  "FoaMax",
  "Fotern",
  "Frucom",
  "G&R Hidromedicion",
  "General Commercial",
  "Gia Linh",
  "GLOCOM",
  "Green Technology",
  "Grupo Cunado",
  "Grupo de Incendios",
  "Grupo Incendios",
  "Grupo Lupi",
  "Grupo Quantum",
  "Grupo Safety",
  "Grupo Salva Vidas",
  "Harbour Rich",
  "HD Fire",
  "Hidrofenix",
  "Hydor",
  "IDATOR",
  "Ideal Solution",
  "IMPEXTRON",
  "InControl",
  "Industrail Motion",
  "Interstae Fire Protection",
  "Jaconn",
  "JCI Control",
  "Koor Caribe",
  "Latente",
  "Marsol",
  "Maximo Supply",
  "Mega Planet",
  "Motec",
  "Mozzanica",
  "Nhat An Industrial Equipment",
  "OLPRA",
  "Omexom",
  "Ondoan",
  "Orion",
  "P/T/ Cerna Corp.",
  "Pefipresa",
  "PKE",
  "Profit",
  "PTSC Quang",
  "PyroAsia",
  "QD Fire",
  "Quest Fire Protection",
  "Riego Pro",
  "RT Rame",
  "S.B. Supply",
  "SafeTec",
  "Sanco S.p.A.",
  "Secur",
  "SertValve",
  "SIA",
  "Stilton",
  "Tan Sang",
  "Tazetco",
  "Tecnovanguardia",
  "TMX Pro",
  "Top Flow",
  "Tubotecnica",
  "United Fire",
  "UruFire",
  "Uxello",
  "Valve Tech",
  "ValveTek",
  "Van Ginkel",
  "Vietsafe",
  "Viking Corp",
  "Viking Far East",
  "Viking Luxemburg",
  "Vina Autech",
  "XPAD",
  "Xpart",
  "Zensitex",
];

const SALES_PEOPLE = [
  "RAN LUTZKY",
  "TAL FISHBHIN",
  "OGENIA ARBITMAN",
  "OHAD LEV",
  "OTHER",
];

const SIGNATURES = {
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

const PAYMENT_PRESETS = ["AS USUAL", "ADVANCED", "NET +30", "NET +60"];
const DELIVERY_PRESETS = ["EXW", "FOB", "C&F"];

const addSize2_5 = (priceList) => {
  if (!priceList) return {};
  const newPriceList = { ...priceList };
  Object.keys(newPriceList).forEach((key) => {
    const item = newPriceList[key];
    if (item && item['2"'] && item['3"'] && !item['2.5"']) {
      const avg = (item['2"'] + item['3"']) / 2;
      newPriceList[key] = { ...item, '2.5"': avg };
    }
  });
  return newPriceList;
};

const formatCurrency = (amount, symbol = "") => {
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const nth = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `${month} ${day}${nth(day)}, ${year}`;
};

// --- 2. RAW DATA (DATABASE) ---

const DIAPHRAGMS_DB = {
  'Deluge (FDV) Diaphragm 2"': 70,
  'Deluge (FDV) Diaphragm 2.5"': 94.5,
  'Deluge (FDV) Diaphragm 3"': 119,
  'Deluge (FDV) Diaphragm 4"': 208,
  'Deluge (FDV) Diaphragm 6"': 358,
  'Deluge (FDV) Diaphragm 8"': 700,
  'Deluge (FDV) Diaphragm 10"': 1050,
  'RAF (FDV-R) Diaphragm 1"': 16,
  'RAF (FDV-R) Diaphragm 1.5"': 20,
  'RAF (FDV-R) Diaphragm 2"': 33,
  'RAF (FDV-R) Diaphragm 2.5"': 33,
  'RAF (FDV-R) Diaphragm 3"': 79,
  'RAF (FDV-R) Diaphragm 4"': 108,
  'RAF (FDV-R) Diaphragm 6"': 147,
  'RAF (FDV-R) Diaphragm 8"': 325,
  'RAF (FDV-R) Diaphragm 10"': 475,
};

const ACCESSORIES_DB = {
  "Pressure Switch Weather Proof (Potter PS-10)": 210,
  "Pressure Switch Explosion proof (Ashcroft B series)": 650,
  "Pressure Switch Explosion proof (PS-10-EX Proof)": 650,
  "Pressure Switch Explosion proof (UE-120)": 650,
  "Pressure Switch PS-13": 100,
  "Solenoid Electric latching solenoid(2/2) (8281- 320595-BURKERT-2/2)": 250,
  "NOT Standard Solenoid EX PROOF": 500,
  "Standard Solenoid": 220,
  "Standard Solenoid EX PROOF": 250,
  "Solenoid Weather proof latching Solenoid (2/2)": 210,
  "Solenoid Electric latching solenoid - Explosion proof (2/2)": 600,
  "Solenoid Electric latching solenoid - Explosion proof (3/2)": 250,
  "Solenoid x-proof (2/2) (24102-12-4R-B12-S0)": 150,
  "Solenoid Weather proof (2/2) (21102-12-4R-S0-L-24V-DC-18)": 0,
  "Solenoid Weather proof (3/2) (30208-2.2-2R-B2-S10)": 0,
  "Solenoid ex-proof (3/2) (30208-2.2-2R-B5-S10)": 250,
  "Solenoid Mechanical latching solenoid": 0,
  "Solenoid Mechanical latching solenoid - Explosion proof": 0,
  "Solenoid 2 way, stainless steel 316": 1500,
  "Solenoid 327 ASCO ATEX": 775.5,
  "Block & Bleed valve": 54,
  "Water Motor Alarm": 290,
  "Trim Comp. drip funnel": 80,
  'Trim Comp. 2 way Ball drain valve BK10N223/F20(3/4"-S.S)': 25,
  'Trim Comp. 2 way Ball drain valve BK14N21/F20(1 1/4"-S.S)': 35,
  'Trim Comp. 2 way Ball drain valve BK18821/F20(2"-S.S)': 120,
  'Trim Comp. 2 way Ball drain valve BK108223/F20(3/4"-brass)': 15,
  'Trim Comp. 2 way Ball drain valve BK188223/F20(2"-brass)': 70,
  "Trim Comp. PT-EX Proof (Kitagawa)": 500,
  "Trim Comp. Pressure Transmitter": 300,
  "Trim Comp. Proximity Switch+Inductor": 530,
  "Trim Comp.PG - Pressure Gauge": 0,
  "ASK with double check valve SST": 323,
  "ASK SST": 250,
  "Air maintenance supply system": 210,
  "Pressure Gauge PG STANDARD Pg-35-03": 50,
  "Pressure Gauge PG SST": 55,
  "Pressure Gauge explosion proofed(ATEX)": 168,
  "Pressure gauge PG certified for ATEX Zone 1, IIB, T3": 225,
  "PRPV (Brass Pressure Reducing Pilot Valve)": 90,
  "PRPV-CF8M (SS Pressure Reducing Pilot Valve)": 135,
  "MADV-1/2-1/4N316 (SS Manual & automatic drain valve)": 104,
  "MADV-1/2-1/4P (Brass Manual Automatic drain valve)": 71,
  "MEU-L-KIT (SS Manual Emergency Unit)": 98,
  "HAV-2-1/2-N316 (SS Hydraulic Actuator Valve)": 109,
  "HAV-2-1/2-B (Brass Hydraulic Actuator Valve)": 98,
  "PSA-1/4W-1/2FP (Brass Pressure Supply Arrestor)": 95,
  "PSA-1/4W-1/2 FSS (SS Pressure Supply Arrestor)": 149,
  "PAV-2 (Brass Pneumatic actuator)": 190,
  "PAV-2-CF8M (SS Pneumatic actuator)": 290,
  "PG-35-03 (Manometer standard)": 18,
  "PG-40-12 (Manometer SST)": 24,
  "GR X FL Adaptor": 100,
  "PSA-1/4W-1/2 FSS ATEX": 650,
  "Position Indicator with LS magnetic sensor": 780,
  "Pressure Switch/Transmitter ATEX Xingyulang": 330,
  "Solenoid Ex-Proof 120VAC 3way": 750,
};

const SORTED_ACCESSORIES_KEYS = Object.keys(ACCESSORIES_DB).sort((a, b) =>
  a.localeCompare(b)
);

const PRODUCTS_DB = {
  "FDV-DE0": {
    desc: "Electric Actuated, Local Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DP0": {
    desc: "Pneumatic Actuated, Local Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DC0": {
    desc: "Electro-Pneumatic Actuated, Local Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DH0": {
    desc: "Hydraulic Actuated, Local Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DA0": {
    desc: "Hydraulic + Anticolumning Actuated, Local Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DE1": {
    desc: "Electric Actuated, Remote Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-3W-DE1": {
    desc: "Electric Actuated, Remote Reset Deluge Valve (3 Way)",
    category: CATEGORIES.VALVES,
  },
  "FDV-DP1": {
    desc: "Pneumatic Actuated, Remote Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DC1": {
    desc: "Electro-Pneumatic Actuated, Remote Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-DH1": {
    desc: "Hydraulic Actuated, Remote Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-3W-DH1": {
    desc: "Hydraulic Actuated, Remote Reset Deluge Valve (3 Way)",
    category: CATEGORIES.VALVES,
  },
  "FDV-DA1": {
    desc: "Hydraulic + Anticolumning Actuated, Remote Reset Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PE0": {
    desc: "Electric Actuated, Local Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PP0": {
    desc: "Pneumatic Actuated, Local Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PC0": {
    desc: "Electro-Pneumatic Actuated, Local Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PH0": {
    desc: "Hydraulic Actuated, Local Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PA0": {
    desc: "Hydraulic + Anticolumning Actuated, Local Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PE1": {
    desc: "Electric Actuated, Remote Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PP1": {
    desc: "Pneumatic Actuated, Remote Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PC1": {
    desc: "Electro-Pneumatic Actuated, Remote Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PH1": {
    desc: "Hydraulic Actuated, Remote Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-PA1": {
    desc: "Hydraulic + Anticolumning Actuated, Remote Reset Modulating Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-AE1": {
    desc: "Electric Actuated, Remote Reset Economic Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-3W-AE1": {
    desc: "Electric Actuated, Remote Reset Economic Deluge Valve (3 Way)",
    category: CATEGORIES.VALVES,
  },
  "FDV-AP1": {
    desc: "Pneumatic Actuated, Remote Reset Economic Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-AC1": {
    desc: "Electro-Pneumatic Actuated, Remote Reset Economic Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-AH1": {
    desc: "Hydraulic Actuated, Remote Reset Economic Deluge Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-3W-AH1": {
    desc: "Hydraulic Actuated, Remote Reset Economic Deluge Valve (3 Way)",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-HH0": {
    desc: "ON/OFF Hydrant, Hydraulic Actuator",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-HHP": {
    desc: "ON/OFF Hydrant, Hydraulic & Pressure Reducing Actuator",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-MH0": {
    desc: "Monitor Hydraulic Local Control Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-MH1": {
    desc: "Monitor Hydraulic Remote Control Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-ME1": {
    desc: "Monitor Electric Remote Control Valve",
    category: CATEGORIES.VALVES,
  },
  "FPS-SIE0": {
    desc: "Single Interlock, Electric Actuator Local Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-SIP0": {
    desc: "Single Interlock, Pneumatic Actuator Local Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-SCE0": {
    desc: "Single Interlock with Pressure Reducing, Electric Actuator Local Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-SIE1": {
    desc: "Single Interlock, Electric Actuator Remote Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-SCE1": {
    desc: "Single Interlock with Pressure Reducing, Electric Actuator Remote Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-DIE0": {
    desc: "Double Interlock, Electric Actuator Local Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-DIC0": {
    desc: "Double Interlock, Electric & Pneumatic Actuator Local Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-DCE0": {
    desc: "Double Interlock with Pressure Reducing, Electric Actuator Local Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-DCE1": {
    desc: "Double Interlock with Pressure Reducing, Electric Actuator Remote Reset",
    category: CATEGORIES.VALVES,
  },
  "FPS-DIE1": {
    desc: "Double Interlock, Electric Actuator Remote Reset",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-PN2": {
    desc: "Pressure Reducing Control Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-RN2": {
    desc: "Pressure Relief Control Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-LE2": {
    desc: "Electric Level Control Valve",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-LF2": {
    desc: "Flow Level Control Valve (min/max)",
    category: CATEGORIES.VALVES,
  },
  "FDV-R-LA2": { desc: "Altitude Control Valve", category: CATEGORIES.VALVES },
};

// --- PRICES RAW DATA ---
const PRICES_STD_USD_RAW = {
  "FDV-DE0": {
    '1.5"': 2317,
    '2"': 2317,
    '3"': 2642,
    '4"': 3244,
    '6"': 4287,
    '8"': 6257,
    '10"': 7509,
  },
  "FDV-DP0": {
    '1.5"': 2422,
    '2"': 2422,
    '3"': 2746,
    '4"': 3349,
    '6"': 4392,
    '8"': 6361,
    '10"': 7612,
  },
  "FDV-DC0": {
    '1.5"': 2879,
    '2"': 2879,
    '3"': 3282,
    '4"': 4031,
    '6"': 5327,
    '8"': 7774,
    '10"': 9329,
  },
  "FDV-DH0": {
    '1.5"': 1964,
    '2"': 1964,
    '3"': 2239,
    '4"': 2749,
    '6"': 3633,
    '8"': 5302,
    '10"': 6362,
  },
  "FDV-DA0": {
    '1.5"': 2443,
    '2"': 2443,
    '3"': 2785,
    '4"': 3420,
    '6"': 4519,
    '8"': 6596,
    '10"': 7915,
  },
  "FDV-DE1": {
    '1.5"': 2011,
    '2"': 2011,
    '3"': 2293,
    '4"': 2816,
    '6"': 3721,
    '8"': 5431,
    '10"': 6517,
  },
  "FDV-3W-DE1": {
    '1.5"': 2169,
    '2"': 2169,
    '3"': 2451,
    '4"': 2974,
    '6"': 3879,
    '8"': 5588,
    '10"': 6675,
  },
  "FDV-DP1": {
    '1.5"': 2116,
    '2"': 2116,
    '3"': 2398,
    '4"': 2921,
    '6"': 3826,
    '8"': 5536,
    '10"': 6622,
  },
  "FDV-DC1": {
    '1.5"': 2571,
    '2"': 2571,
    '3"': 2930,
    '4"': 3599,
    '6"': 4756,
    '8"': 6941,
    '10"': 8329,
  },
  "FDV-DH1": {
    '1.5"': 1715,
    '2"': 1715,
    '3"': 1955,
    '4"': 2401,
    '6"': 3173,
    '8"': 4631,
    '10"': 5557,
  },
  "FDV-3W-DH1": {
    '1.5"': 1715,
    '2"': 1715,
    '3"': 1955,
    '4"': 2401,
    '6"': 3173,
    '8"': 4631,
    '10"': 5557,
  },
  "FDV-DA1": {
    '1.5"': 2137,
    '2"': 2137,
    '3"': 2436,
    '4"': 2992,
    '6"': 3954,
    '8"': 5770,
    '10"': 6925,
  },
  "FDV-PE0": {
    '1.5"': 2837,
    '2"': 2837,
    '3"': 3320,
    '4"': 3764,
    '6"': 4807,
    '8"': 6985,
    '10"': 8382,
  },
  "FDV-PP0": {
    '1.5"': 3110,
    '2"': 3110,
    '3"': 3434,
    '4"': 4037,
    '6"': 5079,
    '8"': 7257,
    '10"': 8653,
  },
  "FDV-PC0": {
    '1.5"': 3399,
    '2"': 3399,
    '3"': 3802,
    '4"': 4551,
    '6"': 5847,
    '8"': 8502,
    '10"': 10202,
  },
  "FDV-PH0": {
    '1.5"': 2483,
    '2"': 2483,
    '3"': 2758,
    '4"': 3269,
    '6"': 4152,
    '8"': 6029,
    '10"': 7235,
  },
  "FDV-PA0": {
    '1.5"': 2963,
    '2"': 2963,
    '3"': 3305,
    '4"': 3940,
    '6"': 5039,
    '8"': 7323,
    '10"': 8788,
  },
  "FDV-PE1": {
    '1.5"': 2531,
    '2"': 2531,
    '3"': 2813,
    '4"': 3336,
    '6"': 4241,
    '8"': 6159,
    '10"': 7390,
  },
  "FDV-PP1": {
    '1.5"': 2804,
    '2"': 2804,
    '3"': 3086,
    '4"': 3609,
    '6"': 4514,
    '8"': 6432,
    '10"': 7663,
  },
  "FDV-PC1": {
    '1.5"': 3090,
    '2"': 3090,
    '3"': 3450,
    '4"': 4119,
    '6"': 5275,
    '8"': 7668,
    '10"': 9202,
  },
  "FDV-PH1": {
    '1.5"': 2235,
    '2"': 2235,
    '3"': 2475,
    '4"': 2921,
    '6"': 3693,
    '8"': 5359,
    '10"': 6430,
  },
  "FDV-PA1": {
    '1.5"': 2657,
    '2"': 2657,
    '3"': 2956,
    '4"': 3512,
    '6"': 4474,
    '8"': 6498,
    '10"': 7798,
  },
  "FDV-AE1": {
    '1.5"': 1589,
    '2"': 1589,
    '3"': 1812,
    '4"': 2225,
    '6"': 3128,
    '8"': 4947,
    '10"': 5936,
  },
  "FDV-3W-AE1": {
    '1.5"': 1747,
    '2"': 1747,
    '3"': 1970,
    '4"': 2383,
    '6"': 3285,
    '8"': 5104,
    '10"': 6093,
  },
  "FDV-AP1": {
    '1.5"': 1694,
    '2"': 1694,
    '3"': 1917,
    '4"': 2330,
    '6"': 3233,
    '8"': 5052,
    '10"': 6041,
  },
  "FDV-AC1": {
    '1.5"': 2026,
    '2"': 2026,
    '3"': 2310,
    '4"': 2837,
    '6"': 3936,
    '8"': 6126,
    '10"': 7352,
  },
  "FDV-AH1": {
    '1.5"': 1384,
    '2"': 1384,
    '3"': 1577,
    '4"': 2218,
    '6"': 2747,
    '8"': 4391,
    '10"': 5269,
  },
  "FDV-3W-AH1": {
    '1.5"': 1384,
    '2"': 1384,
    '3"': 1577,
    '4"': 2218,
    '6"': 2747,
    '8"': 4391,
    '10"': 5269,
  },
  "FDV-R-HH0": { '1.5"': 1697, '2"': 1697, '3"': 1899 },
  "FDV-R-HHP": { '1.5"': 2163, '2"': 2163, '3"': 2365 },
  "FDV-R-MH0": {
    '1.5"': 1439,
    '2"': 1439,
    '3"': 1603,
    '4"': 2146,
    '6"': 2595,
    '8"': 3990,
    '10"': 4735,
    '12"': 6914,
  },
  "FDV-R-MH1": {
    '1.5"': 1552,
    '2"': 1552,
    '3"': 1716,
    '4"': 2260,
    '6"': 2709,
    '8"': 4104,
    '10"': 4849,
    '12"': 7084,
  },
  "FDV-R-ME1": {
    '1.5"': 1727,
    '2"': 1727,
    '3"': 1915,
    '4"': 2266,
    '6"': 3032,
    '8"': 4575,
    '10"': 5414,
    '12"': 7933,
  },
  "FPS-SIE0": {
    '1.5"': 3565,
    '2"': 3565,
    '3"': 3968,
    '4"': 4718,
    '6"': 6015,
    '8"': 8465,
    '10"': 10021,
  },
  "FPS-SIP0": {
    '1.5"': 3564,
    '2"': 3564,
    '3"': 3968,
    '4"': 4717,
    '6"': 6014,
    '8"': 8463,
    '10"': 10019,
  },
  "FPS-SCE0": {
    '1.5"': 4407,
    '2"': 4407,
    '3"': 4909,
    '4"': 5840,
    '6"': 7451,
    '8"': 10495,
    '10"': 12429,
  },
  "FPS-SIE1": {
    '1.5"': 3125,
    '2"': 3125,
    '3"': 3467,
    '4"': 4102,
    '6"': 5201,
    '8"': 7276,
    '10"': 8595,
  },
  "FPS-SCE1": {
    '1.5"': 3721,
    '2"': 3721,
    '3"': 4146,
    '4"': 4936,
    '6"': 6303,
    '8"': 8885,
    '10"': 10526,
  },
  "FPS-DIE0": {
    '1.5"': 3113,
    '2"': 3113,
    '3"': 3463,
    '4"': 4113,
    '6"': 5239,
    '8"': 7365,
    '10"': 8716,
  },
  "FPS-DIC0": {
    '1.5"': 3706,
    '2"': 3706,
    '3"': 4225,
    '4"': 5188,
    '6"': 6856,
    '8"': 10005,
    '10"': 12007,
  },
  "FPS-DCE0": {
    '1.5"': 3558,
    '2"': 3589,
    '3"': 3999,
    '4"': 4720,
    '6"': 6134,
    '8"': 8913,
    '10"': 10603,
  },
  "FPS-DCE1": {
    '1.5"': 3808,
    '2"': 3808,
    '3"': 4256,
    '4"': 5087,
    '6"': 6525,
    '8"': 9243,
    '10"': 10969,
  },
  "FPS-DIE1": {
    '1.5"': 2744,
    '2"': 2744,
    '3"': 3043,
    '4"': 3597,
    '6"': 4557,
    '8"': 6370,
    '10"': 7522,
  },
  "FDV-R-PN2": {
    '1.5"': 830,
    '2"': 830,
    '3"': 1213,
    '4"': 1551,
    '6"': 2904,
    '8"': 4078,
    '10"': 4894,
    '12"': 7340,
  },
  "FDV-R-RN2": {
    '1.5"': 1741,
    '2"': 1741,
    '3"': 1872,
    '4"': 2128,
    '6"': 3725,
    '8"': 5001,
    '10"': 5925,
    '12"': 8699,
  },
  "FDV-R-LE2": {
    '1.5"': 1238,
    '2"': 1238,
    '3"': 1611,
    '4"': 1999,
    '6"': 3355,
    '8"': 4275,
    '10"': 5055,
    '12"': 7393,
  },
  "FDV-R-LF2": {
    '1.5"': 2532,
    '2"': 2532,
    '3"': 2733,
    '4"': 2972,
    '6"': 4381,
    '8"': 5276,
    '10"': 6079,
    '12"': 8489,
  },
  "FDV-R-LA2": {
    '1.5"': 3020,
    '2"': 3020,
    '3"': 3224,
    '4"': 3939,
    '6"': 4708,
    '8"': 5999,
    '10"': 6946,
    '12"': 9790,
  },
};

const PRICES_HG_EUR_RAW = {
  "FDV-DE0": {
    '1.5"': 2616,
    '2"': 2616,
    '3"': 2934,
    '4"': 3526,
    '6"': 4550,
    '8"': 6484,
    '10"': 7712,
  },
  "FDV-DP0": {
    '1.5"': 2710,
    '2"': 2710,
    '3"': 3028,
    '4"': 3620,
    '6"': 4643,
    '8"': 6577,
    '10"': 7805,
  },
  "FDV-DC0": {
    '1.5"': 3281,
    '2"': 3281,
    '3"': 3676,
    '4"': 4411,
    '6"': 5684,
    '8"': 8086,
    '10"': 9613,
  },
  "FDV-DH0": {
    '1.5"': 2268,
    '2"': 2268,
    '3"': 2538,
    '4"': 3039,
    '6"': 3907,
    '8"': 5546,
    '10"': 6587,
  },
  "FDV-DA0": {
    '1.5"': 2739,
    '2"': 2739,
    '3"': 3074,
    '4"': 3698,
    '6"': 4777,
    '8"': 6816,
    '10"': 8111,
  },
  "FDV-DE1": {
    '1.5"': 2258,
    '2"': 2258,
    '3"': 2535,
    '4"': 3048,
    '6"': 3937,
    '8"': 5616,
    '10"': 6682,
  },
  "FDV-3W-DE1": {
    '1.5"': 2400,
    '2"': 2400,
    '3"': 2677,
    '4"': 3190,
    '6"': 4079,
    '8"': 5757,
    '10"': 6824,
  },
  "FDV-DP1": {
    '1.5"': 2353,
    '2"': 2353,
    '3"': 2629,
    '4"': 3143,
    '6"': 4031,
    '8"': 5710,
    '10"': 6777,
  },
  "FDV-DC1": {
    '1.5"': 2807,
    '2"': 2807,
    '3"': 3161,
    '4"': 3817,
    '6"': 4953,
    '8"': 7098,
    '10"': 8461,
  },
  "FDV-DH1": {
    '1.5"': 1967,
    '2"': 1967,
    '3"': 2203,
    '4"': 2641,
    '6"': 3399,
    '8"': 4830,
    '10"': 5740,
  },
  "FDV-3W-DH1": {
    '1.5"': 1967,
    '2"': 1967,
    '3"': 2203,
    '4"': 2641,
    '6"': 3399,
    '8"': 4830,
    '10"': 5740,
  },
  "FDV-DA1": {
    '1.5"': 2382,
    '2"': 2382,
    '3"': 2676,
    '4"': 3221,
    '6"': 4165,
    '8"': 5949,
    '10"': 7082,
  },
  "FDV-PE0": {
    '1.5"': 3126,
    '2"': 3126,
    '3"': 3617,
    '4"': 4036,
    '6"': 5060,
    '8"': 7198,
    '10"': 8570,
  },
  "FDV-PP0": {
    '1.5"': 3371,
    '2"': 3371,
    '3"': 3690,
    '4"': 4281,
    '6"': 5305,
    '8"': 7443,
    '10"': 8814,
  },
  "FDV-PC0": {
    '1.5"': 3791,
    '2"': 3791,
    '3"': 4187,
    '4"': 4922,
    '6"': 6194,
    '8"': 8801,
    '10"': 10470,
  },
  "FDV-PH0": {
    '1.5"': 2778,
    '2"': 2778,
    '3"': 3048,
    '4"': 3550,
    '6"': 4417,
    '8"': 6260,
    '10"': 7444,
  },
  "FDV-PA0": {
    '1.5"': 3249,
    '2"': 3249,
    '3"': 3585,
    '4"': 4208,
    '6"': 5288,
    '8"': 7530,
    '10"': 8968,
  },
  "FDV-PE1": {
    '1.5"': 2769,
    '2"': 2769,
    '3"': 3045,
    '4"': 3559,
    '6"': 4447,
    '8"': 6330,
    '10"': 7539,
  },
  "FDV-PP1": {
    '1.5"': 3014,
    '2"': 3014,
    '3"': 3291,
    '4"': 3804,
    '6"': 4693,
    '8"': 6576,
    '10"': 7785,
  },
  "FDV-PC1": {
    '1.5"': 3318,
    '2"': 3318,
    '3"': 3671,
    '4"': 4327,
    '6"': 5463,
    '8"': 7812,
    '10"': 9318,
  },
  "FDV-PH1": {
    '1.5"': 2478,
    '2"': 2478,
    '3"': 2714,
    '4"': 3151,
    '6"': 3909,
    '8"': 5545,
    '10"': 6597,
  },
  "FDV-PA1": {
    '1.5"': 2892,
    '2"': 2892,
    '3"': 3186,
    '4"': 3731,
    '6"': 4676,
    '8"': 6663,
    '10"': 7939,
  },
  "FDV-AE1": {
    '1.5"': 1901,
    '2"': 1901,
    '3"': 2119,
    '4"': 2525,
    '6"': 3411,
    '8"': 5197,
    '10"': 6168,
  },
  "FDV-3W-AE1": {
    '1.5"': 2043,
    '2"': 2043,
    '3"': 2261,
    '4"': 2667,
    '6"': 3553,
    '8"': 5339,
    '10"': 6310,
  },
  "FDV-AP1": {
    '1.5"': 1995,
    '2"': 1995,
    '3"': 2214,
    '4"': 2620,
    '6"': 3506,
    '8"': 5291,
    '10"': 6263,
  },
  "FDV-AC1": {
    '1.5"': 2330,
    '2"': 2330,
    '3"': 2608,
    '4"': 3126,
    '6"': 4205,
    '8"': 6355,
    '10"': 7558,
  },
  "FDV-AH1": {
    '1.5"': 1699,
    '2"': 1699,
    '3"': 1889,
    '4"': 2518,
    '6"': 3037,
    '8"': 4651,
    '10"': 5513,
  },
  "FDV-3W-AH1": {
    '1.5"': 1699,
    '2"': 1699,
    '3"': 1889,
    '4"': 2518,
    '6"': 3037,
    '8"': 4651,
    '10"': 5513,
  },
  "FDV-R-HH0": { '1.5"': 1527, '2"': 1527, '2.5"': 1709 },
  "FDV-R-HHP": { '1.5"': 1947, '2"': 1947, '2.5"': 2129 },
  "FDV-R-MH0": {
    '1.5"': 1295,
    '2"': 1295,
    '3"': 1443,
    '4"': 1932,
    '6"': 2336,
    '8"': 3591,
    '10"': 4262,
    '12"': 6222,
  },
  "FDV-R-MH1": {
    '1.5"': 1397,
    '2"': 1397,
    '3"': 1545,
    '4"': 2034,
    '6"': 2438,
    '8"': 3693,
    '10"': 4364,
    '12"': 6376,
  },
  "FDV-R-ME1": {
    '1.5"': 1554,
    '2"': 1554,
    '3"': 1724,
    '4"': 2040,
    '6"': 2729,
    '8"': 4118,
    '10"': 4873,
    '12"': 7139,
  },
  "FPS-SIE0": {
    '1.5"': 3208,
    '2"': 3208,
    '3"': 3572,
    '4"': 4246,
    '6"': 5413,
    '8"': 7618,
    '10"': 9019,
  },
  "FPS-SIP0": {
    '1.5"': 3208,
    '2"': 3208,
    '3"': 3571,
    '4"': 4245,
    '6"': 5412,
    '8"': 7617,
    '10"': 9017,
  },
  "FPS-SCE0": {
    '1.5"': 3967,
    '2"': 3967,
    '3"': 4418,
    '4"': 5256,
    '6"': 6706,
    '8"': 9445,
    '10"': 11186,
  },
  "FPS-SIE1": {
    '1.5"': 2812,
    '2"': 2812,
    '3"': 3120,
    '4"': 3692,
    '6"': 4861,
    '8"': 6549,
    '10"': 7736,
  },
  "FPS-SCE1": {
    '1.5"': 3349,
    '2"': 3349,
    '3"': 3732,
    '4"': 4442,
    '6"': 5673,
    '8"': 7997,
    '10"': 9473,
  },
  "FPS-DIE0": {
    '1.5"': 2801,
    '2"': 2801,
    '3"': 3117,
    '4"': 3702,
    '6"': 4715,
    '8"': 6629,
    '10"': 7844,
  },
  "FPS-DIC0": {
    '1.5"': 3335,
    '2"': 3335,
    '3"': 3802,
    '4"': 4669,
    '6"': 6170,
    '8"': 9005,
    '10"': 10806,
  },
  "FPS-DCE0": {
    '1.5"': 3202,
    '2"': 3230,
    '3"': 3600,
    '4"': 4248,
    '6"': 5520,
    '8"': 8021,
    '10"': 9543,
  },
  "FPS-DCE1": {
    '1.5"': 3427,
    '2"': 3427,
    '3"': 3830,
    '4"': 4578,
    '6"': 5873,
    '8"': 8318,
    '10"': 9872,
  },
  "FPS-DIE1": {
    '1.5"': 2470,
    '2"': 2470,
    '3"': 2739,
    '4"': 3238,
    '6"': 4102,
    '8"': 5733,
    '10"': 6770,
  },
  "FDV-R-PN2": {
    '1.5"': 1155,
    '2"': 1155,
    '3"': 1531,
    '4"': 1863,
    '6"': 3192,
    '8"': 4344,
    '10"': 5145,
    '12"': 7547,
  },
  "FDV-R-RN2": {
    '1.5"': 1567,
    '2"': 1567,
    '3"': 1685,
    '4"': 1915,
    '6"': 3352,
    '8"': 4501,
    '10"': 5333,
    '12"': 7829,
  },
  "FDV-R-LE2": {
    '1.5"': 1115,
    '2"': 1115,
    '3"': 1450,
    '4"': 1799,
    '6"': 3020,
    '8"': 3848,
    '10"': 4549,
    '12"': 6654,
  },
  "FDV-R-LF2": {
    '1.5"': 2279,
    '2"': 2279,
    '3"': 2460,
    '4"': 2675,
    '6"': 3943,
    '8"': 4748,
    '10"': 5471,
    '12"': 7640,
  },
  "FDV-R-LA2": {
    '1.5"': 2718,
    '2"': 2718,
    '3"': 2902,
    '4"': 3545,
    '6"': 4238,
    '8"': 5399,
    '10"': 6252,
    '12"': 8811,
  },
};

// --- 3. PROCESSED DATA (Moved AFTER raw data) ---

const PRICES_STD_USD = addSize2_5(PRICES_STD_USD_RAW);
const PRICES_HG_USD = addSize2_5(PRICES_HG_USD_RAW);
const PRICES_STD_EUR = addSize2_5(PRICES_STD_EUR_RAW);
const PRICES_HG_EUR = addSize2_5(PRICES_HG_EUR_RAW);

// --- 4. COMPONENT ---

const BODY_MATERIAL_ADDONS = {
  "Ductile Iron": {},
  "Cast Steel": {
    '1.5"': 183,
    '2"': 262,
    '2.5"': 333,
    '3"': 378,
    '4"': 624,
    '6"': 1180,
    '8"': 1980,
    '10"': 3790,
  },
  "ST. St.": {
    '1.5"': 328,
    '2"': 401,
    '2.5"': 855,
    '3"': 969,
    '4"': 1452,
    '6"': 2250,
    '8"': 3840,
    '10"': 7430,
  },
  "Ni Al Bz": {
    '1.5"': 528,
    '2"': 806,
    '2.5"': 1647,
    '3"': 1867,
    '4"': 2148,
    '6"': 3514,
    '8"': 6090,
    '10"': 12790,
  },
};

const OPTIONS = {
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

export default function QuotationApp() {
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem("RAPHAEL_QUOTATION_DATA");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Local Storage Error", e);
      return null;
    }
  };

  const loadSavedCustomers = () => {
    try {
      const saved = localStorage.getItem("RAPHAEL_CUSTOMERS");
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch (e) {
      console.error("Local Storage Customers Error", e);
      return INITIAL_CUSTOMERS;
    }
  };

  const saved = loadSavedData();

  const [items, setItems] = useState(saved?.items || []);
  const [salesPerson, setSalesPerson] = useState(
    saved?.salesPerson || "RAN LUTZKY"
  );
  const [cust, setCust] = useState(
    saved?.cust || {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      defaultDiscount: 55,
    }
  );
  const [customerList, setCustomerList] = useState(loadSavedCustomers());
  const [currency, setCurrency] = useState(saved?.currency || "USD");
  const [ref, setRef] = useState("");
  const [refSuffix, setRefSuffix] = useState(saved?.refSuffix || 1);
  const [includePacking, setIncludePacking] = useState(
    saved?.includePacking ?? true
  );

  const [terms, setTerms] = useState(
    saved?.terms || {
      payment: "AS USUAL",
      delivery: "EXW",
      leadTime: "6-8 weeks",
      validity: "30 Days",
    }
  );

  useEffect(() => {
    const dataToSave = {
      items,
      cust,
      salesPerson,
      currency,
      terms,
      refSuffix,
      includePacking,
    };
    localStorage.setItem("RAPHAEL_QUOTATION_DATA", JSON.stringify(dataToSave));
  }, [items, cust, salesPerson, currency, terms, refSuffix, includePacking]);

  const saveCustomerToList = (customerName) => {
    if (!customerName) return;
    const trimmedName = customerName.trim();
    if (trimmedName && !customerList.includes(trimmedName)) {
      const newList = [...customerList, trimmedName].sort((a, b) =>
        a.localeCompare(b)
      );
      setCustomerList(newList);
      localStorage.setItem("RAPHAEL_CUSTOMERS", JSON.stringify(newList));
    }
  };

  useEffect(() => {
    let initials = "XX";
    if (salesPerson === "RAN LUTZKY") initials = "RL";
    else if (salesPerson === "TAL FISHBHIN") initials = "TF";
    else if (salesPerson === "OGENIA ARBITMAN") initials = "OA";
    else if (salesPerson === "OHAD LEV") initials = "OL";
    else initials = "FP";

    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(2);
    const dateStr = `${day}${month}${year}`;
    const suffixNum = refSuffix === 1 ? "01" : String((refSuffix - 1) * 11);
    setRef(`${initials}${dateStr}${suffixNum}`);
  }, [salesPerson, refSuffix]);

  const cycleRefSuffix = () => setRefSuffix((prev) => prev + 1);

  const addItem = (category) => {
    const initialDiscount =
      category === CATEGORIES.VALVES ? cust.defaultDiscount : 0;
    const newItem = {
      id: Date.now(),
      category,
      code: "",
      size: "",
      qty: 1,
      discount: initialDiscount,
      bodyMat: "",
      trimMat: "Copper/Brass", // Default value for new items
      connType: "",
      isIncluded: false, // Default
      isEditing: false, // Default
      customDesc: "",
      customPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const applyGlobalDiscount = () => {
    const updatedItems = items.map((item) => ({
      ...item,
      discount: cust.defaultDiscount,
    }));
    setItems(updatedItems);
  };

  const handleCleanAll = () => {
    if (window.confirm("Are you sure you want to clear all fields?")) {
      setItems([]);
      setCust({
        name: "",
        contactName: "",
        email: "",
        phone: "",
        defaultDiscount: 55,
      });
      setTerms({
        payment: "AS USUAL",
        delivery: "EXW",
        leadTime: "6-8 weeks",
        validity: "30 Days",
      });
      setIncludePacking(true);
      localStorage.removeItem("RAPHAEL_QUOTATION_DATA");
    }
  };

  const calculateRow = (item) => {
    // Manually edited price overrides calculation
    if (item.customPrice && item.customPrice > 0) {
      return {
        basePrice: item.customPrice,
        unitPrice: item.customPrice,
        total: item.customPrice * (item.qty || 1),
        bodyAdder: 0,
        trimAdder: 0,
      };
    }

    if (item.category === CATEGORIES.FREE_TEXT) {
      const unitPrice = parseFloat(item.price) || 0;
      return {
        basePrice: unitPrice,
        unitPrice: unitPrice,
        total: unitPrice * (item.qty || 1),
        bodyAdder: 0,
        trimAdder: 0,
      };
    }

    if (item.category === CATEGORIES.VALVES) {
      if (!item.code || !item.size)
        return { basePrice: 0, unitPrice: 0, total: 0 };

      // -- HG TRIM AUTOMATION LOGIC --
      let isHG = false;
      let isSeaWater = false;

      // Safety check for trimMat (handle old data)
      const currentTrim = item.trimMat || "Copper/Brass";

      if (currentTrim === "Full Sea Water Trim") {
        isSeaWater = true;
      } else if (currentTrim !== "Copper/Brass") {
        isHG = true;
      }

      let basePriceTable;
      if (currency === "USD") {
        basePriceTable = isHG ? PRICES_HG_USD : PRICES_STD_USD;
      } else {
        basePriceTable = isHG ? PRICES_HG_EUR : PRICES_STD_EUR;
      }

      const basePrice = basePriceTable?.[item.code]?.[item.size] || 0;
      const discountAmount = basePrice * (item.discount / 100);
      const discountedBase = basePrice - discountAmount;

      const bodyAdder = item.bodyMat
        ? BODY_MATERIAL_ADDONS[item.bodyMat]?.[item.size] || 0
        : 0;
      const trimAdder = isSeaWater ? 10000 : 0;

      const unitPrice = discountedBase + bodyAdder + trimAdder;
      return {
        basePrice,
        unitPrice,
        total: unitPrice * (item.qty || 1),
        bodyAdder,
        trimAdder,
      };
    } else if (
      item.category === CATEGORIES.ACCESSORIES ||
      item.category === CATEGORIES.DIAPHRAGMS
    ) {
      let db =
        item.category === CATEGORIES.ACCESSORIES
          ? ACCESSORIES_DB
          : DIAPHRAGMS_DB;
      const basePrice = db[item.code] || 0;
      const unitPrice = basePrice - basePrice * (item.discount / 100);
      return {
        basePrice,
        unitPrice,
        total: unitPrice * (item.qty || 1),
        bodyAdder: 0,
        trimAdder: 0,
      };
    } else if (item.category === CATEGORIES.SPARE_PARTS) {
      const baseAccessoryPrice = ACCESSORIES_DB[item.code] || 0;
      const basePrice = baseAccessoryPrice * 1.5;
      const unitPrice = basePrice - basePrice * (item.discount / 100);
      return {
        basePrice,
        unitPrice,
        total: unitPrice * (item.qty || 1),
        bodyAdder: 0,
        trimAdder: 0,
      };
    }
    return { basePrice: 0, total: 0 };
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleInclude = (id) => {
    setItems((currentItems) => {
      const index = currentItems.findIndex((i) => i.id === id);
      if (index === -1) return currentItems;

      const item = currentItems[index];
      const newStatus = !item.isIncluded; // Toggle

      // Check if there is a valve above
      if (newStatus) {
        let valveFound = false;
        for (let i = index - 1; i >= 0; i--) {
          if (currentItems[i].category === CATEGORIES.VALVES) {
            valveFound = true;
            break;
          }
        }
        if (!valveFound) {
          alert("No valve selected above this item! Please add a valve first.");
          return currentItems;
        }
      }

      return currentItems.map((i) =>
        i.id === id ? { ...i, isIncluded: newStatus } : i
      );
    });
  };

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const subTotal = items.reduce(
    (sum, item) => sum + calculateRow(item).total,
    0
  );
  const packingCost = includePacking ? subTotal * 0.035 : 0;
  const grandTotal = subTotal + packingCost;
  const currencySymbol = currency === "USD" ? "$" : "€";

  // --- Export Logic Helper ---
  const getExportData = () => {
    const exportItems = [];
    let lastValveIndex = -1;

    items.forEach((item) => {
      const financials = calculateRow(item);
      let desc = item.customDesc || item.code;

      // Generate default description if no custom override
      if (!item.customDesc) {
        if (item.category === CATEGORIES.VALVES) {
          desc = PRODUCTS_DB[item.code]?.desc || item.code;
          if (item.bodyMat) desc += `; Body: ${item.bodyMat}`;
          if (item.trimMat) desc += `; Trim: ${item.trimMat}`;
          if (item.connType) desc += `; Connection: ${item.connType}`;
        } else if (item.category === CATEGORIES.FREE_TEXT) {
          desc = item.description || "";
        }
      }

      if (
        item.isIncluded &&
        item.category !== CATEGORIES.VALVES &&
        lastValveIndex !== -1
      ) {
        // Merge into the last valve
        const valveItem = exportItems[lastValveIndex];
        valveItem.totalPrice += financials.total; // Add total price
        valveItem.desc += ` + ${desc} (Qty: ${item.qty})`; // Append description
      } else {
        // Add as new row
        const newItem = {
          ...item,
          desc: desc,
          unitPrice: financials.unitPrice,
          totalPrice: financials.total,
        };
        exportItems.push(newItem);
        if (item.category === CATEGORIES.VALVES) {
          lastValveIndex = exportItems.length - 1;
        }
      }
    });
    return exportItems;
  };

  const handleExportPDF = () => {
    saveCustomerToList(cust.name);
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = "/raphael_logo_final.png";
    doc.setFont("helvetica", "normal");

    const generate = () => {
      if (logoImg.complete && logoImg.naturalHeight !== 0) {
        doc.addImage(logoImg, "PNG", 14, 10, 50, 15);
      }
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("COMMERCIAL QUOTATION", 14, 35);
      const dateStr = getFormattedDate();
      doc.text(`Date: ${dateStr}`, 140, 35);
      doc.text(`Reference: ${ref}`, 140, 40);
      doc.text(`Attn: ${cust.contactName}`, 14, 45);
      doc.text(`Company: ${cust.name}`, 14, 50);

      const exportItems = getExportData();

      const tableBody = exportItems.map((item, index) => {
        return [
          index + 1,
          item.code,
          item.desc,
          item.size || "-",
          item.qty,
          formatCurrency(item.unitPrice),
          formatCurrency(item.totalPrice),
        ];
      });

      const tableFoot = [
        [
          "",
          "",
          "",
          "",
          "",
          "Subtotal:",
          `${currencySymbol}${formatCurrency(subTotal, "")}`,
        ],
      ];
      if (packingCost > 0) {
        tableFoot.push([
          "",
          "",
          "",
          "",
          "",
          "Packing & Handling (3.5%):",
          `${currencySymbol}${formatCurrency(packingCost, "")}`,
        ]);
      }
      tableFoot.push([
        "",
        "",
        "",
        "",
        "",
        "GRAND TOTAL:",
        `${currencySymbol}${formatCurrency(grandTotal, "")}`,
      ]);

      autoTable(doc, {
        startY: 60,
        head: [
          [
            "No",
            "Model",
            "Description",
            "DN",
            "Qty",
            `Unit Price (${currencySymbol})`,
            `Total (${currencySymbol})`,
          ],
        ],
        body: tableBody,
        foot: tableFoot,
        theme: "striped",
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: {
          fontSize: 9,
          textColor: [0, 0, 0],
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          cellPadding: 4,
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 60 },
        },
        footStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        margin: { top: 20 },
      });

      let finalY = doc.lastAutoTable.finalY + 15;
      if (finalY > 220) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Commercial Terms:", 14, finalY);
      doc.setFont("helvetica", "normal");
      finalY += 5;
      doc.setFontSize(9);
      doc.text(`Payment: ${terms.payment}`, 14, finalY);
      doc.text(`Delivery: ${terms.delivery}`, 80, finalY);
      finalY += 5;
      doc.text(`Lead time: ${terms.leadTime}`, 14, finalY);
      doc.text(`Validity: ${terms.validity}`, 80, finalY);
      finalY += 20;
      doc.text("Sincerely,", 14, finalY);
      finalY += 10;
      const signer = SIGNATURES[salesPerson] || SIGNATURES["OTHER"];
      doc.setTextColor(0, 51, 102);
      doc.setFont("helvetica", "bold");
      doc.text(signer.name || "Sales Manager", 14, finalY);
      doc.setFont("helvetica", "normal");
      finalY += 5;
      doc.text(signer.title, 14, finalY);
      finalY += 5;
      doc.text(signer.region, 14, finalY);
      if (signer.phone) {
        finalY += 5;
        doc.text(`Phone: ${signer.phone}`, 14, finalY);
      }
      if (signer.email) {
        finalY += 5;
        doc.text(`Email: ${signer.email}`, 14, finalY);
      }

      doc.save(`Quotation_${ref}.pdf`);
    };
    logoImg.onload = generate;
    logoImg.onerror = generate;
  };

  const handleExportExcel = () => {
    saveCustomerToList(cust.name);
    const wsData = [];
    wsData.push(["RAPHAEL VALVES QUOTATION"]);
    wsData.push([]);
    wsData.push(["Date:", new Date().toLocaleDateString(), "Reference:", ref]);
    wsData.push(["Attn:", cust.contactName, "Company:", cust.name]);
    wsData.push(["Prepared By:", salesPerson]);
    wsData.push([]);
    wsData.push([
      "No",
      "Code",
      "Description",
      "DN",
      "Qty",
      `Unit Price (${currencySymbol})`,
      `Total (${currencySymbol})`,
    ]);

    const exportItems = getExportData();
    exportItems.forEach((item, index) => {
      wsData.push([
        index + 1,
        item.code,
        item.desc,
        item.size || "-",
        item.qty,
        item.unitPrice,
        item.totalPrice,
      ]);
    });

    wsData.push([]);
    wsData.push(["", "", "", "", "Subtotal:", subTotal]);
    if (includePacking) {
      wsData.push(["", "", "", "", "Packing (3.5%):", packingCost]);
    }
    wsData.push(["", "", "", "", "GRAND TOTAL:", grandTotal]);
    wsData.push([]);
    wsData.push(["Commercial Terms"]);
    wsData.push(["Payment:", terms.payment]);
    wsData.push(["Delivery:", terms.delivery]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quotation");
    XLSX.writeFile(wb, `Quotation_${ref}.xlsx`);
  };

  const handleSmartSave = async () => {
    if (!("showDirectoryPicker" in window)) {
      alert(
        "Browser does not support folder access. Use Chrome or Edge on Desktop."
      );
      return;
    }
    saveCustomerToList(cust.name);
    try {
      const dirHandle = await window.showDirectoryPicker();

      const wsData = [];
      wsData.push(["RAPHAEL VALVES QUOTATION"]);
      wsData.push([]);
      wsData.push([
        "Date:",
        new Date().toLocaleDateString(),
        "Reference:",
        ref,
      ]);
      wsData.push(["Attn:", cust.contactName, "Company:", cust.name]);
      wsData.push(["Prepared By:", salesPerson]);
      wsData.push([]);
      wsData.push([
        "No",
        "Code",
        "Description",
        "DN",
        "Qty",
        `Unit Price (${currencySymbol})`,
        `Total (${currencySymbol})`,
      ]);

      const exportItems = getExportData();
      exportItems.forEach((item, index) => {
        wsData.push([
          index + 1,
          item.code,
          item.desc,
          item.size || "-",
          item.qty,
          item.unitPrice,
          item.totalPrice,
        ]);
      });

      wsData.push([]);
      wsData.push(["", "", "", "", "Subtotal:", subTotal]);
      if (includePacking)
        wsData.push(["", "", "", "", "Packing (3.5%):", packingCost]);
      wsData.push(["", "", "", "", "GRAND TOTAL:", grandTotal]);
      wsData.push([]);
      wsData.push(["Commercial Terms"]);
      wsData.push(["Payment:", terms.payment]);
      wsData.push(["Delivery:", terms.delivery]);

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Quotation");
      const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const excelBlob = new Blob([wbOut], { type: "application/octet-stream" });

      const pdfBlob = await new Promise((resolve) => {
        const doc = new jsPDF();
        const logoImg = new Image();
        logoImg.src = "/raphael_logo_final.png";
        doc.setFont("helvetica", "normal");
        const generatePDFContent = () => {
          if (logoImg.complete && logoImg.naturalHeight !== 0)
            doc.addImage(logoImg, "PNG", 14, 10, 50, 15);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text("COMMERCIAL QUOTATION", 14, 35);
          const dateStr = getFormattedDate();
          doc.text(`Date: ${dateStr}`, 140, 35);
          doc.text(`Reference: ${ref}`, 140, 40);
          doc.text(`Attn: ${cust.contactName}`, 14, 45);
          doc.text(`Company: ${cust.name}`, 14, 50);

          const tableBody = exportItems.map((item, index) => {
            return [
              index + 1,
              item.code,
              item.desc,
              item.size || "-",
              item.qty,
              formatCurrency(item.unitPrice),
              formatCurrency(item.totalPrice),
            ];
          });

          const tableFoot = [
            [
              "",
              "",
              "",
              "",
              "",
              "Subtotal:",
              `${currencySymbol}${formatCurrency(subTotal, "")}`,
            ],
          ];
          if (packingCost > 0)
            tableFoot.push([
              "",
              "",
              "",
              "",
              "",
              "Packing:",
              `${currencySymbol}${formatCurrency(packingCost, "")}`,
            ]);
          tableFoot.push([
            "",
            "",
            "",
            "",
            "",
            "GRAND TOTAL:",
            `${currencySymbol}${formatCurrency(grandTotal, "")}`,
          ]);

          autoTable(doc, {
            startY: 60,
            head: [
              [
                "No",
                "Model",
                "Description",
                "DN",
                "Qty",
                `Unit Price (${currencySymbol})`,
                `Total (${currencySymbol})`,
              ],
            ],
            body: tableBody,
            foot: tableFoot,
            theme: "striped",
            headStyles: {
              fillColor: [0, 51, 102],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: {
              fontSize: 9,
              textColor: [0, 0, 0],
              lineColor: [200, 200, 200],
              lineWidth: 0.1,
              cellPadding: 4,
            },
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 25 },
              2: { cellWidth: 60 },
            },
            footStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: "bold",
              lineColor: [200, 200, 200],
              lineWidth: 0.1,
            },
            margin: { top: 20 },
          });

          let finalY = doc.lastAutoTable.finalY + 15;
          if (finalY > 220) {
            doc.addPage();
            finalY = 20;
          }
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "bold");
          doc.text("Commercial Terms:", 14, finalY);
          doc.setFont("helvetica", "normal");
          finalY += 5;
          doc.setFontSize(9);
          doc.text(`Payment: ${terms.payment}`, 14, finalY);
          doc.text(`Delivery: ${terms.delivery}`, 80, finalY);
          finalY += 5;
          doc.text(`Lead time: ${terms.leadTime}`, 14, finalY);
          doc.text(`Validity: ${terms.validity}`, 80, finalY);
          finalY += 20;
          doc.text("Sincerely,", 14, finalY);
          finalY += 10;
          const signer = SIGNATURES[salesPerson] || SIGNATURES["OTHER"];
          doc.setTextColor(0, 51, 102);
          doc.setFont("helvetica", "bold");
          doc.text(signer.name || "Sales Manager", 14, finalY);
          doc.setFont("helvetica", "normal");
          finalY += 5;
          doc.text(signer.title, 14, finalY);
          finalY += 5;
          doc.text(signer.region, 14, finalY);
          if (signer.phone) {
            finalY += 5;
            doc.text(`Phone: ${signer.phone}`, 14, finalY);
          }
          if (signer.email) {
            finalY += 5;
            doc.text(`Email: ${signer.email}`, 14, finalY);
          }
          resolve(doc.output("blob"));
        };
        logoImg.onload = generatePDFContent;
        logoImg.onerror = generatePDFContent;
      });

      const pdfFileHandle = await dirHandle.getFileHandle(
        `Quotation_${ref}.pdf`,
        { create: true }
      );
      const pdfWritable = await pdfFileHandle.createWritable();
      await pdfWritable.write(pdfBlob);
      await pdfWritable.close();

      const excelFileHandle = await dirHandle.getFileHandle(
        `Quotation_${ref}.xlsx`,
        { create: true }
      );
      const excelWritable = await excelFileHandle.createWritable();
      await excelWritable.write(excelBlob);
      await excelWritable.close();

      alert("Files Saved Successfully!");
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        alert("Error saving files.");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-2 md:p-8 font-sans text-gray-900"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <img
              src="/raphael_logo_final.png"
              alt="Raphael Valves Logo"
              className="h-12 w-auto mb-4 object-contain bg-white rounded p-1"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <h1 className="text-2xl md:text-3xl font-bold uppercase text-center md:text-left">
              RAPHAEL VALVES QUOTATION FORM
            </h1>
            <div className="flex flex-col gap-2 mt-2 bg-blue-800 p-2 rounded w-full md:w-auto">
              <div className="flex items-center gap-2 justify-between md:justify-start">
                <span className="text-blue-200 text-xs">Ref:</span>
                <span className="font-mono font-bold text-white">{ref}</span>
                <button
                  onClick={cycleRefSuffix}
                  className="bg-blue-600 hover:bg-blue-500 px-2 py-0.5 rounded text-[10px]"
                >
                  + ID
                </button>
              </div>
              <div className="flex items-center gap-2 justify-between md:justify-start">
                <span className="text-blue-200 text-xs">Prepared By:</span>
                <select
                  className="text-black text-xs rounded p-1"
                  value={salesPerson}
                  onChange={(e) => setSalesPerson(e.target.value)}
                >
                  {SALES_PEOPLE.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="text-right w-full flex justify-between md:block">
              <label className="block text-xs text-blue-200">Currency</label>
              <select
                className="text-black rounded px-2 py-1 text-sm font-bold"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto items-end">
              <div className="flex gap-2 w-full justify-center md:justify-end">
                <button
                  onClick={handleExportPDF}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded shadow text-sm flex-1 md:flex-none"
                >
                  Export PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded shadow text-sm flex-1 md:flex-none"
                >
                  Export Excel
                </button>
              </div>
              <button
                onClick={handleSmartSave}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-1 px-4 rounded shadow text-xs border border-blue-900/20"
              >
                Save Both to Folder (Browse...)
              </button>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 md:p-6 bg-gray-100 border-b">
          <h3 className="text-sm font-bold text-black mb-3 uppercase">
            Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] text-gray-500">
                Company Name
              </label>
              <input
                list="customers-list"
                className="w-full p-2 border rounded text-black"
                value={cust.name}
                onChange={(e) => setCust({ ...cust, name: e.target.value })}
                placeholder="Type or Select..."
              />
              <datalist id="customers-list">
                {customerList.map((customer, idx) => (
                  <option key={idx} value={customer} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500">
                Contact Person (Attn)
              </label>
              <input
                className="w-full p-2 border rounded text-black"
                value={cust.contactName}
                onChange={(e) =>
                  setCust({ ...cust, contactName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500">Email</label>
              <input
                className="w-full p-2 border rounded text-black"
                value={cust.email}
                onChange={(e) => setCust({ ...cust, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500">Phone</label>
              <input
                className="w-full p-2 border rounded text-black"
                value={cust.phone}
                onChange={(e) => setCust({ ...cust, phone: e.target.value })}
              />
            </div>
            <div className="bg-white p-2 rounded border border-blue-200 shadow-sm">
              <label className="block text-[10px] text-blue-600 font-bold mb-1">
                Global Discount %
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="p-1 border rounded w-16 font-bold text-blue-900 text-center"
                  value={cust.defaultDiscount}
                  onChange={(e) =>
                    setCust({
                      ...cust,
                      defaultDiscount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <button
                  onClick={applyGlobalDiscount}
                  className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-b">
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4">
            <button
              onClick={() => addItem(CATEGORIES.VALVES)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded shadow flex items-center justify-center gap-1 text-xs md:text-sm"
            >
              <span>+ Add Valve</span>
            </button>
            <button
              onClick={() => addItem(CATEGORIES.ACCESSORIES)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow text-xs md:text-sm"
            >
              + Add Accessory
            </button>
            <button
              onClick={() => addItem(CATEGORIES.SPARE_PARTS)}
              className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-2 rounded shadow text-xs md:text-sm"
            >
              + Add Spare Part
            </button>
            <button
              onClick={() => addItem(CATEGORIES.DIAPHRAGMS)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded shadow text-xs md:text-sm"
            >
              + Add Diaphragm
            </button>
            <button
              onClick={() => addItem(CATEGORIES.FREE_TEXT)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded shadow text-xs md:text-sm col-span-2 md:col-span-1"
            >
              + Add Free Text
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-2 md:p-6 overflow-x-auto min-h-[400px]">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Start by adding items from the menu above
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead className="text-xs text-black uppercase bg-gray-200">
                <tr>
                  <th className="px-2 py-3 border-b border-gray-300 w-20">
                    Type
                  </th>
                  <th className="px-2 py-3 border-b border-gray-300">
                    Description / Specs
                  </th>
                  <th className="px-2 py-3 border-b border-gray-300 w-24 text-center">
                    Size
                  </th>
                  <th className="px-2 py-3 border-b border-gray-300 w-20 text-center">
                    Qty
                  </th>

                  {/* CHANGED COLUMN HEADER */}
                  <th className="px-2 py-3 border-b border-gray-300 w-16 text-center">
                    Include
                  </th>

                  <th className="px-2 py-3 border-b border-gray-300 w-28 text-right bg-blue-50">
                    Unitary Price
                    <br />
                    <span className="text-[9px] font-normal lowercase">
                      (Net)
                    </span>
                  </th>
                  <th className="px-2 py-3 border-b border-gray-300 w-20 text-center bg-blue-50">
                    Disc %
                  </th>
                  <th className="px-2 py-3 border-b border-gray-300 w-32 text-right">
                    Total Per Line
                  </th>
                  <th className="px-2 py-3 border-b border-gray-300 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const financials = calculateRow(item);
                  const isValve = item.category === CATEGORIES.VALVES;
                  const isFreeText = item.category === CATEGORIES.FREE_TEXT;
                  let dropDownOptions = [];
                  if (item.category === CATEGORIES.VALVES)
                    dropDownOptions = Object.keys(PRODUCTS_DB);
                  else if (item.category === CATEGORIES.DIAPHRAGMS)
                    dropDownOptions = Object.keys(DIAPHRAGMS_DB);
                  else dropDownOptions = SORTED_ACCESSORIES_KEYS;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b hover:bg-gray-50 align-top ${
                        item.isIncluded ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-2 py-3 text-xs font-bold text-gray-800 uppercase">
                        {item.category}
                      </td>
                      <td className="px-2 py-3">
                        {item.isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              className="border p-1 text-black font-bold"
                              value={item.code || ""}
                              onChange={(e) =>
                                updateItem(item.id, "code", e.target.value)
                              }
                            />
                            <textarea
                              className="border p-1 text-black w-full"
                              rows="2"
                              value={
                                item.customDesc !== undefined
                                  ? item.customDesc
                                  : PRODUCTS_DB[item.code]?.desc ||
                                    item.code ||
                                    ""
                              }
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "customDesc",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ) : (
                          <>
                            {isFreeText ? (
                              <div className="flex flex-col gap-2">
                                <input
                                  type="text"
                                  placeholder="Item Name (Code)"
                                  className="w-full border rounded p-1 text-black font-bold"
                                  value={item.code || ""}
                                  onChange={(e) =>
                                    updateItem(item.id, "code", e.target.value)
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder="Description"
                                  className="w-full border rounded p-1 text-black"
                                  value={item.description || ""}
                                  onChange={(e) =>
                                    updateItem(
                                      item.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              <select
                                className={`w-full border rounded p-1 font-bold text-black ${
                                  !item.code ? "text-gray-400" : ""
                                }`}
                                value={item.code || ""}
                                onChange={(e) => {
                                  updateItem(item.id, "code", e.target.value);
                                  updateItem(item.id, "customDesc", "");
                                  updateItem(item.id, "customPrice", 0);
                                }}
                              >
                                <option value="">Select Item...</option>
                                {dropDownOptions.map((k) => (
                                  <option key={k} value={k}>
                                    {k}
                                  </option>
                                ))}
                              </select>
                            )}

                            {isValve && !item.isEditing && (
                              <div className="text-xs text-black mt-1 font-medium">
                                {item.customDesc ||
                                  PRODUCTS_DB[item.code]?.desc ||
                                  "Select model..."}
                              </div>
                            )}

                            {isValve && (
                              <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-2 rounded border border-dashed">
                                <div>
                                  <label className="text-[10px] font-bold text-black">
                                    BODY MAT.
                                  </label>
                                  <select
                                    className={`w-full text-xs border rounded text-black ${
                                      !item.bodyMat ? "text-gray-400" : ""
                                    }`}
                                    value={item.bodyMat || ""}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "bodyMat",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select...</option>
                                    {OPTIONS.bodyMaterials.map((m) => (
                                      <option key={m} value={m}>
                                        {m}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-black">
                                    TRIM MAT.
                                  </label>
                                  <select
                                    className={`w-full text-xs border rounded text-black ${
                                      !item.trimMat ? "text-gray-400" : ""
                                    }`}
                                    value={item.trimMat || "Copper/Brass"}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "trimMat",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select...</option>
                                    {OPTIONS.trimMaterials.map((m) => (
                                      <option key={m} value={m}>
                                        {m}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-black">
                                    CONNECTION
                                  </label>
                                  <select
                                    className={`w-full text-xs border rounded text-black ${
                                      !item.connType ? "text-gray-400" : ""
                                    }`}
                                    value={item.connType || ""}
                                    onChange={(e) =>
                                      updateItem(
                                        item.id,
                                        "connType",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select...</option>
                                    {OPTIONS.connections.map((c) => (
                                      <option key={c} value={c}>
                                        {c}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {isValve ? (
                          <select
                            className={`border rounded p-1 w-full text-center text-black ${
                              !item.size ? "text-gray-400" : ""
                            }`}
                            value={item.size || ""}
                            onChange={(e) =>
                              updateItem(item.id, "size", e.target.value)
                            }
                          >
                            <option value="">Select...</option>
                            {OPTIONS.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <input
                          type="number"
                          min="1"
                          className="w-full border rounded p-2 text-center font-bold bg-white text-black shadow-sm"
                          value={item.qty || 1}
                          onChange={(e) =>
                            updateItem(item.id, "qty", parseInt(e.target.value))
                          }
                        />
                      </td>

                      {/* NEW INCLUDE / EDIT COLUMN */}
                      <td className="px-2 py-3 text-center flex flex-col items-center gap-2">
                        {!isValve && (
                          <div
                            className="flex items-center gap-1"
                            title="Include with valve above"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={item.isIncluded || false}
                              onChange={() => toggleInclude(item.id)}
                            />
                            <span className="text-[9px] text-gray-600">
                              Incl.
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() =>
                            updateItem(item.id, "isEditing", !item.isEditing)
                          }
                          className="text-gray-500 hover:text-blue-600 p-1 rounded border border-transparent hover:border-gray-300"
                          title="Edit Description/Price"
                        >
                          ✏️
                        </button>
                      </td>

                      <td className="px-2 py-3 text-right bg-blue-50">
                        {isFreeText || item.isEditing ? (
                          <input
                            type="number"
                            className="w-full border rounded p-1 text-right font-mono font-bold text-blue-900"
                            value={
                              item.isEditing
                                ? item.customPrice || 0
                                : item.price || ""
                            }
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                item.isEditing ? "customPrice" : "price",
                                parseFloat(e.target.value)
                              )
                            }
                            placeholder="0.00"
                          />
                        ) : (
                          <>
                            <div className="font-mono font-bold text-blue-900">
                              {formatCurrency(
                                financials.unitPrice,
                                currencySymbol
                              )}
                            </div>
                            {(financials.bodyAdder > 0 ||
                              financials.trimAdder > 0) && (
                              <div className="text-[9px] text-gray-800 mt-1 leading-tight">
                                {financials.bodyAdder > 0 && (
                                  <div>+BodyMat</div>
                                )}
                                {financials.trimAdder > 0 && (
                                  <div>+SeaWater</div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </td>
                      <td className="px-2 py-3 bg-blue-50">
                        <input
                          type="number"
                          className="w-full border rounded p-1 text-center text-red-600 font-bold bg-white"
                          value={item.discount || 0}
                          disabled={isFreeText}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "discount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </td>
                      <td className="px-2 py-3 text-right font-bold text-lg text-black">
                        {formatCurrency(financials.total, currencySymbol)}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-300 hover:text-red-600 font-bold text-xl"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Commercial Terms Editor */}
        <div className="bg-gray-100 p-4 md:p-6 border-t mt-4">
          <h4 className="text-sm font-bold text-black mb-2 uppercase">
            Commercial Terms
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-black">
                Payment
              </label>
              <select
                className="w-full border rounded p-1 text-black mb-1"
                value={
                  PAYMENT_PRESETS.includes(terms.payment)
                    ? terms.payment
                    : "OTHER"
                }
                onChange={(e) => {
                  if (e.target.value === "OTHER")
                    setTerms({ ...terms, payment: "" });
                  else setTerms({ ...terms, payment: e.target.value });
                }}
              >
                {PAYMENT_PRESETS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="OTHER">OTHER (Type below)</option>
              </select>
              {!PAYMENT_PRESETS.includes(terms.payment) && (
                <input
                  className="w-full border rounded p-1 text-black bg-white"
                  placeholder="Type payment terms..."
                  value={terms.payment}
                  onChange={(e) =>
                    setTerms({ ...terms, payment: e.target.value })
                  }
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-black">
                Delivery
              </label>
              <select
                className="w-full border rounded p-1 text-black mb-1"
                value={
                  DELIVERY_PRESETS.includes(terms.delivery)
                    ? terms.delivery
                    : "OTHER"
                }
                onChange={(e) => {
                  if (e.target.value === "OTHER")
                    setTerms({ ...terms, delivery: "" });
                  else setTerms({ ...terms, delivery: e.target.value });
                }}
              >
                {DELIVERY_PRESETS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="OTHER">OTHER (Type below)</option>
              </select>
              {!DELIVERY_PRESETS.includes(terms.delivery) && (
                <input
                  className="w-full border rounded p-1 text-black bg-white"
                  placeholder="Type delivery terms..."
                  value={terms.delivery}
                  onChange={(e) =>
                    setTerms({ ...terms, delivery: e.target.value })
                  }
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-black">
                Lead Time
              </label>
              <input
                className="w-full border rounded p-1 text-black"
                value={terms.leadTime}
                onChange={(e) =>
                  setTerms({ ...terms, leadTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black">
                Validity
              </label>
              <input
                className="w-full border rounded p-1 text-black"
                value={terms.validity}
                onChange={(e) =>
                  setTerms({ ...terms, validity: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Footer Totals */}
        <div className="bg-gray-200 p-4 md:p-6 border-t">
          <div className="flex flex-col items-end gap-2">
            <div className="flex justify-between w-full md:w-64 text-sm text-black">
              <span>Subtotal:</span>
              <span className="font-mono">
                {formatCurrency(subTotal, currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between w-full md:w-64 text-sm text-black border-b border-gray-400 pb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includePacking}
                  onChange={(e) => setIncludePacking(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Packing & Handling (3.5%):</span>
              </div>
              <span
                className={`font-mono ${
                  !includePacking ? "text-gray-400 line-through" : ""
                }`}
              >
                {formatCurrency(packingCost, currencySymbol)}
              </span>
            </div>
            <div className="flex justify-between w-full md:w-64 text-xl font-bold text-blue-900 pt-1">
              <span>Grand Total:</span>
              <span>{formatCurrency(grandTotal, currencySymbol)}</span>
            </div>
            <button
              onClick={handleCleanAll}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded shadow text-xs"
            >
              CLEAN ALL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
