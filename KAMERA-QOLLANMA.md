# Vazifaga kamera va rasm qo‘shish

Bola akkaunti → Vazifalar → Bajardim.

1. Izohni yozing (ixtiyoriy).
2. «Kamerada olish» orqali kameraga ruxsat bering va «Suratga olish»ni bosing. Telefonda orqa kamera afzal ko‘riladi; kompyuterda veb-kamera ishlatiladi.
3. Yoki «Rasm tanlash» orqali JPG, PNG, WebP fayl tanlang (15 MB gacha).
4. Suratni tekshiring: qayta olish, almashtirish yoki olib tashlash mumkin.
5. «Bajardim — ota-onaga yuborish»ni bosing.

Kamera yopilganda, surat olinganda yoki oyna yopilganda kamera oqimi to‘xtaydi. Mikrofonga ruxsat so‘ralmaydi. Kamera ishlamasa, telefonning o‘z kamera/fayl tanlash tugmasi taklif qilinadi. Brauzerda kamera HTTPS yoki localhost orqali ishlaydi.

Surat siqilib, mavjud API orqali MongoDB’ga saqlanadi. Ota-ona uni vazifalar va xabarnomalarda ko‘radi. Telegram xabari uchun mavjud TELEGRAM-ORNATISH.md bo‘yicha botni sozlash kerak.

Yangi komponent: components/TaskCamera.js.
Yangilangan fayllar: components/TaskSubmission.js, app/globals.css.

Tekshirish: kompyuter va telefonda kamera ruxsatini berish/rad etish, surat olish, qayta olish, rasm tanlash, bekor qilish, izoh bilan topshirish va ota-ona akkauntida rasmni ochish.
