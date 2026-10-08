import Link from 'next/link';
import Brand from '@/components/Brand';
import Icon from '@/components/Icon';
import Reveal from '@/components/Reveal';

const steps = [
  { icon: 'users', title: 'Oilangizni birlashtiring', text: 'Ota-ona hisob ochadi va “Oila” bo‘limidan taklif kodi oladi. Farzandingiz shu kod bilan sizga ulanadi.' },
  { icon: 'tasks', title: 'Kichik vazifadan boshlang', text: 'Farzandingiz bilan vazifa, muddat va virtual mukofotni kelishib oling. U bajargan ishini sizga yuboradi.' },
  { icon: 'target', title: 'Harakatni odatga aylantiring', text: 'Vazifani tasdiqlang. Farzandingiz mukofotini ko‘radi, maqsadiga pul ajratadi va natijasini kuzatadi.' },
];
const skills = [
  { icon: 'tasks', number: '01', title: 'Mas’uliyat', text: 'Kelishilgan vazifani vaqtida bajarish va o‘z ishining natijasini ko‘rsatish.', tone: 'mint' },
  { icon: 'target', number: '02', title: 'Jamg‘arish', text: 'Istagan narsasi uchun maqsad qo‘yish va unga kichik qadamlar bilan yaqinlashish.', tone: 'peach' },
  { icon: 'wallet', number: '03', title: 'O‘ylab sarflash', text: 'Ehtiyoj va xohishning farqini tushunish, xarid oldidan o‘ziga savol berish.', tone: 'lilac' },
  { icon: 'clock', number: '04', title: 'Sabr va reja', text: 'Hamma narsaga birdan erishilmasligini, muntazam harakatning qadrini bilish.', tone: 'yellow' },
];
const faqs = [
  ['Bu haqiqiy bank hisobimi?', 'Yo‘q. Birinchi Puldagi balans va mukofotlar virtual. Bu oilada pul haqida suhbatlashish va moliyaviy odatlarni mashq qilish uchun vosita. Sayt bank kartasidan pul yechmaydi yoki pul o‘tkazmaydi.'],
  ['Farzandimni qanday qo‘shaman?', 'Avval ota-ona sifatida ro‘yxatdan o‘ting. Kabinetdagi “Oila” bo‘limida taklif kodi yarating. Farzandingiz ro‘yxatdan o‘tishda “Men bolaman”ni tanlab, shu kodni kiritadi. Kod bir martalik va 24 soat amal qiladi.'],
  ['Vazifani bajarganini kim tasdiqlaydi?', 'Farzandingiz “Qilib bo‘ldim” tugmasi orqali ishini yuboradi. Siz uni ko‘rib chiqasiz: tasdiqlashingiz yoki izoh bilan qaytarishingiz mumkin. Virtual mukofot faqat tasdiqdan so‘ng balansga qo‘shiladi.'],
  ['Virtual mukofotni haqiqiy pulga almashtirish mumkinmi?', 'Bola kabinetdan pul so‘rovi yuborishi mumkin. Uni ota-ona ko‘rib chiqadi. Haqiqiy pulni berish oiladagi kelishuv asosida, saytdan tashqarida amalga oshiriladi.'],
  ['Har bir uy ishi uchun mukofot berish kerakmi?', 'Bu oilangizning qarori. Oddiy oilaviy mas’uliyat va alohida rag‘batlantiriladigan vazifalarni oldindan kelishib olish mumkin. Mukofot bilan birga samimiy maqtov va suhbatga ham joy bering.'],
  ['Nimadan boshlaganimiz ma’qul?', 'Bitta tushunarli vazifa va farzandingiz uchun qiziqarli bitta maqsaddan boshlang. Masalan, kitob o‘qish vazifasi va yangi kitob uchun jamg‘arish. Muhimi, shartlarni birga kelishib olish.'],
];

