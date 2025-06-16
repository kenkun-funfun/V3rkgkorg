// vite.config.ts
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { viteObfuscateFile } = require('vite-plugin-obfuscator');

const isBuild = process.env.npm_lifecycle_event === 'build';

export default defineConfig({
  plugins: [
    solidPlugin(),
    ...(isBuild ? [viteObfuscateFile({ compact: true })] : []),

    // ✅ Google Analytics タグ自動挿入
    {
      name: 'inject-google-analytics',
      transformIndexHtml(html) {
        if (!isBuild) return html;

        const gaTag = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-C979VZBPDX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-C979VZBPDX');
  </script>`;

        return html.replace('</head>', `${gaTag}\n</head>`);
      }
    }
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
