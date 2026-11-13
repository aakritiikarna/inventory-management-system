import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
            <BrowserRouter>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    borderRadius: "12px",
                    background: "var(--toast-bg, #111827)",
                    color: "#fff",
                    fontSize: "14px",
                  },
                  success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
                  error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
                }}
              />
            </BrowserRouter>
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </StrictMode>
);