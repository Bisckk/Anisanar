import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://anisanar.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
});