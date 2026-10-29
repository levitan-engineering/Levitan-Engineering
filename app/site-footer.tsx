"use client";

import { useEffect, useRef } from "react";
import { BUSINESS, whatsappLink } from "../lib/business";
import WhatsAppIcon from "./whatsapp-icon";
import "./site-footer.css";

function ContactIcon({ type }: { type: "phone" | "email" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{type === "email" ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> : <path d="m7 3 3 5-2 2a15 15 0 0 0 6 6l2-2 5 3c0 3-2 4-4 4C10 20 4 14 3 7c0-2 1-4 4-4Z" />}</svg>;
}

export default function SiteFooter() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const footer = root.current;
    if (!footer || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const items = Array.from(footer.querySelectorAll<HTMLElement>("[data-footer-reveal]"));
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("footer-awaiting");
        seen.add(entry.target);
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.05 });
    function updateMotion() {
      observer.disconnect();
      items.forEach(item => {
        if (motion.matches) item.classList.remove("footer-awaiting");
        else if (!seen.has(item)) { item.classList.add("footer-awaiting"); observer.observe(item); }
      });
    }
    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => { observer.disconnect(); motion.removeEventListener("change", updateMotion); };
  }, []);

  return <footer ref={root} className="footer-premium" id="footer" aria-label="פרטי העסק וניווט תחתון">
    <div className="footer-premium-inner">
      <section className="footer-transition" aria-labelledby="footer-transition-title" data-footer-reveal>
        <h2 id="footer-transition-title">מקבלים תמונה הנדסית ברורה.<br /> מקבלים החלטות בביטחון.</h2>
        <a className="footer-transition-button" href={whatsappLink()} target="_blank" rel="noreferrer"><WhatsAppIcon />לתיאום בדיקה ב־WhatsApp</a>
      </section>
      <div className="footer-premium-main" data-footer-reveal>
        <div className="footer-premium-brand">
          <a className="footer-brand-link" href="#top" aria-label="לויתן הנדסה — חזרה לראש העמוד"><img src="/assets/img/logo-transparent.png" width="1556" height="1332" alt="לויתן הנדסה" loading="lazy" /></a>
          <p>לויתן הנדסה – בדק בית, בדיקות איכות בנייה וחוות דעת הנדסיות. מקצועיות, דיוק ושקט נפשי בכל בדיקה.</p>
        </div>
        <nav className="footer-premium-column" aria-labelledby="footer-nav-title">
          <h3 id="footer-nav-title">ניווט</h3>
          <a href="/services/">שירותים</a><a href="#check">מה נבדק</a><a href="#about">אודות</a><a href="#reviews">המלצות</a><a href="#contact">יצירת קשר</a>
        </nav>
        <nav className="footer-premium-column" aria-labelledby="footer-services-title">
          <h3 id="footer-services-title">שירותים</h3>
          <a href="/services/#new-apartment">בדק בית לדירה חדשה מקבלן</a><a href="/services/#used-apartment">בדיקת דירה יד שנייה</a><a href="/services/#engineering-opinion">חוות דעת הנדסית</a><a href="/services/#shared-areas">בדיקת שטחים משותפים</a><a href="/services/#supervision">פיקוח בנייה ושיפוצים</a>
        </nav>
        <div className="footer-premium-contact">
          <h3>מדברים ישירות</h3>
          <a className="footer-premium-phone" href={`tel:${BUSINESS.telephone}`}><ContactIcon type="phone" /><bdi>{BUSINESS.displayPhone}</bdi></a>
          <a className="footer-premium-email" href={`mailto:${BUSINESS.email}`}><ContactIcon type="email" /><bdi>{BUSINESS.email}</bdi></a>
          <a className="footer-direct-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer"><WhatsAppIcon /><span>דברו איתנו ב־WhatsApp</span></a>
          <a href="/services/#supervision-contact">לפנייה בנושא פיקוח בנייה</a><p>שפלה · דרום</p><small>מענה אישי מידידיה לויתן</small>
        </div>
      </div>
      <div className="footer-premium-bottom"><span>© 2026 לויתן הנדסה. כל הזכויות שמורות.</span><a href="#top">חזרה למעלה <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>;
}
