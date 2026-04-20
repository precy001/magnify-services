import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy backend requests to a local PHP server during development.
    // Start it separately:  php -S localhost:8000 -t .
    // See PHP_SETUP.md for details.
    proxy: {
      "/api": {
        target: process.env.VITE_PHP_BACKEND_URL || "http://localhost:8000",
        changeOrigin: true,
      },
      "/admin": {
        target: process.env.VITE_PHP_BACKEND_URL || "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
