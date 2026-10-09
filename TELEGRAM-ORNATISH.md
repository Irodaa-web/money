# Birinchi Pul: rasm va Telegram xabarnomalari

## Nimalar qo‘shildi?
- Bola “Qilib bo‘ldim” oynasida rasm tanlaydi, oldindan ko‘radi va xohlasa olib tashlaydi. Izoh va rasm ixtiyoriy.
- JPG/PNG/WebP: dastlabki fayl 15 MB gacha; brauzer kichraytiradi. Server rasmni qayta tekshiradi, JPEG qiladi va EXIF/GPS ma’lumotlarini olib tashlaydi.
- Rasm MongoDB `taskphotos` kolleksiyasida saqlanadi. Alohida pullik rasm xizmati shart emas; rasmlar MongoDB hajmini ishlatadi.
- Ota-ona vazifa kartasida va xabarnomada rasm hamda izohni ko‘radi. Tasdiqlagandan keyin ham xabarnomadagi rasm qoladi.
- Rasmni faqat tegishli bola va uning ota-onasi akkaunt orqali ochadi. Telegram’ga rasm serverdan fayl sifatida yuboriladi.
- Ota-ona “Oila” yoki “Xabarnomalar” bo‘limida Telegram’ni ulaydi. Har bir ota-ona uchun alohida, 10 daqiqalik, bir martalik havola yaratiladi.
- Telegram xabari: bola ismi, vazifa nomi, rasm, izoh, topshirilgan vaqt, “Vazifani ko‘rish” tugmasi.
- Tasdiqlash saytda amalga oshiriladi. Pul/XP faqat ota-ona tasdiqlagach qo‘shiladi.
- Telegram ishlamasa ham vazifa saqlanadi; xabar MongoDB’dagi navbatda qoladi. Qayta yuborish tugmasi bor.

## 1. Loyihani yangilash
Avval ishlayotgan loyihangiz nusxasini saqlang. ZIP ichidagi `birinchi-pul` papkasini oching: `package.json` shu yerda.
Shu fayllarni mavjud GitHub loyihangizning ishchi papkasiga ko‘chiring. Eski `.env.local` faylingizni saqlab qoling.
ZIP’da node_modules, .next, shaxsiy bazalar, brauzer keshi va haqiqiy tokenlar yo‘q.

VS Code terminali:
```bash
npm ci
```
Node.js 22 yoki yangiroq kerak. Avvalgi MongoDB bazasini ishlating: akkauntlar va balanslarni o‘chirish shart emas.

