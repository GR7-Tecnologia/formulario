import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Qualquer requisição para /api será redirecionada para o servidor da API
      '/api': {
        target: 'http://localhost:3001', // O servidor da API
        changeOrigin: true, // Necessário para o proxy funcionar corretamente
        // A regra 'rewrite' foi removida para que o caminho completo (/api/...) seja enviado.
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
