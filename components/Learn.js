'use client';
import { useState } from 'react';
import Icon from './Icon';
const lessons = [
  { icon: 'wallet', title: 'Ehtiyojmi yoki xohish?', text: 'Ehtiyoj — kundalik hayot uchun zarur narsa. Xohish esa hozir olmasangiz ham bo‘ladigan narsa. Xarid oldidan shu savolni bering.', question: 'Maktab daftarlaringiz tugadi. Qaysi xaridni avval rejalashtirasiz?', options: ['Yangi o‘yinchoq', 'Dars uchun daftar', 'Ikkinchi quloqchin'], answer: 1, why: 'Daftar dars uchun zarur. Qolgan xaridlar uchun keyinroq jamg‘arish mumkin.' },
  { icon: 'target', title: 'Maqsadni kichik qadamlarga bo‘ling', text: 'Katta summani birdan yig‘ish qiyin ko‘rinadi. Uni kichik qismlarga ajrating va muntazam jamg‘aring.', question: 'Kitob 60 000 so‘m. Har hafta 15 000 so‘m ajratsangiz, necha haftada yetadi?', options: ['2 hafta', '3 hafta', '4 hafta'], answer: 2, why: '60 000 ÷ 15 000 = 4 hafta. Rejada boshqa xarajatlarni ham esdan chiqarmang.' },
  { icon: 'clock', title: 'Xarid qilishdan oldin to‘xtang', text: 'Biror narsa yoqib qolsa, uni darrov olish shart emas. Biroz kuting, narxini solishtiring va maqsadingizni eslang.', question: 'O‘yinda chegirma ko‘rdingiz. Eng o‘ylangan birinchi qadam qaysi?', options: ['Darhol hamma pulni sarflash', 'Kerakligini va budjetni tekshirish', 'Do‘stdan pul qarz olish'], answer: 1, why: 'Chegirma borligi xarid zarur degani emas. Avval qancha erkin pulingiz borligini tekshiring.' },
];
export default function Learn() {
  const [answers, setAnswers] = useState({});
  return <div className="lesson-grid">{lessons.map((lesson, index) => <article className="card lesson-card" key={lesson.title}><span className="lesson-icon"><Icon name={lesson.icon} size={26} /></span><span className="eyebrow">{index + 1}-KICHIK DARS</span><h2>{lesson.title}</h2><p>{lesson.text}</p><h3>{lesson.question}</h3><div className="answers">{lesson.options.map((option, i) => <button key={option} onClick={() => setAnswers({ ...answers, [index]: i })} className={answers[index] === i ? (i === lesson.answer ? 'correct' : 'incorrect') : ''}>{option}</button>)}</div>{answers[index] !== undefined && <div className={`alert ${answers[index] === lesson.answer ? 'success' : ''}`}>{answers[index] === lesson.answer ? 'To‘g‘ri! ' : 'Yana o‘ylab ko‘ring. '}{lesson.why}</div>}</article>)}</div>;
}
