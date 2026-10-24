import AboutSection from "./about-section";
import { BUSINESS, NEW_APARTMENT_PATH, whatsappLink } from "../lib/business";
import Reviews from "./reviews";

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
            <a className="primary" href={whatsappLink()} target="_blank" rel="noreferrer">לתיאום בדיקה <span>←</span></a>
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
        <p>מדירה חדשה מקבלן ועד בדיקת שטחים משותפים – הכירו את השירותים המקצועיים של לוויתן הנדסה.</p>
        <a className="journey-primary" href="/services/">לכל השירותים <span aria-hidden="true">←</span></a>
      </section>

      <AboutSection />

      <Reviews />

      <section className="insights section" id="insights" aria-labelledby="insights-title">
        <div className="insights-heading">
          <p className="eyebrow">המדריך לרוכשי דירה</p>
          <h2 id="insights-title">לפני שמקבלים מפתח,<br /><em>מבינים מה מקבלים.</em></h2>
          <p>מדריכים ומחקר מקצועי שיעזרו לכם להבין למה הבדיקה חשובה, מה היא כוללת ואיך משתמשים בממצאים.</p>
        </div>
        <div className="insights-grid">
          <article className="insight-card">
            <div className="insight-meta"><span>01</span><span>לפני המסירה</span></div>
            <h3>דירה חדשה לא תמיד מגיעה ללא ליקויים</h3>
            <p>גם בפרויקט חדש מעורבים בעלי מקצוע וקבלני משנה רבים. סטייה קטנה בשיפוע, באיטום או בחיבור מערכת עלולה להפוך אחרי הכניסה לרטיבות, בלאי או תיקון יקר.</p>
            <details>
              <summary>לקריאת הכתבה <span>＋</span></summary>
              <div className="article-body">
                <p>המראה החדש של הדירה יכול להסתיר פרטים שקשה לזהות ללא ניסיון וציוד מתאים. הבדיקה אינה מחפשת רק פגם אסתטי; היא בוחנת אם הביצוע תואם את התוכניות, המפרט והדרישות הרלוונטיות.</p>
                <p>המועד הנכון לבדיקה הוא כאשר העבודות הסתיימו והמערכות פעילות, סמוך למסירה ולפני הכנסת ריהוט. כך ניתן לתעד את מצב הדירה בצורה מסודרת ולהעביר לקבלן רשימת ממצאים ברורה.</p>
                <strong>המטרה: להיכנס לדירה כשאתם יודעים מה תקין, מה דורש תיקון ומה חשוב להמשיך לעקוב אחריו.</strong>
              </div>
            </details>
          </article>

          <article className="insight-card">
            <div className="insight-meta"><span>02</span><span>מה בודקים</span></div>
            <h3>מהנדס רואה דברים שרוכש רגיל עלול לפספס</h3>
            <p>בדיקה מקצועית מחברת בין העין, המכשור והידע בתקנים: מרטיבות ואיטום ועד ריצוף, פתחים, חשמל, אינסטלציה ורכיבי בטיחות.</p>
            <details>
              <summary>לקריאת הכתבה <span>＋</span></summary>
              <div className="article-body">
                <p>במהלך הבדיקה עוברים באופן שיטתי על חללי הדירה והמערכות הנגישות. בודקים סימני רטיבות, שיפועים וניקוז, איכות גמר, סדקים, דלתות וחלונות, כלים סניטריים ונקודות חשמל.</p>
                <p>לא כל ליקוי נראה מיד ולא כל סימן מעיד על בעיה חמורה. הערך של הבודק הוא ביכולת להבדיל בין תיקון נקודתי לבין ממצא שדורש בירור נוסף, ולתעד את המיקום והמשמעות בצורה שהלקוח יכול להבין.</p>
                <strong>המטרה: להפוך דירה שלמה לרשימה מסודרת של עובדות, סדרי עדיפויות והמלצות.</strong>
              </div>
            </details>
          </article>

          <article className="insight-card">
            <div className="insight-meta"><span>03</span><span>מול הקבלן</span></div>
            <h3>דוח מסודר נותן לכם בסיס אמיתי לדרוש תיקון</h3>
            <p>אמירה כללית כמו “יש בעיה בקיר” קשה לקדם. דוח עם מיקום, צילום והסבר מקצועי מאפשר לפנות לקבלן בצורה ממוקדת ולעקוב אחר הטיפול.</p>
            <details>
              <summary>לקריאת הכתבה <span>＋</span></summary>
              <div className="article-body">
                <p>חוק המכר מבחין בין תקופות בדק ואחריות המשתנות לפי סוג הליקוי. לכן יש ערך לתיעוד מוקדם: הוא יוצר תמונת מצב מתוארכת של הדירה ומרכז את הנושאים שדורשים התייחסות.</p>
                <p>לאחר קבלת הדוח אפשר להעביר לקבלן פנייה מסודרת, לשמור את ההתכתבויות ולוודא שכל סעיף מקבל מענה. במקרה הצורך, הדוח הטכני יכול לסייע לאנשי מקצוע נוספים להבין את המצב.</p>
                <strong>המטרה: לנהל את התיקונים על בסיס מידע מקצועי ולא על בסיס תחושה או זיכרון.</strong>
              </div>
            </details>
          </article>
        </div>
        <a className="press-feature" href="https://www.themarker.com/realestate/2014-02-13/ty-article/0000017f-dc45-db5a-a57f-dc6f4ee60000" target="_blank" rel="noreferrer" aria-label="קריאת הכתבה המלאה באתר TheMarker">
          <div className="press-copy">
            <div className="press-source"><span>THEMARKER</span><span>נדל״ן</span></div>
            <p className="press-label">כתבה ב־TheMarker</p>
            <h3>חוקרים בטכניון: ב-100% מהדירות החדשות בישראל יש ליקויי בנייה</h3>
            <p>חוקרים בטכניון גילו את מה שרוכשי הדירות יודעים כבר שנים - הבנייה בישראל נעשית ברמה נמוכה, על ידי עובדים שלא עברו הכשרה ומפוקחת על ידי מפקחים לא מקצועיים, שלחלקם אין אינטרס לחשוף ליקויים</p>
            <p className="press-meta">רז סמולסקי · 13.02.2014 · TheMarker</p>
          </div>
          <div className="press-action">
            <blockquote>״ככל שהליקוי נחשף בשלב מאוחר יותר — עלות תיקונו גבוהה יותר״</blockquote>
            <span className="press-link">
              לכתבה המלאה ב־TheMarker <span>↗</span>
            </span>
          </div>
        </a>
        <p className="insights-note">התוכן נכתב לצורכי מידע כללי ואינו מהווה ייעוץ משפטי או תחליף לבדיקה של הנכס המסוים.</p>
      </section>

      <section className="contact section" id="contact"><div><p className="eyebrow">השלב הבא</p><h2>נכס לפני רכישה<br /><em>לא בודקים לבד.</em></h2></div><div className="contact-panel"><h3>רוצים לתאם בדיקה?</h3><p>כתבו ב־WhatsApp וקבלו מענה ישיר מידידיה.</p><a className="primary" href={whatsappLink()} target="_blank" rel="noreferrer">תיאום בדיקה ב־WhatsApp <span>↙</span></a><a className="contact-phone" href={`tel:${BUSINESS.telephone}`}>055‑662‑5745</a></div></section>

      <footer className="site-footer" id="footer">
        <div className="footer-cta">
          <div>
            <p className="footer-kicker">לפני שמתקדמים עם הנכס</p>
            <h2>מקבלים תמונה הנדסית ברורה.</h2>
          </div>
          <a href={whatsappLink()} target="_blank" rel="noreferrer">
            תיאום בדיקה ב־WhatsApp <span>↙</span>
          </a>
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <img src="/assets/img/logo-transparent.png" width="1556" height="1332" alt="לויתן הנדסה" />
            <p>בדק בית, פיקוח וחוות דעת הנדסיות — בליווי אישי ומקצועי.</p>
          </div>

          <div className="footer-column">
            <h3>ניווט</h3>
            <a href="/services/">שירותים</a>
            <a href="#check">מה נבדק</a>
            <a href="#about">אודות</a>
          <a href="#reviews">המלצות</a>
            <a href="#contact">יצירת קשר</a>
          </div>

          <div className="footer-column">
            <h3>שירותים</h3>
            <a href={NEW_APARTMENT_PATH}>בדק בית לדירה חדשה</a>
            <a href="/services/#used-apartment">בדיקת דירה יד שנייה</a>
            <a href="/services/#engineering-opinion">חוות דעת הנדסית</a>
            <a href="/services/#shared-areas">בדיקת שטחים משותפים</a>
          </div>

          <div className="footer-column footer-contact">
            <h3>מדברים ישירות</h3>
            <a className="footer-phone" href={`tel:${BUSINESS.telephone}`}>055‑662‑5745</a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            <p>מרכז · שפלה · ירושלים</p>
            <span>מענה אישי מידידיה לויתן</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 לויתן הנדסה. כל הזכויות שמורות.</span>
          <a href="#top">חזרה למעלה ↑</a>
        </div>
      </footer>
    </main>
  );
}
