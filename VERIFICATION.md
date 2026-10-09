# Tekshiruv natijalari — Telegram yangilanishi

- `npm ci`: muvaffaqiyatli.
- `npm run build`: muvaffaqiyatli (Next.js 16.4.0).
- `npm test`: 23 test o‘tdi, 1 MongoDB integratsiya testi o‘tkazib yuborildi.
- `npm run test:http`: 7 sahifa, sessiyasiz API, begona origin, himoyasiz webhook/cron hamda sessiyasiz rasm olish rad etilishi tekshirildi.
- Rasmni qayta kodlash, noto‘g‘ri faylni rad etish, rasmga oila bo‘yicha ruxsat, navbatning parallel yuborishni cheklashi, qayta urinish va mukofotning bir marta berilishi testlandi.
- Telegram API testi soxta fetch javobi bilan ishladi; haqiqiy Telegram yuborilmadi.
- Muhitda vaqtinchalik MongoDB ishga tushmadi va brauzer yuklanmadi. To‘liq DB integratsiya va vizual test hali bajarilmagan.
- GitHub push, Vercel deploy va haqiqiy bot ulanishi bajarilmadi: akkauntlar/token sozlanishi kerak.

Jonli qabul testi: `TELEGRAM-ORNATISH.md` 6-bo‘limi.

## Kamera yangilanishi — ushbu tekshiruv

- `npm ci --ignore-scripts --no-audit --no-fund`: muvaffaqiyatli.
- `npm run build`: muvaffaqiyatli.
- `npm test`: 23 test o‘tdi, 1 MongoDB integratsiya testi sozlanmagan muhit sabab o'tkazib yuborildi.
- Kamera komponentining yig‘ilishi tekshirildi. Haqiqiy telefon/veb-kamera, brauzer ruxsatlari va MongoDB bilan yakuniy topshirish ushbu muhitda sinovdan o‘tkazilmadi.
- Ushbu o‘zgarish deploy qilinmagan. Telegramning haqiqiy tokeni sozlanmagan.

## GitHub Money uchun yakuniy tekshiruv

- Kamera uchun Permissions-Policy `camera=(self)` qilib tuzatildi.
- Bot username namunasi `birinchi_pul_family_bot` qilib belgilandi.
- Testlar: 23 o‘tdi, MongoDB integratsiya testi sozlanmagan muhit sabab o‘tkazib yuborildi.
- Haqiqiy kamera, Telegram tokeni va ishlab turgan baza bilan yakuniy test uchun deploy va maxfiy muhit sozlamalari talab etiladi.
