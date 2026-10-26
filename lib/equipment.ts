// Replace src, dimensions and alt with the real photo when supplied.
// Set illustration to false to remove the illustration caption for the real photo.
export type EquipmentPhoto = { src: string; width: number; height: number; alt: string; illustration?: boolean };
export const equipmentPhoto: EquipmentPhoto | null = {
  src: "/assets/img/professional-equipment-illustration.webp",
  width: 1672,
  height: 940,
  alt: "תמונת המחשה של ציוד מדידה ובדיקה מקצועי לבדק בית",
  illustration: true,
};
