import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ babel: { plugins: [["babel-plugin-react-compiler"]] } })],
  server: {
    proxy: {
      "/users": {
        target: "https://nodejs207.dszcbaross.edu.hu/",
        changeOrigin: true,
      },
      "/animals": {
        target: "https://nodejs207.dszcbaross.edu.hu/",
        changeOrigin: true,
      },
      "/cities": {
        target: "https://nodejs207.dszcbaross.edu.hu/",
        changeOrigin: true,
      },
      "/uploads": {
        target: "https://nodejs207.dszcbaross.edu.hu/",
        changeOrigin: true,
      },
      "/messages": {
        target: "https://nodejs207.dszcbaross.edu.hu/",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "https://nodejs207.dszcbaross.edu.hu/",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
//192.168.9.101