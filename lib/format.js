export const moneyText = value => `${Number(value || 0).toLocaleString('ru-RU')} so‘m`;
export function dateText(value) {
  return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value)).replace(',', '');
}
export function localDateInput() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
export async function api(path, options = {}) {
  const response = await fetch(`/api/${path}`, { cache: 'no-store', ...options, headers: { 'Content-Type': 'application/json', ...options.headers }, body: options.body === undefined ? undefined : JSON.stringify(options.body) });
  let payload;
  try { payload = await response.json(); } catch { throw new Error('Server javobi olinmadi. Qayta urinib ko‘ring.'); }
  if (!response.ok) { const e = new Error(payload.error || 'So‘rov bajarilmadi.'); e.status = response.status; throw e; }
  return payload;
}
