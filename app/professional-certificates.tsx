"use client";
import { useRef, useState } from "react";
type Certificate = { title: string; description: string; image: string | null };
// Add original certificate photos here when the business owner supplies them.
const certificates: Certificate[] = [
 { title: "הנדסאי בניין", description: "תעודת ההכשרה המקצועית", image: null },
 { title: "בדק בית ואיכות הבנייה", description: "תעודת סיום הקורס", image: null },
];
export default function ProfessionalCertificates() {
 const dialog = useRef<HTMLDialogElement>(null);
 const [selected,setSelected]=useState<Certificate|null>(null);
 function open(c:Certificate) {if(!c.image)return;setSelected(c);dialog.current?.showModal();}
 return <section className="professional-certificates" aria-labelledby="certificates-title"><div className="certificates-heading"><h3 id="certificates-title">ההכשרה המקצועית שלי</h3><p className="certificates-subtitle">ידע מקצועי. עבודה יסודית.</p></div><div className="certificates-grid">{certificates.map(c=><article className="certificate-card" key={c.title}>{c.image ? <button type="button" className="certificate-image-button" onClick={()=>open(c)} aria-label={`הגדלת תעודת ${c.title}`}><img src={c.image} alt={`תעודת ${c.title}`} width="900" height="640" loading="lazy"/><span>לחצו להגדלת התעודה <span aria-hidden="true">↗</span></span></button> : <div className="certificate-placeholder"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M9 4h17l6 6v26H9zM26 4v7h6M14 16h12M14 21h9"/><circle cx="21" cy="28" r="3"/><path d="m19 31-1 5 3-2 3 2-1-5"/></svg><span>צילום התעודה המקורית יתווסף כאן</span></div>}<div className="certificate-copy"><h4>{c.title}</h4><p>{c.description}</p></div></article>)}</div><dialog ref={dialog} className="certificate-dialog" aria-labelledby="certificate-dialog-title" onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><div><button type="button" className="certificate-close" onClick={()=>dialog.current?.close()} aria-label="סגירת התעודה">סגירה ×</button><h3 id="certificate-dialog-title">{selected?.title}</h3>{selected?.image&&<img src={selected.image} alt={`תעודת ${selected.title}`}/>}</div></dialog></section>;
}
