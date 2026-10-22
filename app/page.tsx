import InspectionFinder from "./inspection-finder";

const services = [
  ["בדק בית — דירה חדשה", "בדיקת מסירה לפני קבלת המפתח: רטיבות, ריצוף, אינסטלציה, חשמל ואלומיניום."],
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
          <img src="/assets/img/logo-transparent.png" width="1556" height="1332" alt="לויתן הנדסה" />
        </a>
        <nav aria-label="ניווט ראשי">
          <a href="#services">שירותים</a>
          <a href="#check">מה נבדק</a>
          <a href="#about">אודות</a>
          <a href="#contact">יצירת קשר</a>
        </nav>
        <a className="header-cta" href="#finder">בחירת בדיקה <span>↙</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">לויתן הנדסה · בדק בית ופיקוח</p>
          <h1>לפני שאתם<br />חותמים על הנכס,<br /><em>בודקים אותו.</em></h1>
          <p className="hero-lead">בדיקה הנדסית יסודית, דוח ברור וליווי אישי לפני קבלת מפתח או חתימה על עסקה.</p>
          <div className="hero-actions">
            <a className="primary" href="#finder">מצאו את הבדיקה המתאימה <span>↙</span></a>
            <a className="phone" href="tel:+972556625745">055‑662‑5745</a>
          </div>
          <p className="proof"><span>★</span> 5.0 · ביקורות מאומתות ב־Google</p>
        </div>
        <figure className="hero-image">
          <img src="/assets/img/hero.jpg" width="2400" height="1029" alt="בדיקה באתר בנייה" fetchPriority="high" />
          <figcaption>תיעוד מלא של כל ממצא, מהשטח ועד הדוח.</figcaption>
        </figure>
      </section>

      <section className="signal-bar" aria-label="יתרונות מרכזיים">
        <span>הנדסאי בניין מוסמך</span><span>דוח עד 5 ימי עסקים</span><span>מכשור לאיתור רטיבות</span><span>ליווי גם אחרי הבדיקה</span>
      </section>

      <InspectionFinder />

      <section className="services section" id="services">
        <div className="section-head"><p className="eyebrow">מה עושים</p><h2>בדיקה אחת,<br /><em>שמונעת שנים של תקלות.</em></h2></div>
        <div className="service-list">
          {services.map(([title, copy], index) => <article className="service" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><a href="#finder" aria-label={`בחירת ${title}`}>←</a></article>)}
        </div>
      </section>

      <section className="checks section" id="check">
        <div className="section-head"><p className="eyebrow">מה נבדק</p><h2>כל ממצא מקבל<br /><em>מקום בדוח.</em></h2></div>
        <div className="check-grid">
          {checks.map(([image, title, label]) => <a className="check-card" href="#finder" key={title}><div className="check-image"><img src={`/${image}`} width="1200" height="1500" alt="" /><span>{label}</span></div><h3>{title}</h3><p>הסבר ברור, תיעוד מצולם והמלצות להמשך טיפול.</p></a>)}
        </div>
      </section>

      <section className="about section" id="about">
        <div className="about-image"><img src="/assets/img/about.jpg" width="1200" height="1500" alt="ידידיה לויתן" /></div>
        <div className="about-copy"><p className="eyebrow">מי בודק את הנכס</p><h2>הצד שלכם בשולחן,<br /><em>כשמולכם יושב הקבלן.</em></h2><p>שמי ידידיה לויתן, הנדסאי בניין ומנהל פרויקטים, עם ניסיון בפיקוח, בקרת איכות ובדיקות מבנים.</p><p>המטרה שלי ברורה: להגן על האינטרסים שלכם, לאתר ליקויים בזמן ולספק דוח מקצועי שיחסוך עלויות ותקלות בעתיד.</p><div className="signature"><strong>ידידיה לויתן</strong><span>הנדסאי בניין ומנהל פרויקטים</span></div></div>
      </section>

      <section className="review section"><p className="eyebrow">לקוחות מספרים</p><blockquote>״ידידיה היה מאוד יסודי במהלך הבדיקה — עבר סעיף סעיף, עם כל הציוד המקצועי, והרגשנו בטוחים לאורך כל התהליך.״</blockquote><p className="reviewer">גיל פרידמן · ביקורת מאומתת ב־Google</p></section>

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

      <section className="contact section" id="contact"><div><p className="eyebrow">השלב הבא</p><h2>נכס לפני רכישה<br /><em>לא בודקים לבד.</em></h2></div><div className="contact-panel"><h3>רוצים לתאם בדיקה?</h3><p>כתבו ב־WhatsApp וקבלו מענה ישיר מידידיה.</p><a className="primary" href="https://wa.me/972556625745" target="_blank" rel="noreferrer">תיאום בדיקה ב־WhatsApp <span>↙</span></a><a className="contact-phone" href="tel:+972556625745">055‑662‑5745</a></div></section>

      <footer className="site-footer" id="footer">
        <div className="footer-cta">
          <div>
            <p className="footer-kicker">לפני שמתקדמים עם הנכס</p>
            <h2>מקבלים תמונה הנדסית ברורה.</h2>
          </div>
          <a href="https://wa.me/972556625745" target="_blank" rel="noreferrer">
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
            <a href="#services">שירותים</a>
            <a href="#check">מה נבדק</a>
            <a href="#about">אודות</a>
            <a href="#contact">יצירת קשר</a>
          </div>

          <div className="footer-column">
            <h3>שירותים</h3>
            <a href="#finder">בדק בית לדירה חדשה</a>
            <a href="#finder">בדיקת דירה יד שנייה</a>
            <a href="#finder">חוות דעת הנדסית</a>
          </div>

          <div className="footer-column footer-contact">
            <h3>מדברים ישירות</h3>
            <a className="footer-phone" href="tel:+972556625745">055‑662‑5745</a>
            <a href="mailto:levitanengineering@gmail.com">levitanengineering@gmail.com</a>
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
