"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { REVIEW_API, TURNSTILE_KEY, googleReviewUrl, reviewServices, type SiteReview } from "../lib/review-config";
import "./review-submission.css";

type Turnstile = { render(el: HTMLElement, options: Record<string, unknown>): string; remove(id: string): void; reset(id: string): void };
declare global { interface Window { turnstile?: Turnstile } }
function GoogleMark() {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.87 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>;
}
function GoogleButton() {
  const link = googleReviewUrl();
  return link ? <a className="review-new-secondary" href={link} target="_blank" rel="noreferrer"><GoogleMark />כתבו ביקורת בגוגל</a> : null;
}
export default function ReviewSubmission() {
  const [open, setOpen] = useState(false), [saved, setSaved] = useState(false), [sending, setSending] = useState(false);
  const [error, setError] = useState(""), [captcha, setCaptcha] = useState(""), [rating, setRating] = useState(0);
  const [items, setItems] = useState<SiteReview[]>([]), [more, setMore] = useState(false), [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null), widget = useRef<HTMLDivElement>(null), widgetId = useRef<string | null>(null);
  const submissionId = useRef("");
  const configured = !!REVIEW_API && !!TURNSTILE_KEY;
  async function loadReviews(offset: number, signal?: AbortSignal) {
    setLoading(true); setListError("");
    try {
      const response = await fetch(`${REVIEW_API}?offset=${offset}`, { signal, cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data.reviews) || !data.reviews.every((r: SiteReview) => typeof r.id === "string" && typeof r.name === "string" && typeof r.quote === "string" && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5)) throw new Error();
      setItems(previous => offset ? [...previous, ...data.reviews] : data.reviews); setMore(!!data.hasMore);
    } catch (e) { if (!(e instanceof DOMException && e.name === "AbortError")) setListError("לא ניתן לטעון כרגע המלצות נוספות. אפשר לנסות שוב."); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (!REVIEW_API) return;
    const controller = new AbortController(); void loadReviews(0, controller.signal);
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    if (!configured || saved) return;
    let active = true, attempts = 0;
    const render = () => {
      if (!active) return;
      if (window.turnstile && widget.current) {
        widgetId.current = window.turnstile.render(widget.current, { sitekey: TURNSTILE_KEY, action: "review-submit", size: "flexible", language: "he", callback: (token: string) => setCaptcha(token), "expired-callback": () => setCaptcha(""), "error-callback": () => { setCaptcha(""); setError("לא ניתן להשלים כרגע את בדיקת האבטחה. נסו שוב מאוחר יותר."); } });
      } else if (++attempts < 100) timer = window.setTimeout(render, 100);
      else setError("לא ניתן לטעון את בדיקת האבטחה. בדקו את החיבור ונסו שוב.");
    };
    let timer: number | undefined;
    if (!document.getElementById("review-turnstile-script")) {
      const script = document.createElement("script"); script.id = "review-turnstile-script"; script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; document.head.appendChild(script);
    }
    render();
    return () => { active = false; window.clearTimeout(timer); if (widgetId.current) window.turnstile?.remove(widgetId.current); widgetId.current = null; };
  }, [open, saved, configured]);
  function launch() { setSaved(false); setError(""); setRating(0); setCaptcha(""); submissionId.current = crypto.randomUUID(); setOpen(true); }
  function close() { if (sending) return; dialog.current?.close(); setOpen(false); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (sending || !configured) return;
    const form = event.currentTarget; if (!form.reportValidity()) return;
    if (!rating) { setError("בחרו דירוג בין כוכב אחד לחמישה כוכבים."); return; }
    if (!captcha) { setError("יש להשלים את בדיקת האבטחה לפני השליחה."); return; }
    const values = new FormData(form); setSending(true); setError("");
    try {
      const response = await fetch(REVIEW_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionId: submissionId.current, name: values.get("name"), service: values.get("service"), rating, quote: values.get("quote"), consent: values.get("consent") === "on", website: values.get("website") || "", captchaToken: captcha }) });
      const data = await response.json();
      if (!response.ok || data.saved !== true || data.status !== "pending") throw new Error(response.status === 429 ? "יותר מדי ניסיונות שליחה. נסו שוב מאוחר יותר." : "ההמלצה לא נשמרה. אפשר לנסות שוב; התוכן שלכם נשמר בטופס.");
      setSaved(true);
    } catch (e) { setError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "ההמלצה לא נשמרה. בדקו את החיבור ונסו שוב."); setCaptcha(""); if (widgetId.current) window.turnstile?.reset(widgetId.current); }
    finally { setSending(false); }
  }
  return <div className="review-additions">
    {items.length > 0 && <section className="review-site-list" aria-labelledby="site-review-title"><h3 id="site-review-title">המלצות שנכתבו באתר</h3><div className="reviews-grid">{items.map(review => <figure className="customer-review" key={review.id}><span className="review-stars" role="img" aria-label={`${review.rating} מתוך 5 כוכבים`}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span><blockquote>{review.quote}</blockquote><figcaption><span className="review-avatar" aria-hidden="true">{Array.from(review.name)[0]}</span><span className="review-customer"><strong dir="auto">{review.name}</strong><small>המלצה שנכתבה באתר</small></span></figcaption></figure>)}</div></section>}
    {listError && <p role="status">{listError}<button className="review-new-secondary" onClick={() => void loadReviews(items.length)}>ניסיון נוסף</button></p>}
    {more && <button className="review-new-secondary" onClick={() => void loadReviews(items.length)} disabled={loading}>{loading ? "טוענים…" : "להמלצות נוספות מהאתר"}</button>}
    <div className="review-writing-actions"><button className="review-new-primary" onClick={launch}>כתבו עלינו המלצה</button><GoogleButton /></div>
    <dialog ref={dialog} className="review-writing-dialog" aria-labelledby="review-writing-title" onClose={() => setOpen(false)} onCancel={e => { if (sending) e.preventDefault(); }}>
      <div className="review-dialog-head"><h3 id="review-writing-title">{saved ? "תודה על ההמלצה" : "שתפו אותנו בחוויה שלכם"}</h3><button type="button" onClick={close} disabled={sending} aria-label="סגירת הטופס">×</button></div>
      {saved ? <div className="review-thanks" role="status"><p>תודה רבה על ההמלצה ועל האמון בלויתן הנדסה!</p><p>ההמלצה נשמרה ותפורסם לאחר בדיקה ואישור.</p>{googleReviewUrl() && <><p>נשמח אם תשתפו את החוויה שלכם גם בגוגל.</p><GoogleButton /></>}<button className="review-new-secondary" onClick={close}>סיום</button></div> : !configured ? <p>כתיבת המלצות באתר תהיה זמינה בקרוב. תודה על הסבלנות.</p> : <form onSubmit={submit}>
        <p>ספרו על השירות שקיבלתם. ההמלצה תפורסם רק לאחר בדיקה ואישור.</p>
        <label>שם הלקוח<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
        <label>סוג השירות<select name="service" required defaultValue=""><option value="" disabled>בחרו שירות</option>{reviewServices.map(service => <option key={service}>{service}</option>)}</select></label>
        <fieldset className="review-rating"><legend>הדירוג שלכם</legend>{[1,2,3,4,5].map(value => <label key={value}><input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} required /><span aria-hidden="true">{value <= rating ? "★" : "☆"}</span><span className="review-visually-hidden">{value} מתוך 5 כוכבים</span></label>)}</fieldset>
        <label>ההמלצה שלכם<textarea name="quote" required minLength={10} maxLength={2000} rows={5} /></label>
        <div className="review-honeypot" aria-hidden="true"><label>אתר אינטרנט<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="review-consent"><input type="checkbox" name="consent" required /><span>אני מסכים/ה לפרסום שמי, הדירוג וההמלצה באתר לויתן הנדסה, ומאשר/ת שההמלצה מתארת חוויה אישית אמיתית.</span></label>
        <div ref={widget} className="review-captcha" />
        {error && <p className="review-form-error" role="alert">{error}</p>}
        <button className="review-new-primary" type="submit" disabled={sending || !captcha}>{sending ? "שומרים את ההמלצה…" : "שליחת המלצה"}</button>
      </form>}
    </dialog>
  </div>;
}
