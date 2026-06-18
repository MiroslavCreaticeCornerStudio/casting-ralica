import type { APIRoute } from "astro";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// Issues short-lived client tokens so the browser can upload files DIRECTLY to
// Vercel Blob (bypassing the ~4.5MB serverless request-body limit). Runs on the
// Vercel function; reads BLOB_READ_WRITE_TOKEN from the environment.
export const prerender = false;

const MAX_FILE = 100 * 1024 * 1024; // 100 MB

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "video/3gpp",
  "video/x-msvideo",
  "video/mpeg",
];

export const POST: APIRoute = async ({ request }) => {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        maximumSizeInBytes: MAX_FILE,
        addRandomSuffix: true,
      }),
      // We read the returned URL on the client, so no completion work is needed.
      onUploadCompleted: async () => {},
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 400 });
  }
};
