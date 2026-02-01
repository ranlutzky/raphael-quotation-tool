import React from "react";
import { createRoot } from "react-dom/client";
import QuotationApp from "./App"; // וודא שהקוד ששלחת שמור בקובץ App.js
import "./styles.css"; // (אופציונלי - ראה הערה למטה על Tailwind)

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QuotationApp />
  </React.StrictMode>
);