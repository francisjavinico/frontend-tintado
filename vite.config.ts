import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path-browserify";

import { fileURLToPath } from "url";

// Emular __dirname en ESM (porque __dirname no existe directamente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportar configuración Vite
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
