export function googleReviewUrl(value = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "") {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    if (url.hostname === "g.page" && /^\/r\/[^/]+\/review\/?$/.test(url.pathname)) return url.href;
    if (url.hostname === "search.google.com" && url.pathname === "/local/writereview" && url.searchParams.get("placeid")) return url.href;
  } catch { /* No unverified fallback links. */ }
  return "";
}
export const REVIEW_API = (process.env.NEXT_PUBLIC_REVIEW_API_URL || "").replace(/\/$/, "");
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
export const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
export const reviewServices = ["דירה חדשה מקבלן", "בדיקת דירה יד שנייה", "חוות דעת הנדסית", "בדיקת שטחים משותפים", "שירות אחר"];
export type SiteReview = { id: string; name: string; service: string; rating: number; quote: string; approved_at: string };
