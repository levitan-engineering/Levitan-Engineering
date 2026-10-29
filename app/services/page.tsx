import type { Metadata } from "next";
import SiteHeader from "../site-header";
import ServicesSection from "../services-section";
import ProfessionalEquipment from "../professional-equipment";
import { BUSINESS } from "../../lib/business";
export const metadata: Metadata = { title: "בדק בית ופיקוח בנייה | השירותים של לויתן הנדסה", description: "בדק בית לדירה חדשה מקבלן, בדיקת דירה יד שנייה, חוות דעת הנדסית ובדיקת שטחים משותפים. פיקוח על בניית בתים פרטיים ושיפוצים ובקרת איכות הביצוע, בביקור ממוקד או בליווי מתמשך." };
export default function ServicesPage() {
  return <><SiteHeader /><main><ServicesSection standalone /><ProfessionalEquipment /></main><footer className="journey-footer"><a href="/">חזרה לדף הבית</a><a dir="ltr" href={`tel:${BUSINESS.telephone}`}>{BUSINESS.displayPhone}</a><a href="/privacy/">מדיניות פרטיות</a></footer></>;
}
