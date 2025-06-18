// vite.config.ts
import { defineConfig } from "file:///C:/solid/rkgkorg/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///C:/solid/rkgkorg/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import path from "path";
import { createRequire } from "module";
var __vite_injected_original_dirname = "C:\\solid\\rkgkorg";
var __vite_injected_original_import_meta_url = "file:///C:/solid/rkgkorg/vite.config.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var { viteObfuscateFile } = require2("vite-plugin-obfuscator");
var isBuild = process.env.npm_lifecycle_event === "build";
var vite_config_default = defineConfig({
  plugins: [
    solidPlugin(),
    ...isBuild ? [viteObfuscateFile({ compact: true })] : [],
    // ✅ Google Analytics タグ自動挿入
    {
      name: "inject-google-analytics",
      transformIndexHtml(html) {
        if (!isBuild)
          return html;
        const gaTag = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-C979VZBPDX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-C979VZBPDX');
  </script>`;
        return html.replace("</head>", `${gaTag}
</head>`);
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    target: "esnext"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxzb2xpZFxcXFxya2drb3JnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxzb2xpZFxcXFxya2drb3JnXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9zb2xpZC9ya2drb3JnL3ZpdGUuY29uZmlnLnRzXCI7Ly8gdml0ZS5jb25maWcudHNcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHNvbGlkUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXNvbGlkJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5cbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCB7IHZpdGVPYmZ1c2NhdGVGaWxlIH0gPSByZXF1aXJlKCd2aXRlLXBsdWdpbi1vYmZ1c2NhdG9yJyk7XG5cbmNvbnN0IGlzQnVpbGQgPSBwcm9jZXNzLmVudi5ucG1fbGlmZWN5Y2xlX2V2ZW50ID09PSAnYnVpbGQnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc29saWRQbHVnaW4oKSxcbiAgICAuLi4oaXNCdWlsZCA/IFt2aXRlT2JmdXNjYXRlRmlsZSh7IGNvbXBhY3Q6IHRydWUgfSldIDogW10pLFxuXG4gICAgLy8gXHUyNzA1IEdvb2dsZSBBbmFseXRpY3MgXHUzMEJGXHUzMEIwXHU4MUVBXHU1MkQ1XHU2MzNGXHU1MTY1XG4gICAge1xuICAgICAgbmFtZTogJ2luamVjdC1nb29nbGUtYW5hbHl0aWNzJyxcbiAgICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sKSB7XG4gICAgICAgIGlmICghaXNCdWlsZCkgcmV0dXJuIGh0bWw7XG5cbiAgICAgICAgY29uc3QgZ2FUYWcgPSBgXG4gIDwhLS0gR29vZ2xlIHRhZyAoZ3RhZy5qcykgLS0+XG4gIDxzY3JpcHQgYXN5bmMgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RhZy9qcz9pZD1HLUM5NzlWWkJQRFhcIj48L3NjcmlwdD5cbiAgPHNjcmlwdD5cbiAgICB3aW5kb3cuZGF0YUxheWVyID0gd2luZG93LmRhdGFMYXllciB8fCBbXTtcbiAgICBmdW5jdGlvbiBndGFnKCl7ZGF0YUxheWVyLnB1c2goYXJndW1lbnRzKTt9XG4gICAgZ3RhZygnanMnLCBuZXcgRGF0ZSgpKTtcbiAgICBndGFnKCdjb25maWcnLCAnRy1DOTc5VlpCUERYJyk7XG4gIDwvc2NyaXB0PmA7XG5cbiAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZSgnPC9oZWFkPicsIGAke2dhVGFnfVxcbjwvaGVhZD5gKTtcbiAgICAgIH1cbiAgICB9XG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCO0FBSjlCLElBQU0sbUNBQW1DO0FBQW9HLElBQU0sMkNBQTJDO0FBTTlMLElBQU1BLFdBQVUsY0FBYyx3Q0FBZTtBQUM3QyxJQUFNLEVBQUUsa0JBQWtCLElBQUlBLFNBQVEsd0JBQXdCO0FBRTlELElBQU0sVUFBVSxRQUFRLElBQUksd0JBQXdCO0FBRXBELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLFlBQVk7QUFBQSxJQUNaLEdBQUksVUFBVSxDQUFDLGtCQUFrQixFQUFFLFNBQVMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQUE7QUFBQSxJQUd4RDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sbUJBQW1CLE1BQU07QUFDdkIsWUFBSSxDQUFDO0FBQVMsaUJBQU87QUFFckIsY0FBTSxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVkLGVBQU8sS0FBSyxRQUFRLFdBQVcsR0FBRyxLQUFLO0FBQUEsUUFBVztBQUFBLE1BQ3BEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicmVxdWlyZSJdCn0K
