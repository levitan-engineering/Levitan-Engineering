import "./brand-messaging.css";
import MobileNav from "./mobile-nav";
import { BUSINESS } from "../lib/business";
export default function SiteHeader() {
  return <header className="site-header"><a className="logo" href="/#top" aria-label={BUSINESS.name}><img className="header-brand-logo" src="/assets/img/logo-transparent.png" width="1556" height="1332" alt="" /><span className="brand-copy"><span className="brand-tagline">בדק בית | פיקוח בנייה</span></span></a><nav aria-label="ניווט ראשי"><a href="/services/">שירותים</a><a href="/services/#supervision">פיקוח בנייה</a><a href="/services/">מה נבדק</a><a href="/#about">אודות</a><a href="/#reviews">המלצות</a><a href="/#contact">יצירת קשר</a></nav><MobileNav /></header>;
}
