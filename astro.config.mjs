// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // TODO: update to the real production domain before launch
  // (used for canonical URL, Open Graph tags and sitemap).
  site: 'https://home2u.bg',

  // Pages stay static (prerendered); only the lead API runs on-demand as a
  // Vercel serverless function (it opts in with `export const prerender = false`).
  // Uploaded files go to Vercel Blob, so no extra bindings/config are required.
  adapter: vercel(),
});
