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

    // ✅ Google Analytics ＋ AdSense タグ自動挿入
    {
      name: 'inject-meta-tags',
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

        const adsenseTag = `
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5995460087390046"
    crossorigin="anonymous"></script>`;

        return html.replace('</head>', `${gaTag}\n${adsenseTag}\n</head>`);
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
