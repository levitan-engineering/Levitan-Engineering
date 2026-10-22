import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "לויתן הנדסה | בדק בית, פיקוח וחוות דעת הנדסיות",
  description:
    "בדק בית מקצועי, פיקוח וחוות דעת הנדסיות לפני רכישה או קבלת נכס.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
