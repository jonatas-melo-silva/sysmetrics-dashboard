import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// No `make dev` o servidor de logs roda no mesmo container, então o proxy chega nele
// em 127.0.0.1:8765 e reescreve o Host que o servidor exige.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8765',
        headers: { Host: '127.0.0.1:8765' },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
