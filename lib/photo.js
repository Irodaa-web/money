import sharp from 'sharp';
import { ensure } from './security.js';
export const MAX_PHOTO_BYTES = 1500000;
export async function decodePhoto(value) {
  if (value === undefined || value === null || value === '') return null;
  ensure(typeof value === 'string' && value.length <= 2100000, 'Rasm hajmi juda katta.', 413);
  const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  ensure(match, 'JPG, PNG yoki WebP rasm tanlang.');
  const bytes = Buffer.from(match[2], 'base64');
  ensure(bytes.length > 0 && bytes.length <= MAX_PHOTO_BYTES, 'Rasm 1,5 MB dan kichik bo‘lsin.', 413);
  try {
    // Decode, bound pixel count and re-encode: reject forged files and remove EXIF/GPS.
    return await sharp(bytes, { limitInputPixels: 25000000, animated: false })
      .rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#ffffff' }).jpeg({ quality: 82 }).toBuffer();
  } catch { ensure(false, 'Rasmni ochib bo‘lmadi. Boshqa JPG yoki PNG rasm tanlang.'); }
}
export function canViewPhoto(photo, actor) {
  return actor.role === 'parent' ? photo.familyId === actor.id
    : photo.familyId === actor.parentId && photo.childId === actor.id;
}
