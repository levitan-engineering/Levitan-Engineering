"use client";
import { useEffect, useRef, useState } from "react";
import ServiceIntro from "./services/new-apartment/service-intro";
import InspectionJourney from "./services/new-apartment/inspection-journey";
import WhatsAppIcon from "./whatsapp-icon";
import { BUSINESS, whatsappLink } from "../lib/business";
import ConstructionSupervision, { SupervisionIcon } from "./construction-supervision";
import { supervisionServices, supervisionProjects } from "../lib/supervision";
import { normalizePhone } from "../lib/inspection";

const services = [
  { id: "new-apartment", title: "בדק בית – דירה חדשה מקבלן", description: "בדיקה הנדסית מקיפה לאיתור ליקויי בנייה, גמר ומערכות לפני קבלת הדירה, כדי שתדעו מה מצב הנכס לפני הכניסה.", action: "להתאמת הבדיקה" },
  { id: "used-apartment", title: "בדיקת דירה – יד שנייה", description: "בדיקה מקצועית של מצב הנכס לפני רכישה, לזיהוי ליקויים, סימני רטיבות ובלאי שעשויים להשפיע על החלטת הקנייה.", action: "לפרטי השירות" },
  { id: "engineering-opinion", cardTitle: "חוות דעת הנדסית מבוססת תקנים", cardDescription: "חוות דעת מקצועית ומפורטת בהתאם לתקנים ישראליים (ת״י), הכוללת תיעוד ליקויי בנייה ואסמכתאות מקצועיות, לשימוש מול קבלנים ובמסגרת הליכים משפטיים במידת הצורך.", title: "חוות דעת הנדסית", description: "מסמך מקצועי, מנומק ומתועד שמרכז את הממצאים בנכס ומסייע להבין אותם ולהציגם בפני הגורמים הרלוונטיים.", action: "לפרטי השירות" },
  { id: "shared-areas", title: "בדיקת שטחים משותפים", description: "בדיקה הנדסית של השטחים והמערכות המשותפות בבניין, לאיתור ליקויי בנייה וגמר.", action: "לפרטי השירות" },
  ...supervisionServices,
];
function Icon({ index = 0 }: { index?: number }) { return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{index === 0 ? <path d="M4 15 16 4l12 11M7 13v15h18V13M13 28V18h6v10" /> : index === 1 ? <><rect x="7" y="6" width="19" height="23" rx="2"/><path d="M12 6V3h9v3M12 15l3 3 6-6M12 24h9"/></> : index === 2 ? <><path d="M8 3h12l6 6v20H8zM20 3v7h6M12 19l3 3 6-6"/></> : <><path d="M7 29V4h15v25M22 14h5v15M4 29h25M13 29v-5h4v5M11 9h1m5 0h1m-7 5h1m5 0h1m-7 5h1m5 0h1"/></>}</svg>; }
export default function ServicesSection({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const [active, setActive] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", service: "", consent: false, project: "", location: "", stage: "", plan: "", notes: "" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [opened, setOpened] = useState(false);
  const isSupervision = supervisionServices.some(s => s.title === contact.service);
  const projectStages = supervisionProjects.find(p => p.value === contact.project)?.stages || [];
  const root = useRef<HTMLElement>(null);
  const contactHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const cards = root.current?.querySelectorAll<HTMLElement>(".services-premium-card");
    if (!cards || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('awaiting-reveal'); observer.unobserve(entry.target); } }), { threshold: .12 });
    cards.forEach(card => { card.classList.add('awaiting-reveal'); observer.observe(card); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    function readHash() {
      const id = window.location.hash.slice(1);
      if (services.some(s => s.id === id)) setActive(id);
      if (id === "supervision-contact") openSupervisionContact();
    }
    readHash(); window.addEventListener('hashchange',readHash);
    return () => window.removeEventListener('hashchange',readHash);
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const links = document.querySelectorAll<HTMLAnchorElement>('.site-header a[href="#services"], .site-header a[href="/#services"], .site-header a[href="/services/"]');
    const observer = new IntersectionObserver(entries => { const visible = entries[0]?.isIntersecting; links.forEach(link => { if (visible) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current"); }); }, { rootMargin: "-84px 0px -35% 0px", threshold: 0 });
    observer.observe(element);
    return () => { observer.disconnect(); links.forEach(link => link.removeAttribute("aria-current")); };
  }, []);
  useEffect(() => {
    function updateHeader() { document.documentElement.classList.toggle("page-scrolled", window.scrollY > 90); }
    updateHeader(); window.addEventListener("scroll", updateHeader, { passive: true });
    return () => { window.removeEventListener("scroll", updateHeader); document.documentElement.classList.remove("page-scrolled"); };
  }, []);
  function select(id: string) {
    setActive(id);
    requestAnimationFrame(() => {
      const panel = document.getElementById(`service-panel-${id}`);
      panel?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' });
      panel?.focus({preventScroll:true});
    });
  }
  function sendContact(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string,string> = {};
    if (!contact.name.trim()) next.name = "הזינו שם מלא.";
    if (!/^0(?:5\d{8}|[23489]\d{7}|7\d{8})$/.test(normalizePhone(contact.phone))) next.phone = "הזינו מספר טלפון ישראלי תקין.";
    if (isSupervision && !contact.project) next.project = "בחרו את סוג הפרויקט.";
    if (isSupervision && !contact.location.trim()) next.location = "הזינו את מיקום הפרויקט.";
    if (!contact.consent) next.consent = "נדרש אישור לשימוש בפרטים לצורך טיפול בפנייה.";
    setErrors(next); if(Object.keys(next).length) { requestAnimationFrame(()=>root.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return; }
    const message = `שלום, הגעתי מעמוד השירותים באתר לויתן הנדסה ואשמח להתייעץ לגבי בדיקה לנכס.\n\nשם: ${contact.name.trim()}\nטלפון: ${normalizePhone(contact.phone)}${contact.service ? `\nשירות מבוקש: ${contact.service}` : ""}${isSupervision ? `\nסוג הפרויקט: ${contact.project}\nמיקום: ${contact.location.trim()}\nשלב העבודה: ${contact.stage || "טרם נקבע"}\nסוג הליווי: ${contact.plan || "עדיין לא בטוח"}${contact.notes.trim() ? `\nהערות: ${contact.notes.trim()}` : ""}` : ""}`;
    window.open(whatsappLink(message),'_blank','noopener,noreferrer'); setOpened(true);
  }
  function openSupervisionContact(project = "", plan = "", stage = "") {
    setContact(c=>({...c, service:project === "שיפוץ" ? supervisionServices[1].title : supervisionServices[0].title, project, plan, stage})); setOpened(false); setErrors({}); openContact();
  }
  function openContact() { setShowContact(true); requestAnimationFrame(() => {contactHeading.current?.focus({preventScroll:true}); contactHeading.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}); }
  return <section ref={root} className="services-premium" id="services" aria-labelledby="services-heading">
    <span id="finder" className="services-anchor" aria-hidden="true" />
    <header className="services-premium-heading"><p>לויתן הנדסה | מומחיות בבדיקות מבנים</p><Heading id="services-heading">השירותים שלנו</Heading><span className="services-gold-rule" aria-hidden="true"/><p className="services-premium-lead">בדיקות הנדסיות מקצועיות לאיתור ליקויי בנייה, הערכת מצב הנכס וקבלת החלטות בביטחון.</p></header>
    <div className="services-premium-grid">{services.map((service,index) => <article className={`services-premium-card ${active===service.id?'is-active':''}`} key={service.id}>
      <div className="services-card-top"><span className="services-card-icon">{index < 4 ? <Icon index={index}/> : <SupervisionIcon kind={index-4}/>}</span><span className="services-card-number">0{index+1}</span></div>
      <h3>{"cardTitle" in service ? service.cardTitle : service.title}</h3>{"subtitle" in service && <p className="supervision-service-subtitle">{service.subtitle}</p>}<p>{"cardDescription" in service ? service.cardDescription : service.description}</p><button type="button" className="services-card-action" aria-expanded={active===service.id} aria-controls={`service-panel-${service.id}`} onClick={() => select(service.id)}>{service.action}<span aria-hidden="true">←</span></button>
    </article>)}</div>
    <div id="new-apartment" className="services-anchor" />
    <div id="shared-areas" className="services-anchor" />
    <div id="used-apartment" className="services-anchor" />
    <div id="engineering-opinion" className="services-anchor" />
    <div id="service-panel-new-apartment" tabIndex={-1} hidden={active!=="new-apartment"} className="new-apartment-page inline-apartment-service service-expanded-panel"><div className="service-expanded-bar"><span>01 / דירה חדשה מקבלן</span><button type="button" onClick={()=>{setActive(null);document.getElementById('services-heading')?.scrollIntoView({block:'start'});}}>סגירת הפרטים ×</button></div><ServiceIntro embedded/><InspectionJourney/></div>
    {services.slice(1,4).map((service,index) => <div key={service.id} id={`service-panel-${service.id}`} tabIndex={-1} hidden={active!==service.id} className="service-detail-panel service-expanded-panel"><p className="eyebrow">0{index+2} / פרטי השירות</p><h3>{service.title}</h3><p>{service.description}</p><p>{index===0 ? "הבדיקה מספקת תמונת מצב של נכס קיים לפני רכישה. בשיחה נברר את סוג הנכס, מיקומו ומועד הרכישה, ונתאים את היקף הבדיקה." : index===1 ? "בשיחה נברר את השאלה המקצועית, פרטי הנכס והמסמכים הקיימים, כדי להתאים את היקף חוות הדעת לצורך שלכם." : "בשיחה נברר את פרטי הבניין והשטחים המשותפים שברצונכם לבדוק, ונתאים את היקף הבדיקה לצורך שלכם."}</p><a className="journey-primary" href={whatsappLink(`שלום, הגעתי מאתר לויתן הנדסה ואשמח לקבל פרטים על ${service.title}.`)} target="_blank" rel="noreferrer">התייעצות לגבי השירות <WhatsAppIcon /></a><button type="button" className="journey-back" onClick={()=>setActive(null)}>סגירת הפרטים</button></div>)}
    {supervisionServices.map((service,index)=><div key={service.id} id={service.id} className="services-anchor"><div id={`service-panel-${service.id}`} tabIndex={-1} hidden={active!==service.id} className="service-detail-panel service-expanded-panel"><p className="eyebrow">0{index+5} / פיקוח ובקרת איכות</p><h3>{service.title}</h3><p className="supervision-service-subtitle">{service.subtitle}</p><p>{service.description}</p><p>{service.detail}</p><ul className="supervision-detail-list">{service.points.map(point=><li key={point}>{point}</li>)}</ul><div className="supervision-detail-actions"><button type="button" className="journey-primary" onClick={()=>openSupervisionContact(service.project)}>לתיאום שיחת היכרות</button><a href="#supervision" className="journey-secondary">מה בודקים בביקור פיקוח?</a><button type="button" className="journey-back" onClick={()=>setActive(null)}>סגירת הפרטים</button></div></div></div>)}
    <ConstructionSupervision onContact={openSupervisionContact}/>
    <section className="services-trust" aria-labelledby="services-trust-title"><h3 id="services-trust-title">למה לבחור בלויתן הנדסה?</h3><p>בדיקה מקצועית, הסברים ברורים וליווי אישי בתהליך בדיקת הנכס.</p><ul>{[["בדיקה יסודית","בחינה מקצועית של הנכס בהתאם לסוג הבדיקה ולהיקף השירות."],["דוח ברור ומפורט","ממצאים מסודרים שמסייעים להבין את מצב הנכס ואת הליקויים שאותרו."],["ליווי אישי","מענה והסברים לאורך תהליך הבדיקה."]].map(([title,text],index)=><li key={title}><Icon index={index}/><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul></section>
    <section className="services-consult" aria-labelledby="services-consult-title"><div><h3 id="services-consult-title">לא בטוחים איזו בדיקה מתאימה לכם?</h3><p>ספרו לנו על הנכס שלכם ונעזור לכם לבחור את השירות המתאים.</p></div><div className="services-consult-actions"><a href={whatsappLink("שלום, הגעתי מעמוד השירותים באתר לויתן הנדסה ואשמח להתייעץ לגבי בדיקה לנכס.")} target="_blank" rel="noreferrer"><WhatsAppIcon />התייעצות ב-WhatsApp</a><button type="button" aria-expanded={showContact} aria-controls="services-contact-form" onClick={openContact}>השארת פרטים</button></div></section>
    <span id="supervision-contact" className="services-anchor" /><div id="services-contact-form" hidden={!showContact} className="services-short-form"><h3 ref={contactHeading} tabIndex={-1}>איך אפשר לחזור אליכם?</h3><p>מלאו פרטים ונכין עבורכם הודעת WhatsApp. שליחת טופס ישירות לדוא״ל תופעל לאחר השלמת החיבור.</p><form noValidate onSubmit={sendContact}><div className="journey-field"><label htmlFor="consult-name">שם מלא (חובה)</label><input id="consult-name" required maxLength={100} autoComplete="name" value={contact.name} onChange={e=>{setContact({...contact,name:e.target.value});setOpened(false);}} aria-invalid={!!errors.name} aria-describedby={errors.name?'consult-name-error':undefined}/>{errors.name&&<small id="consult-name-error" role="alert" className="journey-error">{errors.name}</small>}</div><div className="journey-field"><label htmlFor="consult-phone">טלפון (חובה)</label><input id="consult-phone" type="tel" inputMode="tel" dir="ltr" required maxLength={24} autoComplete="tel" value={contact.phone} onChange={e=>{setContact({...contact,phone:e.target.value});setOpened(false);}} aria-invalid={!!errors.phone} aria-describedby={errors.phone?'consult-phone-error':undefined}/>{errors.phone&&<small id="consult-phone-error" role="alert" className="journey-error">{errors.phone}</small>}</div><div className="journey-field"><label htmlFor="consult-service">סוג השירות (רשות)</label><select id="consult-service" value={contact.service} onChange={e=>{setContact({...contact,service:e.target.value,project:e.target.value===supervisionServices[1].title?"שיפוץ":e.target.value===supervisionServices[0].title?"בית פרטי":"",stage:""});setOpened(false);}}><option value="">עדיין לא בטוחים</option>{services.map(s=><option key={s.id}>{s.title}</option>)}</select></div>{isSupervision&&<fieldset className="supervision-contact-fields"><legend>פרטי הפרויקט</legend><div className="journey-field"><label htmlFor="consult-project">סוג הפרויקט (חובה)</label><select id="consult-project" required value={contact.project} aria-invalid={!!errors.project} aria-describedby={errors.project?"consult-project-error":undefined} onChange={e=>{setContact({...contact,project:e.target.value,service:e.target.value==="שיפוץ"?supervisionServices[1].title:supervisionServices[0].title,stage:""});setOpened(false);}}><option value="">בחרו סוג פרויקט</option>{supervisionProjects.map(p=><option value={p.value} key={p.value}>{p.label}</option>)}</select>{errors.project&&<small id="consult-project-error" role="alert" className="journey-error">{errors.project}</small>}</div><div className="journey-field"><label htmlFor="consult-location">מיקום הפרויקט (חובה)</label><input id="consult-location" required autoComplete="address-level2" maxLength={150} value={contact.location} onChange={e=>{setContact({...contact,location:e.target.value});setOpened(false);}} aria-invalid={!!errors.location} aria-describedby={errors.location?"consult-location-error":undefined}/>{errors.location&&<small id="consult-location-error" role="alert" className="journey-error">{errors.location}</small>}</div><div className="journey-field"><label htmlFor="consult-stage">שלב העבודה הנוכחי</label><select id="consult-stage" value={contact.stage} onChange={e=>{setContact({...contact,stage:e.target.value});setOpened(false);}}><option value="">עדיין לא בטוחים</option>{projectStages.map(stage=><option key={stage.title}>{stage.title}</option>)}</select></div><div className="journey-field"><label htmlFor="consult-plan">סוג השירות</label><select id="consult-plan" value={contact.plan} onChange={e=>{setContact({...contact,plan:e.target.value});setOpened(false);}}><option value="">עדיין לא בטוח</option><option>ביקור חד־פעמי</option><option>ליווי מתמשך</option></select></div><div className="journey-field"><label htmlFor="consult-notes">הערות נוספות</label><textarea id="consult-notes" maxLength={2000} value={contact.notes} onChange={e=>{setContact({...contact,notes:e.target.value});setOpened(false);}}/></div></fieldset>}<label className="journey-consent"><input type="checkbox" checked={contact.consent} onChange={e=>setContact({...contact,consent:e.target.checked})}/><span>אני מאשר/ת שימוש בפרטים לצורך טיפול בפנייה, בהתאם ל<a href="/privacy/" target="_blank" rel="noreferrer">מדיניות הפרטיות</a>.</span></label>{errors.consent&&<p role="alert" className="journey-error">{errors.consent}</p>}<button type="submit" className="journey-primary">המשך לשליחה ב-WhatsApp <WhatsAppIcon /></button><p className="journey-note" aria-live="polite">{opened?'ההודעה מוכנה. יש ללחוץ על שליחה בתוך WhatsApp כדי להעביר אותה לעסק.':'הפרטים אינם נשלחים עד שתלחצו על שליחה ב־WhatsApp.'}</p></form></div>
  </section>;
}
