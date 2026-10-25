"use client";
import { useState, type FormEvent } from "react";
import { REVIEW_API, SUPABASE_URL, SUPABASE_KEY, type SiteReview } from "../../../lib/review-config";
import "./review-admin.css";
type Review = SiteReview & { status: string; created_at: string };
const labels = { pending: "ממתינות לאישור", approved: "פורסמו", rejected: "נדחו", removed: "הוסרו" };
export default function ReviewAdmin() {
  const [token, setToken] = useState(""), [rows, setRows] = useState<Review[]>([]), [status, setStatus] = useState("pending"), [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const configured = REVIEW_API && SUPABASE_URL && SUPABASE_KEY;
  async function api(access: string, query: string, options: RequestInit = {}) {
    const result = await fetch(`${REVIEW_API}?admin=1${query}`, { ...options, cache: "no-store", headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" } });
    if (result.status === 401 || result.status === 403) { setToken(""); setRows([]); throw new Error("ההתחברות פגה או שאין הרשאת ניהול לחשבון זה."); }
    if (!result.ok) throw new Error(result.status === 409 ? "ההמלצה השתנתה. רעננו את הרשימה לפני פעולה נוספת." : "הפעולה לא הושלמה. נסו שוב.");
    return result.json();
  }
  async function load(access: string, filter: string, offset = 0) {
    const data = await api(access, `&status=${filter}&offset=${offset}`);
    setRows(previous => offset ? [...previous, ...data.reviews] : data.reviews); setMore(data.hasMore);
  }
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = new FormData(e.currentTarget); setBusy(true); setError("");
    let access = "";
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
      if (!response.ok) throw new Error("לא ניתן להתחבר. בדקו את פרטי החשבון.");
      const session = await response.json(); access = session.access_token;
      await load(access, "pending"); setStatus("pending"); setToken(access);
    } catch (e) { if (access) void fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${access}` } }); setError(e instanceof Error ? e.message : "לא ניתן להתחבר כרגע."); }
    finally { setBusy(false); }
  }
  async function perform(action: () => Promise<unknown>) { setBusy(true); setError(""); try { await action(); } catch (e) { setError(e instanceof Error ? e.message : "הפעולה לא הושלמה."); } finally { setBusy(false); } }
  async function moderate(review: Review, target: string) {
    if (target === "removed" && !window.confirm("להסיר את ההמלצה מהפרסום?")) return;
    await api(token, "", { method: "PATCH", body: JSON.stringify({ id: review.id, status: target, expected: review.status }) }); await load(token, status);
  }
  async function logout() {
    const access = token; setToken(""); setRows([]);
    const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${access}` } });
    if (!response.ok) throw new Error("התצוגה נסגרה, אך ביטול ההתחברות בשרת לא הושלם. סגרו את החלון.");
  }
  return <main className="review-admin" dir="rtl"><h1>ניהול המלצות</h1><p>תשע ההמלצות המקוריות נשמרות ללא שינוי. כאן מנהלים המלצות חדשות שנשלחו באתר.</p>
    {!configured ? <p>מערכת הניהול טרם חוברה למסד הנתונים.</p> : !token ? <form onSubmit={login}><label>דוא״ל<input name="email" type="email" autoComplete="username" required /></label><label>סיסמה<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={busy}>כניסה מאובטחת</button></form> : <><button onClick={() => void perform(logout)} disabled={busy}>יציאה</button><nav aria-label="סינון המלצות">{Object.entries(labels).map(([value, label]) => <button key={value} aria-pressed={status === value} disabled={busy} onClick={() => void perform(async () => { await load(token, value); setStatus(value); })}>{label}</button>)}</nav><button disabled={busy} onClick={() => void perform(() => load(token, status))}>רענון הרשימה</button>{!rows.length && <p>אין המלצות ברשימה זו.</p>}{rows.map(review => <article key={review.id}><h2>{review.name}</h2><p>{review.service} · {review.rating} מתוך 5</p><blockquote>{review.quote}</blockquote><div>{review.status !== "approved" && <button disabled={busy} onClick={() => void perform(() => moderate(review, "approved"))}>אישור ופרסום</button>}{review.status !== "rejected" && <button disabled={busy} onClick={() => void perform(() => moderate(review, "rejected"))}>דחייה</button>}{review.status !== "removed" && <button disabled={busy} onClick={() => void perform(() => moderate(review, "removed"))}>הסרה</button>}</div></article>)}{more && <button disabled={busy} onClick={() => void perform(() => load(token, status, rows.length))}>טעינת נוספות</button>}</>}{error && <p role="alert">{error}</p>}{busy && <p role="status">מבצעים את הפעולה…</p>}</main>;
}
