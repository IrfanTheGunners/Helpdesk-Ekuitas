import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // ⬅️ alias

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ⬅️ Tambahkan bagian ini
  server: {
    host: true,        // wajib biar bisa diakses dari luar
    strictPort: true,  // paksa pake port yg sama (5173)
    port: 5173,        // pastikan port sama dengan yg kamu pakai
  },
});
