import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
export default defineConfig({
  site: 'https://anisanar.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  // 'hybrid': todas las páginas se prerenderizan a HTML estático por defecto,
  // excepto las rutas API (src/pages/api/*) que declaran `prerender = false`
  // y necesitan ejecutarse como función serverless (ej. /api/book envía WhatsApp).
  output: 'hybrid',
  adapter: netlify(),
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});