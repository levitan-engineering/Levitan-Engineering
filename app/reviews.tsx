"use client";

import { useEffect, useRef, useState } from "react";
import reviews from "./reviews.json";
import { whatsappLink } from "../lib/business";

// Preserve the five-star display and Google attribution from the existing cards.
function GoogleMark() {
  return <svg className="review-google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.87 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>;
}

function WhatsAppMark() {
  return <svg className="reviews-whatsapp-mark" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.927-3.558 7.931-7.93a7.9 7.9 0 0 0-2.328-5.607M7.994 14.521a6.57 6.57 0 0 1-3.356-.921l-.24-.144-2.492.654.666-2.43-.157-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.954-6.58 6.59-6.58a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.635-2.958 6.585-6.592 6.585m3.615-4.932c-.197-.099-1.17-.578-1.351-.645-.182-.066-.314-.099-.446.1-.132.197-.512.644-.628.776-.115.132-.231.148-.429.05-.197-.1-.835-.308-1.591-.984-.588-.524-.984-1.173-1.1-1.371-.115-.198-.012-.305.087-.403.09-.089.198-.231.297-.347.099-.115.132-.198.198-.33.066-.132.033-.248-.016-.347-.05-.099-.446-1.075-.611-1.472-.16-.386-.323-.334-.446-.34l-.38-.006c-.132 0-.347.05-.529.248-.181.198-.694.678-.694 1.654s.711 1.918.81 2.05c.099.132 1.399 2.136 3.39 2.995.474.205.844.327 1.132.419.476.151.909.13 1.252.079.382-.057 1.17-.479 1.335-.942.165-.463.165-.86.116-.942-.05-.083-.182-.132-.38-.231"/></svg>;
}

function ReviewCard({ quote, name }: { quote: string; name: string }) {
  return <figure className="customer-review" data-review-reveal>
    <span className="review-stars" role="img" aria-label="5 מתוך 5 כוכבים">★★★★★</span>
    <blockquote>{quote}</blockquote>
    <figcaption><span className="review-avatar" aria-hidden="true">{Array.from(name)[0]}</span><span className="review-customer"><strong dir="auto">{name}</strong><small><GoogleMark />ביקורת Google</small></span></figcaption>
  </figure>;
}

export default function Reviews() {
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const revealed = useRef(new WeakSet<Element>());

  useEffect(() => {
    const section = root.current;
    if (!section || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(section.querySelectorAll<HTMLElement>("[data-review-reveal]"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("review-awaiting");
          revealed.current.add(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    function respectMotionPreference() {
      observer.disconnect();
      elements.forEach(element => {
        if (motion.matches) {
          element.classList.remove("review-awaiting");
        } else if (!revealed.current.has(element) && !element.closest('[aria-hidden="true"]')) {
          element.classList.add("review-awaiting");
          observer.observe(element);
        }
      });
    }
    respectMotionPreference();
    motion.addEventListener("change", respectMotionPreference);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", respectMotionPreference);
    };
  }, [expanded]);

  function toggleReviews() {
    if (expanded) toggle.current?.focus();
    setExpanded(value => !value);
  }

  return <section ref={root} className="customer-reviews section" id="reviews" aria-labelledby="reviews-title">
    <div className="reviews-heading" data-review-reveal>
      <p className="eyebrow">לקוחות ממליצים</p>
      <h2 id="reviews-title"><span>המקצועיות שלנו.</span> <span>הביטחון שלכם.</span></h2>
      <span className="reviews-gold-rule" aria-hidden="true" />
      <p className="reviews-intro">לקוחות שבחרו בלוויתן הנדסה משתפים בחוויית השירות, באיכות הבדיקה ובשקט הנפשי שקיבלו לאורך הדרך.</p>
    </div>
    <div className="reviews-trust" data-review-reveal><span className="review-stars" aria-hidden="true">★★★★★</span><span>מבוסס על {reviews.length} חוות דעת של לקוחות</span></div>
    <div className="reviews-grid">{reviews.slice(0, 4).map(review => <ReviewCard key={review.name} {...review} />)}</div>
    <div className="reviews-expand-controls"><button ref={toggle} className="reviews-expand-button" type="button" aria-expanded={expanded} aria-controls="additional-customer-reviews" onClick={toggleReviews}>{expanded ? "הצגת פחות חוות דעת" : "לצפייה בכל חוות הדעת"}<span aria-hidden="true">{expanded ? "↑" : "←"}</span></button></div>
    <div id="additional-customer-reviews" className={`reviews-expansion${expanded ? " is-expanded" : ""}`} inert={!expanded} aria-hidden={!expanded}>
      <div className="reviews-expansion-inner"><div className="reviews-grid">{reviews.slice(4).map(review => <ReviewCard key={review.name} {...review} />)}</div></div>
    </div>
    {expanded && <button className="reviews-collapse-bottom" type="button" onClick={toggleReviews}>צמצום חוות הדעת ↑</button>}
    <p className="reviews-bridge" data-review-reveal>הם כבר בחרו לבדוק בראש שקט. <strong>עכשיו תורכם.</strong></p>
    <div className="reviews-cta" aria-labelledby="reviews-cta-title">
      <p className="eyebrow">הנכס שלכם. השקט שלכם.</p>
      <h3 id="reviews-cta-title">גם אתם רוצים להיכנס לנכס בראש שקט?</h3>
      <p>בדיקת בדק בית מקצועית ויסודית תעזור לכם לזהות ליקויי בנייה, להבין את מצב הנכס ולקבל החלטות מושכלות לפני קבלת המפתח.</p>
      <div className="reviews-cta-actions"><a className="reviews-book" href="#contact">לתיאום בדיקה מקצועית <span aria-hidden="true">←</span></a><a className="reviews-whatsapp" href={whatsappLink("שלום ידידיה, הגעתי לאתר לוויתן הנדסה ואשמח לתאם בדיקת בדק בית מקצועית.")} target="_blank" rel="noreferrer"><WhatsAppMark />דברו איתנו ב־WhatsApp</a></div>
    </div>
  </section>;
}
