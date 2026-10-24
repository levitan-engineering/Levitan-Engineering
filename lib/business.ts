export const BUSINESS = {
  name: "לויתן הנדסה",
  whatsapp: "972556625745",
  telephone: "+972556625745",
  displayPhone: "055-662-5745",
  email: "levitanengineering@gmail.com",
};
export const NEW_APARTMENT_PATH = "/services/#new-apartment";
export function whatsappLink(message = "") {
  return `https://wa.me/${BUSINESS.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
