"use client";
import { useEffect, useRef, useState } from "react";
import { BUSINESS, whatsappLink } from "../../../lib/business";
import { apartmentStages, propertyTypes, initialDetails, validateStep, inspectionMessage, type InspectionDetails } from "../../../lib/inspection";

const stepNames = ["מצב הדירה", "סוג הנכס", "מיקום הנכס", "יצירת קשר"];
export default function InspectionJourney() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<InspectionDetails>(initialDetails);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState("");
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(1);
  const submitting = useRef(false);
  const requestId = useRef("");
  const endpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;
  useEffect(() => {
    if (previousStep.current !== step || sent) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      previousStep.current = step;
    }
  }, [step, sent]);
  function update(key: keyof InspectionDetails, value: string | boolean) {
    setData(d => ({ ...d, [key]: value }));
    setErrors(e => { const next = { ...e }; delete next[key]; return next; });
    setNotice(""); setWhatsappOpened(false); requestId.current = "";
  }
  function next() {
    const result = validateStep(data, step); setErrors(result);
    if (!Object.keys(result).length) setStep(s => s + 1);
  }
  function validFinal() {
    const result = [1, 2, 3, 4].reduce((all, n) => ({ ...all, ...validateStep(data, n) }), {} as Record<string, string>);
    setErrors(result);
    if (Object.keys(result).length) {
      const invalidStep = [1, 2, 3, 4].find(n => Object.keys(validateStep(data, n)).length);
      if (invalidStep && invalidStep !== step) setStep(invalidStep);
      return false;
    }
    return true;
  }
  function openWhatsapp() {
    if (!validFinal()) return;
    setNotice("");
    window.open(whatsappLink(inspectionMessage(data)), "_blank", "noopener,noreferrer");
    setWhatsappOpened(true);
  }
  async function sendLead() {
    if (submitting.current || !validFinal()) return;
    if (!endpoint) { setNotice("שליחת פרטים דרך האתר עדיין אינה פעילה. אפשר לפנות אלינו כעת ב־WhatsApp או בטלפון."); return; }
    submitting.current = true; setSending(true); setNotice("");
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      requestId.current ||= crypto.randomUUID();
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestId.current }, body: JSON.stringify({ ...data, source: "אתר / דירה חדשה מקבלן" }), signal: controller.signal });
      const result = await response.json();
      if (!response.ok || result.accepted !== true || typeof result.receiptId !== "string" || !result.receiptId) throw new Error("Not accepted");
      setSent(true);
    } catch { setNotice("לא הצלחנו לשלוח את הפרטים כרגע. אפשר לנסות שוב או לפנות אלינו ישירות ב-WhatsApp."); }
    finally { clearTimeout(timeout); submitting.current = false; setSending(false); }
  }
  const error = (key: string) => errors[key] ? <p className="journey-error" id={`error-${key}`} role="alert">{errors[key]}</p> : null;
  const fieldProps = (key: string) => ({ "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `error-${key}` : undefined });
  return <section id="inspection-journey" className="journey-section" aria-labelledby="journey-heading">
    <div className="journey-intro"><p className="eyebrow">כמה שאלות קצרות. תיאום מדויק יותר.</p><h2>מתאימים את הבדיקה <br />לבית שלכם.</h2><p>ארבעה שלבים פשוטים, בקצב שלכם. הפרטים נשארים זמינים כשחוזרים בין השלבים.</p></div>
    <div className="journey-panel" aria-busy={sending}>
      {sent ? <div className="journey-thanks"><span aria-hidden="true">✓</span><h2 ref={heading} tabIndex={-1}>תודה שפניתם ללויתן הנדסה!</h2><p>הפרטים התקבלו בהצלחה. ניצור איתכם קשר בהקדם לתיאום הבדיקה.</p><a className="journey-primary" href="/services/">חזרה לשירותים</a></div> : <>
        <div className="journey-progress-copy"><span>שלב {step} מתוך 4</span><span>{stepNames[step - 1]}</span></div>
        <div className="journey-progress" role="progressbar" aria-label="התקדמות מסלול הבדיקה" aria-valuemin={0} aria-valuemax={4} aria-valuenow={step} aria-valuetext={`שלב ${step} מתוך 4: ${stepNames[step - 1]}`}><span style={{ width: `${step * 25}%` }} /></div>
        <form noValidate onSubmit={event => { event.preventDefault(); if (step < 4) next(); }}>
          <fieldset disabled={sending} className="journey-fields"><legend className="visually-hidden">{stepNames[step - 1]}</legend>
          <div className="journey-step" key={step}>
            <h3 id="journey-heading" ref={heading} tabIndex={-1}>{["באיזה שלב נמצאת הדירה שלכם?", "איזה סוג נכס אתם מקבלים?", "היכן נמצא הנכס?", "הבדיקה שלכם מתחילה כאן"][step - 1]}</h3>
            <p className="journey-description">{["נבחר את הבדיקה המתאימה לשלב שבו נמצא הנכס.", "סוג הנכס יעזור לנו להבין את היקף הבדיקה הנדרש.", "כדי שנוכל לבדוק את אזור השירות ולתאם מועד מתאים.", "נשאר רק לבחור איך נוח לכם ליצור איתנו קשר."][step - 1]}</p>
            {(step === 1 || step === 2) && <><div className="journey-options" role="radiogroup" aria-label={stepNames[step - 1]} {...fieldProps(step === 1 ? "stage" : "property")}>{(step === 1 ? apartmentStages : propertyTypes).map((option, index) => { const key = step === 1 ? "stage" : "property"; return <label className={`journey-option ${data[key] === option ? "is-selected" : ""}`} key={option}><input type="radio" name={key} value={option} checked={data[key] === option} onChange={() => update(key, option)} /><span className="journey-option-number" aria-hidden="true">0{index + 1}</span><span>{option}</span><span className="journey-radio-mark" aria-hidden="true" /></label>; })}</div>{error(step === 1 ? "stage" : "property")}</>}
            {step === 3 && <div className="journey-field"><label htmlFor="inspection-city">עיר או יישוב <span>(חובה)</span></label><input id="inspection-city" name="city" autoComplete="address-level2" required maxLength={80} value={data.city} onChange={e => update("city", e.target.value)} {...fieldProps("city")} /><small>אין צורך בכתובת מלאה בשלב הזה.</small>{error("city")}</div>}
            {step === 4 && <>
              <dl className="journey-summary"><div><dt>מצב הדירה</dt><dd>{data.stage}</dd></div><div><dt>סוג הנכס</dt><dd>{data.property}</dd></div><div><dt>עיר או יישוב</dt><dd>{data.city.trim()}</dd></div></dl>
              <div className="journey-field"><label htmlFor="inspection-name">שם מלא <span>(חובה)</span></label><input id="inspection-name" name="name" autoComplete="name" required maxLength={100} value={data.name} onChange={e => update("name", e.target.value)} {...fieldProps("name")} />{error("name")}</div>
              <div className="journey-field"><label htmlFor="inspection-phone">מספר טלפון ישראלי <span>(חובה)</span></label><input id="inspection-phone" name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" required maxLength={24} value={data.phone} onChange={e => update("phone", e.target.value)} {...fieldProps("phone")} />{error("phone")}</div>
              <div className="journey-field"><label htmlFor="inspection-notes">הערות נוספות <span>(רשות)</span></label><textarea id="inspection-notes" name="notes" maxLength={1500} rows={3} value={data.notes} onChange={e => update("notes", e.target.value)} {...fieldProps("notes")} /><small>{data.notes.length.toLocaleString("he-IL")} / 1,500 תווים</small>{error("notes")}</div>
              <div className="journey-honeypot" aria-hidden="true"><label htmlFor="inspection-website">אתר אינטרנט</label><input id="inspection-website" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={e => update("website", e.target.value)} /></div>
              <label className="journey-consent"><input type="checkbox" checked={data.consent} onChange={e => update("consent", e.target.checked)} {...fieldProps("consent")} /><span>אני מאשר/ת שימוש בפרטים לצורך טיפול בפנייה ויצירת קשר, בהתאם ל<a href="/privacy/" target="_blank" rel="noreferrer">מדיניות הפרטיות</a>.</span></label>{error("consent")}
              <div className="journey-contact-actions"><button type="button" className="journey-primary" onClick={openWhatsapp}>שליחת הודעה ב-WhatsApp <span aria-hidden="true">↗</span></button><button type="button" className="journey-secondary" onClick={sendLead} aria-describedby={!endpoint ? "form-availability" : undefined}>{sending ? "שולחים את הפרטים…" : "שליחת פרטים ונחזור אליכם"}</button></div>
              <p className="journey-note">פתיחת WhatsApp מכינה את ההודעה בלבד. השליחה מתבצעת על ידכם בתוך WhatsApp.</p>
              {!endpoint && <p id="form-availability" className="journey-availability">שליחת הטופס דרך האתר תהיה זמינה לאחר השלמת חיבור הדוא״ל. בינתיים אפשר לפנות ב־WhatsApp או <a href={`tel:${BUSINESS.telephone}`}>בטלפון</a>.</p>}
              <div aria-live="polite">{notice && <p className="journey-server-notice" role="alert">{notice}</p>}{whatsappOpened && <p className="journey-note">המשיכו ל־WhatsApp ולחצו על שליחה כדי להעביר את הפנייה.</p>}</div>
            </>}
          </div>
          <div className="journey-navigation">{step > 1 && <button type="button" className="journey-back" onClick={() => { setErrors({}); setNotice(""); setStep(s => s - 1); }}>→ חזרה</button>}{step < 4 && <button type="submit" className="journey-primary">המשך <span aria-hidden="true">←</span></button>}</div>
          </fieldset>
        </form>
      </>}
    </div>
  </section>;
}
