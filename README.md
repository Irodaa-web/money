# Telegram va rasm yangilanishi

Rasm yuklash, sayt xabarnomasi va Telegram bot qo‘shilgan versiya.
**Avval `TELEGRAM-ORNATISH.md` faylini o‘qing.** Bot tokeni va webhook sozlanmaguncha Telegram xabarlari yuborilmaydi; sayt ishlashda davom etadi.

Quyida loyihaning avvalgi tavsifi saqlangan. Telegram bo‘yicha yangi yo‘riqnoma ustuvor.

---

# Birinchi Pul — Next.js + JavaScript + MongoDB

Ota-ona va bola uchun o‘zbek tilidagi ishlaydigan o‘quv loyihasi.
TypeScript ishlatilmagan. UI oddiy CSS; Next.js App Router va Route Handlers ishlatilgan.

## 1. Tez ishga tushirish

Kompyuteringizda **Node.js 22 yoki yangiroq**, **MongoDB Community Server** bo‘lsin.
MongoDB Compass faqat ma’lumotlarni ko‘rish dasturi: uning o‘zi MongoDB serverini ishga tushirmaydi.

ZIPni oching. VS Code’da ichidagi `birinchi-pul` papkasini oching.
Terminal aynan `package.json` turgan papkada bo‘lsin:

```bash
npm install
npm run setup
npm run dev
```

Brauzerda http://localhost:3000 ni oching.

- `npm install` — loyihadagi kutubxonalarni o‘rnatadi.
- `npm run setup` — `.env.example`dan `.env.local` yaratadi. Mavjud faylni o‘zgartirmaydi.
- `npm run dev` — saytni ishlab chiqish rejimida ishga tushiradi.
- Serverni to‘xtatish: terminalda `Ctrl+C`.

MongoDB serveri ishlayotgan bo‘lishi kerak. Compass’da shu manzilga ulaning:

```text
mongodb://127.0.0.1:27017/birinchi_pul
```

Standart manzil `.env.example` va backend kodida tayyor yozilgan.
Birinchi foydalanuvchi ro‘yxatdan o‘tgach `birinchi_pul` bazasi va `users` kolleksiyasi yaratiladi.

Docker o‘rnatilgan bo‘lsa, MongoDB serverini alternativ usulda yoqish mumkin:

```bash
docker compose up -d
```

Bu majburiy emas. Kompyuteringizda MongoDB 27017 portda ishlab turgan bo‘lsa, Docker variantini parallel yoqmang.

## 2. Saqlash tartibi — foydalanuvchi talabi bo‘yicha

| Ma’lumot | Saqlanadigan joy |
| --- | --- |
| Foydalanuvchi ismi, login, parol xeshi, roli | MongoDB `users` |
| Ota-ona va bola bog‘lanishi | MongoDB `users.parentId` |
| Bir martalik tushuntirish yakunlangani | MongoDB `users.onboarded` |
| Taklif kodi xeshi va sessiya xeshlari | MongoDB user ichida |
| Vazifalar | Sayt serverida `.data/<oila-id>.json` |
| Virtual balans, maqsadlar, xabarlar, tarix | Xuddi shu JSON fayl |

**Vazifalar MongoDB’da saqlanmaydi.** `tasks` kolleksiyasi yo‘q.
Ular brauzer localStorage’ida ham emas: serverdagi JSON fayl sabab ota-ona va bola bir saytga turli qurilmalardan kirganda bir xil vazifalarni ko‘radi.
`.data` avtomatik yaratiladi. Bu papka `public` ichida emas va brauzerga ochiq berilmaydi.
Vazifalar sahifani yangilash yoki serverni odatiy qayta ishga tushirishda saqlanib qoladi.
`.data` papkasini o‘chirsangiz vazifalar, virtual hisob va tarix yo‘qoladi; MongoDB userlari qoladi.

