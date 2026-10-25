import AboutSection from "./about-section";
import { BUSINESS, NEW_APARTMENT_PATH, whatsappLink } from "../lib/business";
import Reviews from "./reviews";
import BuyerGuide from "./buyer-guide";
import SiteFooter from "./site-footer";
import WhatsAppIcon from "./whatsapp-icon";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "לויתן הנדסה | בדק בית והמדריך לרוכשי דירה",
  description: "בדק בית מקצועי וליווי אישי של לויתן הנדסה. מדריך לרוכשי דירה חדשה: מה בודקים, מתי מזמינים בדיקה ואיך מתעדים ליקויים מול הקבלן.",
};

const services = [
  ["בדק בית — דירה חדשה מקבלן", "בדיקת מסירה לפני קבלת המפתח: רטיבות, ריצוף, אינסטלציה, חשמל ואלומיניום."],
  ["בדיקת דירה — יד שנייה", "תמונת מצב כנה על נכס קיים לפני רכישה: ליקויים נסתרים, בלאי וסדקים."],
  ["חוות דעת הנדסית", "מסמך כתוב, מנומק ומגובה תקנים — מול הקבלן, המוכר ובמידת הצורך גם בהליך משפטי."],
];

const checks = [
  ["assets/img/proj1.jpg", "בדק בית לפני מפתח", "דירה חדשה מקבלן"],
  ["assets/img/proj2.jpg", "פיקוח ובקרת איכות", "פיקוח באתר"],
  ["assets/img/proj3.jpg", "בדיקה לפני רכישה", "יד שנייה"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="לויתן הנדסה">
          <img className="header-brand-logo" src="/assets/img/logo-transparent.png" width="1556" height="1332" alt="" /><span className="brand-copy"><span className="brand-tagline">בדק בית | איכות הבנייה</span></span>
        </a>
        <nav aria-label="ניווט ראשי">
          <a href="/services/">שירותים</a>
          <a href="#check">מה נבדק</a>
          <a href="#about">אודות</a>
          <a href="#reviews">המלצות</a>
          <a href="#contact">יצירת קשר</a>
        </nav>
        <details className="mobile-nav"><summary aria-label="פתיחת תפריט ניווט"><span aria-hidden="true">☰</span></summary><nav aria-label="תפריט נייד"><a href="#top">ראשי</a><a href="/services/">שירותים</a><a href="#about">אודות</a><a href="#reviews">המלצות</a><a href="#contact">יצירת קשר</a></nav></details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">לויתן הנדסה · בדק בית ובקרת איכות בנייה</p>
          <h1>הבית שלכם.<br /><em>האחריות שלנו.</em></h1>
          <p className="hero-lead hero-service-line"><span>בדק בית מקצועי</span><span aria-hidden="true">|</span><span>איתור ליקויי בנייה</span><span aria-hidden="true">|</span><span>חוות דעת הנדסית</span></p>
          <div className="hero-actions">
            <a className="primary" href={whatsappLink()} target="_blank" rel="noreferrer">לתיאום בדיקה <WhatsAppIcon /></a>
            <a className="phone" href={`tel:${BUSINESS.telephone}`}>055‑662‑5745</a>
          </div>
          <a className="proof hero-reviews-link" href="#reviews"><span aria-hidden="true">★</span><span>לקוחות מספרים</span><span className="reviews-link-arrow" aria-hidden="true">←</span></a>
        </div>
        <figure className="hero-image">
          <img src="/assets/img/hero-architecture-v4.webp" width="1672" height="941" alt="המחשה אדריכלית של מגדל מגורים באבן וזכוכית" fetchPriority="high" />
          <figcaption>תיעוד מלא של כל ממצא, מהשטח ועד הדוח.</figcaption>
        </figure>
      </section>

      <section className="signal-bar" aria-label="יתרונות מרכזיים">
        <span>הנדסאי בניין מוסמך</span><span>דוח עד 5 ימי עסקים</span><span>מכשור לאיתור רטיבות</span><span>ליווי גם אחרי הבדיקה</span>
      </section>


      <section className="home-services-bridge" id="services" aria-labelledby="home-services-title">
        <span id="check" className="services-anchor" aria-hidden="true" />
        <span id="finder" className="services-anchor" aria-hidden="true" />
        <p className="eyebrow">השירותים שלנו</p>
        <h2 id="home-services-title">בדיקות הנדסיות בהתאמה לנכס שלכם</h2>
        <p>מדירה חדשה מקבלן ועד בדיקת שטחים משותפים – הכירו את השירותים המקצועיים של לויתן הנדסה.</p>
        <a className="journey-primary" href="/services/">לכל השירותים <span aria-hidden="true">←</span></a>
      </section>

      <AboutSection />

      <Reviews />

      <BuyerGuide />


      <SiteFooter />
    </main>
  );
}
