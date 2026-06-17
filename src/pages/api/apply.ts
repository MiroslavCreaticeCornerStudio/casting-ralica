import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

// This route runs on the Worker (not prerendered).
export const prerender = false;

const SKYGURU_ENDPOINT = "https://test-hb.skyguru.ai/api/v1/public/leads";
const FORM_NAME = "Casting Ralica";
const MAX_FILE = 100 * 1024 * 1024; // 100 MB (Worker request-body ceiling)

// Page file inputs → label shown on the lead in the CRM (as an `extra` entry).
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

const sanitize = (name: string) =>
  (name || "file").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "file";

export const POST: APIRoute = async ({ request, url }) => {
  const bucket: any = (env as any).UPLOADS;
  if (!bucket) {
    return json({ message: "Хранилището за файлове не е конфигурирано." }, 500);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ message: "Невалидни данни от формата." }, 400);
  }

  const str = (k: string) => ((form.get(k) as string) || "").trim();

  const phone = str("phone");
  if (!phone) return json({ message: "Телефонът е задължителен." }, 422);
  if (!form.get("consent"))
    return json({ message: "Необходимо е съгласие за обработка на личните данни." }, 422);

  // Upload each provided file to R2 under a random key; collect public links.
  const extra: { name: string; value: string }[] = [];
  for (const { field, label } of FILE_FIELDS) {
    const file = form.get(field);
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE) {
        return json({ message: `${label}: файлът е твърде голям (макс. 100 MB).` }, 422);
      }
      const key = `${crypto.randomUUID()}/${sanitize(file.name)}`;
      await bucket.put(key, file.stream(), {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });
      extra.push({ name: label, value: `${url.origin}/files/${key}` });
    }
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
      const data: any = await res.json().catch(() => ({}));
      const first = data?.errors
        ? (Object.values(data.errors)[0] as any)?.[0]
        : data?.message;
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
