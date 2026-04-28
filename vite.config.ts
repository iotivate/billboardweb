import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to all interfaces so devices on the LAN can reach the dev server.
    // Equivalent to `vite --host` but persistent.
    host: true,
    // Vite 6+ enforces an allowedHosts whitelist. Setting it to `true`
    // accepts any Host header, which is what we want for LAN testing
    // from phones / other devices. (Public-internet exposure is still
    // gated by the network itself; this only relaxes the in-app check.)
    allowedHosts: true,
  },
});
