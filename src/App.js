import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// --- DATABASE & CONSTANTS ---

const CATEGORIES = {
  VALVES: "Valves",
  ACCESSORIES: "Accessories",
  SPARE_PARTS: "Spare Parts",
  DIAPHRAGMS: "Diaphragms",
  FREE_TEXT: "Free Text",
};

const SALES_PEOPLE = ["RAN LUTZKY", "TAL FISHBHIN", "OTHER"];

const SIGNATURES = {
  "RAN LUTZKY": {
    name: "Ran Lutzky",
    title: "International Sales Manager",
    region: "The Americas & Southern Europe",
    phone: "+972-556822524",
    email: "rlutzky@raphael-valves.com",
    image: "/ran_signature.png",
  },
  "TAL FISHBHIN": {
    name: "Tal Fishbhin",
    title: "International Sales Manager",
    region: "APAC & EMEA",
    phone: "+972-52-484-4664",
    email: "tfishbhin@raphael-valves.com",
    image: "/tal_signature.png",
  },
  OTHER: {
    image: null,
    name: "",
    title: "Sales Manager",
    region: "International",
    phone: "",
    email: "",
  },
};

const ATTN_OPTIONS = ["TAL FISHBHIN", "RAN LUTZKY", "OTHER"];

// --- HELPER FUNCTIONS ---

const addSize2_5 = (priceList) => {
  if (!priceList) return {};
  const newPriceList = { ...priceList };
  Object.keys(newPriceList).forEach((key) => {
    const item = newPriceList[key];
    if (item && item['2"'] && item['3"']) {
      const avg = (item['2"'] + item['3"']) / 2;
      newPriceList[key] = { ...item, '2.5"': avg };
    }
  });
  return newPriceList;
};

// --- DATA LISTS ---

