"use client";
import { useEffect, useRef, useState } from "react";
import "./professional-certificates.css";
type Certificate = { title: string; description: string; image: string | null };
const certificates: Certificate[] = [
 { title: "הנדסאי בניין", description: "דיפלומת הנדסאי בניין – התמחות בניהול הבנייה", image: "/assets/img/building-technician-diploma-redacted.jpg" },
 { title: "בדק בית ואיכות הבנייה", description: "תעודת סיום הקורס", image: null },
];
function Magnify() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 10h6M10 7v6"/></svg>; }
export default function ProfessionalCertificates() {
 const dialog = useRef<HTMLDialogElement>(null);
 const [selected,setSelected]=useState<Certificate|null>(null);
 const [zoomed,setZoomed]=useState(false);
 useEffect(()=>{
  if (!selected) return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  return ()=>{document.body.style.overflow=previous;};
 },[selected]);
 function open(c:Certificate) {if(!c.image)return;setZoomed(false);setSelected(c);dialog.current?.showModal();}
 function close(){dialog.current?.close();}
 return <section className="professional-certificates certificates-refined" aria-labelledby="certificates-title">
  <div className="certificates-heading"><h3 id="certificates-title">ההכשרה המקצועית שלי</h3><p className="certificates-subtitle">ידע מקצועי. עבודה יסודית.</p></div>
  <div className="certificates-grid">{certificates.map(c=><article className="certificate-card" key={c.title}>
   {c.image ? <button type="button" className="certificate-image-button" onClick={()=>open(c)} aria-label={`הגדלת תעודת ${c.title}`} aria-haspopup="dialog"><img src={c.image} alt={`תעודת ${c.title} — מספר הזהות הושחר`} width="1272" height="1800" loading="lazy"/><span className="certificate-magnify"><Magnify/></span></button> : <div className="certificate-placeholder"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M9 4h17l6 6v26H9zM26 4v7h6M14 16h12M14 21h9"/><circle cx="21" cy="28" r="3"/><path d="m19 31-1 5 3-2 3 2-1-5"/></svg><span>צילום התעודה המקורית יתווסף כאן</span></div>}
   <div className="certificate-copy"><h4>{c.title}</h4><p>{c.description}</p></div>
  </article>)}</div>
  <dialog ref={dialog} className="certificate-dialog certificate-viewer" aria-label={selected ? `תעודת ${selected.title}` : "צפייה בתעודה"} onClose={()=>{setSelected(null);setZoomed(false);}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <div className="certificate-viewer-toolbar"><button type="button" className="certificate-viewer-close" onClick={close} aria-label="סגירת התעודה">×</button><button type="button" className="certificate-viewer-zoom" onClick={()=>setZoomed(z=>!z)} aria-pressed={zoomed}><Magnify/>{zoomed ? "התאמה למסך" : "הגדלה לקריאה"}</button></div>
   <div className={`certificate-viewer-stage${zoomed?' is-zoomed':''}`} onClick={e=>{if(e.target===e.currentTarget)close();}}>{selected?.image&&<button className="certificate-viewer-image" type="button" onClick={()=>setZoomed(z=>!z)} aria-label={zoomed?"התאמת התעודה למסך":"הגדלת התעודה לקריאה"}><img src={selected.image} alt={`תעודת ${selected.title} — מספר הזהות הושחר`} width="1272" height="1800"/></button>}</div>
  </dialog>
 </section>;
}
