import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ babel: { plugins: [["babel-plugin-react-compiler"]] } })],
  server: {
    proxy: {
      "/users": {
        target: "http://192.168.9.101:4000",
        changeOrigin: true,
      },
      "/animals": {
        target: "http://192.168.9.101:4000",
        changeOrigin: true,
      },
      "/cities": {
        target: "http://192.168.9.101:4000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://192.168.9.101:4000",
        changeOrigin: true,
      },
      "/messages": {
        target: "http://192.168.9.101:4000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://192.168.9.101:4000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
//192.168.9.101