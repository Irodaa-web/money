# Tekshiruv natijalari

## Muvaffaqiyatli bajarildi

- `npm install` — barcha loyiha kutubxonalari o‘rnatildi, package-lock.json tayyor.
- `npm run build` — Next.js 16.4.0 production build muvaffaqiyatli, sahifalar va API kompilyatsiya qilindi.
- `npm test` — **10/10 test o‘tdi**:
  1. Bola topshiradi → kutish → ota-ona tasdiqlaydi; bir martalik mukofot.
  2. Bola o‘z vazifasini tasdiqlay olmaydi, boshqa bola vazifasini topshira olmaydi.
  3. Ota-ona avval topshirishni kutishi, izoh bilan qaytarish va qayta topshirish.
  4. Noto‘g‘ri summa va o‘tgan muddatni yaratishda rad etish.
  5. Pul so‘rovi mablag‘ni band qilishi, bir mablag‘ni ikki marta ishlata olmaslik.
  6. Pul so‘rovini rad etishda balans kamaymasligi.
  7. Jamg‘arma limiti, balansga qaytarish va pul turgan maqsadni o‘chirishdan himoya.
  8. Boladan boshqa bolaning vazifa, maqsad, hamyon va xabarlarini yashirish.
  9. Parolga alohida salt, parol xeshini tekshirish.
  10. Bir oilaga 20 ta parallel yozish, atomiklik, xatoli mutatsiya va path traversal himoyasi.

## Muhit sabab yakunlanmagan

- **Haqiqiy MongoDB integratsiyasi:** vaqtinchalik MongoDB 8.2.6 yuklandi, lekin sandbox `open: Operation not permitted` xatosi bilan uning ishga tushishini blokladi. Register/login, oilaga ulash va API’ning haqiqiy DB bilan to‘liq sinovi o‘tgan deb da’vo qilinmaydi.
- **HTTP smoke test:** lokal server bilan aloqa bu muhitda yakunlanmadi; test to‘xtatildi. `npm run build`dan keyin o‘z kompyuteringizda `npm run test:http` bilan tekshirish mumkin.
- **Vizual brauzer QA:** bu muhitda mos browser-preview vositasi yo‘q; haqiqiy brauzerda screenshot/interaktiv tekshiruv bajarilmagan.

## Kompyuteringizda yakuniy qo‘lda tekshiruv

1. MongoDB yoqilgan holda ota-ona ro‘yxatdan o‘tsin.
2. Oila kodini yaratsin, bola alohida brauzer profilida ro‘yxatdan o‘tsin.
3. Bolaga 20 000 so‘mlik vazifa yuborilsin.
4. Bola topshirsin: kutish tugmasi va ota-ona xabari ko‘rinsin.
5. Ota-ona izoh bilan qaytarsin, bola qayta topshirsin.
6. Ota-ona tasdiqlasin: vazifa yo‘qolsin, bola balansi 20 000 bo‘lsin.
7. 10 000 so‘m maqsadga ajratilsin, qolgan 10 000 uchun pul so‘rovi ochilsin.
8. Ota-ona so‘rovni tasdiqlasin. Bolaning hamyon balansi 0, maqsadi 10 000 bo‘lsin.
9. Chiqib qayta kiring: onboarding takrorlanmasin, hisob va tarix saqlansin.
10. Boshqa oila oching: birinchi oilaning ma’lumoti ko‘rinmasin.
