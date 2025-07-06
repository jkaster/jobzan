import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Import your i18n configuration
import App from "./App.tsx";
import "./index.css";

/**
 * Creates a Material-UI theme instance.
 */
const theme = createTheme();

/**
 * Renders the React application into the DOM.
 * The application is wrapped with StrictMode, I18nextProvider, ThemeProvider, and CssBaseline.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>,
);
