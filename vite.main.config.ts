import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve,dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  define: {
    // Embed build-time environment variables into the bundle
    'process.env.APP_PROFILE': JSON.stringify(process.env.APP_PROFILE || 'ng-nest'),
    'process.env.BACKEND': JSON.stringify(process.env.BACKEND || ''),
    'process.env.FRONTEND': JSON.stringify(process.env.FRONTEND || ''),
  },
  build: {
    outDir: '.vite/build',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: () => 'main.mjs'
    },
    rollupOptions: {
      external: ['sqlite3', ...builtinModules, 'electron'],
      output: {
        format: 'es'
      }
    }
  },
  resolve: {
    // Ensure .mjs extensions are properly handled
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
});
