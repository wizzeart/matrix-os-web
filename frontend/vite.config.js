import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Exponer al contenedor
    port: 3000,
  }
});
