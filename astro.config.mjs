import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

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
  output: 'hybrid',
  adapter: vercel(),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});