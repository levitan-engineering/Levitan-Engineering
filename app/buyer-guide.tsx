"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { whatsappLink } from "../lib/business";
import "./buyer-guide.css";

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

function WhatsAppIcon() {
  return <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.927-3.558 7.931-7.93a7.9 7.9 0 0 0-2.328-5.607M7.994 14.521a6.57 6.57 0 0 1-3.356-.921l-.24-.144-2.492.654.666-2.43-.157-.25a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.954-6.58 6.59-6.58a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.635-2.958 6.585-6.592 6.585m3.615-4.932c-.197-.099-1.17-.578-1.351-.645-.182-.066-.314-.099-.446.1-.132.197-.512.644-.628.776-.115.132-.231.148-.429.05-.197-.1-.835-.308-1.591-.984-.588-.524-.984-1.173-1.1-1.371-.115-.198-.012-.305.087-.403.09-.089.198-.231.297-.347.099-.115.132-.198.198-.33.066-.132.033-.248-.016-.347-.05-.099-.446-1.075-.611-1.472-.16-.386-.323-.334-.446-.34l-.38-.006c-.132 0-.347.05-.529.248-.181.198-.694.678-.694 1.654s.711 1.918.81 2.05c.099.132 1.399 2.136 3.39 2.995.474.205.844.327 1.132.419.476.151.909.13 1.252.079.382-.057 1.17-.479 1.335-.942.165-.463.165-.86.116-.942-.05-.083-.182-.132-.38-.231" /></svg>;
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
    title: "מהנדס או בודק מקצועי מזהה ליקויים שלא תמיד רואים בעין",
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
      <section className="guide-contact" aria-labelledby="guide-contact-title" data-guide-reveal>
        <p className="guide-eyebrow">השלב הבא</p>
        <h3 id="guide-contact-title">לפני שמקבלים החלטה על הנכס –<br className="guide-desktop-break" /> בודקים עם מקצוענים.</h3>
        <p>מתקרבים לקבלת דירה חדשה? בדיקה מקצועית של לוויתן הנדסה תעזור לכם להכיר את מצב הנכס ולזהות ליקויים לפני קבלת החלטות חשובות.</p>
        <div className="guide-actions"><a className="guide-book" href="#contact">לתיאום בדיקה מקצועית <span aria-hidden="true">←</span></a><a className="guide-whatsapp" href={whatsappLink("שלום, הגעתי מהמדריך לרוכשי דירה באתר לוויתן הנדסה. אשמח לקבל פרטים על בדיקת דירה חדשה מקבלן.")} target="_blank" rel="noreferrer"><WhatsAppIcon />דברו איתנו ב־WhatsApp</a></div>
      </section>
      <p className="guide-note">המידע במדריך הוא כללי ואינו תחליף לבדיקה של הנכס המסוים או לייעוץ משפטי. היקף השירות נקבע לפי ההזמנה וההסמכות המתאימות.</p>
    </div>
  </section>;
}