Bu arxitektura **bitta Next.js serveri va doimiy disk** uchun yozilgan.
Vercel kabi vaqtinchalik yoki read-only fayl tizimli serverless hosting uchun shu holicha mos emas.
Bunday hosting kerak bo‘lsa, JSON saqlash adapterini doimiy umumiy saqlashga almashtirish kerak.

## 3. Birinchi foydalanish

1. `/register` → **Men ota-onaman**. Ism, login, parol va parol takrorini kiriting.
2. Ota-ona kabinetida bir martalik tushuntirishni yakunlang.
3. **Oila** → **Taklif kodi yaratish**. Kod 24 soat amal qiladi va faqat bir marta ishlaydi.
4. Bolaning qurilmasida `/register` → **Men bolaman** → kodni kiriting.
5. Bola o‘z logini va paroliga ega bo‘ladi. Email talab qilinmaydi.
6. Ota-ona **Yangi vazifa** tugmasini bosadi. Bolani, vazifa matnini, kun va soatni, mukofotni belgilaydi.
7. Bola **Vazifalarim** bo‘limida yangi vazifani ko‘radi. Sahifalar har 4 soniyada yangilanadi; tabga qaytilganda ham yangilanadi.
8. Bola **Qilib bo‘ldim** → ixtiyoriy izoh → **Ota-onaga yuborish**.
9. Bolada tugma **Ota-ona tasdiqlashini kuting** holatiga o‘tib, bloklanadi. Ota-onaga kabinet ichida xabar keladi.
10. Ota-ona tekshiradi: **Tasdiqlash** yoki sabab bilan **Qaytarish**.
11. Tasdiqlanganda vazifa faol ro‘yxatdan olib tashlanadi. Mukofot virtual balansga faqat bir marta qo‘shiladi. Mukofot yozuvi tarixda qoladi.

Bir kompyuterda ota-ona va bolani bir vaqtda tekshirish uchun ikkita **alohida brauzer profili**, oddiy + incognito oyna yoki boshqa brauzerdan foydalaning. Bitta profilning oddiy tablari bir xil login cookie’sini ulashadi.

Muddat **Toshkent (UTC+5)** bo‘yicha kiritiladi va `20.10.2026 19:00` kabi ko‘rsatiladi. Muddat o‘tgan vazifa belgilab qo‘yiladi, bola uni kechikib topshirishi mumkin; yakuniy qarorni ota-ona qiladi.

## 4. Qo‘shimcha funksiyalar

- Bir ota-onaga bir nechta bola ulash.
- Oila bo‘yicha vazifalar va ma’lumotlarni ajratish.
- Bola faqat o‘z vazifa, maqsad, hamyon va xabarlarini ko‘radi.
- Ota-onaning vazifani bekor qilishi va izoh bilan qaytarishi.
- Virtual mukofotlar tarixi.
- Maqsad yaratish, balansdan jamg‘armaga pul ajratish, balansga qaytarish.
- Maqsad summasidan oshib ketishni va manfiy balansni to‘sish.
- Bolaning ota-onadan pul so‘rashi. So‘rovdagi mablag‘ vaqtincha band qilinadi.
- Ota-ona pulni tashqarida bergach, **Pulni berdim** deb tasdiqlaydi. Sayt faqat virtual balansni kamaytiradi.
- Xabarnomalar va o‘qilgan deb belgilash.
- Uchta kichik moliyaviy dars va interaktiv savollar.
- Hisob bo‘yicha bir martalik tushuntirish. Yakunlash MongoDB’da saqlanadi, boshqa qurilmada ham takrorlanmaydi.
- Menyudagi **Saytni tushuntirish** orqali qo‘llanmani qayta ochish.
- Mobil, planshet va desktop uchun moslashuvchi CSS.

**Haqiqiy karta, pul o‘tkazish, SMS, email yuborish yoki push notification ulanmagan.** Xabarlar sayt kabinetida ko‘rinadi. Bu o‘quv loyihasidagi virtual hisob.
Parolni unutish uchun avtomatik tiklash xizmati mavjud emas; login va parolingizni eslab qoling.

