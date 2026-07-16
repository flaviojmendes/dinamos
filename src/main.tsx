import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContentProvider } from "./contexts/ContentContext";
import { ContentProgressProvider } from "./hooks/useContentProgress";
import { whenI18nReady } from "./config/i18n";

const RELOAD_FLAG = "vite-preload-reloaded";
window.addEventListener("vite:preloadError", (event) => {
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  event.preventDefault();
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
});
window.addEventListener("load", () => {
  sessionStorage.removeItem(RELOAD_FLAG);
});

function Bootstrap() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ContentProvider>
            <ContentProgressProvider>
              <App />
            </ContentProgressProvider>
          </ContentProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

whenI18nReady().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Bootstrap />
    </React.StrictMode>,
  );
});
