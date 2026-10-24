import ServiceIntro from "./service-intro";
import type { Metadata } from "next";
import SiteHeader from "../../site-header";
import InspectionJourney from "./inspection-journey";
import { BUSINESS } from "../../../lib/business";
export const metadata: Metadata = { title: "בדק בית לדירה חדשה מקבלן | לויתן הנדסה", description: "נכנסים לבית החדש עם תמונת מצב מקצועית וברורה. התאימו בדק בית לדירה חדשה מקבלן במסלול קצר ונוח." };
export default function NewApartmentPage() {
  return <><SiteHeader /><main className="new-apartment-page"><ServiceIntro /><InspectionJourney /></main><footer className="journey-footer"><a href="/services/">חזרה לשירותים</a><a href={`tel:${BUSINESS.telephone}`} dir="ltr">{BUSINESS.displayPhone}</a><a href="/privacy/">מדיניות פרטיות</a></footer></>;
}