## 5. Sahifa routing

| URL | Vazifasi |
| --- | --- |
| `/` | Tushuntiruvchi bosh sahifa |
| `/register` | Ota-ona / bola ro‘yxatdan o‘tishi |
| `/login` | Login va parol bilan kirish |
| `/parent` | Ota-ona umumiy kabineti |
| `/parent/tasks` | Vazifalar va tasdiqlash |
| `/parent/family` | Farzandlar va taklif kodi |
| `/parent/goals` | Bolalar maqsadlari |
| `/parent/wallet` | Hisob, tarix va pul so‘rovlari |
| `/parent/notifications` | Ota-ona xabarlari |
| `/parent/learn` | Moliyaviy darslar |
| `/child` | Bolaning umumiy kabineti |
| `/child/tasks` | O‘z vazifalari |
| `/child/goals` | Shaxsiy maqsad va jamg‘arma |
| `/child/wallet` | Virtual hamyon va pul so‘rash |
| `/child/notifications` | Bolaning xabarlari |
| `/child/learn` | Moliyaviy darslar |

Ota-ona bola sahifasiga yoki bola ota-ona sahifasiga kirsa, o‘z kabinetiga yo‘naltiriladi. Shaxsiy ma’lumotlarning haqiqiy himoyasi API’da tekshiriladi; faqat frontend tugmalariga tayanilmaydi.

## 6. API routing

Barchasi `app/api/[...path]/route.js` orqali `lib/api.js`ga boradi.

| Method | URL | Ruxsat |
| --- | --- | --- |
| POST | `/api/auth/register` | Ro‘yxatdan o‘tish; bola uchun taklif kodi |
| POST | `/api/auth/login` | Kirish |
| POST | `/api/auth/logout` | Chiqish va sessiyani bekor qilish |
| GET | `/api/auth/me` | Joriy foydalanuvchi |
| POST | `/api/onboarding` | Bir martalik tushuntirishni yakunlash |
| POST | `/api/family/invite` | Faqat ota-ona |
| GET | `/api/state` | Faqat o‘ziga ruxsat etilgan ma’lumotlar |
| POST | `/api/tasks` | Ota-ona vazifa yaratadi |
| PATCH | `/api/tasks/:id` | `submit`, `approve`, `return`, `delete` |
| POST | `/api/goals` | Bola maqsad yaratadi |
| PATCH | `/api/goals/:id` | `save`, `release`, `delete` |
| POST | `/api/payouts` | Bola pul so‘raydi |
| PATCH | `/api/payouts/:id` | Ota-ona `approve` / `reject` |
| POST | `/api/notifications/read` | O‘z xabarlarini o‘qilgan qilish |

POST/PATCH so‘rovlari `Content-Type: application/json` va saytning o‘zi bilan bir xil `Origin` talab qiladi. Frontend buni avtomatik yuboradi. API’ni terminaldan tekshirganda `Origin: http://localhost:3000`ni qo‘shing.

## 7. Fayllar nima uchun kerak?

- `app/` — sahifalar va URL routing.
- `app/globals.css` — butun dizayn, mobil uslublar va animatsiyalar.
- `components/Dashboard.js` — ota-ona va bola kabinetlari hamda formalar.
- `components/AuthForm.js` — register/login formasi.
- `components/Modal.js` — fokus boshqariladigan modal oyna.
- `components/Tour.js` — bir martalik bosqichli tushuntirish.
- `components/Learn.js` — kichik moliyaviy darslar.
- `components/Brand.js`, `Icon.js` — logotip va SVG ikonlar.
- `lib/api.js` — backend endpointlari va ruxsat tekshiruvlari.
- `lib/auth.js` — cookie va MongoDB’da xeshlangan sessiyalar.
- `lib/security.js` — scrypt parol xeshlash, validatsiya, cheklovlar.
- `lib/db.js` — MongoDB ulanishini qayta ishlatish.
- `lib/store.js` — JSON fayllarni lock va atomic rename bilan saqlash.
- `lib/domain.js` — vazifalar, mukofotlar, maqsadlar, so‘rovlar mantig‘i.
- `lib/format.js` — frontend API chaqirish, pul va sana formati.
- `models/User.js` — yagona MongoDB modeli.
- `scripts/setup.mjs` — .env.local yaratish.
- `tests/` — muhim biznes mantiqi, xavfsizlik va parallel yozish testlari.
- `ROUTING.txt` — barcha fayllarning to‘liq tuzilishi.
- `FULL_CODE.md` — loyiha kodlarining bitta fayldagi to‘liq nusxasi; loyiha ishlashi uchun bu fayl shart emas.

