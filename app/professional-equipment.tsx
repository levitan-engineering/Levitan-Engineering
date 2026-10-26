"use client";
import { useEffect, useRef } from "react";
import { equipmentPhoto } from "../lib/equipment";
import "./professional-equipment.css";
export default function ProfessionalEquipment() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let revealed = false;
    const update = () => {
      observer?.disconnect();
      section.classList.remove("equipment-awaiting");
      if (motion.matches || revealed) return;
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          revealed = true; section.classList.remove("equipment-awaiting"); observer?.disconnect();
        }
      }, { threshold: 0.08 });
      section.classList.add("equipment-awaiting"); observer.observe(section);
    };
    update(); motion.addEventListener("change", update);
    return () => { observer?.disconnect(); motion.removeEventListener("change", update); };
  }, []);
  return <section ref={root} className="professional-equipment" aria-labelledby="equipment-title" dir="rtl">
    <h2 id="equipment-title">הציוד המקצועי שלנו</h2>
    <p>בדיקות מקצועיות באמצעות ציוד מדידה ובדיקה מתקדם, בהתאם לצורכי הבדיקה.</p>
    <figure>{equipmentPhoto ? <img src={equipmentPhoto.src} width={equipmentPhoto.width} height={equipmentPhoto.height} alt={equipmentPhoto.alt} loading="lazy" decoding="async" /> : <div className="equipment-photo-placeholder" role="img" aria-label="מקום לתמונת הציוד המקצועי — תמונה תתווסף בהמשך" />}</figure>
  </section>;
}
