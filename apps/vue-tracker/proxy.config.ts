import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/tasks': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
