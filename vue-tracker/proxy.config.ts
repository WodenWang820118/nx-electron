import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/tasks': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
