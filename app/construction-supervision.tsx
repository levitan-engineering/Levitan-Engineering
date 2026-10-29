"use client";
import { useEffect, useRef, useState } from "react";
import { focusedReportBusinessDays, supervisionDisclaimer, supervisionProjects } from "../lib/supervision";
import "./construction-supervision.css";

export function SupervisionIcon({ kind = 0 }: { kind?: number }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind % 4 === 0 ? <><path d="M4 16 16 5l12 11M8 13v15h16V13M13 28v-9h6v9M22 4v6"/><path d="m12 13 3 3 5-5"/></> : kind % 4 === 1 ? <><path d="m5 27 14-14M18 5a7 7 0 0 0 9 9l-7 7-9-9zM4 24l4 4M6 6l7 7M4 4l4 2-2 2z"/></> : kind % 4 === 2 ? <><rect x="7" y="5" width="19" height="24" rx="2"/><path d="M12 5V3h9v2M12 14l3 3 6-6M12 23h9"/></> : <><path d="M5 24h22M8 24v-8a8 8 0 0 1 16 0v8M13 8V4h6v4M16 4v13M5 24v4h22v-4"/></>}</svg>;
}
export default function ConstructionSupervision({ onContact }: { onContact: (project?: string, plan?: string, stage?: string) => void }) {
  const [project, setProject] = useState(0);
  const [stage, setStage] = useState(0);
  const root = useRef<HTMLElement>(null);
  const selected = supervisionProjects[project];
  const current = selected.stages[stage];
  useEffect(() => {
    const items = root.current?.querySelectorAll<HTMLElement>("[data-supervision-reveal]");
    if (!items || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove("supervision-awaiting"); seen.add(entry.target); observer.unobserve(entry.target); } }), {threshold:.08});
    function update() { observer.disconnect(); items!.forEach(item => { if (motion.matches) item.classList.remove("supervision-awaiting"); else if (!seen.has(item)) { item.classList.add("supervision-awaiting"); observer.observe(item); } }); }
    update(); motion.addEventListener("change", update);
    return () => { observer.disconnect(); motion.removeEventListener("change", update); items.forEach(item=>item.classList.remove("supervision-awaiting")); };
  }, []);
  return <section className="supervision" id="supervision" ref={root} aria-labelledby="supervision-title">
    <header className="supervision-heading" data-supervision-reveal><p className="eyebrow">פיקוח בנייה ובקרת איכות הביצוע</p><h2 id="supervision-title">מה בודקים בביקור פיקוח?</h2><p>כל שלב בבנייה דורש תשומת לב לפרטים אחרים. בחרו את סוג הפרויקט ואת שלב העבודה כדי להכיר את הבדיקות המתבצעות במסגרת ביקור פיקוח ובקרת איכות.</p></header>
    <div className="supervision-selector" data-supervision-reveal>
      <fieldset className="supervision-projects"><legend><span>01</span> בחרו את סוג הפרויקט</legend><div>{supervisionProjects.map((item,index)=><button type="button" key={item.value} aria-pressed={project===index} onClick={()=>{setProject(index);setStage(0);}}><SupervisionIcon kind={index}/>{item.label}</button>)}</div></fieldset>
      <div className="supervision-workspace"><fieldset className="supervision-stages"><legend><span>02</span> בחרו את שלב העבודה</legend><div>{selected.stages.map((item,index)=><button type="button" key={item.title} aria-pressed={stage===index} aria-controls="supervision-checks" onClick={()=>setStage(index)}><span aria-hidden="true">0{index+1}</span>{item.title}<span aria-hidden="true">←</span></button>)}</div></fieldset>
      <section id="supervision-checks" className="supervision-checks" aria-live="polite" aria-atomic="true"><div key={`${project}-${stage}`} className="supervision-checks-content"><p className="eyebrow">{selected.label} / שלב 0{stage+1}</p><h3>{current.title}</h3><ul>{current.checks.map(check=><li key={check}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m5 12 4 4 10-10"/></svg>{check}</li>)}</ul><button type="button" className="journey-primary" onClick={()=>onContact(selected.value,"",current.title)}>לתיאום ביקור בשלב זה <span aria-hidden="true">←</span></button></div></section></div>
      <p className="supervision-disclaimer">{supervisionDisclaimer}</p>
    </div>
    <figure className="supervision-site-photo" data-supervision-reveal><img src="/assets/img/proj2.jpg" width="760" height="760" alt="עבודות שלד ותשתיות באתר בנייה" loading="lazy"/><figcaption>בקרת איכות הביצוע, בהתאם לשלב העבודה.</figcaption></figure>
    <section className="supervision-process" aria-labelledby="supervision-process-title" data-supervision-reveal><h2 id="supervision-process-title">איך מתבצע ביקור פיקוח?</h2><ol>{[
      ["היכרות והכנה", "בירור מצב הפרויקט, שלב הביצוע, צורכי הלקוח ועיון במסמכים ובתוכניות הרלוונטיות שהועברו מראש."],
      ["ביקור מקצועי בשטח", "בדיקה חזותית ומדגמית של העבודות הנגישות, בחינת איכות הביצוע ותיעוד ממצאים בהתאם להיקף השירות."],
      ["סיכום מקצועי", "הצגת הממצאים המרכזיים ללקוח, הסבר על ליקויים שהתגלו והמלצות להמשך טיפול."],
      ["קבלת דוח פיקוח", "מסירת דוח מסודר הכולל ממצאים, תמונות והמלצות, בהתאם להיקף הביקור שסוכם."],
    ].map(([title,copy],index)=><li key={title}><span className="supervision-step-number">0{index+1}</span><SupervisionIcon kind={index}/><h3>{title}</h3><p>{copy}</p></li>)}</ol><p className="supervision-time">ביקור ממוקד נמשך בדרך כלל כשעתיים עד שלוש שעות בשטח, בהתאם להיקף הפרויקט. {focusedReportBusinessDays ? `דוח ביקור פיקוח ממוקד יימסר בתוך עד ${focusedReportBusinessDays} ימי עסקים.` : "מועד מסירת דוח הפיקוח ייקבע בתיאום מראש."} דוחות בדק בית נמסרים בתוך עד 7 ימי עסקים.</p></section>
    <section aria-labelledby="supervision-plans-title" className="supervision-plans" data-supervision-reveal><h2 id="supervision-plans-title">ביקור חד־פעמי או פיקוח מתמשך?</h2><div>{[
      {title:"ביקור פיקוח חד־פעמי",text:"מתאים ללקוחות המעוניינים בבדיקה מקצועית בשלב מסוים בבנייה או בשיפוץ.",items:["תיאום הביקור והגדרת היקפו.","בדיקת העבודות הרלוונטיות בשטח.","תיעוד ליקויים וממצאים.","סיכום מקצועי ודוח בהתאם להזמנה."],action:"לתיאום ביקור פיקוח",plan:"ביקור חד־פעמי"},
      {title:"פיקוח וליווי מתמשך",text:"מתאים ללקוחות המעוניינים בבקרה מקצועית לאורך מספר שלבי עבודה.",items:["תכנון ביקורים לפי אבני דרך בפרויקט.","בדיקות איכות בשלבים השונים.","תיעוד ממצאים.","מעקב אחר תיקון ליקויים בביקורים חוזרים.","המלצות מקצועיות לאורך התקדמות העבודות."],action:"לקבלת הצעה לליווי הפרויקט",plan:"ליווי מתמשך"},
    ].map((plan,index)=><article key={plan.title}><SupervisionIcon kind={index+2}/><p className="eyebrow">{index===0?"בקרה בשלב שבחרתם":"בקרה לאורך הדרך"}</p><h3>{plan.title}</h3><p>{plan.text}</p>{index===1&&<small>כולל, בהתאם להסכם:</small>}<ul>{plan.items.map(item=><li key={item}>{item}</li>)}</ul><button type="button" className="journey-primary" onClick={()=>onContact(undefined,plan.plan)}>{plan.action}<span aria-hidden="true">←</span></button></article>)}</div><p className="supervision-disclaimer">ביקור חד־פעמי מתייחס לעבודות שנבדקו במועד הביקור ולהיקף שהוזמן; הוא אינו כולל פיקוח רציף בין הביקורים.</p></section>
    <section className="supervision-benefits" aria-labelledby="supervision-benefits-title" data-supervision-reveal><div><p className="eyebrow">מבט מקצועי. ליווי אישי.</p><h2 id="supervision-benefits-title">למה לבחור בלויתן הנדסה?</h2><ul>{[["ניסיון מהשטח","5 שנות ניסיון בפיקוח בנייה וניהול פרויקטים."],["הכשרה מקצועית","הנדסאי בניין ובעל הכשרה בבדק בית ואיכות הבנייה."],["בקרה מקצועית","התמקדות באיכות הביצוע, בפרטים ובאיתור מוקדם של ליקויים."],["שקיפות ותיעוד","ממצאים מסודרים, תיעוד מצולם והמלצות ברורות ללקוח."]].map(([title,text],index)=><li key={title}><SupervisionIcon kind={index}/><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul><a href="/#certificates-title" className="supervision-credentials">להכשרה ולתעודות המקצועיות <span aria-hidden="true">←</span></a></div><figure><img src="/assets/img/yedidya-levitan-portrait.jpg" width="532" height="1140" alt="ידידיה לויתן בחולצה מכופתרת תכלת" loading="lazy"/></figure></section>
  </section>;
}
