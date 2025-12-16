import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.IS_DEV !== "true" ? "./" : "/",
  root: "src",
  loader: { ".js": "jsx" },
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5005,
  },
  build: {
    outDir: "../electron/build",
  },
});
