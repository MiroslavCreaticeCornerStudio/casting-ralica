import type { APIRoute } from "astro";

// TEMPORARY diagnostic — reports Blob-related env var NAMES (no values) so we can
// see whether/under what name Vercel injects the Blob token at runtime. Remove me.
export const prerender = false;

export const GET: APIRoute = async () => {
  const blobEnvKeys = Object.keys(process.env).filter((k) => /BLOB/i.test(k));
  const body = {
    blobEnvKeys, // names only
    hasDefault: !!process.env.BLOB_READ_WRITE_TOKEN,
    totalEnvKeys: Object.keys(process.env).length,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    node: process.version,
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
