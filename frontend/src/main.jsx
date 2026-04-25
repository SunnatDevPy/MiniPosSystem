import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/AppRoot";

const SW_CLEANUP_RELOAD_KEY = "sw-cleanup-reload-done";

window.addEventListener("load", async () => {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  // If this tab is still controlled by an old SW, reload once after cleanup.
  if (navigator.serviceWorker?.controller && !sessionStorage.getItem(SW_CLEANUP_RELOAD_KEY)) {
    sessionStorage.setItem(SW_CLEANUP_RELOAD_KEY, "1");
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
