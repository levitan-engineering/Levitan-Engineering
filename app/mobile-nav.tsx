"use client";
import { useEffect, useRef } from "react";
import "./mobile-nav.css";

export default function MobileNav() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const restore = useRef<null | (() => void)>(null);
  function unlock() { restore.current?.(); restore.current = null; }
  function close() { dialog.current?.close(); unlock(); trigger.current?.setAttribute("aria-expanded", "false"); }
  function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if(event.key!=="Tab") return;
    const items=Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]"));
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
  }
  function open() {
    const modal = dialog.current;
    if (!modal || modal.open) return;
    const y = window.scrollY;
    const previous = {position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};
    document.body.style.position="fixed"; document.body.style.top=`-${y}px`; document.body.style.width="100%"; document.body.style.overflow="hidden";
    restore.current=()=>{Object.assign(document.body.style,previous);window.scrollTo({top:y,behavior:"instant"});};
    modal.showModal(); trigger.current?.setAttribute("aria-expanded", "true");
  }
  useEffect(()=>{
    const desktop=window.matchMedia("(min-width:901px)");
    const onResize=()=>{if(desktop.matches) close();};
    desktop.addEventListener("change",onResize);
    return ()=>{desktop.removeEventListener("change",onResize);unlock();};
  },[]);
  return <div className="mobile-drawer-nav"><button ref={trigger} type="button" className="mobile-drawer-trigger" aria-label="פתיחת תפריט ניווט" aria-haspopup="dialog" aria-expanded="false" onClick={open}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button><dialog ref={dialog} className="mobile-drawer" aria-label="תפריט ניווט" onKeyDown={trapFocus} onClose={()=>{unlock();trigger.current?.setAttribute("aria-expanded","false");}} onClick={e=>{if(e.target===e.currentTarget) close();}}><div className="mobile-drawer-panel"><div className="mobile-drawer-heading"><span>לויתן הנדסה</span><button type="button" className="mobile-drawer-close" aria-label="סגירת תפריט ניווט" onClick={close} autoFocus><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><nav aria-label="תפריט נייד">{[["/#top","ראשי"],["/services/","שירותים"],["/services/#supervision","פיקוח בנייה"],["/#about","אודות"],["/#reviews","המלצות"],["/#contact","יצירת קשר"]].map(([href,label])=><a key={href} href={href} onClick={close}>{label}<span aria-hidden="true">←</span></a>)}</nav><p>בדק בית | איכות הבנייה</p></div></dialog></div>;
}
