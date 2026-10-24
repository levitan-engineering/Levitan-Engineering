export const apartmentStages = ["לפני מסירת הדירה מהקבלן", "לאחר קבלת המפתח", "לקראת סיום שנת הבדק", "עדיין לא בטוחים במועד"];
export const propertyTypes = ["דירה בבניין מגורים", "דירת גן", "דירת גג / פנטהאוז", "בית פרטי מקבלן"];
export type InspectionDetails = { stage: string; property: string; city: string; name: string; phone: string; notes: string; consent: boolean; website: string };
export const initialDetails: InspectionDetails = { stage: "", property: "", city: "", name: "", phone: "", notes: "", consent: false, website: "" };
export function normalizePhone(raw: string) {
  let value = raw.replace(/[\s().-]/g, "");
  if (value.startsWith("00972")) value = "0" + value.slice(5);
  else if (value.startsWith("+972")) value = "0" + value.slice(4);
  else if (value.startsWith("972")) value = "0" + value.slice(3);
  return value;
}
export function validateStep(data: InspectionDetails, step: number): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 1 && !apartmentStages.includes(data.stage)) errors.stage = "בחרו את השלב שבו נמצאת הדירה.";
  if (step === 2 && !propertyTypes.includes(data.property)) errors.property = "בחרו את סוג הנכס.";
  if (step === 3 && (!data.city.trim() || data.city.trim().length < 2 || data.city.length > 80)) errors.city = "הזינו שם עיר או יישוב (2–80 תווים).";
  if (step === 4) {
    if (!data.name.trim() || data.name.trim().length > 100) errors.name = "הזינו שם מלא, עד 100 תווים.";
    if (!/^0(?:5\d{8}|[23489]\d{7}|7\d{8})$/.test(normalizePhone(data.phone))) errors.phone = "הזינו מספר טלפון ישראלי תקין.";
    if (data.notes.length > 1500) errors.notes = "אפשר להוסיף עד 1,500 תווים.";
    if (!data.consent) errors.consent = "נדרש אישור לשימוש בפרטים לצורך טיפול בפנייה.";
  }
  return errors;
}
export function inspectionMessage(data: InspectionDetails) {
  return `שלום, הגעתי דרך אתר לויתן הנדסה ואני מעוניין לתאם בדק בית לדירה חדשה מקבלן.\n\nשם: ${data.name.trim()}\nטלפון: ${normalizePhone(data.phone)}\nמצב הדירה: ${data.stage}\nסוג הנכס: ${data.property}\nעיר: ${data.city.trim()}${data.notes.trim() ? `\nהערות: ${data.notes.trim()}` : ""}\n\nאשמח לקבל פרטים ולתאם בדיקה. תודה.`;
}
