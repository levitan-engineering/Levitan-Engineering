"use client";

import { useEffect, useRef, useState } from "react";
import reviews from "./reviews.json";
import { whatsappLink } from "../lib/business";

// Preserve the five-star display and Google attribution from the existing cards.
function GoogleMark() {
  return <svg className="review-google-mark" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.87 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>;
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

  useEffect(() => {
    if (!root.current || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("review-awaiting");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    root.current.querySelectorAll("[data-review-reveal]").forEach(card => {
      if (!(card as HTMLElement).hidden && card.getBoundingClientRect().top > window.innerHeight) {
        card.classList.add("review-awaiting");
        observer.observe(card);
      }
    });
    return () => observer.disconnect();
  }, [expanded]);

  function toggleReviews() {
    if (expanded) toggle.current?.focus({ preventScroll: true });
    setExpanded(value => !value);
  }

  return <section ref={root} className="customer-reviews section" id="reviews" aria-labelledby="reviews-title">
    <div className="reviews-heading">
      <p className="eyebrow">לקוחות ממליצים</p>
      <h2 id="reviews-title">הלקוחות שלנו מספרים.</h2>
      <p className="reviews-subtitle">האמון שלכם. המחויבות שלנו.</p>
      <span className="reviews-gold-rule" aria-hidden="true" />
      <p className="reviews-intro">אין תחליף לחוות דעת של לקוחות שכבר עברו איתנו את הדרך. הכירו את החוויות של לקוחות שבחרו בלוויתן הנדסה לבדיקת הנכס שלהם.</p>
      <div className="reviews-trust"><span className="review-stars" aria-hidden="true">★★★★★</span><span>{reviews.length} חוות דעת של לקוחות</span></div>
    </div>
    <div className="reviews-grid">{reviews.slice(0, 4).map(review => <ReviewCard key={review.name} {...review} />)}</div>
    <div className="reviews-expand-controls"><button ref={toggle} className="reviews-expand-button" type="button" aria-expanded={expanded} aria-controls="additional-customer-reviews" onClick={toggleReviews}>{expanded ? "הצגת פחות חוות דעת" : `לצפייה בכל ${reviews.length} חוות הדעת`}<span aria-hidden="true">{expanded ? "↑" : "←"}</span></button></div>
    <div id="additional-customer-reviews" className={`reviews-expansion${expanded ? " is-expanded" : ""}`} inert={!expanded} aria-hidden={!expanded}>
      <div className="reviews-expansion-inner"><div className="reviews-grid">{reviews.slice(4).map(review => <ReviewCard key={review.name} {...review} />)}</div></div>
    </div>
    {expanded && <button className="reviews-collapse-bottom" type="button" onClick={toggleReviews}>צמצום חוות הדעת ↑</button>}
    <div className="reviews-cta" aria-labelledby="reviews-cta-title">
      <p className="eyebrow">הנכס שלכם. השקט שלכם.</p>
      <h3 id="reviews-cta-title">גם אתם רוצים להיכנס לנכס בראש שקט?</h3>
      <p>בדיקת בדק בית מקצועית ויסודית יכולה לעזור לכם לזהות ליקויי בנייה ולקבל תמונת מצב ברורה על הנכס לפני קבלת החלטות חשובות.</p>
      <div className="reviews-cta-actions"><a className="reviews-book" href="#contact">לתיאום בדיקת בדק בית <span aria-hidden="true">←</span></a><a className="reviews-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer">דברו איתנו ב-WhatsApp <span aria-hidden="true">↗</span></a></div>
    </div>
  </section>;
}
