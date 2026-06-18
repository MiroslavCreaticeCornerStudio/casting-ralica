import type { APIRoute } from "astro";

// Runs on-demand as a Vercel serverless function (not prerendered).
// Files are uploaded straight to Vercel Blob from the browser (see
// /api/blob-upload); this route receives only the small form fields plus the
// resulting Blob URLs, so it never hits the serverless request-body limit.
export const prerender = false;

const SKYGURU_ENDPOINT = "https://skyguru.ai/api/v1/public/leads";
const FORM_NAME = "Casting Ralica";

// Uploaded-file URL keys (sent by the client) → label shown on the CRM lead.
const FILE_FIELDS = [
  { field: "cv", label: "Линк към CV" },
  { field: "cover-letter", label: "Мотивационно писмо" },
  { field: "video", label: "Видео" },
];

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
];

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let data: Record<string, any>;
  try {
    data = await request.json();
  } catch {
    return json({ message: "Невалидни данни от формата." }, 400);
  }

  const str = (k: string) => String(data?.[k] ?? "").trim();

  const phone = str("phone");
  if (!phone) return json({ message: "Телефонът е задължителен." }, 422);
  if (!data?.consent)
    return json({ message: "Необходимо е съгласие за обработка на личните данни." }, 422);

  // Files were uploaded straight to Blob from the browser — we receive URLs.
  const files = (data?.files ?? {}) as Record<string, unknown>;
  const extra: { name: string; value: string }[] = [];
  for (const { field, label } of FILE_FIELDS) {
    const url = typeof files[field] === "string" ? (files[field] as string).trim() : "";
    if (url) extra.push({ name: label, value: url });
  }

  const tracking: Record<string, string> = {};
  for (const k of TRACKING_KEYS) {
    const v = str(k);
    if (v) tracking[k] = v;
  }

  const payload: Record<string, unknown> = {
    phone,
    name: str("name") || undefined,
    email: str("email") || undefined,
    form: FORM_NAME,
    ...tracking,
    ...(extra.length ? { extra } : {}),
  };

  try {
    const res = await fetch(SKYGURU_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) return json({ success: true }, 201);

    if (res.status === 422) {
      const d: any = await res.json().catch(() => ({}));
      const first = d?.errors
        ? (Object.values(d.errors)[0] as any)?.[0]
        : d?.message;
      return json({ message: first || "Моля, проверете въведените данни." }, 422);
    }
    if (res.status === 429) {
      return json({ message: "Твърде много заявки. Опитайте отново след минута." }, 429);
    }
    return json({ message: "Възникна грешка при изпращането. Опитайте отново по-късно." }, 502);
  } catch {
    return json({ message: "Неуспешна връзка със сървъра." }, 502);
  }
};
