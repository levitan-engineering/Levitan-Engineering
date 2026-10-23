"use client";

import { useState } from "react";

const choices = [
  { id: "new", label: "דירה חדשה מקבלן", copy: "לפני קבלת המפתח" },
  { id: "used", label: "דירה יד שנייה", copy: "לפני חתימה על חוזה" },
  { id: "opinion", label: "חוות דעת הנדסית", copy: "כשצריך מסמך מקצועי" },
];

export default function InspectionFinder() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedChoice = choices.find((choice) => choice.id === selected);
  const message = selectedChoice
    ? `היי ידידיה, אשמח לתאם ${selectedChoice.label}.`
    : "היי ידידיה, אשמח לתאם בדיקה.";

  return (
    <section id="finder" className="finder" aria-labelledby="finder-title">
      <div className="finder-heading">
        <p className="eyebrow">מתחילים בהחלטה אחת</p>
        <h2 id="finder-title">איזו בדיקה מתאימה לנכס שלך?</h2>
        <p>בחירה קצרה תוביל אותך ישירות לשיחה הרלוונטית.</p>
      </div>
      <div className="finder-choices" role="radiogroup" aria-label="סוג הבדיקה">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            className={selected === choice.id ? "choice selected" : "choice"}
            onClick={() => setSelected(choice.id)}
            role="radio"
            aria-checked={selected === choice.id}
          >
            <span className="choice-index">0{index + 1}</span>
            <span>
              <strong>{choice.label}</strong>
              <small>{choice.copy}</small>
            </span>
            <span className="choice-arrow" aria-hidden="true">←</span>
          </button>
        ))}
      </div>
      <a
        className="finder-action"
        href={`https://wa.me/972556625745?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
      >
        {selectedChoice ? `לתיאום ${selectedChoice.label}` : "בחרו סוג בדיקה כדי להתחיל"}
        <span aria-hidden="true">↙</span>
      </a>
    </section>
  );
}
