// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // TODO: update to the real production domain before deploying
  // (used for canonical URL, Open Graph tags and sitemap).
  site: 'https://home2u.bg',

  // We don't use Astro sessions; set a non-KV driver so the Cloudflare adapter
  // doesn't require a SESSION KV namespace at deploy time.
  session: { driver: 'memory' },

  // Pages stay static (prerendered); only the lead API + file routes run on
  // the Worker (they opt in with `export const prerender = false`).
  adapter: cloudflare({
    // Provides the wrangler.jsonc bindings (R2) locally via Miniflare during
    // `astro dev`, so the upload flow can be tested without deploying.
    platformProxy: { enabled: true },
    // We don't use Astro's image service or sessions — avoid requiring the
    // extra Cloudflare Images / KV bindings in production.
    imageService: "passthrough",
  }),
});
