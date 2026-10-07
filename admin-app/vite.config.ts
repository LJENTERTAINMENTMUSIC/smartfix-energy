import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/admin/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../lib", import.meta.url)),
    },
  },
  server: { host: "127.0.0.1", port: 5174 },
  preview: { host: "127.0.0.1", port: 4174 },
  build: { outDir: "dist" },
});