const DIAPHRAGMS_DB = {
  'Deluge (FDV) Diaphragm 2"': 70,
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

// --- RAW PRICES ---

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
    '1.5"': 1284,
    '2"': 1284,
    '3"': 1701,
    '4"': 2070,
    '6"': 3546,
    '8"': 4827,
    '10"': 5717,
    '12"': 8386,
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

const PRICES_HG_USD_RAW = {
  "FDV-DE0": {
    '1.5"': 2906,
    '2"': 2906,
    '2.5"': 3083,
    '3"': 3260,
    '4"': 3917,
    '6"': 5055,
    '8"': 7204,
    '10"': 8569,
  },
  "FDV-DP0": {
    '1.5"': 3011,
    '2"': 3011,
    '2.5"': 3188,
    '3"': 3365,
    '4"': 4022,
    '6"': 5159,
    '8"': 7308,
    '10"': 8673,
  },
  "FDV-DC0": {
    '1.5"': 3645,
    '2"': 3645,
    '2.5"': 3865,
    '3"': 4085,
    '4"': 4902,
    '6"': 6315,
    '8"': 8985,
    '10"': 10681,
  },
  "FDV-DH0": {
    '1.5"': 2520,
    '2"': 2520,
    '2.5"': 2670,
    '3"': 2820,
    '4"': 3377,
    '6"': 4341,
    '8"': 6162,
    '10"': 7318,
  },
  "FDV-DA0": {
    '1.5"': 3043,
    '2"': 3043,
    '2.5"': 3229,
    '3"': 3416,
    '4"': 4109,
    '6"': 5308,
    '8"': 7573,
    '10"': 9012,
  },
  "FDV-DE1": {
    '1.5"': 2509,
    '2"': 2509,
    '2.5"': 2663,
    '3"': 2816,
    '4"': 3387,
    '6"': 4374,
    '8"': 6240,
    '10"': 7424,
  },
  "FDV-3W-DE1": {
    '1.5"': 2667,
    '2"': 2667,
    '2.5"': 2820,
    '3"': 2974,
    '4"': 3545,
    '6"': 4532,
    '8"': 6397,
    '10"': 7582,
  },
  "FDV-DP1": {
    '1.5"': 2614,
    '2"': 2614,
    '2.5"': 2768,
    '3"': 2921,
    '4"': 3492,
    '6"': 4479,
    '8"': 6345,
    '10"': 7529,
  },
  "FDV-DC1": {
    '1.5"': 3119,
    '2"': 3119,
    '2.5"': 3316,
    '3"': 3512,
    '4"': 4241,
    '6"': 5503,
    '8"': 7887,
    '10"': 9401,
  },
  "FDV-DH1": {
    '1.5"': 2186,
    '2"': 2186,
    '2.5"': 2317,
    '3"': 2448,
    '4"': 2935,
    '6"': 3777,
    '8"': 5367,
    '10"': 6377,
  },
  "FDV-3W-DH1": {
    '1.5"': 2186,
    '2"': 2186,
    '2.5"': 2317,
    '3"': 2448,
    '4"': 2935,
    '6"': 3777,
    '8"': 5367,
    '10"': 6377,
  },
  "FDV-DA1": {
    '1.5"': 2647,
    '2"': 2647,
    '2.5"': 2810,
    '3"': 2973,
    '4"': 3579,
    '6"': 4628,
    '8"': 6610,
    '10"': 7869,
  },
  "FDV-PE0": {
    '1.5"': 3473,
    '2"': 3473,
    '2.5"': 3746,
    '3"': 4018,
    '4"': 4484,
    '6"': 5622,
    '8"': 7998,
    '10"': 9522,
  },
  "FDV-PP0": {
    '1.5"': 3746,
    '2"': 3746,
    '2.5"': 3923,
    '3"': 4100,
    '4"': 4757,
    '6"': 5894,
    '8"': 8270,
    '10"': 9793,
  },
  "FDV-PC0": {
    '1.5"': 4212,
    '2"': 4212,
    '2.5"': 4432,
    '3"': 4652,
    '4"': 5469,
    '6"': 6882,
    '8"': 9779,
    '10"': 11634,
  },
  "FDV-PH0": {
    '1.5"': 3087,
    '2"': 3087,
    '2.5"': 3237,
    '3"': 3387,
    '4"': 3944,
    '6"': 4908,
    '8"': 6956,
    '10"': 8271,
  },
  "FDV-PA0": {
    '1.5"': 3610,
    '2"': 3610,
    '2.5"': 3796,
    '3"': 3983,
    '4"': 4676,
    '6"': 5875,
    '8"': 8367,
    '10"': 9965,
  },
  "FDV-PE1": {
    '1.5"': 3076,
    '2"': 3076,
    '2.5"': 3230,
    '3"': 3383,
    '4"': 3954,
    '6"': 4941,
    '8"': 7033,
    '10"': 8377,
  },
  "FDV-PP1": {
    '1.5"': 3349,
    '2"': 3349,
    '2.5"': 3503,
    '3"': 3656,
    '4"': 4227,
    '6"': 5214,
    '8"': 7306,
    '10"': 8650,
  },
  "FDV-PC1": {
    '1.5"': 3686,
    '2"': 3686,
    '2.5"': 3883,
    '3"': 4079,
    '4"': 4808,
    '6"': 6070,
    '8"': 8680,
    '10"': 10354,
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
    '1.5"': 2112,
    '2"': 2112,
    '2.5"': 2233,
    '3"': 2355,
    '4"': 2806,
    '6"': 3790,
    '8"': 5774,
    '10"': 6853,
  },
  "FDV-3W-AE1": {
    '1.5"': 2269,
    '2"': 2269,
    '2.5"': 2391,
    '3"': 2512,
    '4"': 2963,
    '6"': 3948,
    '8"': 5932,
    '10"': 7011,
  },
  "FDV-AP1": {
    '1.5"': 2217,
    '2"': 2217,
    '2.5"': 2338,
    '3"': 2460,
    '4"': 2911,
    '6"': 3895,
    '8"': 5879,
    '10"': 6958,
  },
  "FDV-AC1": {
    '1.5"': 2589,
    '2"': 2589,
    '2.5"': 2743,
    '3"': 2898,
    '4"': 3473,
    '6"': 4672,
    '8"': 7061,
    '10"': 8398,
  },
  "FDV-AH1": {
    '1.5"': 1887,
    '2"': 1887,
    '2.5"': 1993,
    '3"': 2099,
    '4"': 2797,
    '6"': 3375,
    '8"': 5168,
    '10"': 6126,
  },
  "FDV-3W-AH1": {
    '1.5"': 1887,
    '2"': 1887,
    '2.5"': 1993,
    '3"': 2099,
    '4"': 2797,
    '6"': 3375,
    '8"': 5168,
    '10"': 6126,
  },
  "FDV-R-HH0": { '1.5"': 1697, '2"': 1697, '2.5"': 1798, '3"': 1899 },
  "FDV-R-HHP": { '1.5"': 2163, '2"': 2163, '2.5"': 2264, '3"': 2365 },
  "FDV-R-MH0": {
    '1.5"': 1439,
    '2"': 1439,
    '2.5"': 1521,
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
    '2.5"': 1634,
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
    '2.5"': 1821,
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
    '2.5"': 3767,
    '3"': 3968,
    '4"': 4718,
    '6"': 6015,
    '8"': 8465,
    '10"': 10021,
  },
  "FPS-SIP0": {
    '1.5"': 3564,
    '2"': 3564,
    '2.5"': 3766,
    '3"': 3968,
    '4"': 4717,
    '6"': 6014,
    '8"': 8463,
    '10"': 10019,
  },
  "FPS-SCE0": {
    '1.5"': 4407,
    '2"': 4407,
    '2.5"': 4658,
    '3"': 4909,
    '4"': 5840,
    '6"': 7451,
    '8"': 10495,
    '10"': 12429,
  },
  "FPS-SIE1": {
    '1.5"': 3125,
    '2"': 3125,
    '2.5"': 3296,
    '3"': 3467,
    '4"': 4102,
    '6"': 5201,
    '8"': 7276,
    '10"': 8595,
  },
  "FPS-SCE1": {
    '1.5"': 3721,
    '2"': 3721,
    '2.5"': 3934,
    '3"': 4146,
    '4"': 4936,
    '6"': 6303,
    '8"': 8885,
    '10"': 10526,
  },
  "FPS-DIE0": {
    '1.5"': 3113,
    '2"': 3113,
    '2.5"': 3288,
    '3"': 3463,
    '4"': 4113,
    '6"': 5239,
    '8"': 7365,
    '10"': 8716,
  },
  "FPS-DIC0": {
    '1.5"': 3706,
    '2"': 3706,
    '2.5"': 3965,
    '3"': 4225,
    '4"': 5188,
    '6"': 6856,
    '8"': 10005,
    '10"': 12007,
  },
  "FPS-DCE0": {
    '1.5"': 3558,
    '2"': 3589,
    '2.5"': 3794,
    '3"': 3999,
    '4"': 4720,
    '6"': 6134,
    '8"': 8913,
    '10"': 10603,
  },
  "FPS-DCE1": {
    '1.5"': 3808,
    '2"': 3808,
    '2.5"': 4032,
    '3"': 4256,
    '4"': 5087,
    '6"': 6525,
    '8"': 9243,
    '10"': 10969,
  },
  "FPS-DIE1": {
    '1.5"': 2744,
    '2"': 2744,
    '2.5"': 2893,
    '3"': 3043,
    '4"': 3597,
    '6"': 4557,
    '8"': 6370,
    '10"': 7522,
  },
  "FDV-R-PN2": {
    '1.5"': 1284,
    '2"': 1284,
    '2.5"': 1492,
    '3"': 1701,
    '4"': 2070,
    '6"': 3546,
    '8"': 4827,
    '10"': 5717,
    '12"': 8386,
  },
  "FDV-R-RN2": {
    '1.5"': 1741,
    '2"': 1741,
    '2.5"': 1807,
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
    '2.5"': 1425,
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
    '2.5"': 2633,
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
    '2.5"': 3122,
    '3"': 3224,
    '4"': 3939,
    '6"': 4708,
    '8"': 5999,
    '10"': 6946,
    '12"': 9790,
  },
};

const PRICES_STD_EUR_RAW = {
  "FDV-DE0": {
    '1.5"': 2086,
    '2"': 2086,
    '3"': 2378,
    '4"': 2920,
    '6"': 3859,
    '8"': 5631,
    '10"': 6758,
  },
  "FDV-DP0": {
    '1.5"': 2180,
    '2"': 2180,
    '3"': 2472,
    '4"': 3014,
    '6"': 3952,
    '8"': 5725,
    '10"': 6851,
  },
  "FDV-DC0": {
    '1.5"': 2591,
    '2"': 2591,
    '3"': 2954,
    '4"': 3628,
    '6"': 4794,
    '8"': 6997,
    '10"': 8396,
  },
  "FDV-DH0": {
    '1.5"': 1767,
    '2"': 1767,
    '3"': 2015,
    '4"': 2474,
    '6"': 3269,
    '8"': 4772,
    '10"': 5726,
  },
  "FDV-DA0": {
    '1.5"': 2199,
    '2"': 2199,
    '3"': 2506,
    '4"': 3078,
    '6"': 4067,
    '8"': 5936,
    '10"': 7123,
  },
  "FDV-DE1": {
    '1.5"': 1810,
    '2"': 1810,
    '3"': 2064,
    '4"': 2534,
    '6"': 3349,
    '8"': 4888,
    '10"': 5865,
  },
  "FDV-3W-DE1": {
    '1.5"': 1952,
    '2"': 1952,
    '3"': 2205,
    '4"': 2676,
    '6"': 3491,
    '8"': 5030,
    '10"': 6007,
  },
  "FDV-DP1": {
    '1.5"': 1905,
    '2"': 1905,
    '3"': 2158,
    '4"': 2629,
    '6"': 3444,
    '8"': 4982,
    '10"': 5960,
  },
  "FDV-DC1": {
    '1.5"': 2314,
    '2"': 2314,
    '3"': 2637,
    '4"': 3239,
    '6"': 4280,
    '8"': 6247,
    '10"': 7496,
  },
  "FDV-DH1": {
    '1.5"': 1544,
    '2"': 1544,
    '3"': 1780,
    '4"': 2161,
    '6"': 2856,
    '8"': 4168,
    '10"': 5001,
  },
  "FDV-3W-DH1": {
    '1.5"': 1544,
    '2"': 1544,
    '3"': 1780,
    '4"': 2161,
    '6"': 2856,
    '8"': 4168,
    '10"': 5001,
  },
  "FDV-DA1": {
    '1.5"': 1923,
    '2"': 1923,
    '3"': 2193,
    '4"': 2693,
    '6"': 3558,
    '8"': 5193,
    '10"': 6232,
  },
  "FDV-PE0": {
    '1.5"': 2553,
    '2"': 2553,
    '3"': 2988,
    '4"': 3388,
    '6"': 4326,
    '8"': 6288,
    '10"': 7544,
  },
  "FDV-PP0": {
    '1.5"': 2799,
    '2"': 2799,
    '3"': 3091,
    '4"': 3633,
    '6"': 4571,
    '8"': 6531,
    '10"': 7788,
  },
  "FDV-PC0": {
    '1.5"': 3059,
    '2"': 3059,
    '3"': 3422,
    '4"': 4096,
    '6"': 5262,
    '8"': 7652,
    '10"': 9182,
  },
  "FDV-PH0": {
    '1.5"': 2235,
    '2"': 2235,
    '3"': 2482,
    '4"': 2942,
    '6"': 3737,
    '8"': 5426,
    '10"': 6512,
  },
  "FDV-PA0": {
    '1.5"': 2666,
    '2"': 2666,
    '3"': 2974,
    '4"': 3546,
    '6"': 4535,
    '8"': 6591,
    '10"': 7909,
  },
  "FDV-PE1": {
    '1.5"': 2278,
    '2"': 2278,
    '3"': 2532,
    '4"': 3002,
    '6"': 3817,
    '8"': 5543,
    '10"': 6651,
  },
  "FDV-PP1": {
    '1.5"': 2524,
    '2"': 2524,
    '3"': 2777,
    '4"': 3248,
    '6"': 4063,
    '8"': 5788,
    '10"': 6897,
  },
  "FDV-PC1": {
    '1.5"': 2781,
    '2"': 2781,
    '3"': 3105,
    '4"': 3707,
    '6"': 4748,
    '8"': 6901,
    '10"': 8282,
  },
  "FDV-PH1": {
    '1.5"': 2011,
    '2"': 2011,
    '3"': 2228,
    '4"': 2629,
    '6"': 3324,
    '8"': 4823,
    '10"': 5787,
  },
  "FDV-PA1": {
    '1.5"': 2391,
    '2"': 2391,
    '3"': 2681,
    '4"': 3161,
    '6"': 4026,
    '8"': 5848,
    '10"': 7018,
  },
  "FDV-AE1": {
    '1.5"': 1431,
    '2"': 1431,
    '3"': 1631,
    '4"': 2003,
    '6"': 2815,
    '8"': 4452,
    '10"': 5342,
  },
  "FDV-3W-AE1": {
    '1.5"': 1572,
    '2"': 1572,
    '3"': 1773,
    '4"': 2145,
    '6"': 2957,
    '8"': 4594,
    '10"': 5484,
  },
  "FDV-AP1": {
    '1.5"': 1525,
    '2"': 1525,
    '3"': 1725,
    '4"': 2097,
    '6"': 2909,
    '8"': 4546,
    '10"': 5437,
  },
  "FDV-AC1": {
    '1.5"': 1824,
    '2"': 1824,
    '3"': 2079,
    '4"': 2553,
    '6"': 3542,
    '8"': 5514,
    '10"': 6616,
  },
  "FDV-AH1": {
    '1.5"': 1245,
    '2"': 1245,
    '3"': 1420,
    '4"': 1996,
    '6"': 2472,
    '8"': 3952,
    '10"': 4742,
  },
  "FDV-3W-AH1": {
    '1.5"': 1245,
    '2"': 1245,
    '3"': 1420,
    '4"': 1996,
    '6"': 2472,
    '8"': 3952,
    '10"': 4742,
  },
  "FDV-R-HH0": { '1.5"': 1192, '2"': 1192, '3"': 1359 },
  "FDV-R-HHP": { '1.5"': 1473, '2"': 1473, '3"': 1640 },
  "FDV-R-MH0": {
    '1.5"': 875,
    '2"': 875,
    '3"': 1011,
    '4"': 1459,
    '6"': 1829,
    '8"': 2980,
    '10"': 3595,
    '12"': 5392,
  },
  "FDV-R-MH1": {
    '1.5"': 969,
    '2"': 969,
    '3"': 1104,
    '4"': 1552,
    '6"': 1923,
    '8"': 3074,
    '10"': 3688,
    '12"': 5532,
  },
  "FDV-R-ME1": {
    '1.5"': 1113,
    '2"': 1113,
    '3"': 1288,
    '4"': 1558,
    '6"': 2189,
    '8"': 3463,
    '10"': 4155,
    '12"': 6233,
  },
  "FPS-SIE0": {
    '1.5"': 2378,
    '2"': 2378,
    '3"': 2711,
    '4"': 3358,
    '6"': 4399,
    '8"': 6532,
    '10"': 7839,
  },
  "FPS-SIP0": {
    '1.5"': 2377,
    '2"': 2377,
    '3"': 2710,
    '4"': 3357,
    '6"': 4398,
    '8"': 6531,
    '10"': 7838,
  },
  "FPS-SCE0": {
    '1.5"': 2911,
    '2"': 2937,
    '3"': 3272,
    '4"': 3862,
    '6"': 5019,
    '8"': 7292,
    '10"': 8675,
  },
  "FPS-SIE1": {
    '1.5"': 2064,
    '2"': 2064,
    '3"': 2353,
    '4"': 2915,
    '6"': 3885,
    '8"': 5621,
    '10"': 6804,
  },
  "FPS-SCE1": {
    '1.5"': 2597,
    '2"': 2597,
    '3"': 2911,
    '4"': 3483,
    '6"': 4389,
    '8"': 6374,
    '10"': 7715,
  },
  "FPS-DIE0": {
    '1.5"': 2378,
    '2"': 2378,
    '3"': 2711,
    '4"': 3358,
    '6"': 4399,
    '8"': 6532,
    '10"': 7839,
  },
  "FPS-DIC0": {
    '1.5"': 3032,
    '2"': 3032,
    '3"': 3456,
    '4"': 4245,
    '6"': 5609,
    '8"': 8186,
    '10"': 9824,
  },
  "FPS-DCE0": {
    '1.5"': 2911,
    '2"': 2937,
    '3"': 3272,
    '4"': 3862,
    '6"': 5019,
    '8"': 7292,
    '10"': 8675,
  },
  "FPS-DCE1": {
    '1.5"': 2597,
    '2"': 2597,
    '3"': 2911,
    '4"': 3483,
    '6"': 4389,
    '8"': 6374,
    '10"': 7715,
  },
  "FPS-DIE1": {
    '1.5"': 2064,
    '2"': 2064,
    '3"': 2353,
    '4"': 2915,
    '6"': 3885,
    '8"': 5621,
    '10"': 6804,
  },
  "FDV-R-PN2": {
    '1.5"': 747,
    '2"': 747,
    '3"': 1092,
    '4"': 1396,
    '6"': 2614,
    '8"': 3670,
    '10"': 4404,
    '12"': 6606,
  },
  "FDV-R-RN2": {
    '1.5"': 1124,
    '2"': 1124,
    '3"': 1233,
    '4"': 1444,
    '6"': 2758,
    '8"': 3814,
    '10"': 4576,
    '12"': 6865,
  },
  "FDV-R-LE2": {
    '1.5"': 710,
    '2"': 710,
    '3"': 1017,
    '4"': 1337,
    '6"': 2456,
    '8"': 3215,
    '10"': 3858,
    '12"': 5787,
  },
  "FDV-R-LF2": {
    '1.5"': 1050,
    '2"': 1050,
    '3"': 1215,
    '4"': 1412,
    '6"': 2575,
    '8"': 3313,
    '10"': 3976,
    '12"': 5964,
  },
  "FDV-R-LA2": {
    '1.5"': 1452,
    '2"': 1452,
    '3"': 1620,
    '4"': 2210,
    '6"': 2845,
    '8"': 3909,
    '10"': 4691,
    '12"': 7037,
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

// --- PROCESSED PRICES ---

const PRICES_STD_USD = addSize2_5(PRICES_STD_USD_RAW);
const PRICES_HG_USD = addSize2_5(PRICES_HG_USD_RAW);
const PRICES_STD_EUR = addSize2_5(PRICES_STD_EUR_RAW);
const PRICES_HG_EUR = addSize2_5(PRICES_HG_EUR_RAW);

// --- COMPONENT ---

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
  // --- 1. טעינת נתונים ראשונית (מונע דריסה) ---
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem("RAPHAEL_QUOTATION_DATA");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Local Storage Error", e);
      return null;
    }
  };

  const saved = loadSavedData();

  // --- 2. הגדרת המשתנים (עם העדפה למידע שמור) ---
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
  const [currency, setCurrency] = useState(saved?.currency || "USD");

  // ה-Ref מחושב אוטומטית בהמשך, אז אפשר להשאיר ריק בהתחלה
  const [ref, setRef] = useState("");
  const [refSuffix, setRefSuffix] = useState(saved?.refSuffix || 1);

  const [terms, setTerms] = useState(
    saved?.terms || {
      payment: "AS USUAL",
      delivery: "EXW",
      leadTime: "6-8 weeks",
      validity: "30 Days",
    }
  );

  // (ה-useEffect של הטעינה נמחק כי עשינו את זה למעלה)

  // --- 3. שמירה אוטומטית (נשאר ללא שינוי) ---
  useEffect(() => {
    const dataToSave = { items, cust, salesPerson, currency, terms, refSuffix };
    localStorage.setItem("RAPHAEL_QUOTATION_DATA", JSON.stringify(dataToSave));
  }, [items, cust, salesPerson, currency, terms, refSuffix]);

  // --- LOCAL STORAGE LOGIC ---
  useEffect(() => {
    // Load from local storage on mount
    const savedData = localStorage.getItem("RAPHAEL_QUOTATION_DATA");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.items) setItems(parsed.items);
        if (parsed.cust) setCust(parsed.cust);
        if (parsed.salesPerson) setSalesPerson(parsed.salesPerson);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.terms) setTerms(parsed.terms);
        if (parsed.refSuffix) setRefSuffix(parsed.refSuffix);
      } catch (e) {
        console.error("Failed to load local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to local storage on any change
    const dataToSave = { items, cust, salesPerson, currency, terms, refSuffix };
    localStorage.setItem("RAPHAEL_QUOTATION_DATA", JSON.stringify(dataToSave));
  }, [items, cust, salesPerson, currency, terms, refSuffix]);

  useEffect(() => {
    let initials = "XX";
    if (salesPerson === "RAN LUTZKY") initials = "RL";
    else if (salesPerson === "TAL FISHBHIN") initials = "TF";
    else initials = "GN";

    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(2);
    const dateStr = `${day}${month}${year}`;

    const suffixNum = refSuffix === 1 ? "01" : String((refSuffix - 1) * 11);

    setRef(`${initials}${dateStr}${suffixNum}`);
  }, [salesPerson, refSuffix]);

  const cycleRefSuffix = () => {
    setRefSuffix((prev) => prev + 1);
  };

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
      isHighGrade: false,
      bodyMat: "",
      trimMat: "",
      connType: "",
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
      localStorage.removeItem("RAPHAEL_QUOTATION_DATA");
    }
  };

  const calculateRow = (item) => {
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

      let basePriceTable;
      if (currency === "USD") {
        basePriceTable = item.isHighGrade ? PRICES_HG_USD : PRICES_STD_USD;
      } else {
        basePriceTable = item.isHighGrade ? PRICES_HG_EUR : PRICES_STD_EUR;
      }

      const basePrice = basePriceTable[item.code]?.[item.size] || 0;
      const discountPercent = item.discount || 0;
      const discountAmount = basePrice * (discountPercent / 100);
      const discountedBase = basePrice - discountAmount;

      const bodyAdder = item.bodyMat
        ? BODY_MATERIAL_ADDONS[item.bodyMat]?.[item.size] || 0
        : 0;
      const trimAdder = item.trimMat === "Full Sea Water Trim" ? 10000 : 0;

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
      const discountPercent = item.discount || 0;
      const discountAmount = basePrice * (discountPercent / 100);
      const unitPrice = basePrice - discountAmount;

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
      const discountPercent = item.discount || 0;
      const discountAmount = basePrice * (discountPercent / 100);
      const unitPrice = basePrice - discountAmount;

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

  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));

  const subTotal = items.reduce(
    (sum, item) => sum + calculateRow(item).total,
    0
  );
  const packingCost = subTotal * 0.035;
  const grandTotal = subTotal + packingCost;

  const currencySymbol = currency === "USD" ? "$" : "€";

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = "/raphael_logo_final.png";

    const generate = () => {
      if (logoImg.complete && logoImg.naturalHeight !== 0) {
        doc.addImage(logoImg, "PNG", 14, 10, 50, 15);
      }

      doc.setFontSize(10);
      doc.setTextColor(200, 0, 0);
      doc.text("RAPHAEL FP", 14, 35);

      doc.setTextColor(0, 0, 0);
      doc.text("COMMERCIAL QUOTATION", 14, 40);

      const dateStr = new Date().toLocaleDateString();
      doc.text(`Date: ${dateStr}`, 140, 35);
      doc.text(`Reference: ${ref}`, 140, 40);
      doc.text(`Attn: ${cust.contactName}`, 14, 50);
      doc.text(`Company: ${cust.name}`, 14, 55);

      const tableBody = items.map((item, index) => {
        const financials = calculateRow(item);
        let desc = "";
        let code = item.code;

        if (item.category === CATEGORIES.VALVES) {
          const baseDesc = PRODUCTS_DB[item.code]?.desc || item.code;
          desc = `${baseDesc}`;
          if (item.bodyMat) desc += `; Body: ${item.bodyMat}`;
          if (item.trimMat) desc += `; Trim: ${item.trimMat}`;
          if (item.connType) desc += `; Connection: ${item.connType}`;
        } else if (item.category === CATEGORIES.FREE_TEXT) {
          code = item.code || "General";
          desc = item.description || "";
        } else {
          desc = item.code;
        }

        return [
          index + 1,
          code,
          desc,
          item.size || "-",
          item.qty,
          financials.unitPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          financials.total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        ];
      });

      autoTable(doc, {
        startY: 65,
        head: [
          [
            "No",
            "Code",
            "Description",
            "DN",
            "Qty",
            `Unit Price (${currencySymbol})`,
            `Total (${currencySymbol})`,
          ],
        ],
        body: tableBody,
        foot: [
          [
            "",
            "",
            "",
            "",
            "",
            "Subtotal:",
            `${currencySymbol}${subTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`,
          ],
          [
            "",
            "",
            "",
            "",
            "",
            "Packing (3.5%):",
            `${currencySymbol}${packingCost.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`,
          ],
          [
            "",
            "",
            "",
            "",
            "",
            "GRAND TOTAL:",
            `${currencySymbol}${grandTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`,
          ],
        ],
        theme: "striped",
        headStyles: { fillColor: [22, 160, 133] },
        footStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        styles: { fontSize: 8, textColor: [0, 0, 0] },
        columnStyles: { 2: { cellWidth: 80 } },
      });

      let finalY = doc.lastAutoTable.finalY + 15;
      if (finalY > 220) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFontSize(10);
      doc.text("Commercial Terms:", 14, finalY);
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

      if (signer.image) {
        const sigImg = new Image();
        sigImg.src = signer.image;
        try {
          doc.addImage(sigImg, "PNG", 14, finalY, 100, 50);
          finalY += 40;
        } catch (e) {
          console.log("Signature image not ready");
        }
      } else {
        doc.setFont("helvetica", "bold");
        doc.text(signer.name || "Sales Manager", 14, finalY);

        doc.setFont("helvetica", "normal");
        finalY += 5;
        doc.text(signer.title, 14, finalY);
        finalY += 5;
        doc.text(signer.region, 14, finalY);
      }

      doc.save(`Quotation_${ref}.pdf`);
    };

    logoImg.onload = () => generate();
    logoImg.onerror = () => generate();
  };

  const handleExportExcel = () => {
    const wsData = [];

    wsData.push(["RAPHAEL VALVES QUOTATION"]);
    wsData.push([]);
    wsData.push(["Date:", new Date().toLocaleDateString(), "Reference:", ref]);
    wsData.push(["Attn:", cust.contactName, "Company:", cust.name]);
    wsData.push(["Prepared By:", salesPerson]);
    wsData.push(["Email:", cust.email, "Phone:", cust.phone]);
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

    items.forEach((item, index) => {
      const financials = calculateRow(item);
      let desc = "";
      let code = item.code;

      if (item.category === CATEGORIES.VALVES) {
        const baseDesc = PRODUCTS_DB[item.code]?.desc || item.code;
        desc = `${baseDesc}`;
        if (item.bodyMat) desc += `; Body: ${item.bodyMat}`;
        if (item.trimMat) desc += `; Trim: ${item.trimMat}`;
        if (item.connType) desc += `; Connection: ${item.connType}`;
      } else if (item.category === CATEGORIES.FREE_TEXT) {
        code = item.code || "General";
        desc = item.description || "";
      } else {
        desc = item.code;
      }

      wsData.push([
        index + 1,
        code,
        desc,
        item.size || "-",
        item.qty,
        financials.unitPrice,
        financials.total,
      ]);
    });

    wsData.push([]);
    wsData.push(["", "", "", "", "Subtotal:", subTotal]);
    wsData.push(["", "", "", "", "Packing (3.5%):", packingCost]);
    wsData.push(["", "", "", "", "GRAND TOTAL:", grandTotal]);
    wsData.push([]);
    wsData.push(["Commercial Terms"]);
    wsData.push(["Payment:", terms.payment]);
    wsData.push(["Delivery:", terms.delivery]);
    wsData.push(["Lead Time:", terms.leadTime]);
    wsData.push(["Validity:", terms.validity]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quotation");
    XLSX.writeFile(wb, `Quotation_${ref}.xlsx`);
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900"
      dir="ltr"
    >
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
          <div className="flex flex-col">
            <img
              src="/raphael_logo_final.png"
              alt="Raphael Valves Logo"
              className="h-12 w-auto mb-4 object-contain bg-white rounded p-1"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <h1 className="text-3xl font-bold uppercase">
              RAPHAEL VALVES QUOTATION FORM
            </h1>

            <div className="flex flex-col gap-2 mt-2 bg-blue-800 p-2 rounded">
              <div className="flex items-center gap-2">
                <span className="text-blue-200 text-xs">Ref:</span>
                <span className="font-mono font-bold text-white">{ref}</span>
                <button
                  onClick={cycleRefSuffix}
                  className="bg-blue-600 hover:bg-blue-500 px-2 py-0.5 rounded text-[10px]"
                >
                  + ID
                </button>
              </div>
              <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-4">
            <div className="text-right">
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

            <div className="flex flex-col gap-2">
              <button
                onClick={handleExportPDF}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded shadow text-sm"
              >
                Export PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded shadow text-sm"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-6 bg-gray-100 border-b">
          <h3 className="text-sm font-bold text-black mb-3 uppercase">
            Customer Details
          </h3>
          <div className="grid grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] text-gray-500">
                Company Name
              </label>
              <input
                className="w-full p-2 border rounded text-black"
                value={cust.name}
                onChange={(e) => setCust({ ...cust, name: e.target.value })}
              />
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
                  title="Update existing lines"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 flex gap-4 border-b bg-white">
          <button
            onClick={() => addItem(CATEGORIES.VALVES)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
          >
            <span>+ Add Valve</span>
          </button>
          <button
            onClick={() => addItem(CATEGORIES.ACCESSORIES)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Accessory
          </button>
          <button
            onClick={() => addItem(CATEGORIES.SPARE_PARTS)}
            className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded shadow"
          >
            + Add Spare Part
          </button>
          <button
            onClick={() => addItem(CATEGORIES.DIAPHRAGMS)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
          >
            + Add Diaphragm
          </button>
          <button
            onClick={() => addItem(CATEGORIES.FREE_TEXT)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded shadow"
          >
            + Add Free Text
          </button>
        </div>

        {/* Items Table */}
        <div className="p-6 overflow-x-auto min-h-[400px]">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              Start by adding items from the menu above
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
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
                  <th className="px-2 py-3 border-b border-gray-300 w-16 text-center">
                    HG TRIM
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

                  let productList = {};
                  if (item.category === CATEGORIES.VALVES)
                    productList = PRODUCTS_DB;
                  else if (item.category === CATEGORIES.DIAPHRAGMS)
                    productList = DIAPHRAGMS_DB;
                  else productList = ACCESSORIES_DB;

                  return (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 align-top"
                    >
                      <td className="px-2 py-3 text-xs font-bold text-gray-800 uppercase">
                        {item.category}
                      </td>

                      <td className="px-2 py-3">
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
                            value={item.code}
                            onChange={(e) =>
                              updateItem(item.id, "code", e.target.value)
                            }
                          >
                            <option value="">Select Item...</option>
                            {Object.keys(productList).map((k) => (
                              <option key={k} value={k}>
                                {k}
                              </option>
                            ))}
                          </select>
                        )}

                        {isValve && (
                          <div className="text-xs text-black mt-1 font-medium">
                            {PRODUCTS_DB[item.code]?.desc ||
                              "Select model to see description"}
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
                                value={item.bodyMat}
                                onChange={(e) =>
                                  updateItem(item.id, "bodyMat", e.target.value)
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
                                value={item.trimMat}
                                onChange={(e) =>
                                  updateItem(item.id, "trimMat", e.target.value)
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
                                value={item.connType}
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
                      </td>

                      <td className="px-2 py-3 text-center">
                        {isValve ? (
                          <select
                            className={`border rounded p-1 w-full text-center text-black ${
                              !item.size ? "text-gray-400" : ""
                            }`}
                            value={item.size}
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
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.id, "qty", parseInt(e.target.value))
                          }
                        />
                      </td>

                      <td className="px-2 py-3 text-center">
                        {isValve ? (
                          <input
                            type="checkbox"
                            className="w-5 h-5 accent-blue-600"
                            checked={item.isHighGrade}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "isHighGrade",
                                e.target.checked
                              )
                            }
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Unitary Price (Net) */}
                      <td className="px-2 py-3 text-right bg-blue-50">
                        {isFreeText ? (
                          <input
                            type="number"
                            className="w-full border rounded p-1 text-right font-mono font-bold text-blue-900"
                            value={item.price || ""}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            placeholder="0.00"
                          />
                        ) : (
                          <>
                            <div className="font-mono font-bold text-blue-900">
                              {currencySymbol}
                              {financials.unitPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
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
                          value={item.discount}
                          disabled={isFreeText} // No discount for free text
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
                        {currencySymbol}
                        {financials.total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
        <div className="bg-gray-100 p-6 border-t mt-4">
          <h4 className="text-sm font-bold text-black mb-2 uppercase">
            Commercial Terms
          </h4>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-black">
                Payment
              </label>
              <input
                className="w-full border rounded p-1 text-black"
                value={terms.payment}
                onChange={(e) =>
                  setTerms({ ...terms, payment: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black">
                Delivery
              </label>
              <input
                className="w-full border rounded p-1 text-black"
                value={terms.delivery}
                onChange={(e) =>
                  setTerms({ ...terms, delivery: e.target.value })
                }
              />
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
        <div className="bg-gray-200 p-6 border-t">
          <div className="flex flex-col items-end gap-2">
            <div className="flex justify-between w-64 text-sm text-black">
              <span>Subtotal:</span>
              <span className="font-mono">
                {currencySymbol}
                {subTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between w-64 text-sm text-black border-b border-gray-400 pb-2">
              <span>Packing & Handling (3.5%):</span>
              <span className="font-mono">
                {currencySymbol}
                {packingCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="flex justify-between w-64 text-xl font-bold text-blue-900 pt-1">
              <span>Grand Total:</span>
              <span>
                {currencySymbol}
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* CLEAN ALL BUTTON */}
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
