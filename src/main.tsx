import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContentProvider } from "./contexts/ContentContext";
import { ContentProgressProvider } from "./hooks/useContentProgress";
import "./config/i18n";

// After a redeploy the hashed asset filenames change, so a browser still holding
// the previous index.html will try to import chunks that no longer exist (the
// host serves index.html for the missing .js, which fails as a module). Vite
// emits `vite:preloadError` for these failed dynamic imports — recover by doing
// a one-time reload to pull the fresh index.html and chunk hashes. The
// sessionStorage flag guards against a reload loop if a chunk is truly missing.
const RELOAD_FLAG = "vite-preload-reloaded";
window.addEventListener("vite:preloadError", (event) => {
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  event.preventDefault();
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
});
window.addEventListener("load", () => {
  // Clear the guard once a navigation completes successfully so future stale
  // deploys can recover too.
  sessionStorage.removeItem(RELOAD_FLAG);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
