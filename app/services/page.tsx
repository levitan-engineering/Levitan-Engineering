import type { Metadata } from "next";
import SiteHeader from "../site-header";
import ServicesSection from "../services-section";
import { BUSINESS } from "../../lib/business";
export const metadata: Metadata = { title: "השירותים שלנו | לויתן הנדסה", description: "בדק בית לדירה חדשה מקבלן, בדיקת דירה יד שנייה, חוות דעת הנדסית ובדיקת שטחים משותפים. בדיקות הנדסיות בהתאמה לנכס שלכם." };
export default function ServicesPage() {
  return <><SiteHeader /><main><ServicesSection standalone /></main><footer className="journey-footer"><a href="/">חזרה לדף הבית</a><a dir="ltr" href={`tel:${BUSINESS.telephone}`}>{BUSINESS.displayPhone}</a><a href="/privacy/">מדיניות פרטיות</a></footer></>;
}
