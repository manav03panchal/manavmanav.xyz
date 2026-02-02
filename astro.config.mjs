import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://manavmanav.xyz',
  compressHTML: true,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});