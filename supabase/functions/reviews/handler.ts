type Environment = { get(name: string): string | undefined };
type Dependencies = { env: Environment; fetcher?: typeof fetch; now?: () => number };
const services = ["דירה חדשה מקבלן", "בדיקת דירה יד שנייה", "חוות דעת הנדסית", "בדיקת שטחים משותפים", "שירות אחר"];
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export function validateSubmission(body: Record<string, unknown>) {
  return !!body && !Array.isArray(body) && typeof body.name === "string" && body.name.trim().length >= 2 && body.name.trim().length <= 80 &&
    typeof body.quote === "string" && body.quote.trim().length >= 10 && body.quote.trim().length <= 2000 &&
    !/(?:https?:\/\/|www\.)/i.test(body.quote) && typeof body.service === "string" && services.includes(body.service) &&
    Number.isInteger(body.rating) && Number(body.rating) >= 1 && Number(body.rating) <= 5 && body.consent === true &&
    typeof body.submissionId === "string" && uuid.test(body.submissionId) && body.website === "" &&
    typeof body.captchaToken === "string" && body.captchaToken.length > 0 && body.captchaToken.length <= 2048;
}
async function boundedText(request: Request, limit: number) {
  const reader = request.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder(); let size = 0, text = "";
  try { while (true) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > limit) { await reader.cancel(); throw new RangeError("too_large"); } text += decoder.decode(value,{stream:true}); } return text + decoder.decode(); }
  finally { reader.releaseLock(); }
}
export function createHandler({ env, fetcher = fetch, now = Date.now }: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin") || "";
    const allowed = (env.get("REVIEW_ALLOWED_ORIGINS") || "").split(",").map(x => x.trim()).filter(Boolean);
    const headers = { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Headers": "authorization,content-type", "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS", "Vary": "Origin", "Cache-Control": "no-store", "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" };
    const reply = (status: number, data: unknown) => new Response(JSON.stringify(data), { status, headers });
    if (!allowed.includes(origin)) return new Response(null, { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const base = env.get("SUPABASE_URL"), secret = env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!base || !secret) return reply(503, { error: "unavailable" });
    const db = async (path: string, options: RequestInit = {}) => {
      const response = await fetcher(`${base}/rest/v1/${path}`, { ...options, headers: { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json", ...(options.headers || {}) } });
      if (!response.ok) throw new Error("Database operation failed");
      return response.status === 204 ? null : response.json();
    };
    const url = new URL(request.url);
    const admin = url.searchParams.get("admin") === "1";
    try {
      let actor = "";
      if (admin || request.method === "PATCH") {
        const bearer = request.headers.get("authorization") || "";
        if (!/^Bearer .+/.test(bearer)) return reply(401, { error: "unauthorized" });
        const auth = await fetcher(`${base}/auth/v1/user`, { headers: { apikey: secret, Authorization: bearer } });
        if (!auth.ok) return reply(401, { error: "unauthorized" });
        const user = await auth.json();
        if (!user.id || !await db("rpc/review_is_admin", { method: "POST", body: JSON.stringify({ actor: user.id }) })) return reply(403, { error: "forbidden" });
        actor = user.id;
      }
      if (request.method === "GET") {
        const offset = Number(url.searchParams.get("offset") || 0);
        if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000) return reply(400, { error: "invalid" });
        const status = url.searchParams.get("status") || "pending";
        if (admin && !["pending", "approved", "rejected", "removed"].includes(status)) return reply(400, { error: "invalid" });
        const selection = admin ? "id,name,service,rating,quote,status,created_at,approved_at" : "id,name,service,rating,quote,approved_at";
        const rows = await db(`customer_reviews?select=${selection}&status=eq.${admin ? status : "approved"}&order=${admin ? "created_at.desc,id.desc" : "approved_at.asc,id.asc"}&offset=${offset}&limit=51`);
        return reply(200, { reviews: rows.slice(0, 50), hasMore: rows.length > 50 });
      }
      if (request.method === "PATCH") {
        const text = await boundedText(request, 1000);
        const body = JSON.parse(text);
        if (!body || !uuid.test(body.id || "") || !["approved", "rejected", "removed"].includes(body.status) || !["pending", "approved", "rejected", "removed"].includes(body.expected)) return reply(400, { error: "invalid" });
        const changed = await db("rpc/review_moderate", { method: "POST", body: JSON.stringify({ review: body.id, actor, target: body.status, expected: body.expected }) });
        return changed ? reply(200, { saved: true }) : reply(409, { error: "changed" });
      }
      if (request.method !== "POST" || admin) return reply(405, { error: "method" });
      const captchaSecret = env.get("TURNSTILE_SECRET_KEY"), salt = env.get("REVIEW_RATE_LIMIT_SALT");
      if (!captchaSecret || !salt) return reply(503, { error: "unavailable" });
      const text = await boundedText(request, 16000);
      const body = JSON.parse(text);
      if (!validateSubmission(body)) return reply(400, { error: "invalid" });
      const ip = (request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
      const hmac = await crypto.subtle.importKey("raw", new TextEncoder().encode(salt), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const bytes = await crypto.subtle.sign("HMAC", hmac, new TextEncoder().encode(`${ip}:${Math.floor(now() / 3600000)}`));
      const bucket = Array.from(new Uint8Array(bytes), x => x.toString(16).padStart(2, "0")).join("");
      if (!await db("rpc/review_rate_limit", { method: "POST", body: JSON.stringify({ bucket_key: bucket }) })) return reply(429, { error: "rate_limit" });
      const verification = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: new URLSearchParams({ secret: captchaSecret, response: body.captchaToken, remoteip: ip, idempotency_key: body.submissionId }) });
      if (!verification.ok) return reply(503, { error: "unavailable" });
      const result = await verification.json();
      if (!result.success || result.action !== "review-submit" || result.hostname !== new URL(origin).hostname) return reply(400, { error: "captcha" });
      await db("customer_reviews?on_conflict=submission_id", { method: "POST", headers: { Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ submission_id: body.submissionId, name: body.name.trim(), quote: body.quote.trim(), service: body.service, rating: body.rating, consent: true, status: "pending" }) });
      return reply(201, { saved: true, status: "pending" });
    } catch (error) {
      if (error instanceof RangeError) return reply(413, { error: "too_large" });
      if (error instanceof SyntaxError) return reply(400, { error: "invalid" });
      return reply(503, { error: "unavailable" });
    }
  };
}
