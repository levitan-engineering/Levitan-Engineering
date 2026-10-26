// Add only the owner's real equipment photo when supplied.
// Copy it into public/assets/img/ and set src to /assets/img/<filename>.
// Record the image's actual pixel dimensions; do not use a stock placeholder.
export type EquipmentPhoto = { src: string; width: number; height: number; alt: string };
export const equipmentPhoto: EquipmentPhoto | null = null;
