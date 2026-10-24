"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { whatsappLink } from "../lib/business";
import "./buyer-guide.css";
import WhatsAppIcon from "./whatsapp-icon";

type IconKind = "key" | "plan" | "report" | "home" | "calendar";
function GuideIcon({ kind }: { kind: IconKind }) {
  const paths: Record<IconKind, ReactNode> = {
    key: <><circle cx="8" cy="8" r="4.5" /><path d="m11.2 11.2 9 9M16 16l2-2m0 4 2-2" /></>,
    plan: <><path d="M4 3h16v18H4zM4 9h7V3m0 6v7h9M4 16h3m8-7h5" /><path d="M8 21v-5m8 0v5" /></>,
    report: <><path d="M7 4H4v17h16V4h-3M8 3h8v4H8zM8 12h8M8 16h5" /></>,
    home: <><path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-13 5 3 3 5-5" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}


const topics: { label: string; title: string; copy: string; icon: IconKind; detail: ReactNode }[] = [
  {
    label: "לפני המסירה", icon: "key",
    title: "דירה חדשה לא תמיד מגיעה ללא ליקויים",
    copy: "גם בדירה חדשה מקבלן עלולים להתגלות ליקויי ביצוע, גמר והתקנה. בדיקה מקצועית יכולה לסייע באיתור הליקויים ובתיעודם לפני קבלת הדירה או בסמוך למסירתה.",
    detail: <p>בדיקת דירה חדשה כוללת בחינה של רכיבים ומערכות נגישים בהתאם להיקף הבדיקה, כגון ריצוף, חיפויים, דלתות, חלונות, עבודות גמר ומערכות רלוונטיות. איתור ותיעוד מוקדם של ליקויים מאפשרים לרוכשים לפנות לקבלן בצורה מסודרת.</p>,
  },
  {
    label: "מה בודקים?", icon: "plan",
    title: "ליקויים שלא תמיד רואים בעין",
    copy: "בדיקה מקצועית משלבת ידע בתחום הבנייה, ניסיון וציוד מתאים, כדי לזהות ליקויים גלויים וסימנים לבעיות אפשריות.",
    detail: <><ul><li>ריצוף וחיפויים.</li><li>עבודות טיח, צבע וגמר.</li><li>דלתות וחלונות.</li><li>אינסטלציה וכלים סניטריים.</li><li>מערכות חשמל – בדיקות בתחום ההסמכה והסמכות המתאימות בלבד.</li><li>סימני רטיבות ואיטום.</li><li>ליקויי בטיחות נראים לעין.</li><li>התאמה לתוכניות ולמפרט, ככל שהמסמכים זמינים והנושא כלול בהיקף הבדיקה.</li></ul><p className="guide-scope-note">היקף הבדיקה נקבע לפי השירות שהוזמן. בדיקות הרסניות, בדיקות מעבדה ובדיקות של מערכות נסתרות אינן נכללות אלא אם הוסכם עליהן במפורש במסגרת השירות.</p></>,
  },
  {
    label: "מול הקבלן", icon: "report",
    title: "דוח מסודר נותן לכם בסיס מקצועי לדרישת תיקון",
    copy: "לא מספיק לדעת שקיים ליקוי. חשוב לתעד אותו באופן ברור כדי שניתן יהיה לפנות לקבלן ולבקש טיפול.",
    detail: <><p>לאחר הבדיקה מתקבל דוח מקצועי בהתאם לשירות שהוזמן, הכולל פירוט ממצאים, תיעוד וצילומים לפי הצורך. הדוח מסייע לרוכשים להציג לקבלן את הליקויים באופן מסודר ולעקוב אחר הטיפול בהם.</p><p className="guide-scope-note">הדוח אינו מבטיח שהקבלן יתקן כל ממצא או תוצאה משפטית מסוימת.</p></>,
  },
];

const stages: { title: string; copy: string; icon: IconKind }[] = [
  { title: "לפני מסירת הדירה", icon: "plan", copy: "בדיקה לפני המסירה, כאשר מתאפשרת גישה לנכס, יכולה לסייע בזיהוי ובתיעוד ליקויים לפני קבלת המפתח." },
  { title: "לאחר קבלת המפתח", icon: "home", copy: "גם לאחר המסירה ניתן לבצע בדיקה מקצועית, לאתר ליקויים ולפנות לקבלן לטיפול בהתאם לנסיבות." },
  { title: "במהלך תקופת הבדק", icon: "calendar", copy: "ניתן לתעד ליקויים שהתגלו במהלך השימוש בדירה ולבחון את הצורך בפנייה לקבלן בהתאם לדין, להסכם ולנסיבות." },
];

function TopicCard({ topic, index }: { topic: typeof topics[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const contentId = `guide-topic-${index + 1}`;
  return <article className="guide-topic" data-guide-reveal style={{ "--guide-delay": `${index * 100}ms` } as CSSProperties}>
    <div className="guide-card-top"><div><span className="guide-number" aria-hidden="true">0{index + 1}</span><span className="guide-category">{topic.label}</span></div><span className="guide-icon"><GuideIcon kind={topic.icon} /></span></div>
    <h3 id={`${contentId}-title`}>{topic.title}</h3>
    <p className="guide-topic-copy">{topic.copy}</p>
    <button className="guide-disclosure" type="button" aria-expanded={open} aria-controls={contentId} aria-label={`${open ? "פחות מידע" : "למידע נוסף"} — ${topic.label}`} onClick={() => setOpen(value => !value)}><span>{open ? "פחות מידע" : "למידע נוסף"}</span><span className="guide-plus" aria-hidden="true">{open ? "−" : "+"}</span></button>
    <div id={contentId} className={`guide-accordion${open ? " is-open" : ""}`} inert={!open} aria-hidden={!open} role="region" aria-labelledby={`${contentId}-title`}><div className="guide-accordion-inner"><div className="guide-article-body">{topic.detail}</div></div></div>
  </article>;
}

export default function BuyerGuide() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(section.querySelectorAll<HTMLElement>("[data-guide-reveal]"));
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("guide-awaiting");
      seen.add(entry.target);
      observer.unobserve(entry.target);
    }), { threshold: 0.08 });
    function updateMotion() {
      observer.disconnect();
      elements.forEach(element => {
        if (motion.matches) element.classList.remove("guide-awaiting");
        else if (!seen.has(element)) { element.classList.add("guide-awaiting"); observer.observe(element); }
      });
    }
    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => { observer.disconnect(); motion.removeEventListener("change", updateMotion); };
  }, []);

  return <section className="buyer-guide" id="insights" ref={root} aria-labelledby="buyer-guide-title">
    <div className="guide-container">
      <header className="guide-intro">
        <p className="guide-eyebrow" data-guide-reveal>המדריך לרוכשי דירה</p>
        <h2 id="buyer-guide-title" data-guide-reveal><span>לפני שמקבלים מפתח,</span> <span>מבינים מה מקבלים.</span></h2>
        <span className="guide-gold-rule" aria-hidden="true" />
        <p className="guide-lead" data-guide-reveal>כל מה שחשוב לדעת לפני קבלת דירה חדשה מקבלן – מה בודקים, אילו ליקויים עלולים להסתתר ואיך בדיקה מקצועית יכולה לעזור לכם להבין את מצב הנכס.</p>
      </header>
      <div className="guide-topics">{topics.map((topic, index) => <TopicCard key={topic.label} topic={topic} index={index} />)}</div>
      <section className="guide-timing" aria-labelledby="guide-timing-title">
        <div className="guide-section-heading" data-guide-reveal><p className="guide-eyebrow">הבדיקה בזמן שלכם</p><h3 id="guide-timing-title">מתי כדאי לבצע בדיקת בדק בית?</h3></div>
        <ol className="guide-stages">{stages.map((stage, index) => <li key={stage.title} data-guide-reveal style={{ "--guide-delay": `${index * 100}ms` } as CSSProperties}><span className="guide-stage-icon"><GuideIcon kind={stage.icon} /></span><div><h4>{stage.title}</h4><p>{stage.copy}</p></div></li>)}</ol>
      </section>
      <aside className="guide-press" aria-labelledby="guide-press-title" data-guide-reveal>
        <div className="guide-press-brand"><p className="guide-eyebrow">ידע מקצועי מהתקשורת</p><span lang="en" dir="ltr">TheMarker</span><small>כתבת רקע · 2014</small></div>
        <div className="guide-press-story"><h3 id="guide-press-title">חוקרים בטכניון: ב-100% מהדירות החדשות בישראל יש ליקויי בנייה</h3><p>כתבת רקע על מחקר שעסק בליקויי בנייה בדירות חדשות ובשאלות של איכות הביצוע והפיקוח.</p><p className="guide-source">רז סמולסקי <span aria-hidden="true">·</span> <time dateTime="2014-02-13">13.02.2014</time> <span aria-hidden="true">·</span> TheMarker</p><a className="guide-press-link" href="https://www.themarker.com/realestate/2014-02-13/ty-article/0000017f-dc45-db5a-a57f-dc6f4ee60000" target="_blank" rel="noreferrer">לקריאת הכתבה המקורית <span aria-hidden="true">←</span></a><small className="guide-press-context">הכתבה מובאת כרקע היסטורי; הנתונים בה אינם מוצגים כנתונים עדכניים. היא אינה כתבה על לוויתן הנדסה או המלצה על העסק.</small></div>
      </aside>
      <section className="guide-contact" id="contact" aria-labelledby="guide-contact-title" data-guide-reveal>
        <p className="guide-eyebrow">השלב הבא</p>
        <h3 id="guide-contact-title">לפני קבלת המפתח – דואגים לשקט הנפשי שלכם.</h3>
        <p>בדיקת דירה חדשה מקבלן תסייע לכם לאתר ליקויי בנייה, להבין את מצב הדירה ולקבל דוח מקצועי ומסודר.</p>
        <div className="guide-actions"><a className="guide-book" href="/services/new-apartment/#inspection-journey">לתיאום בדיקת דירה חדשה <span aria-hidden="true">←</span></a><a className="guide-whatsapp" href={whatsappLink("שלום, הגעתי מהמדריך לרוכשי דירה באתר לוויתן הנדסה. אשמח לקבל פרטים על בדיקת דירה חדשה מקבלן.")} target="_blank" rel="noreferrer"><WhatsAppIcon />דברו איתנו ב־WhatsApp</a></div>
      </section>
      <p className="guide-note">המידע במדריך הוא כללי ואינו תחליף לבדיקה של הנכס המסוים או לייעוץ משפטי. היקף השירות נקבע לפי ההזמנה וההסמכות המתאימות.</p>
    </div>
  </section>;
}