## 2. Bot yaratish — bir marta
Telegram’da rasmiy @BotFather (https://t.me/BotFather) ni oching.
`/newbot` yuboring, nom kiriting, so‘ng `bot` bilan tugaydigan bo‘sh username tanlang.
Berilgan tokenni `.env.local` ichidagi TELEGRAM_BOT_TOKEN ga kiriting. Uni GitHub’ga yoki chatga joylamang.

## 3. Sozlamalar
`.env.example` namunasi asosida `.env.local` ni to‘ldiring. Mavjud MONGODB_URI qiymatini o‘zgartirmang.
```env
MONGODB_URI=avvalgi_mongodb_manzilingiz
APP_ORIGIN=https://sizning-saytingiz.vercel.app
COOKIE_SECURE=true
TELEGRAM_BOT_TOKEN=BotFather_bergan_token
TELEGRAM_BOT_USERNAME=bot_username_at_belgisiz
TELEGRAM_WEBHOOK_SECRET=yaratilgan_maxfiy_qiymat
CRON_SECRET=yaratilgan_boshqa_maxfiy_qiymat
```
Maxfiy qiymatlarni terminalda o‘zingiz yarating:
```bash
npm run telegram:secrets
```
Chiqqan ikkita qiymatni tegishli sozlamalarga qo‘ying.
Mahalliy `npm run dev` uchun APP_ORIGIN=http://localhost:3000 va COOKIE_SECURE=false bo‘ladi.
Bot webhook’i uchun esa ommaviy HTTPS manzil kerak; uni production Vercel manziliga sozlang.

## 4. GitHub va Vercel
Mavjud repository papkasida:
```bash
git status
git add .
git commit -m "Add task photos and Telegram notifications"
git push
```
Vercel loyiha sozlamalaridagi Environment Variables bo‘limiga yuqoridagi 7 qiymatni kiriting.
APP_ORIGIN aynan foydalanuvchi ochadigan production manzil bo‘lsin. Oxirida `/` qo‘ymaslik qulay.
Production muhitiga saqlang va Redeploy qiling. Root Directory `package.json` joylashgan papka bo‘lsin.
Build command: `npm run build`; framework: Next.js.
Bu loyiha sessiya cookie bilan ishlaydi; yangi JWT_SECRET talab qilinmaydi.

## 5. Webhook’ni ulash
Deploy Ready bo‘lgach, lokal `.env.local` da APP_ORIGIN production HTTPS manziliga o‘rnatilganini va token/secret Vercel bilan bir xil ekanini tekshiring:
```bash
npm run telegram:setup
```
Skript botni getMe bilan tekshiradi, setWebhook ni chaqiradi, getWebhookInfo natijasini ko‘rsatadi. Tokenni chop etmaydi.
Webhook manzili: `https://SAYTINGIZ/api/telegram/webhook`.
Vercel deployment protection Telegram’ning production webhook so‘rovini login sahifasiga yo‘naltirmasligi kerak.

## 6. Ota-onani ulash va sinash
1. Production saytda ota-ona akkauntiga kiring.
2. “Oila” yoki “Xabarnomalar” → “Telegram’ni ulash”.
3. “Telegram’ni ochish” → botda Start/Boshlash.
4. Saytga qaytganda “Telegram ulangan” yozuvi chiqadi.
5. Bolaga yangi vazifa bering. Bola akkauntidan rasm va izoh bilan topshiring.
6. Ota-ona sayti va Telegram’da bir xil rasm/izoh kelishini tekshiring.
7. “Vazifani ko‘rish” → saytda tasdiqlang. Balans va XP bir marta oshadi.
8. Telegram’dan `/stop` yoki saytdan “Ulanishni uzish” xabarnomalarni to‘xtatadi.

Bot ulanmagan bo‘lsa ham saytdagi topshirish ishlaydi. Avval yuborilmagan xabarlarni “Qayta yuborish” orqali (bir bosishda 3 tagacha) yetkazish mumkin.

## Qayta yuborish va jadval
Oddiy topshirishda Telegram’ga darhol yuborishga urinish bo‘ladi. Xatoda ma’lumotlar bazasidagi navbat saqlanadi.
`vercel.json` kuniga bir marta (00:00 UTC) qayta urinishni sozlaydi. Vercel CRON_SECRET qiymati bilan so‘rovni himoyalaydi.
Tezroq avtomatik takrorlash kerak bo‘lsa, tarifingiz qo‘llasa cron’ni `*/5 * * * *` ga o‘zgartiring yoki ishonchli scheduler’dan har 5 daqiqada quyidagini chaqiring:
- GET https://SAYTINGIZ/api/telegram/retry
- Authorization: Bearer CRON_SECRET_QIYMATI

Bir cron chaqiruvi 10 tagacha ulangan oiladan bittadan xabarni oladi. Ko‘p foydalanuvchi bo‘lsa tez-tez ishlaydigan jadval kerak.
Telegram bloklangan yoki token noto‘g‘ri bo‘lsa xabar “yetkazilmadi” bo‘ladi; sozlamani tuzatib “Qayta yuborish”ni bosing.
Telegram xabarni olib, tarmoq javobi yo‘qolgan juda kam holatlarda qayta urinish takroriy xabar berishi mumkin; mukofot takroran berilmaydi.

## Tekshirish
```bash
npm run build
npm test
npm run test:http
```
MongoDB integratsiya testi alohida test bazasi uchun MONGODB_TEST_URI berilgandagina ishlaydi. Haqiqiy foydalanuvchi bazasini test uchun ishlatmang.

## Hozirgi tekshiruv chegarasi
Kod build va 23 ta avtomatik testdan o‘tdi. Haqiqiy bot tokeni va production akkauntlariga ulanmaganimiz sababli jonli Telegram yetkazilishi va Vercel deploy hali bajarilmagan.
Ushbu muhitda vaqtinchalik MongoDB ishga tushmadi, shuning uchun MongoDB integratsiya testi o‘tkazib yuborildi. Brauzer o‘rnatilishi ham yakunlanmadi, vizual tekshiruv bajarilmadi.

Manbalar: https://core.telegram.org/bots/api#sendphoto, https://core.telegram.org/bots/api#setwebhook, https://core.telegram.org/bots/features#deep-linking
