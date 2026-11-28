import { defineConfig } from 'vite'; import react from '@vitejs/plugin-react';
// El build se sirve desde la API .NET en /app (wwwroot/app). En desarrollo: http://localhost:5173/app/ con proxy a la API.
export default defineConfig({
  base: '/app/',
  plugins: [react()],
  build: { outDir: '../wwwroot/app', emptyOutDir: true },
  server: { proxy: { '/api': 'http://localhost:5080' } }
});
