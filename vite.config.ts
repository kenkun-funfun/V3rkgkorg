// vite.config.ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// ✅ default ではなく、viteObfuscateFile を明示的に取得する！
const { viteObfuscateFile } = require('vite-plugin-obfuscator');

const isBuild = process.env.npm_lifecycle_event === 'build';

export default defineConfig({
  plugins: [
    solidPlugin(),
    ...(isBuild ? [viteObfuscateFile({ compact: true })] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
  },
});
