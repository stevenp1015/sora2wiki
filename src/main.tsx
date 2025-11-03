import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { applyTheme, getInitialThemeSettings } from "./lib/theme/themes";
import "../index.css";

// Apply theme before rendering the app
const { themeId, mode } = getInitialThemeSettings();
applyTheme(themeId, mode, false);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
