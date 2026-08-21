import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

// Lighthouse fixes baked into the build config:
// 1. Brotli/gzip pre-compression of build assets ("Enable text compression")
// 2. Manual vendor chunk splitting so the initial bundle is smaller ("Reduce unused JavaScript" / "Avoid enormous network payloads")
// 3. Minification + console/debugger stripping in production ("Minify JavaScript")
export default defineConfig({
  plugins: [
    react(),
    compression({ algorithms: ["brotliCompress", "gzip"] }),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