## 8. Tekshirish va production

```bash
npm test
npm run build
npm start
```

`npm test`: 10 ta avtomatik test. `npm run build`: Next.js production build.
Haqiqiy MongoDB bilan to‘liq integratsion testga urinishda bu muhit MongoDB serverini `Operation not permitted` xatosi bilan to‘xtatdi. Shuning uchun register/login va oilaga ulashning haqiqiy baza bilan yakuniy tekshiruvi bajarilmagan. Kompyuteringizda yuqoridagi birinchi foydalanish ketma-ketligini sinang. Aniq tekshiruv natijalari `VERIFICATION.md`da.
Brauzerda vizual tekshiruv ushbu tayyorlash muhitida bajarilmagan; taqdimotdan oldin kompyuter va telefoningizda ko‘rib chiqing.

Production uchun:
- Node serverni doimiy diskli VPS yoki xuddi shunday hostingda ishlating; `.data` uchun saqlanadigan volume bering.
- HTTPS qo‘ying va `.env.local`dagi `COOKIE_SECURE=true` qiling.
- `MONGODB_URI`ni o‘zingizning MongoDB serveringiz/Atlas manziliga o‘zgartiring. Parollarni Git’ga yuklamang.
- `.data` va MongoDB’ni birga zaxiralang. Ikkalasi oilaning holatini tashkil qiladi.
- Bitta Node instance bilan ishlating. Ko‘p replika uchun markaziy saqlash va umumiy rate limiter kerak.
- JSON fayl hajmi va yozish yuklamasi sabab katta masshtab uchun alohida saqlash adapteri kerak.
- Server keskin o‘chib, eski `.lock` papkasi qolsa: barcha Node jarayonlari to‘xtaganini tekshiring, faqat qolgan `<oila-id>.json.lock` papkasini olib tashlang, serverni qayta yoqing. `.json`ni o‘chirmang.

## 9. Ko‘p uchraydigan muammolar

**Bazaga ulanish bo‘lmadi:** Compass ochiqligining o‘zi yetmaydi; MongoDB Community Server xizmati ishlayotganini tekshiring. `.env.local` o‘zgarsa Next serverini qayta ishga tushiring.

**Bola vazifani ko‘rmayapti:** u aynan shu ota-ona bergan kod bilan ro‘yxatdan o‘tganini tekshiring. Ikkala qurilma ham bir xil ishlayotgan Next serverga kirishi kerak. Ikki alohida loyiha nusxasining `.data` fayllari umumiy emas.

**Telefondan kirish:** kompyuter va telefon bitta Wi-Fi’da bo‘lsin. Telefonda `http://KOMPYUTER_LAN_IP:3000`ni oching, localhost emas. Firewall ruxsatini tekshiring. Bu lokal sinov; internetga chiqarish uchun HTTPS deployment kerak.

**Bir tabda ota-ona, ikkinchisida bola yo‘q:** login cookie brauzer profilida umumiy. Incognito yoki alohida brauzer profilini ishlating.

**MongoDB’da vazifalar ko‘rinmayapti:** bu talab bo‘yicha to‘g‘ri. Ular `.data` ichida saqlanadi.

**Shrift yuklanmadi:** dizayn internetdan Google Fonts olishi mumkin. Internet bo‘lmasa Arial fallback bilan barcha funksiyalar ishlaydi.