export default function Home() {
  return <main className="landing premium-landing">
    <nav className="landing-nav" aria-label="Bosh sahifa menyusi">
      <Brand />
      <div className="landing-links"><a href="#qanday">Qanday ishlaydi?</a><a href="#konikmalar">Farzandingiz uchun</a><a href="#savollar">Savollar</a></div>
      <div className="landing-account"><Link href="/login" className="nav-login">Kirish</Link><Link href="/register" className="button primary">Boshlash <Icon name="arrow" size={17} /></Link></div>
    </nav>
    <section className="premium-hero">
      <div className="hero-copy">
        <span className="pill"><span className="dot" /> KICHIK ODATLAR. KATTA KELAJAK.</span>
        <h1>Bugun kichik vazifa.<br />Ertaga <em>katta<br className="desktop-break" /> mustaqillik.</em></h1>
        <p>Farzandingiz pulning qadrini hayotiy mashqlar orqali o‘rgansin. Vazifalar, virtual mukofotlar va orzular uchun jamg‘arma — barchasi sizning mehrli ko‘magingiz bilan.</p>
        <div className="hero-actions"><Link href="/register" className="button primary">Oilamiz bilan boshlash <Icon name="arrow" /></Link><a className="text-link" href="#qanday"><span className="play-icon">▶</span> Qanday ishlaydi?</a></div>
        <div className="hero-note"><span><Icon name="check" size={16} /> Karta kerak emas</span><span><Icon name="check" size={16} /> O‘zbek tilida</span><span><Icon name="check" size={16} /> Ota-ona nazoratida</span></div>
      </div>
      <div className="journey-scene" aria-label="Vazifa, virtual mukofot va jamg‘arma jarayonining ko‘rgazmali namunasi">
        <div className="scene-grid" aria-hidden="true" /><span className="scene-spark spark-one" aria-hidden="true">✳</span><span className="scene-spark spark-two" aria-hidden="true">✦</span>
        <div className="scene-heading"><span className="dot" /> KATTA ORZULAR SHU YERDAN BOSHLANADI</div>
        <div className="journey-wallet"><div className="wallet-card-top"><span>MENING ILK JAMG‘ARMAM</span><Icon name="wallet" size={23} /></div><strong>120 000 <small>so‘m</small></strong><div className="wallet-card-bottom"><span>Harakatlarimning natijasi</span><span>✦</span></div><span className="wallet-circle" aria-hidden="true" /></div>
        <div className="journey-task"><span className="sample-check"><Icon name="check" size={22} /></span><div><strong>Kitob o‘qish</strong><small>Vazifa ota-ona tomonidan tasdiqlandi</small></div><b>+20 000</b></div>
        <div className="journey-goal"><div className="goal-picture" aria-hidden="true">🚲</div><div className="journey-goal-copy"><span>MENING KATTA ORZUM</span><h3>Birinchi velosipedim</h3><div className="goal-demo-numbers"><strong>120 000 so‘m</strong><span>30%</span></div><div className="progress"><span style={{ width: '30%' }} /></div><small>400 000 so‘mlik maqsad sari</small></div></div>
        <div className="scene-sticker"><Icon name="star" size={18} /> Men uddalayman!</div>
        <p className="scene-caption">Ko‘rgazmali namuna · Balans va mukofotlar virtual</p>
      </div>
    </section>
    <div className="promise-strip"><span>Puldan ham muhimrog‘i — <strong>yaxshi odatlar.</strong></span><div><span><Icon name="users" /> Birga o‘rganish</span><span><Icon name="leaf" /> Har kuni o‘sish</span><span><Icon name="target" /> Maqsad bilan yashash</span></div></div>
    <Reveal className="landing-section intro-section" id="imkoniyatlar">
      <div className="section-intro"><span className="eyebrow">OTA-ONALAR UCHUN YARATILGAN</span><h2>“Olib bering”dan<br /><em>“O‘zim yig‘aman”gacha.</em></h2></div>
      <div className="intro-copy"><p>Pul haqida gaplashishni katta bo‘lguncha kutish shart emas. Kundalik kichik vazifalar orqali mehnat, tanlov va jamg‘arish o‘rtasidagi bog‘liqlikni birga kashf qiling.</p><p>Birinchi Pul shu jarayonni ko‘rinadigan qiladi: siz yo‘l ko‘rsatasiz, farzandingiz harakat qiladi, natijadan esa birga quvonasiz.</p><a className="text-link" href="#panellar">Oilamiz uchun nimalar bor? <Icon name="arrow" size={18} /></a></div>
    </Reveal>
    <Reveal className="landing-section learning-section" id="konikmalar">
      <div className="section-title-row"><div><span className="eyebrow">FAQAT PUL SANASH EMAS</span><h2>Hayotga kerakli<br />to‘rtta kichik ko‘nikma.</h2></div><p>Bugun mashq qilingan odatlar<br />ertangi mustaqil qarorlarga asos bo‘ladi.</p></div>
      <div className="skills-grid">{skills.map(skill => <article className={`skill-card ${skill.tone}`} key={skill.number}><div className="skill-top"><span className="skill-icon"><Icon name={skill.icon} size={26} /></span><span>{skill.number}</span></div><h3>{skill.title}</h3><p>{skill.text}</p></article>)}</div>
    </Reveal>
    <Reveal className="landing-section process-section" id="qanday">
      <div className="section-title-row"><div><span className="eyebrow">BOSHLASH O‘YLANGANIDAN OSON</span><h2>Bir oila. Bir jamoa.<br />Uchta oddiy qadam.</h2></div><Link className="button light" href="/register">Birinchi qadamni qo‘yish <Icon name="arrow" size={18} /></Link></div>
      <div className="process-grid">{steps.map((step, i) => <article key={step.title}><div className="process-top"><span className="process-number">0{i + 1}</span><Icon name={step.icon} size={28} /></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    </Reveal>
    <Reveal className="landing-section panels-section" id="panellar">
      <div className="center-section-title"><span className="eyebrow">HAR KIMNING O‘Z DUNYOSI</span><h2>Sizga xotirjamlik.<br />Farzandingizga ilhom.</h2><p>Ikki xil kabinet, bir xil maqsad — birga ulg‘ayish.</p></div>
      <div className="panel-showcase-grid"><article className="parent-showcase"><span className="showcase-label"><Icon name="users" size={17} /> OTA-ONA KABINETI</span><h3>Katta manzara.<br />Hammasi nazoratingizda.</h3><p>Vazifalarni belgilang, bajarilgan ishni ko‘rib chiqing va farzandingizning maqsad sari harakatini kuzating.</p><div className="sample-review"><div><span className="sample-avatar">A</span><div><strong>Aziz · Kitob o‘qish</strong><small>Ko‘rib chiqishingizni kutmoqda</small></div><span className="review-dot" /></div><div className="sample-review-note">“Bugun 20 bet o‘qidim. Eng qiziq joyi...”</div><span className="sample-approve"><Icon name="check" size={16} /> Tasdiqlash va rag‘batlantirish</span><small className="sample-label">Kabinetning ko‘rgazmali namunasi</small></div><ul className="feature-checks"><li><Icon name="check" /> Vazifa va mukofotni o‘zingiz belgilaysiz</li><li><Icon name="check" /> Har bir tasdiq sizning qo‘lingizda</li><li><Icon name="check" /> Hisob tarixi va pul so‘rovlari bir joyda</li></ul></article>
      <article className="child-showcase"><span className="showcase-label"><Icon name="star" size={17} /> BOLA KABINETI</span><h3>Har bir qadam —<br />“Men uddaladim!”</h3><p>Aniq vazifalar, ko‘rinib turadigan natija va o‘z orzusi. Farzandingiz uchun sodda, rangli va tushunarli makon.</p><div className="sample-child-goal"><span className="book-emoji" aria-hidden="true">📚</span><span className="sample-star" aria-hidden="true">✦</span><strong>Yangi kitoblarim uchun</strong><span>Orzumga yanada yaqinman!</span><div className="progress"><span style={{ width: '65%' }} /></div><small>Ko‘rgazmali namuna · 65% jamg‘arildi</small></div><ul className="feature-checks"><li><Icon name="check" /> Vazifani bajarib, natijasini yuboradi</li><li><Icon name="check" /> O‘z maqsadiga virtual pul ajratadi</li><li><Icon name="check" /> Kichik darslar orqali bilimini sinaydi</li></ul></article></div>
    </Reveal>
    <Reveal className="landing-section everyday-section"><div className="everyday-art"><span className="eyebrow">ODDIY KUNDAN BIR MISOL</span><div className="everyday-item"><span>📖</span><div><strong>20 bet kitob o‘qish</strong><small>Avval kichik vazifa</small></div><Icon name="check" /></div><div className="everyday-connector" /><div className="everyday-item"><span>🌟</span><div><strong>“Barakalla, uddalading!”</strong><small>So‘ng e’tirof va virtual mukofot</small></div><Icon name="check" /></div><div className="everyday-connector" /><div className="everyday-item"><span>🎯</span><div><strong>Orzuga yana bir qadam</strong><small>Mukofotning bir qismini jamg‘arish</small></div><Icon name="check" /></div></div><div><span className="eyebrow">ENG MUHIM QISMI — SIZ</span><h2>Ilova hisoblaydi.<br /><em>Siz yo‘l ko‘rsatasiz.</em></h2><p>Kun oxirida birga qarang: bugun nima uddalandi, nimasi qiyin bo‘ldi, keyingi qadam qanday? Oddiy suhbat ham qimmatli darsga aylanishi mumkin.</p><p>Vazifalarni farzandingizning imkoniyatiga moslang. Faqat natijani emas, intilish va halollikni ham qadrlang.</p><div className="parent-tip"><Icon name="leaf" size={24} /><span><strong>Kichik maslahat</strong> Birinchi maqsadni farzandingizning o‘zi tanlasin. O‘z orzusi uchun harakat qilish qiziqroq.</span></div></div></Reveal>
    <Reveal className="landing-section faq-section" id="savollar"><div><span className="eyebrow">OTA-ONALAR SO‘RAYDI</span><h2>Boshlashdan oldin<br />bilish yaxshi.</h2><p>Oilaviy yangi odat haqida<br />eng tabiiy savollarga javoblar.</p><span className="faq-decoration" aria-hidden="true">?</span></div><div className="faq-list">{faqs.map(([q, a], i) => <details key={q}><summary><span className="faq-number">0{i + 1}</span><span>{q}</span><Icon name="plus" size={19} /></summary><p>{a}</p></details>)}</div></Reveal>
    <Reveal className="landing-section final-cta"><span className="cta-spark" aria-hidden="true">✳</span><span className="eyebrow">BIRINCHI QADAMNI BIRGA QO‘YAMIZ</span><h2>Katta kelajak<br /><em>kichik odatdan boshlanadi.</em></h2><p>Bugun bitta vazifa. Bitta maqsad. Bitta samimiy “barakalla”.</p><Link href="/register" className="button">Oilamiz bilan boshlash <Icon name="arrow" /></Link><small>Karta kerak emas · Virtual mukofotlar · Haqiqiy ko‘nikmalar</small></Reveal>
    <footer className="premium-footer"><div><Brand /><p>Katta hayotga kichik qadam.</p></div><div className="footer-links"><a href="#qanday">Qanday ishlaydi?</a><a href="#savollar">Savollar</a><Link href="/login">Kabinetga kirish <Icon name="arrow" size={15} /></Link></div><span>Mehr bilan o‘rgatamiz.<br />Birga ulg‘ayamiz.</span></footer>
  </main>;
}
